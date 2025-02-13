// src/build.rs
use std::convert::Infallible;
use std::net::SocketAddr;
use hyper::{Body, Request, Response, Server, StatusCode};
use hyper::service::{make_service_fn, service_fn};
use serde_json::{json, Value};

async fn handle_request(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let body = hyper::body::to_bytes(req.into_body()).await.unwrap();
    let body_str = String::from_utf8_lossy(&body);

    match serde_json::from_str::<Value>(&body_str) {
        Ok(parsed_body) => {
            println!("Req Json: {}", json!(parsed_body));
            let response = Response::builder()
                .status(StatusCode::OK)
                .header("Content-Type", "text/plain")
                .body(Body::from("JSON data accepted"))
                .unwrap();
            Ok(response)
        }
        Err(error) => {
            eprintln!("JSON parse error: {}", error);
            let response = Response::builder()
                .status(StatusCode::BAD_REQUEST)
                .header("Content-Type", "text/plain")
                .body(Body::from(format!("Invalid JSON data: {}", error)))
                .unwrap();
            Ok(response)
        }
    }
}

pub async fn build(port: u16) {
    let addr = SocketAddr::from(([127, 0, 0, 1], port));

    let make_svc = make_service_fn(|_conn| {
        async {
            Ok::<_, Infallible>(service_fn(handle_request))
        }
    });

    let server = Server::bind(&addr).serve(make_svc);

    println!("Server Running at {}", port);

    if let Err(e) = server.await {
        eprintln!("Server error: {}", e);
    }
}