# CareLink Layer 2 - Quick Reference Guide

## 🚀 Quick Start

### 1. Verify Installation
```bash
cd backend
npm install
npm run verify-db      # Check all indexes
npm run seed           # Initialize database
npm run dev            # Start server
```

### 2. Run Tests
```bash
# In another terminal
npx ts-node src/scripts/test_layer2.ts
```

---

## 📋 API ENDPOINTS AT A GLANCE

### Doctor Queue (Priority Management)
```bash
GET /consultations/queue
Authorization: Bearer <doctor-token>
```
**Used By**: Doctors to see their work queue sorted by priority

**Response**: Array of pending consultations with patient info, severity, priority

---

### Patient Timeline (Medical History)
```bash
GET /patients/:patientId/timeline
Authorization: Bearer <patient-token|doctor-token|admin-token>
```
**Used By**: Patients (own), Doctors (assigned), Admins (any)

**Returns**: Chronological view of all triage, consultations, records, emergencies

**Access Control**:
```typescript
PATIENT:  Can view own timeline only (patientId must match user.id)
DOCTOR:   Can view only if assigned to consultation with patient
ADMIN:    Can view any timeline
```

---

### Admin Metrics (Dashboard)
```bash
GET /admin/metrics
GET /admin/metrics/consultations
GET /admin/metrics/doctors
GET /admin/metrics/patients
Authorization: Bearer <admin-token>
```
**Used By**: SYSTEM_ADMIN, HOSPITAL_ADMIN only

**Returns**: System-wide statistics and metrics

---

## 🔄 WORKFLOWS

### Doctor's Morning
1. Login: `POST /auth/login` → Get token
2. Check Queue: `GET /consultations/queue` → See pending cases
3. Accept High Priority: `PATCH /consultations/:id/status` → status: ACTIVE
4. Review Timeline: `GET /patients/:id/timeline` → Patient history
5. Complete: `PATCH /consultations/:id/status` → status: COMPLETED

### Patient Self-Service
1. Login: `POST /auth/login` → Get token
2. Create Triage: `POST /triage` → Report symptoms
3. Request Consultation: `POST /consultations/request` → Ask for doctor
4. Check Status: `GET /consultations/me` → See assigned doctor
5. View Timeline: `GET /patients/me/timeline` → Review history

### Admin Monitoring
1. Login: `POST /auth/login` with SYSTEM_ADMIN role
2. Dashboard: `GET /admin/metrics` → See all metrics
3. Doctor Stats: `GET /admin/metrics/doctors` → Workload distribution
4. Patient Engagement: `GET /admin/metrics/patients` → System health

---

## 🎯 KEY FEATURES

### Auto-Priority Assignment
```typescript
Triage Severity → Consultation Priority
HIGH    → 1 (Urgent)
MEDIUM  → 2 (Standard)
LOW     → 3 (Routine)
```

**Triggered By**: `POST /consultations/request`

```bash
curl -X POST http://localhost:3000/consultations/request \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"notes": "Follow-up needed"}'

# Response includes priority from latest triage
{
  "data": {
    "id": "consult-123",
    "priority": 1,
    "priority_name": "HIGH",
    "autoEscalated": false
  }
}
```

---

### Auto-Emergency Escalation
```typescript
Triage Severity: HIGH
↓
Automatically creates emergency_event
↓
Status: TRIGGERED
↓
Audit log: AUTO_ESCALATE_EMERGENCY
```

**Triggered By**: `POST /triage` with severity=HIGH

```bash
curl -X POST http://localhost:3000/triage \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "symptoms": "Severe chest pain, difficulty breathing",
    "severity": "HIGH"
  }'

# Response indicates auto-escalation
{
  "data": {
    "id": "triage-123",
    "autoEscalated": true,
    "severity": "HIGH"
  }
}
```

---

### Timeline (Unified View)
```typescript
Patient Timeline Timeline = [
  { type: "TRIAGE", data: {...}, timestamp: "..." },
  { type: "CONSULTATION", data: {...}, timestamp: "..." },
  { type: "RECORD", data: {...}, timestamp: "..." },
  { type: "EMERGENCY", data: {...}, timestamp: "..." }
]
```

**Sorted**: Most recent first (DESC)

```bash
curl http://localhost:3000/patients/patient-123/timeline \
  -H "Authorization: Bearer <token>"

# Response
{
  "success": true,
  "data": {
    "timeline": [
      {
        "id": "event-id",
        "type": "CONSULTATION",
        "timestamp": "2026-02-13T10:30:00Z",
        "data": {
          "notes": "Follow-up consultation",
          "status": "COMPLETED",
          "doctor": "Dr. Smith",
          "priority": 1,
          "priority_name": "HIGH"
        }
      }
    ],
    "summary": {
      "total_events": 5,
      "active_emergencies": 0,
      "latest_severity": "MEDIUM"
    }
  }
}
```

---

## 🔒 ACCESS CONTROL MATRIX

