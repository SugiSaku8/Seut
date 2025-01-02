// src/connect.rs
use reqwest::{Error, Client, header, Response};
use serde::{Serialize, Deserialize};
use std::collections::HashMap;

#[derive(Serialize, Deserialize, Debug)]
pub struct ResponseData {
    pub message: String,
}

pub async fn connect(data: &HashMap<String, String>, port: u16) -> Result<ResponseData, Error> {
    println!("Connect to the backend server.");

    let client = Client::new();
    let url = format!("http://localhost:{}", port);

    let response: Response = client
        .post(url)
        .header(header::CONTENT_TYPE, "application/json")
        .json(data)
        .send()
        .await?;

    if !response.status().is_success() {
        let error_message = format!("CmdServer:Local response was not ok, status: {}", response.status());
        eprintln!("{}", error_message);
        return Err(Error::from(std::io::Error::new(std::io::ErrorKind::Other, error_message)));
    }

    let response_body = response.text().await?;
    if response_body.is_empty() {
        let error_message = "CmdServer: Response body is empty".to_string();
        eprintln!("{}", error_message);
        return Err(Error::from(std::io::Error::new(std::io::ErrorKind::Other, error_message)));
    }

    let response_data: ResponseData = serde_json::from_str(&response_body)?;
    println!("CmdServerResponse: {:?}", response_data);
    Ok(response_data)
}