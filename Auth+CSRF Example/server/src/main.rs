use actix_web::{web, App, HttpServer};
use actix_cors::Cors;

mod models;
mod auth;
mod csrf;
mod handlers;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let cors = Cors::default()
        .allow_any_origin("https://localhost:3000")
        .allow_any_methods(vec!["GET", "POST", "OPTIONS"])
        .allow_any_headers(vec!["Content-Type", "x-csrf-token"])
        .supports_credentials()
        .finish();

    HttpServer::new(move || {
        App::new()
            .wrap(cors.clone())
            .route("/api/get_token", web::get().to(handlers::get_token))
            .route("/api/login", web::post().to(handlers::login))
            .route("/api/logout", web::post().to(handlers::logout))
            .route("/api/me", web::get().to(handlers::get_me))
    })
    .bind("127.0.0.1:4000")?
    .run()
    .await
}