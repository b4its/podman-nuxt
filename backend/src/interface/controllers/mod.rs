use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use crate::application::AuthUseCase;
use sqlx::PgPool;
use serde_json::json;

// Payload khusus untuk Register
#[derive(Deserialize)]
pub struct RegisterPayload {
    pub name: String,
    pub email: String,
    pub password: String,
}

// Payload khusus untuk Login
#[derive(Deserialize)]
pub struct LoginPayload {
    pub email: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct AuthResponse {
    pub token: Option<String>,
    pub message: String,
}

pub struct AppState {
    pub auth_use_case: Arc<AuthUseCase>,
    pub pool: PgPool
}

pub async fn register_handler(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<RegisterPayload>, // Gunakan RegisterPayload
) -> impl IntoResponse {
    match state.auth_use_case.register(payload.name, payload.email, payload.password).await {
        Ok(_) => (
            StatusCode::CREATED,
            Json(AuthResponse { token: None, message: "User registered successfully".into() })
        ),
        Err(e) => (
            StatusCode::BAD_REQUEST,
            Json(AuthResponse { token: None, message: e })
        ),
    }
}

pub async fn login_handler(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<LoginPayload>, 
) -> impl IntoResponse {
    match state.auth_use_case.login(payload.email, payload.password).await {
        Ok(token) => (
            StatusCode::OK,
            Json(AuthResponse { token: Some(token), message: "Login successful".into() })
        ),
        Err(e) => (
            StatusCode::UNAUTHORIZED,
            Json(AuthResponse { token: None, message: e })
        ),
    }
}

pub async fn get_all_users_handler(
    State(state): State<Arc<AppState>>,
) -> impl IntoResponse {
    match state.auth_use_case.get_all_users().await {
        Ok(users) => {
            // Mapping untuk menghilangkan field password dari response frontend
            let safe_users: Vec<_> = users.into_iter().map(|u| {
                json!({
                    "id": u.id,
                    "name": u.name,
                    "email": u.email
                })
            }).collect();

            Json(json!({
                "status": "success",
                "data": safe_users
            })).into_response()
        }
        Err(err) => {
            let error_response = json!({ "status": "error", "message": err });
            (StatusCode::INTERNAL_SERVER_ERROR, Json(error_response)).into_response()
        }
    }
}


pub async fn get_user_by_id_handler(
    State(state): State<Arc<AppState>>,
    Path(id): Path<uuid::Uuid>, 
) -> impl IntoResponse {
    match state.auth_use_case.get_user_by_id(id).await {
        Ok(user) => {
            
            let safe_user = json!({
                "id": user.id,
                "name": user.name,
                "email": user.email
            });

            Json(json!({
                "status": "success",
                "data": safe_user
            })).into_response()
        }
        Err(err) => {
            let status = if err == "User not found" {
                StatusCode::NOT_FOUND
            } else {
                StatusCode::INTERNAL_SERVER_ERROR
            };
            
            let error_response = json!({ "status": "error", "message": err });
            (status, Json(error_response)).into_response()
        }
    }
}