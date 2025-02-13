// src/DC.rs
pub mod utils;
use std::collections::HashMap;
use crate::utils::{get_blank, get_ntn_blank, init};
use crate::geral::main;
use crate::special_cmd::main;
use chrono::Local;
use crate::build::build;

pub struct DC {
    pub ram: HashMap<String, Option<HashMap<String, String>>>,
}

impl DC {
    pub fn new(ram: &mut HashMap<String, Option<HashMap<String, String>>>) -> DC {
        init(ram, "memory", 1000); // 仮のサイズ
        DC { ram: ram.clone() }
    }

    pub fn ordar(
        &mut self,
        cmd: &HashMap<String, String>,
        config: &HashMap<String, HashMap<String, String>>,
    ) -> Option<HashMap<String, String>> {
        let type_ = cmd.get("type").unwrap_or(&String::from(""));
        let memory = self.get();

        match type_.as_str() {
            "geral-cmd" => {
                if let Some(network_config) = config.get("network") {
                    if network_config.get("type") == Some(&String::from("cell")) {
                    }
                }
            }
            "special-cmd" => {
                if let Some(network_config) = config.get("network") {
                    if network_config.get("type") == Some(&String::from("cell")) {
                      
                    }
                }
            }
            "" => {
                println!("Specify the instruction type.");
            }
            _ => {
                println!("Unknown instruction type.");
            }
        }
        let now_time = Local::now().format("%Y-%m-%d %H:%M:%S").to_string();
        let m0 = get_blank(&self.ram).unwrap_or(String::new());
        let m1 = get_ntn_blank(&self.ram).unwrap_or(String::new());
        if !m0.is_empty()
            && !m1.is_empty()
            && cmd.contains_key("name")
            && cmd.contains_key("sender")
            && cmd.contains_key("time")
            && cmd.contains_key("command")
        {
            let m0_obj = HashMap::from([
                ("name".to_string(), cmd.get("name").unwrap().clone()),
                ("sender".to_string(), cmd.get("sender").unwrap().clone()),
                ("version".to_string(), config.get("version").unwrap().get("version").unwrap().clone()),
                ("cmd_make".to_string(), cmd.get("time").unwrap().clone()),
                ("command".to_string(), cmd.get("command").unwrap().clone()),
                ("build_make".to_string(), now_time.clone()),
                ("slot".to_string(), m0.clone()),
            ]);
            self.ram.insert(m0.clone(), Some(m0_obj));

            let m1_obj = HashMap::from([
                ("log".to_string(), "Slots were allocated and orders were sent to various agencies.".to_string()),
            ]);
            self.ram.insert(m1.clone(), Some(m1_obj));

            if type_ == "geral-cmd" {
                main::geral(m0.clone(), m1.clone(), config, self);
            }
            if type_ == "special-cmd" {
                main::spe_cmd(m0.clone(), m1.clone(), config, self);
            }
            if cmd.get("command") == Some(&"start".to_string()) {
                tokio::spawn(async {
                    build(2539).await;
                });
            }
        } else {
            if config.contains_key("true") {
                eprintln!(
                    "{} Network configuration is an incorrect shape. \nPlease check if you have added version to the configuration item.",
                    type_
                );
            }
        }
        None
    }

    pub fn get(&self) -> HashMap<String, Option<HashMap<String, String>>> {
        self.ram.clone()
    }

    pub fn post(&mut self, req: &HashMap<String, String>) {
        let id = req.get("id").unwrap();
        let data = req.get("data").unwrap();
        let r0 = get_blank(&self.ram).unwrap_or(String::new());
        let r1 = get_ntn_blank(&self.ram).unwrap_or(String::new());
        self.ram.insert(r0, Some(HashMap::from([("awarded".to_string(), id.clone())])));
        self.ram.insert(r1, Some(HashMap::from([("data".to_string(), data.clone())])));
    }

    pub fn post_with_log(&mut self, report: HashMap<String, String>, log_message: String) {
        let r0 = get_blank(&self.ram).unwrap_or(String::new());
        let r1 = get_ntn_blank(&self.ram).unwrap_or(String::new());
        self.ram.insert(r0, Some(report));
        self.ram.insert(r1, Some(HashMap::from([("log".to_string(), log_message)])));
    }
}