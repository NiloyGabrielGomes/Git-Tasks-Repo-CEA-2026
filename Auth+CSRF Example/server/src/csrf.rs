use rand::Rng;

pub fn generate_token() -> String {
    let mut rng = rand::thread_rng();
    let token = Vec<u8> = (0..32).map(|_| rng.gen()).collect();
    hex::encode(token)
}

pub fn validate_token(cookie_token: Option<String>, header_token: Option<String>) -> bool {
    match (cookie_token, header_token) {
        (Some(cookie_token), Some(header_token)) => cookie_token == header_token,
        _ => false
    }
}