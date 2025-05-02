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

### Menggunakan Docker biasa

Build image:
```bash
docker build -t sengketa-backend .
```

Jalankan container:
```bash
docker run -p 3003:3003 sengketa-backend
```

### Menggunakan Docker Compose

1. Buat file `docker-compose.yml`:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3003:3003"
    environment:
      - NODE_ENV=production
    volumes:
      - ./uploads:/app/uploads
    restart: unless-stopped
```

2. Jalankan dengan Docker Compose:
```bash
# Memulai services
docker-compose up -d

# Melihat logs
docker-compose logs -f

# Menghentikan services
docker-compose down
```

## API Documentation

Setelah menjalankan aplikasi, dokumentasi API dapat diakses di:
```
http://localhost:3003/api-docs
```

## License

MIT