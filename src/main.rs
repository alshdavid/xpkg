mod cmd;
mod config;

use std::path::PathBuf;

use clap::Parser;
use clap::Subcommand;

use crate::config::Config;

#[derive(Debug, Subcommand)]
pub enum MainCommandType {
    /// Install a package
    Install(cmd::install::InstallCommand),
    /// Uninstall a package
    Uninstall(cmd::uninstall::UninstallCommand),
    /// Version information
    Info(cmd::info::InfoCommand),
    /// Version information
    Update(cmd::update::UpdateCommand),
    Version,
}

#[derive(Parser, Debug)]
pub struct MainCommand {
    #[clap(subcommand)]
    pub command: MainCommandType,
    #[arg(env = "XPKG_DIR")]
    pub apvm_dir: Option<PathBuf>,
}

fn main() -> anyhow::Result<()> {
    let args = MainCommand::parse();
    let config = Config{};

    match args.command {
        MainCommandType::Install(cmd) => cmd::install::main(config, cmd),
        MainCommandType::Uninstall(cmd) => cmd::uninstall::main(config, cmd),
        MainCommandType::Info(cmd) => cmd::info::main(config, cmd),
        MainCommandType::Update(cmd) => cmd::update::main(config, cmd),
        MainCommandType::Version => unreachable!(),
    }
}
