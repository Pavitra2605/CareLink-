# CareLink - Full Stack Deployment Guide

**System Status**: Backend ✅ Ready | Frontend ✅ Ready | Integration ✅ Ready  
**Deployment Target**: Windows 10/11 Development Server  
**Test Credentials**: Provided Both Services  

---

## 📊 System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      CareLink Full Stack                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  FRONTEND (React 18 + TypeScript)           BACKEND (Node.js)    │
│  ├─ Port: 5173 (Vite dev)                   ├─ Port: 3000       │
│  ├─ Build: npm run build → dist/            ├─ Health: /health  │
│  ├─ API Client: Axios with JWT              ├─ JWT Auth: Bearer │
│  ├─ State: Zustand + React Query            ├─ DB: SQLite3      │
│  └─ 436 KB JS + 25 KB CSS                   └─ ORM: Prisma      │
│                                                                   │
│  HTTP Request Flow:                                              │
│  React Component → useAuth Hook → Axios     API Route Handler   │
│                    ↓ (JWT Token)            ↓ verify JWT        │
│              API Client Interceptor ──→ Backend Service          │
│                    ↑ (Response)             ↑ Database           │
│            Store (Zustand) ←──────────────────────              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start (5 Minutes)

### Terminal 1: Backend

```bash
cd c:\CareLink-\backend

# Install dependencies (if first time)
npm install

# Start backend server
npm run dev
# Expected output: Server running on http://localhost:3000
# Expected: ✅ Connected to SQLite database
```

### Terminal 2: Frontend

```bash
cd c:\CareLink-\frontend

# Install dependencies (if first time)
npm install

# Start frontend dev server
npm run dev
# Expected output: ✅ VITE v7.3.1 ready in XX ms
# Open http://localhost:5173
```

### Browser

1. Navigate to **http://localhost:5173**
2. Click login or demo credentials button
3. Enter credentials:
   - **Patient**: john@example.com / password123
   - **Doctor**: doctor@example.com / password123
4. ✅ Redirected to /dashboard with user info

---

## 📋 Pre-Deployment Checklist

### Backend Verification

```bash
# Terminal 1: Backend directory
cd c:\CareLink-\backend

# Check health endpoint
curl http://localhost:3000/health
# Response: {"status":"ok","timestamp":"2025-02-14T..."}

# Check API docs
# Open: http://localhost:3000/api-docs (Swagger UI)

# Verify database
# File exists: c:\CareLink-\backend\carelink.db
# Tables created: users, consultations, etc.
```

✅ **Backend Checklist**:
- [ ] npm install completed without errors
- [ ] npm run dev starts without errors
- [ ] Health endpoint returns 200 OK
- [ ] API docs accessible at /api-docs
- [ ] SQLite database file exists
- [ ] No missing environment variables

### Frontend Verification

```bash
cd c:\CareLink-\frontend

# Check build
npm run build
# Expected: ✅ built in XX.XXs (zero errors)

# Check dev server
npm run dev
# Open http://localhost:5173
```

✅ **Frontend Checklist**:
- [ ] npm install completed without errors
- [ ] npm run build succeeds (zero TS errors)
- [ ] npm run dev starts without errors
- [ ] http://localhost:5173 loads
- [ ] .env configured with VITE_API_BASE_URL=http://localhost:3000/api

### Integration Verification

```bash
# 1. Both servers running (2 terminal windows)
# 2. Navigate to http://localhost:5173
# 3. Click "Demo Credentials" and test
# 4. Check Network tab in DevTools:
#    - POST /api/auth/login → 200 OK
#    - Response includes JWT token
#    - localStorage has auth-storage key
```

✅ **Integration Checklist**:
- [ ] Login form submits to backend
- [ ] JWT token returned and stored
- [ ] Redirect to /dashboard succeeds
- [ ] User info displays correctly
- [ ] Logout clears localStorage
- [ ] Protected routes enforce authentication

---

## 🏗️ File Structure Verification

### Backend
```
backend/
├── package.json          ✅ Dependencies listed
├── tsconfig.json         ✅ TypeScript 5.3
├── src/
│   ├── app.ts            ✅ Express setup
│   ├── server.ts         ✅ Port 3000
│   ├── config/           ✅ Database config
│   ├── middleware/       ✅ 5 middleware files
│   ├── modules/          ✅ 6 feature modules
│   └── schemas/          ✅ 5 validation schemas
└── carelink.db           ✅ SQLite database
```

