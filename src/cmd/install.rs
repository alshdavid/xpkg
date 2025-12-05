use clap::Parser;

use crate::config::Config;

#[derive(Debug, Parser)]
pub struct InstallCommand {}

pub fn main(
  _config: Config,
  _cmd: InstallCommand,
) -> anyhow::Result<()> {
  Ok(())
}