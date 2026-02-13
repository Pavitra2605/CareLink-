# 🏥 CareLink Backend - Production-Ready Healthcare System

A comprehensive, security-hardened Node.js + Express backend for the CareLink healthcare platform with intelligent workflows and production observability.

**Status**: ✅ **Production Ready** | **All 3 Layers Complete** | **61 Compiled Files** | **Zero TypeScript Errors**

---

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running](#running-the-server)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Initialize database
npm run seed

# 3. Start development server  
npm run dev
```

Server runs on `http://localhost:3000`  
Swagger UI: `http://localhost:3000/api-docs`

**Test Credentials**:
- **Patient**: `john@example.com` / `password123`
- **Doctor**: `doctor@example.com` / `password123`

---

## ✨ Features

### Layer 1: Security Hardening ✅
- **Authentication**: JWT-based with 1-hour expiry, refresh tokens
- **Authorization**: Role-based access control (PATIENT, DOCTOR, ADMIN, STAFF)
- **Input Validation**: Zod schemas on all endpoints
- **Database Integrity**: PRAGMA foreign_keys, CHECK constraints, 8 strategic indexes
- **Audit Logging**: 7+ event types with user/IP tracking
- **Rate Limiting**: 3-tier system (auth: 10/min, critical: 10/min, API: 60/min)
- **Password Security**: bcrypt hashing (12 rounds)
- **Health Checks**: Database connectivity monitoring

### Layer 2: Intelligent Workflows ✅
- **Doctor Queue**: Priority-sorted (ASC) with triage severity mapping
- **Auto-Escalation**: HIGH severity → Priority 1 + emergency creation
- **Patient Timeline**: 4 event types (consultations, triages, emergencies, records)
- **Analytics Dashboard**: Consultation/doctor/patient metrics
- **Enhanced Audit**: Resource-level tracking with context
- **Performance Optimization**: 8 strategic database indexes
- **Modular Architecture**: Service-Controller-Routes pattern

### Layer 3: Production Observability ✅
- **Structured Logging**: Winston with JSON format + file rotation
- **Request Logging**: Morgan HTTP middleware integrated
- **Metrics Endpoint**: Real-time uptime, memory, request statistics
- **API Documentation**: OpenAPI 3.0 Swagger UI with schemas
- **Containerization**: Dockerfile + Docker Compose orchestration
- **Security Headers**: Helmet with HSTS, CORS configured
- **Environment Management**: `.env` templating for all configurations
- **Build System**: TypeScript compilation with npm scripts

---

## 🏗️ Architecture

### Technology Stack
- **Runtime**: Node.js 18+ (or Docker)
- **Framework**: Express.js 4.18
- **Language**: TypeScript 5.3
- **Database**: SQLite3 (replaceable)
- **Authentication**: JWT (jsonwebtoken)
- **Logging**: Winston 3.19, Morgan 1.10
- **Validation**: Zod 4.3
- **Security**: bcrypt, helmet, express-rate-limit
- **API Docs**: Swagger/OpenAPI 3.0

### Directory Structure
```
src/
├── config/          # Database, Swagger, logging config
├── middleware/      # Auth, validation, rate limiting, CORS
├── modules/         # Feature modules (auth, consultations, etc.)
│   ├── auth/        # JWT authentication
│   ├── users/       # User management
│   ├── triage/      # Patient triage & severity
│   ├── consultations/ # Doctor queue system
│   ├── records/     # Medical records
│   ├── emergency/   # Emergency events
│   └── audit/       # Audit logging
├── schemas/         # Zod validation schemas
├── utils/           # Logger utility
└── scripts/         # Database seeds, testing, verification

dist/               # Compiled JavaScript (61 files)
schema.sql          # SQLite schema with indexes
```

### Database Schema Highlights
- **Tables**: 7 (users, consultations, triage_logs, medical_records, emergency_events, audit_logs, patient_profiles)
- **Indexes**: 8 strategic (priority, status, severity, timestamps)
- **Constraints**: Foreign keys, CHECK constraints, CASCADE delete
- **Priority System**: 1 (HIGH) → 2 (MEDIUM) → 3 (LOW)

---

## 📦 Installation

### Prerequisites
- Node.js 18+ (or Docker)
- npm 9+
- Git

### Steps

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and configure:
   ```env
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=your-secret-key-change-in-production
   DB_PATH=./carelink.db
   LOG_LEVEL=info
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Initialize Database**
   ```bash
   npm run seed
   ```
   Creates schema, indexes, and test data (john@example.com, doctor@example.com)

---

## ⚙️ Configuration

### Environment Variables
| Variable | Default | Purpose |
|----------|---------|---------|
| `PORT` | 3000 | Server port |
| `NODE_ENV` | development | Environment (development/production) |
| `JWT_SECRET` | N/A | JWT signing key ⚠️ **MUST CHANGE** |
| `JWT_EXPIRE` | 1h | JWT expiration time |
| `DB_PATH` | ./carelink.db | SQLite database location |
| `LOG_LEVEL` | info | Logging level (error/warn/info/debug) |
| `LOG_DIR` | ./logs | Log file directory |
| `CORS_ORIGIN` | http://localhost:3000 | Allowed frontend origin |
| `ENABLE_METRICS` | true | Metrics endpoint enabled |
| `SWAGGER_ENABLED` | true | Swagger UI enabled |

### Security Settings
- Rate limit windows: Auth 10/min, Critical 10/min, API 60/min
- Password minimum: 8 characters
- Phone format: 10 digits
- Age validation: 0-150 years
- HSTS: 1 year, includeSubDomains, preload

---

## 🏃 Running the Server

### Development
```bash
npm run dev
```
Runs with nodemon (hot reload), logs to console

### Production
```bash
npm run build
npm start
```
Compiles TypeScript, runs from dist/

### Docker
```bash
npm run docker:build
npm run docker:up
```
Or use Docker Compose directly:
```bash
docker-compose up --build
```

### Available Scripts
| Script | Purpose |
|--------|---------|
| `npm run dev` | Development with hot reload |
| `npm run build` | Compile TypeScript to dist/ |
| `npm start` | Run compiled server (production) |
| `npm run serve` | Build & start |
| `npm run seed` | Initialize database |
| `npm run verify-db` | Check schema & indexes |
| `npm run docker:build` | Build Docker image |
| `npm run docker:up` | Docker Compose up |
| `npm run docker:down` | Docker Compose down |
| `npm run docker:logs` | View container logs |

---

## 📚 API Documentation

### Interactive Documentation
Start the server and visit: **`http://localhost:3000/api-docs`**

Swagger UI provides:
- ✅ All endpoints with request/response schemas
- ✅ Try it out functionality
- ✅ Authentication (JWT Bearer token)
- ✅ Error response examples
- ✅ Complete parameter documentation

### Key Endpoints

#### Health & System
```
GET  /health              # System status & DB connectivity
GET  /metrics             # Performance metrics & telemetry
```

#### Authentication
```
POST /auth/register       # Register new user
POST /auth/login          # Login & get JWT token
POST /auth/refresh        # Refresh JWT token
GET  /auth/profile        # Get current user profile
```

#### Consultations (Doctor Queue)
```
GET  /consultations/queue # Get doctor queue (priority-sorted)
POST /consultations       # Create consultation
GET  /consultations/:id   # Get consultation details
PATCH /consultations/:id  # Update consultation status
```

#### Triage
```
POST /triage              # Create triage log
GET  /triage/:id          # Get triage details
PATCH /triage/:id         # Update triage
```

#### Medical Records
```
POST /records             # Create medical record
GET  /records/:id         # Get record details
PATCH /records/:id        # Update record
```

#### Emergency Events
```
POST /emergencies         # Create emergency event
GET  /emergencies/:id     # Get emergency details
PATCH /emergencies/:id    # Update emergency status
```

#### Analytics
```
GET  /analytics           # Dashboard metrics
GET  /analytics/consultations
GET  /analytics/doctors   
GET  /analytics/patients  
```

#### Timeline
```
GET  /timeline/:userId    # Patient event timeline
```

---

## 🧪 Testing

### Automated Test Flow
```bash
npx ts-node src/scripts/test_flow.ts
```
Runs E2E tests on auth, triage, records, consultations, and emergency modules.

### Database Verification
```bash
npm run verify-db
```
Checks:
- Tables exist
- Indexes are created
- Foreign keys enabled
- Data integrity

### Manual Testing

**Using cURL**:
```bash
# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get consultations queue
curl -X GET http://localhost:3000/consultations/queue \
  -H "Authorization: Bearer <your-token>"
```

**Using Insomnia/Postman**:
1. Import Swagger spec: `http://localhost:3000/api-docs`
2. Authenticate with test credentials
3. Test each endpoint

### Test Data
- **Patient User**: john@example.com / password123  
- **Doctor User**: doctor@example.com / password123
- Both have profiles created and ready for consultations

---

## 🚢 Deployment

### Docker Deployment (Recommended)

1. **Build Image**
   ```bash
   docker build -t carelink-backend .
   ```

2. **Run Container**
   ```bash
   docker run -d \
     -p 3000:3000 \
     -e JWT_SECRET=your-production-secret \
     -e NODE_ENV=production \
     -v carelink-data:/app/data \
     carelink-backend
   ```

3. **Docker Compose** (All-in-one)
   ```bash
   docker-compose up -d --build
   ```

### Environment for Production

**Update `.env`**:
```env
NODE_ENV=production
JWT_SECRET=<generate-strong-random-key>
DB_PATH=/app/data/carelink.db
CORS_ORIGIN=<your-frontend-domain>
LOG_LEVEL=warn
ENABLE_METRICS=true
```

**Database**:
- Use mounted volume for persistence: `/app/data/carelink.db`
- SQLite suitable for medium loads; consider PostgreSQL for scaling

**Security**:
- ✅ Use strong JWT_SECRET (min 32 chars)
- ✅ Enable HTTPS in production
- ✅ Configure CORS_ORIGIN to frontend domain
- ✅ Set NODE_ENV=production for optimizations
- ✅ Rotate logs regularly
- ✅ Monitor metrics endpoint

### Kubernetes/Cloud Deployment
See [LAYER3_PRODUCTION_GUIDE.md](LAYER3_PRODUCTION_GUIDE.md) for detailed K8s, AWS, and cloud-specific deployment instructions.

---

## 🔍 Troubleshooting

### "SQLITE_ERROR: no such column: priority"
**Solution**: Run fresh database initialization
```bash
rm carelink.db
npm run seed
```

### "Port 3000 already in use"
**Solutions**:
```bash
# Change port
PORT=3001 npm run dev

# Or kill existing process
lsof -ti:3000 | xargs kill -9  # macOS/Linux
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process  # Windows
```

### "Cannot find module X"
```bash
npm install
npm run build  # Ensure dist/ is compiled
```

### Database locked
```bash
# Kill Node processes holding locks
killall node  # or: Get-Process node | Stop-Process -Force

# Delete corrupted database
rm carelink.db
npm run seed
```

### TypeScript compilation errors
```bash
npm run build  # Will show exact errors
# Fix errors in src/ and rebuild
```

### Logs not appearing
Check configuration:
```bash
grep LOG_LEVEL .env
tail -f logs/error.log  # Check file logs
```

---

## 📊 Monitoring & Observability

### Metrics Endpoint
```bash
curl http://localhost:3000/metrics | jq
```

Returns:
- Uptime (milliseconds)
- Memory usage (RSS, heap)
- Request metrics (total, errors, avg response time)
- Status code distribution
- Last 100 request times

### Logging
- **Files**: `logs/error.log` (errors), `logs/combined.log` (all)
- **Format**: JSON for parsing, includes timestamp, level, message
- **Rotation**: 5MB per file, 5 error files, 10 combined files
- **Console**: Dev only (set by NODE_ENV)

### Health Check
```bash
curl http://localhost:3000/health
# { "status": "OK", "message": "Database connected" }
```

---

## 📖 Additional Documentation

- **[Schema Migration Details](SCHEMA_MIGRATION_COMPLETE.md)**: Database updates and verification
- **[Production Deployment Guide](LAYER3_PRODUCTION_GUIDE.md)**: Comprehensive production setup
- **[Database Schema](schema.sql)**: SQL DDL with indexes and constraints

---

## 🤝 Contributing

### Code Standards
- TypeScript strict mode enabled
- ESLint configured (via tsconfig)
- Zod validation on all API inputs
- Service-Controller-Routes pattern
- Named exports for better tree-shaking

### Development Workflow
1. Create feature branch
2. Make changes in `src/`
3. Run `npm run build` to verify
4. Test with `npm run dev`
5. Commit and push

---

## 📝 License

[Specify your license here]

---

## ✅ Status Summary

| Component | Status | Details |
|-----------|--------|---------|
| Security (Layer 1) | ✅ Complete | Auth, validation, audit, rate limiting |
| Workflows (Layer 2) | ✅ Complete | Priority queue, auto-escalation, analytics |
| Observability (Layer 3) | ✅ Complete | Logging, metrics, Swagger, Docker |
| Database | ✅ Ready | Schema finalized, indices created |
| Build | ✅ Success | 61 compiled files, zero errors |
| Production | ✅ Ready | Docker, monitoring, security headers |

**Last Updated**: February 13, 2026  
**Next Step**: Deploy with `npm run docker:up` or `npm start`
View lines 6-10 to see the login code:
```typescript
const patientLogin = await axios.post(`${BASE_URL}/auth/login`, {
    email: 'john@example.com',
    password: 'password123'
});
```

### Option 2: Using CURL in Terminal
Run this command in your terminal to test login:

**Patient Login:**
```bash
curl -X POST http://localhost:3000/auth/login ^
 -H "Content-Type: application/json" ^
 -d "{\"email\": \"john@example.com\", \"password\": \"password123\"}"
```

**Doctor Login:**
```bash
curl -X POST http://localhost:3000/auth/login ^
 -H "Content-Type: application/json" ^
 -d "{\"email\": \"doctor@example.com\", \"password\": \"password123\"}"
```

If successful, you will receive a JSON response containing a `token`. This token is your "key" to access other endpoints.

## API Endpoints

| Module | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| **Auth** | POST | `/auth/register` | Register new user |
| | POST | `/auth/login` | Login (returns JWT) |
| | GET | `/auth/me` | Get current user info |
| **Triage** | POST | `/triage` | Submit symptoms & severity |
| | GET | `/triage/me` | Get my triage logs |
| **Profile** | POST | `/users/profile` | Create patient profile |
| | GET | `/users/me` | Get full profile |
| **Consultation** | POST | `/consultations/request` | Request consultation (Patient) |
| | GET | `/consultations/me` | Get my consultations |
| | PATCH | `/consultations/:id/status` | Update status (Doctor) |
| **Records** | POST | `/records` | Create record (Doctor) |
| | GET | `/records/:patientId` | Get patient records |
| **Emergency** | POST | `/emergency` | Trigger emergency |

## Project Structure
- `src/config`: Database setup
- `src/middleware`: Auth, Role, Error handling
- `src/modules`: Feature-based modules (Controller, Service, Routes)