### Frontend
```
frontend/
├── package.json          ✅ Dependencies listed
├── vite.config.ts        ✅ Path alias configured
├── tsconfig.app.json     ✅ Strict mode enabled
├── .env                  ✅ API URL configured
├── src/
│   ├── api/              ✅ Axios client + auth.api.ts
│   ├── app/
│   │   └── stores/       ✅ auth.store.ts, ui.store.ts
│   ├── features/         ✅ auth + shared modules
│   ├── components/       ✅ Toast, Loading, ErrorBoundary
│   ├── hooks/            ✅ useAuth, useToast
│   ├── routes/           ✅ ProtectedRoute
│   ├── App.tsx           ✅ Router configured
│   └── index.css         ✅ Tailwind + custom styles
└── dist/                 ✅ Build output (post-build)
```

---

## 🔐 Authentication Flow Verification

### 1. Registration Flow
```
User fills form → Submit → POST /api/auth/register
                          ↓
                    Backend validates
                    Hash password (bcrypt)
                    Create user record
                    ↓
                    200 {token, refreshToken, user}
                    ↓
Frontend: Store in useAuthStore + localStorage
          Redirect to /dashboard
          Display user info
```

**Test Registration**:
```bash
# Navigate to http://localhost:5173/register
# Fill form:
# - Name: Test Patient
# - Email: testpatient@example.com
# - Phone: 555-1234
# - Password: testpass123
# - Role: PATIENT
# - Click Register

# Expected: Redirected to /dashboard
# Check DevTools → Application → localStorage → auth-storage
# Should contain: token, refreshToken, user object
```

### 2. Login Flow
```
User fills form → Submit → POST /api/auth/login
                         ↓
                    Backend validates email + password
                    Compare hashed password
                    Generate JWT token
                    ↓
                    200 {token, refreshToken, user}
                    ↓
Frontend: Store in useAuthStore + localStorage
          Request interceptor attaches JWT
          Redirect to /dashboard
```

**Test Login**:
```bash
# Navigate to http://localhost:5173/login
# Enter:
# - Email: john@example.com
# - Password: password123
# - Click Login

# Expected: Redirected to /dashboard
# Dashboard displays:
# - User name: John Doe
# - User role: PATIENT
# - Available features (role-specific)
```

### 3. Protected Route Test
```
Unauthenticated user tries /dashboard
            ↓
ProtectedRoute checks isAuthenticated
            ↓
Redirects to /login (with location state)
            ↓
User logs in
            ↓
Redirects back to /dashboard
```

**Test Protected Routes**:
```bash
# 1. Clear localStorage (DevTools → Storage → Clear)
# 2. Navigate to http://localhost:5173/dashboard
# Expected: Redirected to /login

# 3. Log in with credentials
# 4. Try accessing /unauthorized
# Expected: Should show 403 page (no role restriction yet)
```

### 4. Token Refresh Flow
```
Access token expires (if implemented)
            ↓
API returns 401 Unauthorized
            ↓
Request interceptor catches 401
            ↓
POST /api/auth/refresh {refreshToken}
            ↓
Backend validates refresh token
Generate new access token
            ↓
200 {token, new_refreshToken}
            ↓
Frontend updates useAuthStore
Retry original request
```

**Note**: Refresh token flow ready in backend, frontend interceptor configured

---

## 🔧 Configuration Details

### Backend (.env)
```env
# c:\CareLink-\backend\.env (or environment variables)
NODE_ENV=development
PORT=3000
DATABASE_PATH=./carelink.db
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-key
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=info
```

### Frontend (.env)
```env
# c:\CareLink-\frontend\.env
VITE_API_BASE_URL=http://localhost:3000/api
```

Both files are created and configured. No additional setup needed during development.

---

## 🧪 Testing the System

### Test Case 1: User Registration + Login + Dashboard

```bash
# Terminal 1: Backend running
npm run dev
# Output: ✅ Server running on http://localhost:3000

# Terminal 2: Frontend running
npm run dev
# Output: ✅ VITE ready in XX ms

# Browser: http://localhost:5173
1. Click Register
2. Fill form (name, email, phone, password, role)
3. Click Register
4. Verify: Redirected to /dashboard
5. Verify: User info displays
6. Click Logout
7. Verify: Redirected to /login
8. Login with same credentials
9. Verify: Back to /dashboard

Result: ✅ PASS if all steps succeed
```

