use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Serialize, Clone, Deserialize)]
pub struct Claims {
    pub email: String,
    pub exp: usize,
}