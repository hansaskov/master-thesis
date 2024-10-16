use crate::reading;
use reading::Reading;
use tokio::sync::mpsc::Sender;

pub trait Reader {
    async fn read(&mut self, sender: &Sender<Reading>) -> anyhow::Result<()>;
}
