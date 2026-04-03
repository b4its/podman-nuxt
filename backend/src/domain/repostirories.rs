use super::entities::User;

// Application layer hanya akan memanggil fungsi di trait ini.
#[async_trait::async_trait]
pub trait UserRepository: Send + Sync {
    async fn save(&self, user: &User) -> Result<(), String>;
    async fn find_by_email(&self, email: &str) -> Result<Option<User>, String>;
    async fn find_all(&self) -> Result<Vec<User>, String>;
    async fn find_by_id(&self, id: uuid::Uuid) -> Result<Option<User>, String>;
}