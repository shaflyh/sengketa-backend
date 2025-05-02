# Sengketa Backend

Backend service untuk integrasi dengan Smart Contract Sengketa. Aplikasi ini menyediakan REST API untuk berinteraksi dengan smart contract Sengketa pada blockchain.

## Teknologi

- Node.js & TypeScript
- Express.js - Web framework
- Viem - Ethereum/Web3 library
- Swagger - API documentation
- Winston - Logging
- Zod - Schema validation

## Fitur

- REST API endpoints untuk interaksi dengan smart contract
- Swagger documentation
- File upload handling dengan Multer
- Type-safe dengan TypeScript
- Logging system
- Input validation
- CORS support

## Struktur Proyek

```
src/
├── applications/   # Business logic
├── config/        # Konfigurasi aplikasi
├── controllers/   # Route handlers
├── doc/          # Swagger documentation
├── middlewares/  # Express middlewares
├── models/       # Data models
├── routes/       # API routes
├── services/     # External services integration
└── validations/  # Input validation schemas
```

## Instalasi

1. Clone repository
```bash
git clone [repository-url]
cd sengketa-backend
```

2. Install dependencies
```bash
npm install
# atau
yarn install
```

3. Setup environment variables
```bash
cp .env.example .env
# Edit .env sesuai konfigurasi yang dibutuhkan
```

## Development

Menjalankan dalam mode development:
```bash
npm run dev
# atau
yarn dev
```

## Production

Build dan jalankan untuk production:
```bash
npm run build
npm start
# atau
yarn build
yarn start
```

## Docker

### Dockerfile Optimasi

Dockerfile telah dioptimasi menggunakan:
- **Multi-stage builds** - memisahkan build stage dan production stage
- **Optimasi ukuran image** - menggunakan node:20-slim sebagai base image
- **Security best practices** - menggunakan non-root user
- **Caching layer** - memisahkan dependency installation dari code copy
- **Target environments** - support untuk production dan development

Build untuk development:
```bash
docker build -t sengketa-backend:dev .
```

Build untuk production:
```bash
docker build --target production -t sengketa-backend:prod .
```

Jalankan container development:
```bash
docker run -p 3003:3003 sengketa-backend:dev
```

Jalankan container production:
```bash
docker run -p 3003:3003 sengketa-backend:prod
```

### Menggunakan Docker Compose

Jalankan dengan Docker Compose:
```bash
# Memulai services dengan development environment (default)
docker compose up -d

# Memulai services dengan production environment (edit compose.yaml target: production)
# docker compose up -d

# Melihat logs
docker compose logs -f

# Menghentikan services
docker compose down
```

> **Catatan**: Gunakan target `development` atau `production` di compose.yaml sesuai kebutuhan.

## API Documentation

Setelah menjalankan aplikasi, dokumentasi API dapat diakses di:
```
http://localhost:3003/api-docs
```

## License

MIT