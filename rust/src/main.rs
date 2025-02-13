// src/main.rs
mod connect;
mod build;
mod utils;
mod DC;
mod aster;
use std::sync::Arc;
use hyper::service::service_fn;
use tokio::sync::Mutex;
use std::collections::HashMap;
use crate::aster::handle_request;
use std::convert::Infallible;
use std::net::SocketAddr;
use hyper::{Server, service::make_service_fn};

#[tokio::main]
async fn main() {
    let addr = SocketAddr::from(([127, 0, 0, 1], 2539));
    let ram = &mut HashMap::new();
    let dc = Arc::new(Mutex::new(crate::DC::DC::new(ram)));
    let make_svc = make_service_fn(move |_conn| {
        let dc = dc.clone();
        async move {
            Ok::<_, Infallible>(service_fn(move |req| {
                let dc = dc.clone();
                handle_request(req, dc)
            }))
        }
    });

    let server = Server::bind(&addr).serve(make_svc);

    println!("Server is up on port 2539!");

    if let Err(e) = server.await {
        eprintln!("Server error: {}", e);
    }
}