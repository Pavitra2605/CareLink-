# CareLink System - Bug Report & Analysis

**Test Date:** February 16, 2026  
**Status:** Both frontend and backend are running, but critical bugs prevent them from communicating.

---

## 🔴 CRITICAL BUGS BLOCKING FUNCTIONALITY

### 1. **CORS Configuration Mismatch** (CRITICAL)
**Location:** `backend/.env` and `backend/src/app.ts`  
**Severity:** 🔴 CRITICAL - Blocks all frontend-backend communication

**Issue:**
- Backend CORS is configured to only accept requests from `http://localhost:3000`
- Frontend runs on `http://localhost:5173`
- All API requests from frontend will be blocked with CORS errors

**Current Config in app.ts:**
```typescript
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',  // ❌ WRONG!
    credentials: true,
    optionsSuccessStatus: 200
}));
```

**Backend .env file is missing:**
```dotenv
CORS_ORIGIN=http://localhost:5173  // ❌ MISSING!
```

**Fix Required:**
Update `.env` to include: `CORS_ORIGIN=http://localhost:5173`

---

### 2. **API Route Prefix Mismatch** (CRITICAL)
**Location:** `frontend/src/api/client.ts` and `backend/src/app.ts`

**Issue:**
- Frontend API client expects routes at `/api/auth`, `/api/users`, etc.
- Backend routes are registered directly at `/auth`, `/users`, etc.
- All API calls will return 404 errors

**Frontend expects:**
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
// Calls: http://localhost:3000/api/auth/login
```

**Backend provides:**
```typescript
app.use('/auth', authRouter);      // ❌ Should be at /api/auth
app.use('/users', userRouter);     // ❌ Should be at /api/users
```

**Fix Required:**
Wrap all routes with `/api` prefix in backend.

---

### 3. **Auth Response Type Mismatch** (CRITICAL)
**Location:** 
- `backend/src/modules/auth/auth.service.ts` (resolves)
- `frontend/src/api/auth.api.ts` (expects)
- `frontend/src/app/stores/auth.store.ts` (stores)

**Issue:**
- Backend login/register returns: `{ token, user }`
- Frontend expects: `{ token, refreshToken, user }`
- Frontend will crash trying to store `undefined` refreshToken

**Backend returns:**
```typescript
resolve({
    token,                      // ✅ Provided
    user: { id, name, ... }    // ✅ Provided
    // ❌ NO refreshToken
});
```

**Frontend expects:**
```typescript
interface LoginResponse {
    token: string;
    refreshToken: string;       // ❌ MISSING
    user: { ... };
}
```

**Fix Required:**
Either:
- Option A: Remove `refreshToken` from frontend expectation (simpler)
- Option B: Implement refresh token mechanism in backend (recommended for production)

---

## 🟡 MEDIUM SEVERITY ISSUES

### 4. **JWT Token Expiration Without Refresh Mechanism** (MEDIUM)
**Location:** `backend/src/modules/auth/auth.service.ts`

**Issue:**
- JWT tokens expire in 1 hour
- No refresh token endpoint exists
- Users will be logged out after 1 hour with no way to refresh
- Frontend has refresh logic but backend doesn't support it

**Token generation (1-hour expiry):**
```typescript
const token = jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: '1h'  // ⚠️ Short expiry
});
```

**Backend is missing:**
- `/auth/refresh` endpoint
- Refresh token storage in database
- Refresh token validation logic

**Fix Required:**
Implement proper refresh token mechanism or increase JWT expiry to 24 hours for development.

---

### 5. **Missing Environment Variables** (MEDIUM)
**Location:** `backend/.env`

**Issue:**
Frontend cannot connect to backend without proper environment configuration.

**Missing in .env:**
```dotenv
CORS_ORIGIN=http://localhost:5173  # ❌ MISSING - CRITICAL
VITE_API_BASE_URL=http://localhost:3000/api  # In frontend .env (may be missing)
```

---

## 🟢 LOGIC ISSUES & WARNINGS

### 6. **Fire-and-Forget Emergency Auto-Escalation** (INFO)
**Location:** `backend/src/modules/triage/triage.service.ts`

**Note (Not a bug, but a design choice):**
```typescript
// Auto-escalate to emergency if HIGH severity
if (severity === 'HIGH') {
    TriageService.autoEscalateEmergency(userId, triageId, symptoms);  // Fire and forget
}
```

- Emergency escalation happens asynchronously without error handling
- Response success doesn't confirm emergency was created
- If database is busy, escalation might fail silently

**Recommendation:**
- Implement queue-based escalation or wait for confirmation

---

### 7. **Missing `/auth/profile` Endpoint** (MEDIUM)
**Location:** `frontend/src/api/auth.api.ts`

**Issue:**
```typescript
getProfile: () =>
    api.get<any>('/auth/profile'),  // ❌ This endpoint doesn't exist
