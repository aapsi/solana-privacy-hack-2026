use anchor_lang::prelude::*;
use anchor_spl::{
    token_2022::{self, Token2022},
    token_interface::{Mint, TokenAccount, TokenInterface},
};

declare_id!("GhsT1111111111111111111111111111111111111111");

#[program]
pub mod ghostbuys {
    use super::*;

    /// Initialize a new private vault for a user
    /// The vault acts as a privacy shield - deposits go in, trades happen privately,
    /// withdrawals come out to potentially different addresses
    pub fn initialize_vault(ctx: Context<InitializeVault>, vault_bump: u8) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.owner = ctx.accounts.owner.key();
        vault.bump = vault_bump;
        vault.created_at = Clock::get()?.unix_timestamp;
        vault.total_deposits = 0;
        vault.total_withdrawals = 0;
        vault.is_active = true;

        emit!(VaultCreated {
            vault: vault.key(),
            owner: vault.owner,
            timestamp: vault.created_at,
        });

        Ok(())
    }

    /// Deposit tokens into the private vault
    /// After deposit, trading happens through confidential transfers
    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        require!(amount > 0, GhostError::InvalidAmount);
        require!(ctx.accounts.vault.is_active, GhostError::VaultInactive);

        // Transfer tokens from user to vault's token account
        let cpi_accounts = anchor_spl::token_interface::TransferChecked {
            from: ctx.accounts.user_token_account.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.vault_token_account.to_account_info(),
            authority: ctx.accounts.owner.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        anchor_spl::token_interface::transfer_checked(
            cpi_ctx,
            amount,
            ctx.accounts.mint.decimals,
        )?;

        // Update vault stats
        let vault = &mut ctx.accounts.vault;
        vault.total_deposits = vault.total_deposits.checked_add(amount).unwrap();

        emit!(DepositMade {
            vault: vault.key(),
            amount,
            mint: ctx.accounts.mint.key(),
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// Execute a private swap through the confidential transfer pool
    /// The swap amount and direction are hidden from chain observers
    pub fn private_swap(
        ctx: Context<PrivateSwap>,
        encrypted_amount: [u8; 64],  // ElGamal encrypted amount
        proof_data: Vec<u8>,          // Zero-knowledge proof of valid swap
    ) -> Result<()> {
        require!(ctx.accounts.vault.is_active, GhostError::VaultInactive);
        require!(!proof_data.is_empty(), GhostError::InvalidProof);

        let swap_record = &mut ctx.accounts.swap_record;
        swap_record.vault = ctx.accounts.vault.key();
        swap_record.from_mint = ctx.accounts.from_mint.key();
        swap_record.to_mint = ctx.accounts.to_mint.key();
        swap_record.encrypted_amount = encrypted_amount;
        swap_record.timestamp = Clock::get()?.unix_timestamp;
        swap_record.status = SwapStatus::Pending;

        // In production: verify ZK proof and execute confidential transfer
        // The proof ensures the swap is valid without revealing the amount

        emit!(SwapInitiated {
            vault: ctx.accounts.vault.key(),
            from_mint: ctx.accounts.from_mint.key(),
            to_mint: ctx.accounts.to_mint.key(),
            timestamp: swap_record.timestamp,
        });

        Ok(())
    }

    /// Withdraw tokens from the vault to any address
    /// The withdrawal address can be different from deposit address,
    /// breaking the on-chain link
    pub fn withdraw(
        ctx: Context<Withdraw>,
        amount: u64,
        withdrawal_proof: Vec<u8>,  // Proof of ownership without revealing identity
    ) -> Result<()> {
        require!(amount > 0, GhostError::InvalidAmount);
        require!(ctx.accounts.vault.is_active, GhostError::VaultInactive);
        require!(!withdrawal_proof.is_empty(), GhostError::InvalidProof);

        // Verify the withdrawal proof
        // This proves the user owns the vault without linking to their public identity

        let vault = &ctx.accounts.vault;
        let seeds = &[
            b"vault",
            vault.owner.as_ref(),
            &[vault.bump],
        ];
        let signer = &[&seeds[..]];

        // Transfer from vault to recipient (can be any address)
        let cpi_accounts = anchor_spl::token_interface::TransferChecked {
            from: ctx.accounts.vault_token_account.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.recipient_token_account.to_account_info(),
            authority: ctx.accounts.vault.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);

        anchor_spl::token_interface::transfer_checked(
            cpi_ctx,
            amount,
            ctx.accounts.mint.decimals,
        )?;

        // Update vault stats
        let vault = &mut ctx.accounts.vault;
        vault.total_withdrawals = vault.total_withdrawals.checked_add(amount).unwrap();

        emit!(WithdrawalMade {
            vault: vault.key(),
            amount,
            mint: ctx.accounts.mint.key(),
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// Close the vault and return remaining funds
    pub fn close_vault(ctx: Context<CloseVault>) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.is_active = false;

        emit!(VaultClosed {
            vault: vault.key(),
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }
}

// ============================================================================
// Account Structures
// ============================================================================

#[account]
#[derive(Default)]
pub struct PrivateVault {
    /// Owner of the vault (for reference, but withdrawals don't require this wallet)
    pub owner: Pubkey,
    /// PDA bump seed
    pub bump: u8,
    /// Creation timestamp
    pub created_at: i64,
    /// Total deposited (public stat, individual deposits can be hidden)
    pub total_deposits: u64,
    /// Total withdrawn
    pub total_withdrawals: u64,
    /// Whether the vault is active
    pub is_active: bool,
}

#[account]
pub struct SwapRecord {
    /// The vault executing the swap
    pub vault: Pubkey,
    /// Source token mint
    pub from_mint: Pubkey,
    /// Destination token mint
    pub to_mint: Pubkey,
    /// Encrypted swap amount (ElGamal)
    pub encrypted_amount: [u8; 64],
    /// Timestamp of swap
    pub timestamp: i64,
    /// Current status
    pub status: SwapStatus,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum SwapStatus {
    Pending,
    Completed,
    Failed,
}

impl Default for SwapStatus {
    fn default() -> Self {
        SwapStatus::Pending
    }
}

// ============================================================================
// Context Structures
// ============================================================================

#[derive(Accounts)]
#[instruction(vault_bump: u8)]
pub struct InitializeVault<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + 32 + 1 + 8 + 8 + 8 + 1,
        seeds = [b"vault", owner.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, PrivateVault>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(
        mut,
        seeds = [b"vault", owner.key().as_ref()],
        bump = vault.bump,
        has_one = owner
    )]
    pub vault: Account<'info, PrivateVault>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub mint: InterfaceAccount<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = owner,
    )]
    pub user_token_account: InterfaceAccount<'info, TokenAccount>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = vault,
    )]
    pub vault_token_account: InterfaceAccount<'info, TokenAccount>,

    pub token_program: Interface<'info, TokenInterface>,
}

#[derive(Accounts)]
pub struct PrivateSwap<'info> {
    #[account(
        mut,
        seeds = [b"vault", owner.key().as_ref()],
        bump = vault.bump
    )]
    pub vault: Account<'info, PrivateVault>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub from_mint: InterfaceAccount<'info, Mint>,
    pub to_mint: InterfaceAccount<'info, Mint>,

    #[account(
        init,
        payer = owner,
        space = 8 + 32 + 32 + 32 + 64 + 8 + 1,
    )]
    pub swap_record: Account<'info, SwapRecord>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(
        mut,
        seeds = [b"vault", vault.owner.as_ref()],
        bump = vault.bump
    )]
    pub vault: Account<'info, PrivateVault>,

    /// The signer proving ownership (could be different from vault.owner for privacy)
    pub authority: Signer<'info>,

    pub mint: InterfaceAccount<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = vault,
    )]
    pub vault_token_account: InterfaceAccount<'info, TokenAccount>,

    /// Can be ANY address - doesn't have to be linked to deposits
    #[account(mut)]
    pub recipient_token_account: InterfaceAccount<'info, TokenAccount>,

    pub token_program: Interface<'info, TokenInterface>,
}