| Endpoint | PATIENT | DOCTOR | ADMIN | PUBLIC |
|----------|---------|--------|-------|--------|
| /consultations/queue | ❌ | ✅ | ✅ | ❌ |
| /patients/:id/timeline | ✅* | ✅** | ✅ | ❌ |
| /admin/metrics | ❌ | ❌ | ✅ | ❌ |
| /admin/metrics/* | ❌ | ❌ | ✅ | ❌ |

**Legend:**
- ✅ = Allowed
- ❌ = Denied (403)
- \* = Own timeline only
- \*\* = Assigned patients only

---

## 💾 DATABASE OPTIMIZATION

### Indexes for Performance
```sql
-- Queue queries
CREATE INDEX idx_consultations_priority ON consultations(priority);
CREATE INDEX idx_consultations_priority_status ON consultations(priority, status);

-- Timeline queries
CREATE INDEX idx_triage_severity ON triage_logs(severity);
CREATE INDEX idx_triage_user_created ON triage_logs(user_id, created_at DESC);
CREATE INDEX idx_emergency_created ON emergency_events(created_at DESC);

-- Audit queries
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_user_date ON audit_logs(user_id, created_at DESC);
```

### Verify Indexes Created
```bash
npm run verify-db
```

---

## 🧪 TESTING CHEAT SHEET

### Full Test Suite
```bash
npx ts-node src/scripts/test_layer2.ts
```

### Manual Test: Auto-Priority
```bash
# 1. Register patient
POST /auth/register

# 2. Create HIGH triage
POST /triage
body: { severity: "HIGH", symptoms: "..." }

# 3. Request consultation (should get priority 1)
POST /consultations/request
body: { notes: "..." }

# Verify: priority should be 1
```

### Manual Test: Doctor Queue
```bash
# As Doctor:
GET /consultations/queue

# Should see pending consultations sorted by priority
# Priority 1 items first (HIGH severity)
```

### Manual Test: Timeline
```bash
# Create triage, consultation, record
# Then:
GET /patients/:patientId/timeline

# Should include all event types in timeline array
```

---

## 📊 AUDIT LOG EVENTS

| Event | Resource | Logged When |
|-------|----------|------------|
| CREATE_TRIAGE | TRIAGE | New triage submitted |
| AUTO_ESCALATE_EMERGENCY | EMERGENCY | HIGH triage auto-creates emergency |
| REQUEST_CONSULTATION | CONSULTATION | Patient requests consultation |
| UPDATE_STATUS | CONSULTATION | Doctor changes consultation status |
| VIEW_CONSULTATION_QUEUE | QUEUE | Doctor accesses queue |
| VIEW_TIMELINE | PATIENT | Patient/doctor views timeline |

**Check Audit Logs:**
```sql
-- Recent system events
SELECT action, resource_type, details, created_at 
FROM audit_logs 
WHERE created_at > datetime('now', '-1 hour')
ORDER BY created_at DESC;

-- Failed logins
SELECT COUNT(*) 
FROM audit_logs 
WHERE action = 'LOGIN_FAILED'
AND created_at > datetime('now', '-24 hours')
GROUP BY ip_address;
```

---

## 🐛 TROUBLESHOOTING

### Queue Returns Empty
```
Check:
1. Are there pending consultations? SELECT * FROM consultations WHERE status = 'REQUESTED'
2. Is doctor authorized? Role must be DOCTOR
3. Are there recent triages? Latest triage determines priority
```

### Timeline Shows No Events
```
Check:
1. Patient has any triage/consultations? SELECT * FROM triage_logs WHERE user_id = ?
2. Access control: You viewing own timeline? (patient) or assigned? (doctor)
3. Dates: Query uses DESC sort, check timestamps aren't future
```

### Admin Metrics Show 0
```
Check:
1. User is SYSTEM_ADMIN or HOSPITAL_ADMIN? 
   SELECT role FROM users WHERE id = ?
2. Database has sufficient test data?
   npm run seed
3. Indexes created?
   npm run verify-db
```

### Priority Not Assigned
```
Check:
1. Patient has recent triage? 
   SELECT * FROM triage_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 1
2. Severity matches HIGH/MEDIUM/LOW (case-sensitive)?
3. Consultation.priority column exists?
   PRAGMA table_info(consultations)
```

---

## 📈 EXAMPLE ANALYTICS RESPONSE

```json
{
  "success": true,
  "data": {
    "users": {
      "total": 150,
      "patients": 100,
      "doctors": 20
    },
    "consultations": {
      "total": 45,
      "pending": 3,
      "active": 2
    },
    "emergencies": {
      "active": 1,
      "in_progress": 0
    },
    "triage": {
      "total": 120,
      "bySeverity": {
        "LOW": 50,
        "MEDIUM": 45,
        "HIGH": 25
      }
    },
    "medical_records": {
      "total": 80
    },
    "timestamp": "2026-02-13T10:30:45.123Z"
  }
}
```

---

## 🔗 USEFUL COMMANDS

```bash
# Start development server
npm run dev

# Run database verification
npm run verify-db

# Seed initial data
npm run seed

# Run Layer 2 tests
npx ts-node src/scripts/test_layer2.ts

# Build TypeScript
npm run build

# Check for errors
npx tsc --noEmit
```

---

## 🆘 SUPPORT

### Check Server Health
```bash
curl http://localhost:3000/health
# Should return: { status: "OK", database: "connected" }
```

### View API Docs
- Consult: [HARDENING.md](./HARDENING.md) for Layer 1
- Consult: [LAYER2_IMPLEMENTATION.md](./LAYER2_IMPLEMENTATION.md) for detailed specs
- Consult: [README.md](./README.md) for basic setup

### Database Issues
```bash
npm run verify-db  # Full integrity check
```

---

**Last Updated**: February 13, 2026  
**Layer**: 2 - Intelligent Workflow & Observability  
**Status**: ✅ Production Ready
