## Rust Clean Architecture with Nuxt Framework
menggunakan podman untuk containerization, dan quadlet untuk mengelola container, pod, volume, dan jaringan pakai unit systemd

### build images
```bash
podman build -t authenticate-backend ./backend
podman build -t localhost/authenticate-backend:latest -f backend/Containerfile ./backend
podman build --no-cache --progress plain -t localhost/authenticate-backend:latest -f backend/Containerfile ./backend
podman build -t authenticate-frontend ./frontend
podman build -t localhost/authenticate-frontend:latest -f frontend/Containerfile ./frontend
podman build --no-cache --progress plain -t localhost/authenticate-frontend:latest -f frontend/Containerfile ./frontend

```
### konfigurasi quadlet
```bash
mkdir -p ~/.config/systemd/user/
cp quadlets/* ~/.config/systemd/user/

# link container ke systemd
mkdir -p ~/.config/containers/systemd/auth-nuxt
ln -sf ~/programming/rust/cargoRs/nuxt-podman/quadlets/* ~/.config/containers/systemd/auth-nuxt/
ln -sf ~/programming/rust/cargoRs/nuxt-podman/quadlets/*.container ~/.config/containers/systemd/auth-nuxt/
ln -sf ~/programming/rust/cargoRs/nuxt-podman/quadlets/auth-net.network ~/.config/containers/systemd/auth-nuxt/auth.network

systemctl --user daemon-reload
```
### jalankan network dan service yang lain
```bash
systemctl --user start auth-network.service

# Jalankan sisanya
systemctl --user start auth-db.service
systemctl --user start auth-backend.service
systemctl --user start auth-frontend.service
```

### jalankan container podman
```bash
systemctl --user daemon-reload
systemctl --user start auth-network.service
systemctl --user start auth-db.service
```

### masuk ke frontend bash
```bash
podman exec -it auth-frontend bash
podman run --rm -v .:/app -w /app oven/bun:latest bun install
```


### cek unit list
```bash
systemctl --user list-unit-files | grep auth
```

### untuk melihat log frontend:
```bash
podman logs -f auth-frontend-dev
```

### cek container status
```bash
systemctl --user status auth-network.service
systemctl --user status auth-db.service
systemctl --user status auth-backend.service
systemctl --user status auth-frontend.service
```
### restart container service
```bash
systemctl --user restart auth-network.service
systemctl --user restart auth-db.service
systemctl --user restart auth-backend.service
systemctl --user restart auth-frontend.service
```

### untuk mencari service tersedia
```bash
systemctl --user list-units --type=service
systemctl --user list-units --type=service | grep auth
```
### untuk menjalankan migration pada posgresql
```bash
sqlx migrate add -r create_users_table
sqlx database create

sqlx migrate run
```

### bersihkan package
```bash
rm -rf .nuxt .output node_modules/.cache
```
