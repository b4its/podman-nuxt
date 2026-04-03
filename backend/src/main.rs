mod domain;
mod application;
mod infrastructure;
mod interface;

// 1. FIXED: Tambahkan 'get' pada import routing
use axum::{routing::{get, post}, Router};
use dotenvy::dotenv;
use sqlx::PgPool;
use std::sync::Arc;
use std::env;

use crate::application::AuthUseCase;
use crate::infrastructure::database::PostgresUserRepository;
use crate::interface::controllers::{
    login_handler, 
    register_handler, 
    get_all_users_handler, 
    get_user_by_id_handler, 
    AppState
};

use axum::{extract::State, response::IntoResponse, Json};
use serde_json::json;

// 2. FIXED: Ekstrak state dari AppState, lalu gunakan state.pool
async fn health_handler(State(state): State<Arc<AppState>>) -> impl IntoResponse {
    // Cek koneksi database dengan query sederhana menggunakan state.pool
    let db_status = match sqlx::query("SELECT 1").execute(&state.pool).await {
        Ok(_) => "Up",
        Err(_) => "Down",
    };

    // Tentukan status keseluruhan API
    // Jika DB down, API dianggap degraded/bermasalah
    let overall_status = if db_status == "Up" { "Healthy" } else { "Degraded" };

    let response = json!({
        "status": overall_status,
        "message": "System status report",
        "components": {
            "api_server": "Up",
            "database": db_status,
            "auth_service": "Up" 
        },
        "timestamp": chrono::Local::now().to_rfc3339() 
    });
    
    // Opsional: Jika Anda ingin merespons dengan HTTP 503 saat DB mati,
    // Anda bisa merombak kembalian Json ini menggunakan tuple (StatusCode, Json)
    Json(response)
}

#[tokio::main]
async fn main() {
    // Load .env untuk development
    dotenv().ok();

    // 1. Setup Database
    let db_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool = PgPool::connect(&db_url).await.expect("Failed to connect to DB");

    // 2. Setup Repository (Infrastructure Layer)
    // PgPool sangat ringan untuk di-clone karena menggunakan Arc internal
    let user_repo = Arc::new(PostgresUserRepository::new(pool.clone()));

    // 3. Setup Use Case (Application Layer)
    let auth_use_case = Arc::new(AuthUseCase::new(user_repo));

    // 4. Setup State untuk Controller (Interface Layer)
    let state = Arc::new(AppState { 
        auth_use_case,
        pool: pool.clone() // Pastikan struct AppState sudah diupdate menerima field ini
    });

    // 5. Setup Router Axum
    let app = Router::new()
        .route("/api/register", post(register_handler))
        .route("/api/login", post(login_handler))
        .route("/api/users", get(get_all_users_handler))      
        .route("/api/users/{id}", get(get_user_by_id_handler))
        .route("/api/health", get(health_handler)) 
        .with_state(state);

    let port = env::var("PORT").unwrap_or_else(|_| "8080".to_string());
    let addr = format!("0.0.0.0:{}", port);
    
    println!("🚀 Server running on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}