```

Frontend tries to call `/api/auth/profile` but backend only has:
- `/auth/register`
- `/auth/login`
- `/auth/me` ✅ (This one exists)

**Fix Required:**
Change frontend to call `/auth/me` or add `/profile` endpoint to backend.

---

### 8. **Missing `/auth/logout` Endpoint** (MEDIUM)
**Location:** `frontend/src/api/auth.api.ts`

**Issue:**
```typescript
logout: () =>
    api.post('/auth/logout'),  // ❌ This endpoint doesn't exist
```

Backend doesn't implement logout. Currently only frontend store is cleared.

**Note:**
For stateless JWT auth, logout is optional (token invalidation happens on expiry).

---

### 9. **Missing `/auth/refresh` Endpoint** (MEDIUM)
**Location:** `frontend/src/api/auth.api.ts`

**Issue:**
```typescript
refresh: (refreshToken: string) =>
    api.post<LoginResponse>('/auth/refresh', { refreshToken }),  // ❌ Not implemented
```

Backend has no refresh endpoint or refresh token mechanism.

---

## 📊 SYSTEM STATUS

### ✅ What's Working:
- Backend server starts successfully on port 3000
- Frontend dev server starts on port 5173
- Database initializes properly
- Swagger documentation available at `/api-docs`
- Health check endpoint available at `/health`
- Metrics endpoint available at `/metrics`

### ❌ What's Not Working:
- Frontend cannot communicate with backend (CORS + routing)
- Login/Register will fail with type mismatches
- Complex Auth flows will break
- JWT tokens expire without refresh mechanism

---

## 🛠️ PRIORITY FIX ORDER

### Phase 1 (Immediate - Unblock communication):
1. ✏️ Update `backend/.env` - Add `CORS_ORIGIN=http://localhost:5173`
2. ✏️ Wrap backend routes with `/api` prefix
3. ✏️ Fix auth response to match frontend expectations (remove refreshToken from frontend OR add to backend)

### Phase 2 (Functionality):
4. ✏️ Implement proper token refresh mechanism
5. ✏️ Fix auth endpoint mismatches (`/profile` → `/me`)
6. ✏️ Add proper error handling

### Phase 3 (Production):
7. 🔒 Change `JWT_SECRET` from hardcoded value
8. 🔒 Implement rate limiting policy
9. ✅ Add comprehensive error handling and validation

---

## 📋 SUMMARY TABLE

| Bug # | Issue | Severity | Status | Impact |
|-------|-------|----------|--------|--------|
| 1 | CORS blocked | 🔴 CRITICAL | Not Fixed | No API calls work |
| 2 | API route prefix | 🔴 CRITICAL | Not Fixed | 404 on all routes |
| 3 | Auth response type | 🔴 CRITICAL | Not Fixed | Login/Register crash |
| 4 | No refresh tokens | 🟡 MEDIUM | Not Fixed | 1-hour session limit |
| 5 | Missing env vars | 🟡 MEDIUM | Not Fixed | Can't configure |
| 6 | Missing endpoints | 🟡 MEDIUM | Not Fixed | Feature incomplete |
| 7 | Silent failures | 🟢 LOW | Design | Edge case handling |

---

**Generated:** 2026-02-16 21:27  
**Status:** Ready for fixes
