use actix_web::{web, HttpResponse, HttpRequest, cookie::{Cookie, SameSite}};
use crate::auth::{create_jwt, verify_jwt, validate_user};
use crate::csrf::{generate_token, validate_token};
use crate::models::LoginRequest;

pub async fn get_token() -> HttpResponse {
    let token = generate_token();
    let cookie = Cookie::build("csrf_token", token.clone())
        .path("/")
        .same_site(SameSite::Strict)
        .max_age(time::Duration::hours(1))
        .http_only(false)
        .finish();

    HttpResponse::Ok()
        .cookie(cookie)
        .json(serde_json::json!({ "csrf_token": token }))
}

pub async fn login(req: web::Json<LoginRequest>, http_req: HttpRequest) -> HttpResponse {
    let cookie_token = http_req.cookie("csrf_token").map(|c| c.value().to_string());
    let header_token = http_req.headers()
        .get("x-csrf-token")
        .and_then(|h| h.to_str().ok())
        .map(|s| s.to_string());

    if !validate_token(cookie_token, header_token) {
        return HttpResponse::Forbidden()
            .json(serde_json::json!({ "error": "CSRF token validation failed" }));
    }

    if !validate_user(&req.email, &req.password) {
        return HttpResponse::Unauthorized()
            .json(serde_json::json!({ "error": "Invalid email or password" }));
    }

    let token = create_jwt(req.email.clone());
    let auth_cookie = Cookie::build("auth_token", token.clone())
        .path("/")
        .same_site(SameSite::Strict)
        .max_age(time::Duration::hours(1))
        .http_only(true)
        .finish();

    HttpResponse::Ok()
        .cookie(auth_cookie)
        .json(serde_json::json!({ "message": "Login successful", "token": token }))
}

pub async fn logout(http_req: HttpRequest) -> HttpResponse {
    let cookie_token = http_req.cookie("csrf_token").map(|c| c.value().to_string());
    let header_token = http_req.headers()
        .get("x-csrf-token")
        .and_then(|h| h.to_str().ok())
        .map(|s| s.to_string());

    if !validate_token(cookie_token, header_token) {
        return HttpResponse::Forbidden()
            .json(serde_json::json!({ "error": "CSRF token validation failed" }));
    }

    let auth_cookie = Cookie::build("auth_token", "")
        .path("/")
        .same_site(SameSite::Strict)
        .max_age(time::Duration::seconds(0))
        .http_only(true)
        .finish();

    HttpResponse::Ok()
        .cookie(auth_cookie)
        .json(serde_json::json!({ "success": true }))
}

pub async fn get_me(http_req: HttpRequest) -> HttpResponse {
    let token = http_req.cookie("auth_token").map(|c| c.value().to_string());

    match token {
        Some(t) if verify_jwt(t.clone()) => {
            HttpResponse::Ok().json(serde_json::json!({ "isLoggedIn": true }))
        }
        _ => HttpResponse::Unauthorized().json(serde_json::json!({ "isLoggedIn": false }))
    }
}