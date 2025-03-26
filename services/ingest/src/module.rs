use crate::event_bus::{Event, EventBus, EventKind};
use crate::reading::Reading;

use anyhow::Result;
use tokio::sync::broadcast;

pub trait Module {
    fn run(&mut self) -> impl Future<Output = Result<()>>;
}

#[derive(Debug)]
pub struct ModuleCtx {
    pub name: String,
    pub sender: broadcast::Sender<Event>,
    pub receiver: broadcast::Receiver<Event>,
}

impl ModuleCtx {
    pub fn new(name: &str, bus: &EventBus) -> Self {
        let sender = bus.sender.clone();
        let receiver = bus.subscribe();

        Self {
            name: name.to_string(),
            sender,
            receiver,
        }
    }

    pub fn send(&self, event_kind: EventKind) {
        let event = Event {
            module: self.name.clone(),
            inner: event_kind,
        };

        if let Err(e) = self.sender.send(event) {
            eprintln!("Failed to send event in module {}: {}", self.name, e);
        }
    }

    pub fn send_log(&self, message: String) {
        self.send(EventKind::Log(message));
    }

    pub fn send_reading(&self, reading: Reading) {
        self.send(EventKind::Reading(reading));
    }
}
