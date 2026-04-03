use crate::domain::{entities::User, repostirories::UserRepository};
use crate::infrastructure::auth::{hash_password, verify_password, create_jwt};
use std::sync::Arc;

pub struct AuthUseCase {
    user_repo: Arc<dyn UserRepository>,
}

impl AuthUseCase {
    pub fn new(user_repo: Arc<dyn UserRepository>) -> Self {
        Self { user_repo }
    }

    pub async fn register(&self, name: String, email: String, password: String) -> Result<User, String> {
        let existing = self.user_repo.find_by_email(&email).await?;
        if existing.is_some() {
            return Err("Email already exists".to_string());
        }

        // Hash password sebelum disimpan, meskipun nama kolom/field-nya "password"
        let hashed = hash_password(&password).map_err(|e| e.to_string())?;
        let user = User::new(name, email, hashed);

        self.user_repo.save(&user).await?;
        Ok(user)
    }

    pub async fn login(&self, email: String, password: String) -> Result<String, String> {
        let user = self.user_repo.find_by_email(&email).await?
            .ok_or("Invalid credentials")?;

        // Verifikasi password plain dari user dengan password yang sudah di-hash di DB
        if verify_password(&password, &user.password).unwrap_or(false) {
            let token = create_jwt(&user.id.to_string()).map_err(|e| e.to_string())?;
            Ok(token)
        } else {
            Err("Invalid credentials".to_string())
        }
    }

    pub async fn get_all_users(&self) -> Result<Vec<User>, String> {
        let users = self.user_repo.find_all().await?;
        
        Ok(users)
    }

    pub async fn get_user_by_id(&self, id: uuid::Uuid) -> Result<User, String> {
        let user = self.user_repo.find_by_id(id).await?
            .ok_or("User not found".to_string())?;
            
        Ok(user)
    }
}