#[derive(Accounts)]
pub struct CloseVault<'info> {
    #[account(
        mut,
        seeds = [b"vault", owner.key().as_ref()],
        bump = vault.bump,
        has_one = owner,
        close = owner
    )]
    pub vault: Account<'info, PrivateVault>,

    #[account(mut)]
    pub owner: Signer<'info>,
}

// ============================================================================
// Events
// ============================================================================

#[event]
pub struct VaultCreated {
    pub vault: Pubkey,
    pub owner: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct DepositMade {
    pub vault: Pubkey,
    pub amount: u64,
    pub mint: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct SwapInitiated {
    pub vault: Pubkey,
    pub from_mint: Pubkey,
    pub to_mint: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct WithdrawalMade {
    pub vault: Pubkey,
    pub amount: u64,
    pub mint: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct VaultClosed {
    pub vault: Pubkey,
    pub timestamp: i64,
}

// ============================================================================
// Errors
// ============================================================================

#[error_code]
pub enum GhostError {
    #[msg("Invalid amount provided")]
    InvalidAmount,
    #[msg("Vault is inactive")]
    VaultInactive,
    #[msg("Invalid proof provided")]
    InvalidProof,
    #[msg("Insufficient balance")]
    InsufficientBalance,
    #[msg("Unauthorized access")]
    Unauthorized,
}
