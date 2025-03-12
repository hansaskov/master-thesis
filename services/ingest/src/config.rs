use clap::Parser;

#[derive(Parser, Debug, Clone)]
#[command(author, version, about, long_about = None)]
pub struct Args {
    #[clap(short, long)]
    pub url: String,

    #[clap(short, long)]
    pub key: String,

    #[arg(
        short = 'm',
        long,
        help = "Specifies the operation mode: full, read, or send",
        default_value = "full"
    )]
    pub mode: Mode,

    #[arg(
        short,
        long = "db",
        help = "Specify where to store your sqlite db. Also wotks with \':memory:\'",
        default_value = "sqlite:local_readings.db"
    )]
    pub sqlite: String,
}

#[derive(clap::ValueEnum, Debug, Clone, PartialEq)]
pub enum Mode {
    Full,
    Read,
    Send,
}