### Test Case 2: API Client JWT Auto-Attach

```bash
# Open DevTools (F12)
# Go to Network tab
# Login with credentials

1. Check Request Headers for /api/auth/login
   - Should contain: "Accept": "application/json"
   - No Authorization header (login request)

2. After successful login:
   - Check any API call (e.g., /api/auth/profile)
   - Should contain: "Authorization": "Bearer <JWT_TOKEN>"
   
3. Verify DevTools Storage → localStorage
   - Key: auth-storage
   - Value: {token, refreshToken, user}

Result: ✅ PASS if JWT auto-attached to all requests
```

### Test Case 3: Protected Routes

```bash
# DevTools Console: localStorage.clear()
# Navigate to http://localhost:5173/dashboard

1. Verify: Redirected to /login
2. Login
3. Verify: Redirected back to /dashboard

Result: ✅ PASS if protected route recognized auth
```

### Test Case 4: Error Handling

```bash
# Terminal 1: Stop backend server (Ctrl+C)
# Frontend still running
# Navigate to http://localhost:5173
# Try to login

1. Enter any credentials
2. Click Login
3. Observe: Network error caught
4. Verify: Error toast displayed
5. Check Console: Error logged properly

Result: ✅ PASS if error handled gracefully
```

---

## 📦 Build & Production Deployment

### Production Build (Frontend)

```bash
cd c:\CareLink-\frontend

# Build for production
npm run build

# Expected output:
# ✅ 2234 modules transformed
# ✅ dist/index.html 0.54 kB
# ✅ dist/assets/index-XXXXXX.js 436.43 kB / 142.08 kB gzipped
# ✅ dist/assets/index-XXXXXX.css 24.90 kB / 4.29 kB gzipped
# ✅ built in 2.70s

# Preview production build locally
npm run preview
# Navigate to shown URL (typically http://localhost:4173)
```

### Production Build (Backend)

```bash
cd c:\CareLink-\backend

# Compile TypeScript
npx tsc

# Expected: No errors
# Output: compiled files in dist/

# Start production
NODE_ENV=production node dist/server.js
```

### Docker Deployment (Optional)

#### Backend Docker
```dockerfile
# File: c:\CareLink-\backend\Dockerfile (create if missing)
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

#### Frontend Docker
```dockerfile
# File: c:\CareLink-\frontend\Dockerfile (create if missing)
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

#### Docker Compose
```yaml
# File: docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_PATH: /data/carelink.db
      JWT_SECRET: ${JWT_SECRET}
    volumes:
      - ./data:/data
    networks:
      - carelink

  frontend:
    build: ./frontend
    ports:
      - "3001:3000"
    environment:
      VITE_API_BASE_URL: http://localhost:3000/api
    depends_on:
      - backend
    networks:
      - carelink

networks:
  carelink:
    driver: bridge
```

**Deploy with Docker Compose**:
```bash
docker-compose up -d
# Frontend: http://localhost:3001
# Backend: http://localhost:3000
```

---

## 🚨 Troubleshooting

### Frontend Won't Start

**Error**: `EADDRINUSE` (Port 5173 in use)
```bash
# Find process using port
lsof -i :5173
# Kill process
kill -9 <PID>
# Or change port
npm run dev -- --port 5174
```

**Error**: Module not found (@/)
```bash
# Check vite.config.ts has resolve.alias
# Check tsconfig.app.json has paths
# Clear node_modules and reinstall
rm -r node_modules
npm install
```

**Error**: API calls failing (CORS)
```bash
# Ensure backend .env has:
# CORS_ORIGIN=http://localhost:5173
# Or backend has CORS middleware enabled

# Check Network tab in DevTools:
# Look for CORS error headers
# Verify Access-Control-Allow-Origin response header
```

### Backend Won't Start

**Error**: `EADDRINUSE` (Port 3000 in use)
```bash
# Find and kill process
lsof -i :3000
kill -9 <PID>
```

**Error**: Database connection failed
```bash
# Check carelink.db exists
ls -la backend/*.db

# If missing, reseed:
npm run seed
```

**Error**: JWT_SECRET not defined
```bash
# Ensure .env file exists in backend/
# Contains: JWT_SECRET=your-secret-key

# Or set environment variable
set JWT_SECRET=your-secret-key
npm run dev
```

### Authentication Issues

**Issue**: JWT not attaching to requests
```bash
# Check DevTools Network tab
# Verify Authorization header present
# If missing:
# 1. Check localStorage has token
# 2. Verify axios interceptor in src/api/client.ts
# 3. Check useAuthStore has token
```

