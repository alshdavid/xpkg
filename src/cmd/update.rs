use clap::Parser;

use crate::config::Config;

#[derive(Debug, Parser)]
pub struct UpdateCommand {}

pub fn main(
  _config: Config,
  _cmd: UpdateCommand,
) -> anyhow::Result<()> {
  Ok(())
}