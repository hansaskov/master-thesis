use crate::{
    event_bus::{Event, EventKind},
    module::{Module, ModuleCtx},
    reading::Reading,
};
use anyhow::{Ok, Result};
use opcua::{
    client::{Client, ClientBuilder, DataChangeCallback, IdentityToken, Session},
    crypto::SecurityPolicy,
    types::{
        EndpointDescription, MessageSecurityMode, MonitoredItemCreateRequest, NodeId,
        TimestampsToReturn, UserTokenPolicy,
    },
};
use serde::{Deserialize, Serialize};
use std::{
    sync::Arc,
    time::{Duration, SystemTime},
};

#[derive(Serialize, Deserialize, Debug)]
pub struct Config {
    pub url: String,
    pub node_ids: Vec<NewNodeId>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct NewNodeId {
    pub namespace: u16,
    pub variable: String,
    pub name: String,
    pub category: String,
    pub unit: String,
}

pub struct OPCUA {
    ctx: ModuleCtx,
    client: Client,
    config: Config,
}

impl OPCUA {
    pub fn new(ctx: ModuleCtx, config: Config) -> Self {
        let client = ClientBuilder::new()
            .application_name("Simple Client")
            .application_uri("urn:SimpleClient")
            .product_uri("urn:SimpleClient")
            .trust_server_certs(true)
            .create_sample_keypair(true)
            .session_retry_limit(3)
            .client()
            .unwrap();

        Self {
            ctx,
            client,
            config,
        }
    }

    pub async fn subscribe_to_variables(&self, session: Arc<Session>) -> Result<()> {
        // Creates a subscription with a data change callback
        let sender = self.ctx.sender.clone();
        let module_name = self.ctx.name.clone();
        let node_ids = self.config.node_ids.clone();

        let subscription_id = session
            .create_subscription(
                Duration::from_secs(1),
                10,
                30,
                0,
                0,
                true,
                DataChangeCallback::new(move |dv, item| {
                    let variant = match dv.value {
                        Some(value) => value,
                        None => return,
                    };

                    let float = match variant {
                        opcua::types::Variant::Int16(i) => i as f32,
                        opcua::types::Variant::UInt16(i) => i as f32,
                        opcua::types::Variant::Int32(i) => i as f32,
                        opcua::types::Variant::UInt32(i) => i as f32,
                        opcua::types::Variant::Int64(i) => i as f32,
                        opcua::types::Variant::UInt64(i) => i as f32,
                        opcua::types::Variant::Float(f) => f,
                        opcua::types::Variant::Double(f) => f as f32,
                        _ => return,
                    };

                    // Create and send the event directly
                    let event = Event {
                        module: module_name.clone(),
                        inner: EventKind::Log(variant.to_string()),
                    };

                    if let Err(e) = sender.send(event) {
                        eprintln!("Failed to send event: {}", e);
                    }

                    let identifier = item.item_to_monitor().node_id.identifier.to_string();

                    let variable = match identifier.split_once('=') {
                        Some((_, identifier)) => identifier.to_string(),
                        None => return,
                    };

                    if let Some(new_node_id) = node_ids.iter().find(|v| v.variable == variable.to_string()) {

                        let reading = Reading {
                            name: new_node_id.name.clone(),
                            category: new_node_id.category.clone(),
                            unit: new_node_id.unit.clone(),
                            value: float,
                            time: SystemTime::now(),
                        };
    
                        // Create and send the event directly
                        let event = Event {
                            module: module_name.clone(),
                            inner: EventKind::Reading(reading),
                        };
    
                        if let Err(e) = sender.send(event) {
                            eprintln!("Failed to send readings: {}", e);
                        }

                    }                                      
                }),
            )
            .await?;
        println!("Created a subscription with id = {}", subscription_id);

        // Create some monitored items
        let items_to_create: Vec<MonitoredItemCreateRequest> = self
            .config
            .node_ids
            .iter()
            .map(|node| NodeId::new(node.namespace, node.variable.clone()).into())
            .collect();
        let _ = session
            .create_monitored_items(subscription_id, TimestampsToReturn::Both, items_to_create)
            .await?;

        Ok(())
    }
}

impl Module for OPCUA {
    async fn run(&mut self) -> Result<()> {
        let endpoint: EndpointDescription = (
            self.config.url.as_str(),
            SecurityPolicy::None.to_str(),
            MessageSecurityMode::None,
            UserTokenPolicy::anonymous(),
        )
            .into();

        let (session, event_loop) = self
            .client
            .connect_to_matching_endpoint(endpoint, IdentityToken::Anonymous)
            .await
            .unwrap();

        let handle = event_loop.spawn();
        session.wait_for_connection().await;

        if let Err(result) = self.subscribe_to_variables(session.clone()).await {
            println!(
                "ERROR: Got an error while subscribing to variables - {}",
                result
            );
            let _ = session.disconnect().await;
        }

        let session_c = session.clone();
        tokio::task::spawn(async move {
            if let Err(e) = tokio::signal::ctrl_c().await {
                println!("Failed to register CTRL-C handler: {e}");
                return;
            }
            let _ = session_c.disconnect().await;
        });

        handle.await.unwrap();

        Ok(())
    }
}
