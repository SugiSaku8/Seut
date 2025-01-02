// src/geral.rs
use std::collections::HashMap;
use chrono::Local;

pub fn geral(
    m0: String,
    m1: String,
    config: &HashMap<String, HashMap<String, String>>,
    dc: &mut crate::DC::DC, // DCインスタンスを受け取る
) -> bool {
    let mut name = String::new();
    let mut sender = String::new();
    let mut version = String::new();
    let mut cmd_time = String::new();
    let mut command = String::new();

    if let Some(m0_data) = config.get("ram").and_then(|ram| ram.get(&m0)) {
        if let Some(name_val) = m0_data.get("name") {
            name = name_val.clone();
        }
        if let Some(sender_val) = m0_data.get("sender") {
            sender = sender_val.clone();
        }
        if let Some(version_val) = m0_data.get("version") {
            version = version_val.clone();
        }
        if let Some(cmd_time_val) = m0_data.get("cmd_make") {
            cmd_time = cmd_time_val.clone();
        }
        if let Some(command_val) = m0_data.get("command") {
            command = command_val.clone();
        }
    }

    let awa_time = Local::now();
    let report = HashMap::from([
        ("Name".to_string(), name),
        ("Order Sender".to_string(), sender),
        ("Config Version".to_string(), version),
        ("Awarded".to_string(), awa_time.format("%Y-%m-%d %H:%M:%S").to_string()),
    ]);

    let cmd = HashMap::from([
        ("time".to_string(), cmd_time),
        ("command".to_string(), command),
    ]);

    let result = match execute_command(&cmd) {
        Ok(_) => {
            dc.post_with_log(report, "The entrusted order has been terminated.".to_string());
            true
        }
        Err(e) => {
            eprintln!("Error occurs at consignment site.\n{}", e);
            dc.post_with_log(report, format!("Error occurs at consignment site.\n{}", e));
            false
        }
    };
    
    dc.post_with_log(report, "Notify the command post of the consignment.".to_string());

    result
}

fn execute_command(cmd: &HashMap<String, String>) -> Result<(), String> {
    // ここにコマンド実行のロジックを実装します。
    // cmd.commandの値に応じて異なる処理を行うようにします。
    match cmd.get("command").map(|s| s.as_str()) {
        Some("test") => {
            // "test"コマンドの処理
            println!("Executing test command.");
            Ok(())
        }
        Some("another_command") => {
            // "another_command"コマンドの処理
            println!("Executing another command.");
            Ok(())
        }
        Some(command) => {
            // 未知のコマンドの場合
            Err(format!("Unknown command: {}", command))
        }
        None => {
            // commandキーが存在しない場合
            Err("Command not specified.".to_string())
        }
    }
}