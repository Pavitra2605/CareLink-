# CareLink Backend - Production Hardening Guide

This document details all production-grade security and stability hardening implemented in the CareLink backend.

---

## 1. DATABASE INTEGRITY ENFORCEMENT ✅

### Foreign Key Enforcement
- **Status**: ✅ IMPLEMENTED
- **Location**: `src/config/database.ts`
- **Details**: 
  - `PRAGMA foreign_keys = ON` is executed on every database connection
  - Prevents orphaned records and maintains referential integrity
  - All table relationships use `FOREIGN KEY` constraints with `ON DELETE CASCADE` or `ON DELETE SET NULL`

```typescript
// In database.ts
db.run('PRAGMA foreign_keys = ON'); // Executed on connection
```

### Database Indexes
- **Status**: ✅ IMPLEMENTED
- **Location**: `schema.sql`
- **Indexes Created**:
  - Users: `idx_users_phone`, `idx_users_role`
  - Patient Profiles: Auto-indexed on primary key
  - Triage Logs: `idx_triage_user`
  - Consultations: `idx_consultations_patient`, `idx_consultations_doctor`, `idx_consultations_status`
  - Medical Records: `idx_records_patient`, `idx_records_doctor`
  - Emergency Events: `idx_emergency_patient`, `idx_emergency_status`
  - Audit Logs: `idx_audit_user`, `idx_audit_resource`, `idx_audit_date`

**Purpose**: Improve query performance and enable fast lookups for common operations.

### CHECK Constraints
- **Status**: ✅ IMPLEMENTED
- **Constraints**:
  - `role` IN ('PATIENT', 'DOCTOR', 'PHARMACIST', 'HOSPITAL_ADMIN', 'SYSTEM_ADMIN', 'CHW')
  - `severity` IN ('LOW', 'MEDIUM', 'HIGH')
  - `consultation_status` IN ('REQUESTED', 'ACTIVE', 'COMPLETED', 'CANCELLED')
  - `emergency_status` IN ('TRIGGERED', 'IN_PROGRESS', 'RESOLVED')

**Purpose**: Enforce data validity at the database layer, preventing invalid values.

### NOT NULL Enforcement
- **Status**: ✅ IMPLEMENTED
- **Critical Fields**:
  - `users`: name, email, password, role, phone
  - `patient_profiles`: user_id, date_of_birth, gender, address
  - `triage_logs`: user_id, symptoms, severity, recommended_action
  - `consultations`: patient_id, status
  - `medical_records`: patient_id, doctor_id, diagnosis
  - `emergency_events`: patient_id, status

---

## 2. INPUT VALIDATION LAYER ✅

### Zod Schema Validation
- **Status**: ✅ IMPLEMENTED
- **Package**: `zod` v4.3.6
- **Location**: `src/schemas/`

### Validation Schemas

#### Auth Validation (`auth.schema.ts`)
```typescript
// Register Validation
- name: 2-100 characters
- email: Valid email format
- password: 6-128 characters, alphanumeric + symbols
- role: ENUM validation with error message
- phone: 10-20 characters, supports +, (), -, . formats
  Example: +1234567890, (123) 456-7890, 123-456-7890

// Login Validation
- email: Valid email format
- password: Required, max 128 characters
```

#### Triage Validation (`triage.schema.ts`)
```typescript
- symptoms: Min 3 characters
- severity: ENUM ['LOW', 'MEDIUM', 'HIGH']
```

#### Consultation Validation (`consultation.schema.ts`)
```typescript
// Request
- notes: Optional string

// Update Status
- status: ENUM ['ACTIVE', 'COMPLETED', 'CANCELLED']
- id (param): Valid UUID format
```

#### Records Validation (`records.schema.ts`)
```typescript
- patient_id: Valid UUID
- diagnosis: Min 2 characters
- prescription: Optional
- notes: Optional
```

#### Emergency Validation (`emergency.schema.ts`)
```typescript
- description: Optional
- location: Optional
```

#### User Profile Validation (`user.schema.ts`) ✨ NEW
```typescript
- date_of_birth: Valid date, age 0-150 years
- gender: ENUM ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']
- address: 5-255 characters
- medical_history: Optional, max 1000 characters
```

### Validation Middleware
- **Location**: `src/middleware/validation.middleware.ts`
- **Behavior**:
  - Validates `req.body`, `req.query`, `req.params` against Zod schema
  - Returns HTTP 400 with detailed error messages on validation failure
  - Errors include field path and specific validation message

```typescript
// Example Error Response
{
  "status": "fail",
  "message": "Validation Error: body.password is Password must be at least 6 characters, body.phone is Invalid phone format..."
}
```

