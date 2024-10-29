use anchor_lang::prelude::*;

declare_id!("5p3BC3xzdS5pabm6ZWZZg9i5PFgUPyiN4mSGcHVnHxwf");

#[program]
pub mod tribuo {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
