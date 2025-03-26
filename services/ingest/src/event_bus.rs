use crate::reading::Reading;
use tokio::sync::broadcast;

#[derive(Clone, Debug)]
pub struct Event {
    pub module: String,
    pub inner: EventKind,
}

#[derive(Clone, Debug)]
pub enum EventKind {
    Log(String),
    Reading(Reading),
}

#[derive(Debug)]
pub struct EventBus {
    pub sender: broadcast::Sender<Event>,
    pub receiver: broadcast::Receiver<Event>,
}

impl Clone for EventBus {
    fn clone(&self) -> Self {
        Self {
            sender: self.sender.clone(),
            receiver: self.sender.subscribe(),
        }
    }
}

impl Default for EventBus {
    fn default() -> Self {
        Self::new()
    }
}

impl EventBus {
    pub fn new() -> Self {
        let (sender, receiver) = broadcast::channel(100);
        Self { sender, receiver }
    }

    pub fn subscribe(&self) -> broadcast::Receiver<Event> {
        self.sender.subscribe()
    }
}
