use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct User {
    pub id: Uuid, // ID sebagai Primary Key di database
    pub name: String,
    pub email: String,
    pub password: String, 
}

impl User {
    pub fn new(name: String, email: String, password: String) -> Self {
        Self {
            id: Uuid::new_v4(),
            name,
            email,
            password,
        }
    }
}