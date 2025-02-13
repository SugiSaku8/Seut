// src/aster.rs
use std::{convert::Infallible, sync::Arc};
use hyper::{Body, Request, Response, StatusCode};
use hyper::service::{service_fn};
use serde_json::{json, Value};
use std::fs;
use std::path::Path;
use tokio::sync::Mutex;
use std::collections::HashMap;
use crate::DC::DC;
use crate::utils;
use crate::build;
use crate::connect;

pub async fn handle_request(req: Request<Body>, dc: Arc<Mutex<crate::DC::DC>>) -> Result<Response<Body>, Infallible> {
    let path = req.uri().path();
    match (req.method(), path) {
        (&hyper::Method::POST, "/send") => {
            let body = hyper::body::to_bytes(req.into_body()).await.unwrap();
            let body_str = String::from_utf8_lossy(&body);
            match serde_json::from_str::<Value>(&body_str) {
                Ok(parsed_body) => {
                    let mut dc_lock = dc.lock().await;
                    let cmd = parsed_body.as_object().unwrap().iter().map(|(k, v)| (k.clone(), v.as_str().unwrap_or("").to_string())).collect();
                    let config = HashMap::from([
                        ("version".to_string(), HashMap::from([("version".to_string(), "1.0".to_string())])),
                        ("network".to_string(), HashMap::from([("type".to_string(), "cell".to_string())])),
                    ]);
                    dc_lock.ordar(&cmd, &config);
                    let response = Response::builder()
                        .status(StatusCode::OK)
                        .header("Content-Type", "application/json")
                        .body(Body::from(json!({"status": "終了しました。"}).to_string()))
                        .unwrap();
                    Ok(response)
                }
                Err(error) => {
                    eprintln!("JSON parse error: {}", error);
                    let response = Response::builder()
                        .status(StatusCode::BAD_REQUEST)
                        .header("Content-Type", "application/json")
                        .body(Body::from(json!({"status": "エラーが発生しました。\nデータが不正です。"}).to_string()))
                        .unwrap();
                    Ok(response)
                }
            }
        }
        (&hyper::Method::POST, "/get") => {
            let body = hyper::body::to_bytes(req.into_body()).await.unwrap();
            let body_str = String::from_utf8_lossy(&body);
            match serde_json::from_str::<Value>(&body_str) {
                Ok(parsed_body) => {
                    let file_name = parsed_body.get("name").and_then(|v| v.as_str()).unwrap_or("");
                    let file_path = format!("./n/n_p/data/{}", file_name);
                    match fs::read_to_string(file_path) {
                        Ok(data) => {
                            let response = Response::builder()
                                .status(StatusCode::OK)
                                .header("Content-Type", "application/json")
                                .body(Body::from(json!({"data": data}).to_string()))
                                .unwrap();
                            Ok(response)
                        }
                        Err(error) => {
                            eprintln!("File read error: {}", error);
                            let response = Response::builder()
                                .status(StatusCode::INTERNAL_SERVER_ERROR)
                                .header("Content-Type", "application/json")
                                .body(Body::from(json!({"status": "エラーが発生しました。"}).to_string()))
                                .unwrap();
                            Ok(response)
                        }
                    }
                }
                Err(error) => {
                    eprintln!("JSON parse error: {}", error);
                    let response = Response::builder()
                        .status(StatusCode::BAD_REQUEST)
                        .header("Content-Type", "application/json")
                        .body(Body::from(json!({"status": "エラーが発生しました。\nデータが不正です。"}).to_string()))
                        .unwrap();
                    Ok(response)
                }
            }
        }
        (&hyper::Method::GET, "/top") => {
            let file_paths = get_files("./n/n_p/data");
            let mut json_data: Vec<_> = file_paths.iter().filter_map(|file| {
                if let Ok(data) = fs::read_to_string(file) {
                    if let Ok(json_value) = serde_json::from_str::<Value>(&data) {
                        if let Ok(metadata) = fs::metadata(file) {
                            return Some((json_value, metadata.modified().unwrap()));
                        }
                    }
                }
                None
            }).collect();
            json_data.sort_by(|(_, a), (_, b)| b.cmp(a));
            let latest_json_data: Vec<_> = json_data.iter().take(10).map(|(data, _)| data.clone()).collect();
            let response = Response::builder()
                .status(StatusCode::OK)
                .header("Content-Type", "application/json")
                .body(Body::from(json!(latest_json_data).to_string()))
                .unwrap();
            Ok(response)
        }
        (&hyper::Method::GET, "/scr") => {
            let file_paths = get_files("./n/n_p/data/勉強相談室");
            let mut json_data: Vec<_> = file_paths.iter().filter_map(|file| {
                if let Ok(data) = fs::read_to_string(file) {
                    if let Ok(json_value) = serde_json::from_str::<Value>(&data) {
                        if let Ok(metadata) = fs::metadata(file) {
                            return Some((json_value, metadata.modified().unwrap()));
                        }
                    }
                }
                None
            }).collect();
            json_data.sort_by(|(_, a), (_, b)| b.cmp(a));
            let latest_json_data: Vec<_> = json_data.iter().take(10).map(|(data, _)| data.clone()).collect();
            let response = Response::builder()
                .status(StatusCode::OK)
                .header("Content-Type", "application/json")
                .body(Body::from(json!(latest_json_data).to_string()))
                .unwrap();
            Ok(response)
        }
        (&hyper::Method::GET, "/") => {
            let file_path = Path::new("./public/index.html");
            match fs::read_to_string(file_path) {
                Ok(data) => {
                    let response = Response::builder()
                        .status(StatusCode::OK)
                        .header("Content-Type", "text/html")
                        .body(Body::from(data))
                        .unwrap();
                    Ok(response)
                }
                Err(error) => {
                    eprintln!("File read error: {}", error);
                     let response = Response::builder()
                        .status(StatusCode::NOT_FOUND)
                        .header("Content-Type", "text/html")
                        .body(Body::from("404 Not Found"))
                        .unwrap();
                    Ok(response)
                }
            }
        }
        (&hyper::Method::GET, "/en") => {
            let file_path = Path::new("./public/en.html");
            match fs::read_to_string(file_path) {
                Ok(data) => {
                    let response = Response::builder()
                        .status(StatusCode::OK)
                        .header("Content-Type", "text/html")
                        .body(Body::from(data))
                        .unwrap();
                    Ok(response)
                }
                Err(error) => {
                    eprintln!("File read error: {}", error);
                     let response = Response::builder()
                        .status(StatusCode::NOT_FOUND)
                        .header("Content-Type", "text/html")
                        .body(Body::from("404 Not Found"))
                        .unwrap();
                    Ok(response)
                }
            }
        }
        (&hyper::Method::GET, "/help/cookie/ja") => {
            let file_path = Path::new("./public/data/help/Cookieja.html");
             match fs::read_to_string(file_path) {
                Ok(data) => {
                    let response = Response::builder()
                        .status(StatusCode::OK)
                        .header("Content-Type", "text/html")
                        .body(Body::from(data))
                        .unwrap();
                    Ok(response)
                }
                Err(error) => {
                    eprintln!("File read error: {}", error);
                     let response = Response::builder()
                        .status(StatusCode::NOT_FOUND)
                        .header("Content-Type", "text/html")
                        .body(Body::from("404 Not Found"))
                        .unwrap();
                    Ok(response)
                }
            }
        }
        (&hyper::Method::GET, "/help/cookie") => {
            let file_path = Path::new("./public/data/help/Cookie.html");
             match fs::read_to_string(file_path) {
                Ok(data) => {
                    let response = Response::builder()
                        .status(StatusCode::OK)
                        .header("Content-Type", "text/html")
                        .body(Body::from(data))
                        .unwrap();
                    Ok(response)
                }
                Err(error) => {
                    eprintln!("File read error: {}", error);
                     let response = Response::builder()
                        .status(StatusCode::NOT_FOUND)
                        .header("Content-Type", "text/html")
                        .body(Body::from("404 Not Found"))
                        .unwrap();
                    Ok(response)
                }
            }
        }
        _ => {
            let response = Response::builder()
                .status(StatusCode::NOT_FOUND)
                .header("Content-Type", "text/html")
                .body(Body::from("404 Not Found"))
                .unwrap();
            Ok(response)
        }
    }
}

fn get_files(dir_path: &str) -> Vec<String> {
    let mut file_paths = Vec::new();
    if let Ok(entries) = fs::read_dir(dir_path) {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.is_dir() {
                file_paths.extend(get_files(path.to_str().unwrap()));
            } else if path.extension().and_then(|s| s.to_str()) == Some("json") {
                file_paths.push(path.to_str().unwrap().to_string());
            }
        }
    }
    file_paths
}