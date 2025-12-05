use clap::Parser;

use crate::config::Config;

#[derive(Debug, Parser)]
pub struct UninstallCommand {}

pub fn main(
  _config: Config,
  _cmd: UninstallCommand,
) -> anyhow::Result<()> {
  Ok(())
}