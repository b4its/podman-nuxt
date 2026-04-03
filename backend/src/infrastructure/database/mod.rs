use crate::domain::{entities::User, repostirories::UserRepository};
use sqlx::{PgPool, Row};

pub struct PostgresUserRepository {
    pool: PgPool,
}

impl PostgresUserRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

#[async_trait::async_trait]
impl UserRepository for PostgresUserRepository {
    async fn save(&self, user: &User) -> Result<(), String> {
        sqlx::query("INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4)")
            .bind(user.id)
            .bind(&user.name)
            .bind(&user.email)
            .bind(&user.password)
            .execute(&self.pool)
            .await
            .map_err(|e| e.to_string())?;
        Ok(())
    }

    async fn find_by_email(&self, email: &str) -> Result<Option<User>, String> {
        let row = sqlx::query("SELECT id, name, email, password FROM users WHERE email = $1")
            .bind(email)
            .fetch_optional(&self.pool)
            .await
            .map_err(|e| e.to_string())?;

        if let Some(r) = row {
            Ok(Some(User {
                id: r.get("id"),
                name: r.get("name"),
                email: r.get("email"),
                password: r.get("password"),
            }))
        } else {
            Ok(None)
        }
    }

    async fn find_all(&self) -> Result<Vec<User>, String> {
        let rows = sqlx::query("SELECT id, name, email, password FROM users")
            .fetch_all(&self.pool)
            .await
            .map_err(|e| e.to_string())?;

        let users = rows.into_iter().map(|r| User {
            id: r.get("id"),
            name: r.get("name"),
            email: r.get("email"),
            password: r.get("password"),
        }).collect();

        Ok(users)
    }

    async fn find_by_id(&self, id: uuid::Uuid) -> Result<Option<User>, String> {
        let row = sqlx::query("SELECT id, name, email, password FROM users WHERE id = $1")
            .bind(id)
            .fetch_optional(&self.pool)
            .await
            .map_err(|e| e.to_string())?;

        if let Some(r) = row {
            Ok(Some(User {
                id: r.get("id"),
                name: r.get("name"),
                email: r.get("email"),
                password: r.get("password"),
            }))
        } else {
            Ok(None)
        }
    }
}