### Applied to All Routes
- ✅ `/auth/register` - registerSchema
- ✅ `/auth/login` - loginSchema
- ✅ `/triage` - createTriageSchema
- ✅ `/consultations/request` - requestConsultationSchema
- ✅ `/consultations/:id/status` - updateConsultationStatusSchema
- ✅ `/records` - createRecordSchema
- ✅ `/emergency` - triggerEmergencySchema
- ✅ `/users/profile` - createPatientProfileSchema

---

## 3. CONSULTATION STATUS TRANSITION GUARD ✅

### Strict State Machine Implementation
- **Location**: `src/modules/consultations/consultation.service.ts`
- **Status**: ✅ IMPLEMENTED

### Allowed Transitions
```
REQUESTED → ACTIVE (Doctor takes the request)
ACTIVE → COMPLETED (Doctor marks as done)
REQUESTED → CANCELLED (Either party can cancel request)
```

### Disallowed Transitions
- ❌ COMPLETED → ACTIVE (Cannot reopen completed consultations)
- ❌ ACTIVE → REQUESTED (Cannot downgrade status)
- ❌ Invalid state transitions (HTTP 400)

### Access Control
- **Only DOCTOR role can update status**
  - Enforced with `restrictTo('DOCTOR')` middleware
  - Patient cannot unilaterally update consultation status
  - Non-assigned doctor cannot update another's consultation

### Error Handling
```typescript
// Invalid transitions return:
{
  "status": "fail",
  "message": "Invalid status transition from [current] to [desired]"
}
```

---

## 4. AUDIT LOGGING SYSTEM ✅

### Audit Log Table
- **Location**: `schema.sql`
- **Status**: ✅ IMPLEMENTED

### Table Schema
```sql
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT NOT NULL,
    details TEXT,
    ip_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_resource ON audit_logs(resource_id);
CREATE INDEX idx_audit_date ON audit_logs(created_at);
```

### Audit Service
- **Location**: `src/modules/audit/audit.service.ts`
- **Method**: `AuditService.log(userId, action, resourceType, resourceId, details, ipAddress)`

### Events Logged
1. **USER_REGISTRATION** - New user registration with email and role
2. **LOGIN_SUCCESS** - Successful login with IP address
3. **LOGIN_FAILED** - Failed login attempts with email and IP address
4. **REQUEST_CONSULTATION** - Patient requests consultation
5. **UPDATE_STATUS** - Doctor updates consultation status
6. **TRIGGER_EMERGENCY** - Emergency event triggered
7. **CREATE_RECORD** - Medical record created by doctor

### IP Address Capture ✨ NEW
- **Location**: `src/modules/auth/auth.controller.ts`
- **Method**: `AuthController.getClientIp(req)`
- **Handles**:
  - Direct connections: `req.socket.remoteAddress`
  - Proxied connections: `x-forwarded-for` header
  - Returns first IP if multiple in header

```typescript
// Example Usage
const clientIp = this.getClientIp(req); // '192.168.1.100'
AuditService.log(userId, 'ACTION', 'RESOURCE', resourceId, details, clientIp);
```

---

## 5. HEALTH CHECK ENDPOINT ✅

### Implementation
- **Location**: `src/app.ts`
- **Endpoint**: `GET /health`
- **Status**: ✅ IMPLEMENTED

### Response Format
```json
{
  "status": "OK|ERROR",
  "database": "connected|disconnected",
  "timestamp": "2026-02-13T10:30:45.123Z"
}
```

### Database Connectivity Check
- Executes `SELECT 1` against SQLite
- Returns 500 if database unavailable
- Returns 200 if all checks pass

### Use Cases
- Kubernetes/Docker health probes
- Load balancer checks
- CI/CD pipeline verification
- Monitoring systems

---

## 6. RATE LIMITING ✅

### Implementation
- **Package**: `express-rate-limit` v8.2.1
- **Location**: `src/middleware/rateLimit.middleware.ts`

### Limiters Configured

#### Auth Limiter
```typescript
// 10 requests per minute per IP
export const authLimiter
- Window: 60 seconds
- Max: 10 requests
- Applied to: POST /auth/login
- Message: "Too many login attempts..."
```

#### Critical Limiter
```typescript
// 10 requests per minute per IP
export const criticalLimiter
- Window: 60 seconds
- Max: 10 requests
- Applied to: 
  - POST /triage
  - POST /emergency
- Message: "Too many critical requests..."
```

#### API Limiter
```typescript
// 60 requests per minute per IP (general)
export const apiLimiter
- Window: 60 seconds
- Max: 60 requests
- Applied to: All routes (global)
- Message: "Too many requests..."
```

### Rate Limit Response
```json
{
  "status": "fail",
  "message": "Too many login attempts from this IP, please try again after a minute"
}
```

---

## 7. CENTRALIZED ERROR HANDLING ✅

### Custom Error Class
- **Location**: `src/middleware/error.middleware.ts`
- **Class**: `AppError`

