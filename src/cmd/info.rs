use clap::Parser;

use crate::config::Config;

#[derive(Debug, Parser)]
pub struct InfoCommand {}

pub fn main(
  _config: Config,
  _cmd: InfoCommand,
) -> anyhow::Result<()> {
  Ok(())
}