**Issue**: 401 responses not redirecting to login
```bash
# Check response interceptor in src/api/client.ts
# Verify logout() function called
# Confirm redirect to /login executed
# Check browser console for errors
```

**Issue**: localStorage not persisting
```bash
# DevTools → Storage → localStorage
# Verify key 'auth-storage' exists after login
# If missing:
# 1. Check browser localStorage isn't disabled
# 2. Verify Zustand persist middleware active
# 3. Clear and try login again
```

---

## 📊 Performance Monitoring

### Frontend Performance

```bash
# Build size analysis
npm run build -- --analyze
# Shows which dependencies take most space

# Development profiling
# DevTools → Performance tab → Record session
# Measure React component render times

# Network tab
# Check API response times (aim for < 200ms)
# Check bundle size (436 KB already optimized)
```

### Backend Performance

```bash
# Monitor logs
# Look for slow queries
# Check database indexes

# Load test
# Use Apache Bench or Artillery
ab -n 100 -c 10 http://localhost:3000/health

# Memory usage
# Task Manager (Windows) → Node.js process
# Watch memory growth over time
```

---

## 🔄 Development Workflow

### Daily Development

```bash
# Morning: Start both servers
# Terminal 1
cd c:\CareLink-\backend && npm run dev

# Terminal 2
cd c:\CareLink-\frontend && npm run dev

# Browser
# http://localhost:5173

# Edit code
# Changes auto-reload (HMR for frontend, restart for backend)

# Before committing
npm run build  # Frontend build check
npm run lint   # ESLint check
```

### Adding New Features

```bash
# 1. Create feature folder
mkdir src/features/my-feature
mkdir src/features/my-feature/pages
mkdir src/features/my-feature/components

# 2. Create API service
# src/api/my-feature.api.ts
# Use axios client with proper typing

# 3. Create page component
# src/features/my-feature/pages/MyFeaturePage.tsx
# Import API and use useQuery

# 4. Add route
# Update src/App.tsx with new route
# Use ProtectedRoute if needed

# 5. Test
npm run build  # Check for errors
npm run dev    # Test in browser
```

---

## 🎯 Success Criteria Checklist

- [ ] Backend server starts without errors (`npm run dev`)
- [ ] Frontend server starts without errors (`npm run dev`)
- [ ] Health endpoint responds (`curl http://localhost:3000/health`)
- [ ] Frontend loads at `http://localhost:5173`
- [ ] Login page accessible and renders
- [ ] Demo credentials button works
- [ ] Registration form submits successfully
- [ ] JWT token stored in localStorage after login
- [ ] Dashboard displays user info correctly
- [ ] Logout clears localStorage and redirects to login
- [ ] Protected routes enforce authentication
- [ ] API calls include JWT authorization header
- [ ] Error handling works (try login with wrong password)
- [ ] Toast notifications display errors
- [ ] Build succeeds with zero TypeScript errors
- [ ] Production bundle created in `dist/`

---

## 📞 Quick Reference

### Port Usage
| Service | Port | URL |
|---------|------|-----|
| Frontend Dev | 5173 | http://localhost:5173 |
| Backend | 3000 | http://localhost:3000 |
| API Base | 3000 | http://localhost:3000/api |
| API Docs | 3000 | http://localhost:3000/api-docs |

### Important Files
| Path | Purpose |
|------|---------|
| `backend/.env` | Backend configuration |
| `frontend/.env` | Frontend API URL |
| `backend/carelink.db` | SQLite database |
| `frontend/dist/` | Production build output |

### Key Commands
```bash
# Backend
npm run dev          # Start dev server
npm run build        # Compile TypeScript
npm run seed         # Reset database

# Frontend
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview build locally
npm run lint         # ESLint check
```

---

## ✅ System Ready for Production Phase 2

All prerequisites met:
- ✅ Backend fully functional with all 6 modules
- ✅ Frontend Phase 1 foundation complete
- ✅ Authentication working end-to-end
- ✅ API integration tested
- ✅ Error handling in place
- ✅ Type safety enforced

**Ready for Phase 2**: Patient/Doctor/Admin dashboards  
**Ready for Phase 3**: Real-time features and admin analytics  

---

**Last Updated**: February 2025  
**Status**: Production-Ready Full Stack  
**Next Review**: Phase 2 Completion