```typescript
export class AppError extends Error {
    public statusCode: number;
    public status: string;        // 'fail' or 'error'
    public isOperational: boolean; // true = safe to send to client
}
```

### Error Handler Middleware
- **Behavior**:
  - Catches all errors globally
  - Different responses for development vs production
  - No stack traces in production
  - Proper HTTP status codes

### Development Errors (NODE_ENV=development)
```json
{
  "status": "error|fail",
  "error": { ... full error object ... },
  "message": "Error message",
  "stack": "Full stack trace"
}
```

### Production Errors (NODE_ENV=production)
```json
{
  "status": "fail",
  "message": "Specific error message (if operational)"
}
```

```json
{
  "status": "error",
  "message": "Something went very wrong!"
}
```

### Operational vs Programming Errors
- **Operational Errors** (`isOperational: true`)
  - Validation failures
  - Authentication errors
  - Resource not found
  - Business logic violations
  - Sent to client with details

- **Programming Errors** (`isOperational: false`)
  - Uncaught exceptions
  - Database connection errors
  - Logic bugs
  - Only generic message sent to client
  - Full details logged internally

---

## 8. DATABASE VERIFICATION SCRIPT ✅

### Usage
```bash
npm run verify-db
```

### Location
`src/scripts/verify_db.ts`

### Checks Performed
1. **Foreign Keys Status**
   - Verifies `PRAGMA foreign_keys` is ON
   - Warns if turned off

2. **Table Indexes**
   - Lists all indexes for each table
   - Shows index uniqueness status
   - Tables checked:
     - users
     - patient_profiles
     - triage_logs
     - consultations
     - medical_records
     - emergency_events
     - audit_logs

3. **Database Integrity**
   - Runs `PRAGMA integrity_check`
   - Reports any corruption
   - Validates table structure

### Example Output
```
🔍 Verifying Database Integrity...
✅ PRAGMA foreign_keys = ON

📋 Indexes for users:
   - idx_users_phone (Unique: 0)
   - idx_users_role (Unique: 0)

📋 Indexes for consultations:
   - idx_consultations_patient (Unique: 0)
   - idx_consultations_doctor (Unique: 0)
   - idx_consultations_status (Unique: 0)

🏥 Database Integrity Check:
   ok
```

---

## SECURITY CHECKLIST ✅

| Feature | Status | Details |
|---------|--------|---------|
| Foreign Key Enforcement | ✅ | ON for all connections |
| Database Indexes | ✅ | 12 indexes created |
| CHECK Constraints | ✅ | Role, Status, Severity |
| Input Validation | ✅ | Zod schemas on all endpoints |
| Phone Format Validation | ✅ | Regex supports multiple formats |
| Password Strength | ✅ | 6+ chars, alphanumeric |
| Consultation State Machine | ✅ | Strict transition rules |
| Audit Logging | ✅ | 7 events logged |
| IP Address Tracking | ✅ | Auth, Login, Failed login |
| Health Check Endpoint | ✅ | Database connectivity verified |
| Rate Limiting | ✅ | Auth (10), Critical (10), API (60) per minute |
| Error Handling | ✅ | No stack traces in production |
| Role-Based Access Control | ✅ | Enforced on sensitive endpoints |
| JWT Authentication | ✅ | Secure token generation |
| Password Hashing | ✅ | bcrypt with salt rounds |
| HTTPS Headers | ✅ | helmet middleware enabled |
| CORS Protection | ✅ | Enabled in app.ts |

---

## PRODUCTION DEPLOYMENT CHECKLIST

### Environment Variables
Before production deployment, ensure `.env` contains:

```env
# Required
PORT=3000
JWT_SECRET=<CHANGE_THIS_GENERATE_LONG_RANDOM_STRING>
DB_PATH=./carelink.db
NODE_ENV=production

# Optional Database
DB_POOL_SIZE=10
DB_TIMEOUT=5000
```

### Pre-Deployment Steps
1. ✅ Run `npm install` to install dependencies
2. ✅ Run `npm run seed` to initialize database
3. ✅ Run `npm run verify-db` to verify database integrity
4. ✅ Generate strong `JWT_SECRET` (minimum 32 characters)
5. ✅ Set `NODE_ENV=production`
6. ✅ Review `.env` file - ensure no defaults exposed

### Health Checks
```bash
# Test API health
curl http://localhost:3000/health

# Expected response
{
  "status": "OK",
  "database": "connected",
  "timestamp": "2026-02-13T10:30:45.123Z"
}

# Run verification script
npm run verify-db
```

### Monitoring & Logs
1. Monitor `/health` endpoint for uptime
2. Check database indexes regularly
3. Review audit logs for suspicious activity
4. Monitor rate limiting rejections
5. Alert on failed login attempts

