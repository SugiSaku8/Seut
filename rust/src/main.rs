// src/main.rs
mod andel;
mod connect;
mod build;
mod utils;
mod DC;
mod aster;
use std::{convert::Infallible, net::SocketAddr, sync::Arc};
use hyper::{Body, Request, Response, Server, StatusCode};
use hyper::service::{make_service_fn, service_fn};
use serde_json::{json, Value};
use std::fs;
use std::path::Path;
use tokio::sync::Mutex;
use std::collections::HashMap;
use crate::DC::DC;
use crate::aster::handle_request;

#[tokio::main]
async fn main() {
    let addr = SocketAddr::from(([127, 0, 0, 1], 2539));
    let ram = &mut HashMap::new();
    let dc = Arc::new(Mutex::new(DC::new(ram)));
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