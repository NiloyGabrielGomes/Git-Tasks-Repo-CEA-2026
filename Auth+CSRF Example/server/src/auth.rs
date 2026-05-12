use jsonwebtoken::{encode, decode, EncodingKey, DecodingKey, Header, Validation};
use chrono::{Utc, Duration};
use crate::models::Claims;

const jwt_secret: &str = "very-much-demo-secret";

pub fn create_jwt(email: String) -> String {
    let exp = (Utc::now() + Duration::hours(1)).timestamp() as usize;
    let claims = Claims {
        email,
        exp
    };
    encode(&Header::default(), &claims, &EncodingKey::from_secret(jwt_secret.as_bytes())).unwrap()
}

pub fn verify_jwt(token: String) -> bool {
    let mut validation = Validation::default();
    validation.validate_exp = true;
    decode::<Claims>(&token, &DecodingKey::from_secret(jwt_secret.as_bytes()), &validation).is_ok()
}

pub fn validate_user(email: &str, password: &str) -> bool {
    email == "admin" && password == "admin"
}