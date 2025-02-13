// src/DC/utils.rs
// src/utils.rs の内容をコピー
use std::collections::HashMap;

pub fn init(a: &mut HashMap<String, Option<HashMap<String, String>>>, type_: &str, size: usize) {
    match type_ {
        "memory" => init_ram(a, size),
        "storage" => init_storage(a, size),
        _ => {
            eprintln!(
                "Sort System Error:\nAn error occurred while sorting {}.\n{} cannot be initialized with SORT.",
                type_, type_
            );
        }
    }
}

pub fn init_ram(a: &mut HashMap<String, Option<HashMap<String, String>>>, size: usize) {
    let alphabet = "abcdefghijklmnopqrstuvwxyz";
    let numbers: Vec<String> = (0..size).map(|i| i.to_string()).collect();
    let mut counter = 0;

    for char in alphabet.chars() {
        if counter >= size {
            break;
        }
        a.insert(format!("a.{}", char), None);
        counter += 1;
    }

    for num in numbers {
        for char in alphabet.chars() {
            if counter >= size {
                break;
            }
            a.insert(format!("a.{}{}", char, num), None);
            counter += 1;
        }
        if counter >= size {
            break;
        }
    }
}

pub fn init_storage(a: &mut HashMap<String, Option<HashMap<String, String>>>, size: usize) {
    let alphabet = "abcdefghijklmnopqrstuvwxyz";
    let numbers: Vec<String> = (0..size).map(|i| i.to_string()).collect();
    let mut counter = 0;

    for char in alphabet.chars() {
        if counter >= size {
            break;
        }
        a.insert(format!("a.{}", char), None);
        counter += 1;
    }

    for num in numbers {
        for char in alphabet.chars() {
            if counter >= size {
                break;
            }
            a.insert(format!("a.{}{}", char, num), None);
            counter += 1;
        }
        if counter >= size {
            break;
        }
    }
}

pub fn get_blank(obj: &HashMap<String, Option<HashMap<String, String>>>) -> Option<String> {
    obj.iter()
        .find(|(_, value)| value.is_none())
        .map(|(key, _)| key.clone())
}

pub fn get_ntn_blank(obj: &HashMap<String, Option<HashMap<String, String>>>) -> Option<String> {
    let keys: Vec<String> = obj.keys().cloned().collect();
    let first_empty = get_blank(obj);
    if let Some(first_empty) = first_empty {
        let index = keys.iter().position(|key| key == &first_empty);
        if let Some(index) = index {
            if index + 1 < keys.len() {
                return Some(keys[index + 1].clone());
            }
        }
    }
    None
}