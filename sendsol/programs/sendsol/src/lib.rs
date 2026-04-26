use anchor_lang::prelude::*;

declare_id!("2sHW7DmHBzu75ZHWgxLg5bWudJ4nxy5VYWVUWhktLGng");

#[program]
pub mod sendsol {
    use super::*;

    pub fn registrar_usuario(ctx: Context<RegistrarUsuario>, nome: String) -> Result<()> {
        require!(nome.len() >= 3, SendsolError::NomeCurto);
        require!(nome.len() <= 50, SendsolError::NomeLongo);
        let conta = &mut ctx.accounts.conta_usuario;
        conta.nome = nome.clone();
        conta.carteira = ctx.accounts.usuario.key();
        conta.bump = ctx.bumps.conta_usuario;
        msg!("Usuario registrado: @{}", nome);
        Ok(())
    }

    pub fn transferir(ctx: Context<Transferir>, valor: u64) -> Result<()> {
        require!(valor > 0, SendsolError::ValorInvalido);
        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.de.key(),
            &ctx.accounts.para.key(),
            valor,
        );
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.de.to_account_info(),
                ctx.accounts.para.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;
        msg!("Transferido {} lamports para @{}", valor, ctx.accounts.conta_destino.nome);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(nome: String)]
pub struct RegistrarUsuario<'info> {
    #[account(
        init,
        payer = usuario,
        space = 8 + 32 + 4 + 50 + 1,
        seeds = [b"usuario", nome.as_bytes()],
        bump
    )]
    pub conta_usuario: Account<'info, ContaUsuario>,
    #[account(mut)]
    pub usuario: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Transferir<'info> {
    #[account(mut)]
    pub de: Signer<'info>,
    /// CHECK: endereço validado pela conta_destino
    #[account(mut)]
    pub para: UncheckedAccount<'info>,
    pub conta_destino: Account<'info, ContaUsuario>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct ContaUsuario {
    pub carteira: Pubkey,
    pub nome: String,
    pub bump: u8,
}

#[error_code]
pub enum SendsolError {
    #[msg("Nome muito curto, minimo 3 caracteres")]
    NomeCurto,
    #[msg("Nome muito longo, maximo 50 caracteres")]
    NomeLongo,
    #[msg("Valor deve ser maior que zero")]
    ValorInvalido,
}