---

## EXAMPLE WORKFLOWS

### 1. Patient Registration with Validation
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "role": "PATIENT",
    "phone": "+1-555-123-4567"
  }'

# Success Response (201)
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { "id": "...", "name": "John Doe", "email": "john@example.com", "role": "PATIENT" }
  }
}

# Invalid Phone (400)
{
  "status": "fail",
  "message": "Validation Error: body.phone is Invalid phone format..."
}
```

### 2. Doctor Consultation Status Transition
```bash
# Doctor updates consultation from REQUESTED to ACTIVE
curl -X PATCH http://localhost:3000/consultations/consult-123/status \
  -H "Authorization: Bearer <DOCTOR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"status": "ACTIVE"}'

# Success (200)
{
  "status": "success",
  "data": { "id": "consult-123", "status": "ACTIVE", /* ... */ }
}

# Invalid Transition (400)
{
  "status": "fail",
  "message": "Invalid status transition from COMPLETED to ACTIVE"
}

# Not Authorized (403)
{
  "status": "fail",
  "message": "You are not assigned to this consultation"
}
```

### 3. Audit Log Query (Admin Dashboard)
```sql
-- Recent login attempts from specific IP
SELECT * FROM audit_logs 
WHERE action IN ('LOGIN_SUCCESS', 'LOGIN_FAILED')
AND ip_address = '192.168.1.100'
ORDER BY created_at DESC
LIMIT 10;

-- Consultation status changes by doctor
SELECT * FROM audit_logs 
WHERE action = 'UPDATE_STATUS' 
AND user_id = 'doctor-id-123'
ORDER BY created_at DESC;

-- Emergency events triggered
SELECT * FROM audit_logs 
WHERE action = 'TRIGGER_EMERGENCY'
ORDER BY created_at DESC;
```

---

## DEPENDENCIES FOR HARDENING

```json
{
  "dependencies": {
    "express-rate-limit": "^8.2.1",
    "zod": "^4.3.6",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "helmet": "^7.1.0",
    "cors": "^2.8.5",
    "sqlite3": "^5.1.7",
    "dotenv": "^16.4.5"
  }
}
```

---

## TROUBLESHOOTING

### Rate Limit Rejection
```
Error: Too many login attempts...
```
**Solution**: Wait 60 seconds or configure limiter in `rateLimit.middleware.ts`

### Validation Errors
```
Validation Error: body.phone is Invalid phone format...
```
**Solution**: Check phone format - supports: +1234567890, (123) 456-7890, 123-456-7890

### Invalid Status Transition
```
Invalid status transition from ACTIVE to REQUESTED
```
**Solution**: Only these sequences allowed:
- REQUESTED → ACTIVE
- ACTIVE → COMPLETED
- REQUESTED → CANCELLED

### Database Not Connected
```
GET /health returns status: ERROR, database: disconnected
```
**Solution**: 
1. Verify `DB_PATH` exists and is accessible
2. Run: `npm run verify-db`
3. Check file permissions
4. Restart application

---

## MONITORING QUERIES

### Database Integrity
```bash
npm run verify-db
```

### Recent Audit Events
```sql
SELECT action, resource_type, COUNT(*) as count
FROM audit_logs 
WHERE created_at > datetime('now', '-1 hour')
GROUP BY action, resource_type;
```

### Failed Login Attempts
```sql
SELECT ip_address, COUNT(*) as attempts
FROM audit_logs
WHERE action = 'LOGIN_FAILED'
AND created_at > datetime('now', '-1 hour')
GROUP BY ip_address
HAVING attempts > 3;
```

### User Activity
```sql
SELECT user_id, action, COUNT(*) as count
FROM audit_logs
WHERE created_at > datetime('now', '-24 hours')
GROUP BY user_id, action;
```

---

## NEXT STEPS FOR FURTHER HARDENING

1. **Database Encryption**
   - Consider SQLCipher for encrypted SQLite
   - Encrypt sensitive fields at application layer

2. **Secrets Management**
   - Use AWS Secrets Manager or HashiCorp Vault
   - Rotate JWT_SECRET periodically

3. **API Documentation**
   - Add OpenAPI/Swagger documentation
   - Document all validation requirements

4. **Request Signing**
   - Add request signature verification
   - Prevent replay attacks

5. **Two-Factor Authentication**
   - Implement OTP for sensitive operations
   - Support authenticator apps

6. **Encryption at Transport**
   - Enforce HTTPS in production
   - Add HSTS headers (helmet does this)

7. **Performance Monitoring**
   - Add application performance monitoring
   - Track request/response times

8. **Database Backups**
   - Automated daily backups
   - Point-in-time recovery capability

---

**Last Updated**: February 13, 2026  
**Status**: ✅ Production-Ready with Full Hardening
