use crate::event_bus::{Event, EventBus, EventKind};
use crate::reading::Reading;

use anyhow::Result;
use tokio::sync::broadcast;

pub trait Module {
    fn run(&mut self) -> impl Future<Output = Result<()>>;
}

// New trait for event sending capabilities
pub trait EventSender {
    fn send_event(&self, module_name: String, event_kind: EventKind);
    fn send_log(&self, module_name: String, message: String);
    fn send_reading(&self, module_name: String, reading: Reading);
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

    // Keep the old interface
    pub fn send(&self, event_kind: EventKind) {
        self.sender.send_event(self.name.clone(), event_kind);
    }

    pub fn send_log(&self, message: String) {
        self.sender.send_log(self.name.clone(), message);
    }

    pub fn send_reading(&self, reading: Reading) {
        self.sender.send_reading(self.name.clone(), reading);
    }
}

// Implement the trait for broadcast::Sender<Event>
impl EventSender for broadcast::Sender<Event> {
    fn send_event(&self, module_name: String, event_kind: EventKind) {
        let event = Event {
            module: module_name.clone(),
            inner: event_kind,
        };

        if let Err(e) = self.send(event) {
            eprintln!("Failed to send event in module {}: {}", module_name, e);
        }
    }

    fn send_log(&self, module_name: String, message: String) {
        self.send_event(module_name, EventKind::Log(message));
    }

    fn send_reading(&self, module_name: String, reading: Reading) {
        self.send_event(module_name, EventKind::Reading(reading));
    }
}