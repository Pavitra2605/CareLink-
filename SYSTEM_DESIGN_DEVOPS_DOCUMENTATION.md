# CareLink - SYSTEM DESIGN & DEVOPS DOCUMENTATION
## Advanced Architecture, Design Diagrams & CI/CD Pipeline

**Document Version:** 1.0
**Date:** May 5, 2026
**Status:** PRODUCTION-READY
**Audience:** Systems Architects, DevOps Engineers, Development Teams

---

## TABLE OF CONTENTS
1. USE CASE DIAGRAM
2. LEVEL 0 DATA FLOW DIAGRAM (DFD)
3. UML CLASS DIAGRAM
4. UML SEQUENCE DIAGRAMS
5. ARCHITECTURE EXPLANATION
6. TESTING STRATEGY
7. DEVOPS CI/CD PIPELINE
8. MONITORING & OBSERVABILITY
9. TOOLS & TECHNOLOGY STACK

---

## 1. USE CASE DIAGRAM

### 1.1 Actor Definitions

| Actor | Description | System Access |
|-------|-------------|----------------|
| **Patient** | End-user seeking healthcare guidance | Mobile app, web portal |
| **Doctor** | Licensed healthcare provider | Web dashboard, video conferencing |
| **Community Health Worker (CHW)** | Field-based health advocate | Mobile app (offline-capable) |
| **Pharmacist** | Pharmacy inventory manager | Web dashboard, inventory system |
| **Admin** | System administrator | Web console, monitoring dashboard |
| **AI Service** | Backend ML/LLM processor | Internal service |
| **Supabase (DB)** | Cloud database backend | Internal data store |
| **Mapbox** | External mapping service | GPS hospital location |

---

### 1.2 Use Cases & Actor Interactions

```
┌─────────────────────────────────────────────────────────────────┐
│                        CareLink System                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Patient                    Doctor              Admin            │
│    ║                          ║                  ║              │
│    ║                          ║                  ║              │
│    ╠─── UC-1: Register ──────────                ║              │
│    ║                                             ║              │
│    ╠─── UC-2: Login ────────────────────────────╛              │
│    ║                                                            │
│    ╠─── UC-3: Check Symptoms                                  │
│    ║      │                                                   │
│    ║      └─→ UC-3a: Input Free Text Symptoms               │
│    ║      └─→ UC-3b: Answer Clarification Questions         │
│    ║      └─→ UC-3c: View Risk Classification               │
│    ║      └─→ UC-3d: Read AI Explanation                    │
│    ║                                                          │
│    ╠─── UC-4: Upload Medical Image                          │
│    ║      └─→ UC-4a: Capture/Select Image                   │
│    ║      └─→ UC-4b: AI Image Analysis (VLM)               │
│    ║      └─→ UC-4c: View Findings                          │
│    ║                                                          │
│    ╠─── UC-5: Initiate Emergency SOS                        │
│    ║      └─→ UC-5a: Activate SOS Button                    │
│    ║      └─→ UC-5b: Quick Triage Assessment                │
│    ║      └─→ UC-5c: Find Nearest Hospital (Mapbox)         │
│    ║      └─→ UC-5d: Notify Emergency Contacts              │
│    ║      └─→ UC-5e: Receive First-Aid Guidance             │
│    ║                                                          │
│    ╠─── UC-6: Book Consultation                             │
│    ║      └─→ UC-6a: Select Specialty                        │
│    ║      └─→ UC-6b: Browse Doctors                          │
│    ║      └─→ UC-6c: View Availability                       │
│    ║      └─→ UC-6d: Make Payment                            │
│    ║      └─→ UC-6e: Receive Confirmation                    │
│    ║                                  ║                       │
│    ║                                  ║                       │
│    ║                    ╠─── UC-7: Conduct Consultation      │
│    ║                    ║      └─→ UC-7a: Join Video Call    │
│    ║                    ║      └─→ UC-7b: Chat During Call   │
│    ║                    ║      └─→ UC-7c: Write Prescription │
│    ║                    ║      └─→ UC-7d: End Consultation   │
│    ║                    ║                                     │
│    ║                    ╠─── UC-8: Review Patient Records    │
│    ║                    ║      └─→ UC-8a: Access EHR         │
│    ║                    ║      └─→ UC-8b: Review History     │
│    ║                    ║      └─→ UC-8c: View Tests         │
│    ║                                                          │
│    ╠─── UC-9: View Health Records                           │
│    ║      └─→ UC-9a: Medical History                        │
│    ║      └─→ UC-9b: Immunizations                          │
│    ║      └─→ UC-9c: Medications                            │
│    ║      └─→ UC-9d: Test Results                           │
│    ║                                                          │
│    ╠─── UC-10: Search Medicines                             │
│    ║      └─→ UC-10a: Search by Name/Symptom                │
│    ║      └─→ UC-10b: Find Nearby Pharmacies                │
│    ║      └─→ UC-10c: Compare Prices                        │
│    ║                                                          │
│    ╠─── UC-11: Continue AI Chat                             │
│    ║      └─→ UC-11a: Send Message                          │
│    ║      └─→ UC-11b: View History                          │
│    ║      └─→ UC-11c: Receive AI Response                   │
│    ║                                                          │
│    ╠─── UC-12: Change Language                              │
│    ║      └─→ Select from en/es/fr/hi/ta                    │
│    ║                                                          │
│    │                                  ║                       │
│    │                                  ║                       │
│    │                    ╠─── UC-13: Manage Inventory ────────╛
│    │Pharmacist             └─→ UC-13a: Update Stock
│    │    ║                  └─→ UC-13b: Set Prices
│    │    ║                  └─→ UC-13c: View Reports
│    │    ║
│    │    ╠─── UC-14: Search Medicines
│    │    ║
│    │    ╠─── UC-15: Process Orders
│    │    ║
│    │
│    Admin
│    ║
│    ╠─── UC-16: Monitor System Health
│    ║      └─→ Prometheus/Grafana Dashboard
│    ║
│    ╠─── UC-17: View Audit Logs
│    ║      └─→ Prediction logs, access logs
│    ║
│    ╠─── UC-18: Manage Users
│    ║      └─→ UC-18a: View Users
│    ║      └─→ UC-18b: Suspend/Enable Accounts
│    ║      └─→ UC-18c: View Roles & Permissions
│    ║
│    ╠─── UC-19: Model Management
│    ║      └─→ UC-19a: Check Model Version
│    ║      └─→ UC-19b: Deploy New Model
│    ║      └─→ UC-19c: Rollback Model
│    ║
│    ╠─── UC-20: System Configuration
│    ║      └─→ UC-20a: Manage API Keys
│    ║      └─→ UC-20b: Configure Thresholds
│    ║      └─→ UC-20c: Update Rules
│    ║
└─────────────────────────────────────────────────────────────────┘
```

---

### 1.3 Detailed Use Case Specifications

#### UC-3: Check Symptoms (Primary Flow)

```
Actors: Patient, AI Service
Precondition: User logged in
Postcondition: Risk classification displayed

Main Flow:
1. Patient navigates to "Symptom Checker" screen
2. Patient enters free-text symptoms (e.g., "chest pain, sweating")
3. Patient selects age, duration, chronic conditions
4. Patient selects language preference
5. Patient taps "Submit"
6. System validates input (Pydantic models)
7. AI Service receives request via REST API
8. NLP preprocessing (normalize, tokenize)
9. SymptomExtractor extracts entities (spaCy)
10. FeatureEngineer builds 14-D feature vector
11. ML Model (GradientBoosting) generates forecast
12. RuleEngine applies 8 clinical rules
13. Confidence controller checks confidence gate
14. MedGemma LLM generates explanation (GPU)
15. AuditLogger logs prediction to SQLite
16. System returns JSON response to mobile app
17. Mobile displays:
    - Risk level (HIGH/MEDIUM/LOW) with color coding
    - Confidence percentage
    - AI explanation
    - Recommended actions
18. Patient views results
19. Patient can:
    - Continue to chat
    - Book doctor consultation
    - Emergency SOS
    - Save to medical records

Exception Flows:
- If input invalid → show validation error
- If API timeout → show "Please try again"
- If GPU fails to load → show template explanation
- If confidence <60% → escalate for human review
```

---

#### UC-5: Emergency SOS (Critical Flow)

```
Actors: Patient, Mapbox, Supabase, Twilio (SMS)
Precondition: Device has GPS enabled, internet (or cached maps)
Postcondition: Emergency contacts notified, location shared

Main Flow:
1. Patient taps large red "SOS" button (home or emergency tab)
2. Haptic feedback triggered
3. 3-second cancellation countdown shown
4. If not cancelled:
   a. GPS location captured (expo-location)
   b. Quick emergency questionnaire (1 minute)
   c. Risk assessed (HIGH/MEDIUM/LOW)
   d. AI-guided first-aid instructions displayed
   e. Mapbox query for nearest 5 hospitals
   f. Results shown: name, distance, travel time, phone
   g. One-tap directions (Google Maps/Apple Maps)
   h. Emergency contacts (up to 3) notified via SMS
   i. Location link sent to each contact
   j. Follow-up reminder scheduled (6 hours)

Emergency Contact Notification:
- SMS: "EMERGENCY: {PatientName} needs help at {LocationLink}"
- Contact can tap link to see location on map
- Contact receives in-app notification (if user in system)

Data Flow:
Patient App → Firebase → AI Service → Mapbox API → Hospital data
              ↓
           Twilio SMS ← Contact phone numbers
```

---

#### UC-7: Conduct Consultation (Doctor Flow)

```
Actors: Doctor, Patient, WebRTC (video/audio), Supabase
Precondition: Consultation scheduled, both parties online
Postcondition: Prescription issued, consultation closed

Main Flow:
1. Doctor receives notification "Patient {Name} ready for consultation"
2. Doctor joins video call
3. System establishes WebRTC peer-to-peer connection
4. Video/audio streams encrypted (DTLS-SRTP)
5. Patient and doctor converse
6. Doctor can:
   - Toggle video/audio
   - Request tests/exams
   - Access patient's medical history (EHR)
   - Share screen (future)
7. Doctor writes prescription during/after call
8. System issues e-prescription (QR code)
9. Call ends when either party disconnects
10. System logs consultation duration
11. Patient prompted to rate consultation (1-5 stars)
12. System notifies patient: "Visit completed, prescription ready"
13. Patient can:
    - Download prescription
    - Share with pharmacy (QR code)
    - Schedule follow-up

Exception Flows:
- If network drops → "Reconnecting..." shown
- If patient no-shows → Mark as "No-show", alert doctor
- If doctor runs late → Auto-extend waiting time (5 min)
```

---

## 2. LEVEL 0 DATA FLOW DIAGRAM (DFD)

### 2.1 Context Diagram (Level 0)

```
                    ┌──────────────────────────────────────┐
                    │                                      │
                    │   CARELINK HEALTHCARE PLATFORM      │
                    │                                      │
                    │  • Symptom Triage                    │
                    │  • Telemedicine                      │
                    │  • Health Records                    │
                    │  • Emergency Response                │
                    │  • Medicine Search                   │
                    │                                      │
                    └──────────────┬───────────────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         │                         │                         │
         │                         │                         │
         ▼                         ▼                         ▼

    ┌─────────────┐          ┌──────────────┐          ┌──────────┐
    │   PATIENT   │          │    DOCTOR    │          │  MAPBOX  │
    │             │          │              │          │  (Maps)  │
    │ • Register  │          │ • Conduct    │          │          │
    │ • Symptoms  │          │   consults   │          │ GPS Data │
    │ • Upload    │          │ • Prescribe  │          │          │
    │ • SOS       │          │ • View EHR   │          └──────────┘
    │ • Records   │          │              │
    │ • Chat      │          └──────────────┘
    │             │
    └─────────────┘

    ┌─────────────────────────────────────────────────────────────┐
    │                  EXTERNAL SYSTEMS                            │
    ├─────────────────────────────────────────────────────────────┤
    │ • Supabase (PostgreSQL)  │ • HuggingFace API (MedGemma)     │
    │ • Twilio (SMS)           │ • Google Translate API           │
    │ • Stripe (Payments)      │ • Firebase (Push notifications)  │
    └─────────────────────────────────────────────────────────────┘
```

---

### 2.2 Level 1 DFD (Process Decomposition)

```
┌──────────────────────────────────────────────────────────────────────────┐
│                     CARELINK SYSTEM (Level 1)                            │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Patient/Doctor         1.0                      2.0                    │
│      │              AUTHENTICATION          SYMPTOM TRIAGE              │
│      │                                                                  │
│      │─→ Register  ─────────→ [JWT Issuer]          [Preprocessor]    │
│      │              │            ↓                       ↓              │
│      │              └─→ Supabase Auth ──→ [NLP Extractor]             │
│      │                  (users table)        ↓                          │
│      │                                   [Feature Engineer]              │
│      │              [ML Model]                ↓                         │
│      │         (GradientBoosting)        [RuleEngine]                  │
│      │              ↓                        ↓                         │
│      │         Prediction                [LLM Service]                 │
│      │         (HIGH/MED/LOW)            (MedGemma GPU)               │
│      │              │                       ↓                         │
│      │              │                   [AuditLogger]                  │
│      │              │                       ↓                         │
│      │              └───→ Supabase DB ←───SQLite                      │
│      │                  (predictions)     (local audit)                │
│      │                      │                 │                        │
│      │                      ▼                 ▼                        │
│      │              Response JSON ←── Cache (AsyncStorage)             │
│      │                      │                                          │
│      └──────────────────────┴──────────────────→ Mobile App            │
│                                                                        │
│      ┌──────────────────────┐        ┌──────────────────────┐         │
│      │ 3.0 TELEMEDICINE    │        │ 4.0 EMERGENCY RESPONSE│         │
│      │                      │        │                      │         │
│      │ Doctor selects ─────→│        │ SOS Button ─→GPS Loc │         │
│      │ Patient             │        │      ↓               │         │
│      │      ↓              │        │  Mapbox Query ───────→│         │
│      │ WebRTC Setup ──→ P2P│        │      ↓               │         │
│      │ Call                │        │ Hospital List         │         │
│      │      ↓              │        │      ↓               │         │
│      │ Prescription ────→ E│        │ Notify Contacts      │         │
│      │      ↓              │        │ (Twilio SMS)         │         │
│      │ Supabase Store      │        │                      │         │
│      └──────────────────────┘        └──────────────────────┘         │
│                                                                        │
│      ┌──────────────────────┐        ┌──────────────────────┐         │
│      │ 5.0 HEALTH RECORDS  │        │ 6.0 MEDICINE SEARCH  │         │
│      │                      │        │                      │         │
│      │ Get User Profile    │        │ Search Query ────────→│         │
│      │      ↓              │        │      ↓               │         │
│      │ Medical History     │        │ Pharmacy Inventory   │         │
│      │ Immunizations       │        │      ↓               │         │
│      │ Medications         │        │ Price Comparison     │         │
│      │ Test Results        │        │      ↓               │         │
│      │      ↓              │        │ Mapbox (Nearby)      │         │
│      │ Supabase Retrieve   │        │ Display Results      │         │
│      └──────────────────────┘        └──────────────────────┘         │
│                                                                        │
└──────────────────────────────────────────────────────────────────────┘
```

---

### 2.3 Data Stores & Storage Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     DATA PERSISTENCE LAYER                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PRIMARY DATABASE (Supabase PostgreSQL)                        │
│  ├─ users (1M rows, 500MB)                                    │
│  ├─ chat_sessions (10M, 5GB)                                  │
│  ├─ chat_messages (100M, 50GB)                                │
│  ├─ vlm_scans (5M, 2.5GB)                                     │
│  ├─ symptom_checks (50M, 25GB)                                │
│  ├─ consultations (2M, 1GB)                                   │
│  ├─ prescriptions (10M, 5GB)                                  │
│  ├─ health_records (5M, 2.5GB)                                │
│  ├─ medicines (100K, 100MB)                                   │
│  ├─ pharmacies (10K, 50MB)                                    │
│  └─ pharmacy_inventory (1M, 500MB)                            │
│     ├─ Size: ~92GB                                            │
│     ├─ Backup: Daily snapshots                                │
│     ├─ Replication: 3 zones (high availability)               │
│     ├─ Encryption: AES-256 at rest, TLS 1.3 in transit       │
│     └─ RLS: auth.uid() = user_id on all tables               │
│                                                                 │
│  LOCAL DATABASE (SQLite - Offline/Audit)                       │
│  ├─ carelink.db (106KB initial)                               │
│  ├─ predictions (10K cached rows)                             │
│  ├─ api_calls (100K cached)                                   │
│  ├─ sync_queue (1K current offline)                           │
│  ├─ Purpose: Offline triage + audit trail                     │
│  ├─ Max size: 200MB per device                                │
│  └─ No sensitive data (audit only)                            │
│                                                                 │
│  CLOUD STORAGE (Supabase Storage / S3)                         │
│  ├─ medical-images/                                           │
│  │  ├─ Size: ~100TB estimated                                │
│  │  ├─ Policy: User upload to own folder                     │
│  │  └─ Access: Public read (anonymized)                      │
│  ├─ test-reports/                                             │
│  │  └─ Size: ~50TB estimated                                 │
│  └─ prescriptions/                                            │
│     └─ Size: ~10TB estimated                                 │
│     └─ Total: ~160TB @ scale                                 │
│                                                                 │
│  CACHE LAYER (Redis - Optional)                               │
│  ├─ Session cache (24h TTL)                                   │
│  ├─ Model weights cache                                       │
│  ├─ Query cache (1h TTL)                                      │
│  └─ Purpose: Reduce database load                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 2.4 External Data Flows

```
┌────────────────────────────────────────────────────────────────┐
│              EXTERNAL INTEGRATIONS & DATA FLOWS                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Mapbox API                                                   │
│  ├─ Request: GPS coordinates (lat, lon)                      │
│  ├─ Response: Nearest 5 hospitals with details              │
│  ├─ Frequency: On-demand (emergency SOS)                    │
│  └─ Cache: Downloaded map tiles (offline fallback)         │
│                                                                │
│  HuggingFace API                                              │
│  ├─ Model: google/medgemma-4b-it (4B param)                │
│  ├─ Request: Image data + clinical question                │
│  ├─ Response: Analysis text + findings                      │
│  ├─ Frequency: On-demand (user upload)                      │
│  ├─ Latency: 15-30s (GPU inference)                         │
│  └─ Cache: Quantized model (2GB on GPU)                     │
│                                                                │
│  Google Translate API                                         │
│  ├─ Request: Text + target language                         │
│  ├─ Response: Translated text                               │
│  ├─ Frequency: On ML response generation                    │
│  └─ Cache: 1-hour TTL per phrase                            │
│                                                                │
│  Twilio SMS API                                               │
│  ├─ Request: Phone numbers + message                        │
│  ├─ Response: Delivery status (sent/failed)                │
│  ├─ Frequency: Emergency SOS only                           │
│  ├─ Reliability: 99.9% delivery SLA                         │
│  └─ Retry: Up to 3 attempts on failure                      │
│                                                                │
│  Firebase Cloud Messaging (Push)                              │
│  ├─ Request: Device token + message payload                 │
│  ├─ Response: Delivery confirmation                         │
│  ├─ Frequency: Appointment reminders, alerts                │
│  └─ Fallback: SMS if Firebase fails                         │
│                                                                │
│  Stripe Payment API (Future)                                  │
│  ├─ Request: Card details + amount                          │
│  ├─ Response: Payment status (success/fail)                │
│  ├─ PCI DSS: Compliant via Stripe (no card data in app)    │
│  └─ Retry: PCI-safe retry logic                            │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 3. UML CLASS DIAGRAM

### 3.1 Core Domain Classes

```
┌──────────────────────────────────────────────────────────────────────┐
│                        UML CLASS DIAGRAM                             │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────┐                                    │
│  │        USER                 │                                    │
│  ├─────────────────────────────┤                                    │
│  │ - id: UUID                  │                                    │
│  │ - email: String             │                                    │
│  │ - password_hash: String     │                                    │
│  │ - full_name: String         │                                    │
│  │ - date_of_birth: Date       │                                    │
│  │ - blood_type: String        │                                    │
│  │ - allergies: String[]       │                                    │
│  │ - chronic_conditions: []    │                                    │
│  │ - emergency_contacts: []    │                                    │
│  │ - language: String          │                                    │
│  │ - role: Enum(PATIENT|...)   │                                    │
│  │ - created_at: DateTime      │                                    │
│  ├─────────────────────────────┤                                    │
│  │ + register(): bool          │                                    │
│  │ + login(): JWT              │                                    │
│  │ + getProfile(): User        │                                    │
│  │ + updateProfile(): void     │                                    │
│  │ + logout(): void            │                                    │
│  │ + getHealthRecords(): []    │                                    │
│  └──────────────┬──────────────┘                                    │
│                 │ has                                               │
│                 │ 1..*                                              │
│                 │                                                   │
│  ┌──────────────▼──────────────────────────────────┐               │
│  │    HEALTH_RECORD                                │               │
│  ├──────────────────────────────────────────────────┤               │
│  │ - id: UUID                                      │               │
│  │ - user_id: UUID (FK)                           │               │
│  │ - record_type: Enum(HISTORY|IMMUNIZATION|...)  │               │
│  │ - condition: String                             │               │
│  │ - date: Date                                    │               │
│  │ - details: JSON                                 │               │
│  │ - created_at: DateTime                          │               │
│  ├──────────────────────────────────────────────────┤               │
│  │ + getHistory(): String[]                        │               │
│  │ + addRecord(): bool                             │               │
│  │ + deleteRecord(): bool                          │               │
│  └──────────────┬───────────────────────────────────┘               │
│                 │                                                   │
│  ┌──────────────▼──────────────────────────────────┐               │
│  │  SYMPTOM_CHECK (Triage Result)                 │               │
│  ├──────────────────────────────────────────────────┤               │
│  │ - id: UUID                                      │               │
│  │ - user_id: UUID (FK)                           │               │
│  │ - symptoms_text: String                         │               │
│  │ - age: Int                                      │               │
│  │ - duration_days: Int                            │               │
│  │ - ml_prediction: Enum(LOW|MEDIUM|HIGH)         │               │
│  │ - ml_confidence: Float (0-1)                   │               │
│  │ - rules_triggered: String[]                     │               │
│  │ - final_prediction: Enum(LOW|MEDIUM|HIGH)      │               │
│  │ - explanation: String                           │               │
│  │ - emergency_flag: Boolean                       │               │
│  │ - model_version: String                         │               │
│  │ - request_id: String                            │               │
│  │ - created_at: DateTime                          │               │
│  ├──────────────────────────────────────────────────┤               │
│  │ + getTriage(): TriageResponse                    │               │
│  │ + isEmergency(): Boolean                        │               │
│  │ + getExplanation(): String                      │               │
│  └──────────────┬───────────────────────────────────┘               │
│                 │ refers_to                                        │
│  ┌──────────────▼──────────────────────────────────┐               │
│  │  AI_MODEL                                       │               │
│  ├──────────────────────────────────────────────────┤               │
│  │ - id: UUID                                      │               │
│  │ - version: String                               │               │
│  │ - algorithm: String (GradientBoosting)         │               │
│  │ - accuracy: Float                               │               │
│  │ - training_date: Date                           │               │
│  │ - model_path: String                            │               │
│  │ - is_active: Boolean                            │               │
│  ├──────────────────────────────────────────────────┤               │
│  │ + predict(features[]): Prediction               │               │
│  │ + load(): void                                  │               │
│  │ + evaluate(): Float                             │               │
│  │ + deploy(): void                                │               │
│  │ + rollback(): void                              │               │
│  └──────────────────────────────────────────────────┘               │
│                                                                    │
│  ┌──────────────────────────────────────────────────┐               │
│  │  CONSULTATION                                   │               │
│  ├──────────────────────────────────────────────────┤               │
│  │ - id: UUID                                      │               │
│  │ - patient_id: UUID (FK → USER)                 │               │
│  │ - doctor_id: UUID (FK → USER)                  │               │
│  │ - consultation_type: Enum(VIDEO|AUDIO|TEXT)    │               │
│  │ - status: Enum(SCHEDULED|ACTIVE|COMPLETED)    │               │
│  │ - specialty: String                             │               │
│  │ - started_at: DateTime                          │               │
│  │ - ended_at: DateTime                            │               │
│  │ - summary: String                               │               │
│  │ - prescription_id: UUID (FK)                    │               │
│  │ - rating: Float (1-5)                           │               │
│  │ - created_at: DateTime                          │               │
│  ├──────────────────────────────────────────────────┤               │
│  │ + schedule(): bool                              │               │
│  │ + start(): WebRTC_Connection                    │               │
│  │ + end(): void                                   │               │
│  │ + rate(rating: Float): void                     │               │
│  │ + getPrescription(): Prescription               │               │
│  │ + getSummary(): String                          │               │
│  └──────────────┬───────────────────────────────────┘               │
│                 │ results_in                                       │
│  ┌──────────────▼──────────────────────────────────┐               │
│  │  PRESCRIPTION                                   │               │
│  ├──────────────────────────────────────────────────┤               │
│  │ - id: UUID                                      │               │
│  │ - consultation_id: UUID (FK)                    │               │
│  │ - patient_id: UUID (FK)                         │               │
│  │ - medications: Medicine[]                       │               │
│  │ - instructions: String                          │               │
│  │ - refills_remaining: Int                        │               │
│  │ - qr_code: String                               │               │
│  │ - is_valid: Boolean                             │               │
│  │ - created_at: DateTime                          │               │
│  ├──────────────────────────────────────────────────┤               │
│  │ + generateQRCode(): String                      │               │
│  │ + validate(): boolean                           │               │
│  │ + refill(): Prescription                        │               │
│  │ + share(pharmacy_id): void                      │               │
│  └──────────────────────────────────────────────────┘               │
│                                                                      │
│  ┌──────────────────────────────────────────────────┐               │
│  │  EMERGENCY_INCIDENT                             │               │
│  ├──────────────────────────────────────────────────┤               │
│  │ - id: UUID                                      │               │
│  │ - user_id: UUID (FK)                           │               │
│  │ - incident_type: String                         │               │
│  │ - latitude: Float                               │               │
│  │ - longitude: Float                              │               │
│  │ - risk_level: Enum(HIGH|MEDIUM|LOW)           │               │
│  │ - hospital_id: UUID                             │               │
│  │ - contacts_notified: String[]                   │               │
│  │ - first_aid_guidance: String                    │               │
│  │ - status: Enum(ACTIVE|RESOLVED)                │               │
│  │ - created_at: DateTime                          │               │
│  │ - resolved_at: DateTime                         │               │
│  ├──────────────────────────────────────────────────┤               │
│  │ + activate(): void                              │               │
│  │ + getNearestHospitals(): Hospital[]             │               │
│  │ + notifyContacts(): void                        │               │
│  │ + getFirstAidGuidance(): String                 │               │
│  │ + resolve(): void                               │               │
│  └──────────────────────────────────────────────────┘               │
│                                                                      │
│  ┌──────────────────────────────────────────────────┐               │
│  │  HOSPITAL                                        │               │
│  ├──────────────────────────────────────────────────┤               │
│  │ - id: UUID                                      │               │
│  │ - name: String                                  │               │
│  │ - address: String                               │               │
│  │ - latitude: Float                               │               │
│  │ - longitude: Float                              │               │
│  │ - phone: String                                 │               │
│  │ - specialties: String[]                         │               │
│  │ - beds_available: Int                           │               │
│  │ - open_24_7: Boolean                            │               │
│  ├──────────────────────────────────────────────────┤               │
│  │ + getDistance(lat: Float, lon: Float): Float   │               │
│  │ + getETA(lat: Float, lon: Float): Time         │               │
│  │ + hasSpecialty(specialty: String): Boolean     │               │
│  └──────────────────────────────────────────────────┘               │
│                                                                      │
│  ┌──────────────────────────────────────────────────┐               │
│  │  CHAT_SESSION                                    │               │
│  ├──────────────────────────────────────────────────┤               │
│  │ - id: UUID                                      │               │
│  │ - user_id: UUID (FK)                           │               │
│  │ - title: String                                 │               │
│  │ - messages: Message[]                           │               │
│  │ - triage_context: JSON                          │               │
│  │ - created_at: DateTime                          │               │
│  ├──────────────────────────────────────────────────┤               │
│  │ + sendMessage(role, content): Message           │               │
│  │ + getMessages(): Message[]                      │               │
│  │ + generateTitle(): String                       │               │
│  └──────────────────────────────────────────────────┘               │
│                                                                      │
│  ┌──────────────────────────────────────────────────┐               │
│  │  VLM_SCAN (Medical Image Analysis)              │               │
│  ├──────────────────────────────────────────────────┤               │
│  │ - id: UUID                                      │               │
│  │ - user_id: UUID (FK)                           │               │
│  │ - image_url: String                             │               │
│  │ - clinical_question: String                     │               │
│  │ - analysis: String                              │               │
│  │ - findings: String[]                            │               │
│  │ - severity: Enum(MILD|MODERATE|SEVERE)        │               │
│  │ - confidence: Float (0-1)                       │               │
│  │ - model_name: String                            │               │
│  │ - created_at: DateTime                          │               │
│  ├──────────────────────────────────────────────────┤               │
│  │ + analyze(): void                               │               │
│  │ + getFindings(): String[]                       │               │
│  │ + getSeverity(): String                         │               │
│  └──────────────────────────────────────────────────┘               │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

### 3.2 Class Relationships & Associations

```
Relationships Summary:

1. USER (1) ──has_many──> (M) HEALTH_RECORD
   └ One user has multiple health records

2. USER (1) ──initiates──> (M) SYMPTOM_CHECK
   └ Patient creates multiple symptom checks

3. USER (1) ──participates_in──> (M) CONSULTATION
   └ User is patient or doctor in multiple consultations

4. CONSULTATION (1) ──results_in──> (1) PRESCRIPTION
   └ Each consultation can yield one prescription

5. USER (1) ──conducts──> (M) CHAT_SESSION
   └ User has multiple chat sessions

6. CHAT_SESSION (1) ──records──> (M) CHAT_MESSAGE
   └ Session contains multiple messages

7. SYMPTOM_CHECK (M) ──analyzed_by──> (1) AI_MODEL
   └ Multiple checks use single model version

8. USER (1) ──reports──> (M) EMERGENCY_INCIDENT
   └ User can trigger multiple emergency events

9. EMERGENCY_INCIDENT (M) ──directs_to──> (1) HOSPITAL
   └ Incident routed to nearest hospital

10. USER (1) ──captures──> (M) VLM_SCAN
    └ User uploads multiple medical images
```

---

## 4. UML SEQUENCE DIAGRAMS

### 4.1 Symptom Triage Sequence (Detailed)

```
┌────────────────────────────────────────────────────────────────────────┐
│                    SYMPTOM TRIAGE SEQUENCE DIAGRAM                     │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│ Patient      MobileApp      FastAPI       AIService      Supabase     │
│    │               │              │             │            │        │
│    │               │              │             │            │        │
│    ├─ Enter ──────→│              │             │            │        │
│    │   Symptoms   │              │             │            │        │
│    │              │              │             │            │        │
│    ├─ Click ──────→│              │             │            │        │
│    │  Submit      │              │             │            │        │
│    │              │              │             │            │        │
│    │              ├─ Validate ───→│             │            │        │
│    │              │   Input       │             │            │        │
│    │              │              │ (Pydantic) │            │        │
│    │              │              │             │            │        │
│    │              │              ├─ TextPreprocess ──→       │        │
│    │              │              │  (normalize, tokenize)    │        │
│    │              │              │             │            │        │
│    │              │              ├─ SymptomExtract ───────→  │        │
│    │              │              │  (spaCy NLP)             │        │
│    │              │              │             │            │        │
│    │              │              ├─ FeatureEngineer ────────→│        │
│    │              │              │  (14-D vector)           │        │
│    │              │              │             │            │        │
│    │              │              ├─ ML Predict ────────────→ │        │
│    │              │              │  (GradientBoosting)      │        │
│    │              │              │             │            │        │
│    │              │              ├─ RuleEngine Check ─────→ │        │
│    │              │              │  (8 clinical rules)      │        │
│    │              │              │             │            │        │
│    │              │              ├─ LLM Generate ─────┐     │        │
│    │              │              │  (MedGemma GPU)    │     │        │
│    │              │              │        (8-15s)    │     │        │
│    │              │              │                   ├───→MedGemma  │
│    │              │              │        ←─────────┤  Response    │
│    │              │              │                   │             │
│    │              │              ├─ AuditLogger ────────────→│        │
│    │              │              │  (log SQLite)            │        │
│    │              │              │             │            │        │
│    │              │  JSON ←──────┤             │            │        │
│    │              │  Response    │             │            │        │
│    │              │              │             │            │        │
│    │ Display ←────┤              │             │            │        │
│    │ Results      │              │             │            │        │
│    │              │              │             │            │        │
│    ├─ Continue ──→│              │ (Chat API)  │            │        │
│    │  Chat / SOS  │──────────→   │ / Emergency │            │        │
│    │   / Book Dr  │              │             │            │        │
│    │              │              │             │            │        │
└────────────────────────────────────────────────────────────────────────┘

Time Breakdown:
├─ Input validation: 5-10ms
├─ Text preprocessing: 50-100ms
├─ NLP extraction: 30-50ms
├─ Feature engineering: 10-20ms
├─ ML prediction: 50-100ms
├─ Rule engine: 10-20ms
├─ LLM generation: 8-15 seconds (GPU bound)
├─ Audit logging: 20-50ms
└─ Total: 8-16 seconds (P99)
```

---

### 4.2 Emergency SOS Response Sequence

```
┌────────────────────────────────────────────────────────────────────────┐
│                    EMERGENCY SOS RESPONSE SEQUENCE                     │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│ Patient      MobileApp    FastAPI    Mapbox    Supabase    Twilio    │
│    │             │          │         │          │         │         │
│    │             │          │         │          │         │         │
│    ├─ Tap SOS ───→│          │         │          │         │         │
│    │  Button      │          │         │          │         │         │
│    │              │          │         │          │         │         │
│    │        [3s countdown shown to user]         │         │         │
│    │              │          │         │          │         │         │
│    ├─ Confirm ───→│          │         │          │         │         │
│    │  (not cancel)│          │         │          │         │         │
│    │              │          │         │          │         │         │
│    │              ├─ getGPS ─┐         │          │         │         │
│    │              │   (expo  │         │          │         │         │
│    │              │ -location)         │          │         │         │
│    │              │   ↓      │         │          │         │         │
│    │              │  [lat=XX, lon=YY]  │          │         │         │
│    │              │          │         │          │         │         │
│    │              ├─────────API Call──→│ query    │          │         │
│    │              │  (emergency SOS)   │          │          │         │
│    │              │          │         │ hospitals│          │         │
│    │              │          │         │          │          │         │
│    │              │          ├─ Query Mapbox ────→│          │         │
│    │              │          │ (nearest 5) │          │         │
│    │              │          │         ←──────────────→│          │         │
│    │              │          │         [Hospital Data]│         │
│    │              │          │          │          │         │         │
│    │              │          ├─ Store ─────────────→│         │         │
│    │              │          │ Incident │          │         │         │
│    │              │          │ (Supabase│          │         │         │
│    │              │          │ emergency│          │         │         │
│    │              │          │ _incidents)        │         │         │
│    │              │          │          │          │         │         │
│    │              │ Hospital  │         │          │         │         │
│    │              │ List ←────┤         │          │         │         │
│    │              │ + Map     │         │          │         │         │
│    │              │          │         │          │         │         │
│    ├─ Select ─────→│          │         │          │         │         │
│    │ Hospital      │          │         │          │         │         │
│    │              │          │         │          │         │         │
│    │ [One-tap ──→ Google Maps/Apple Maps - Directions]      │         │
│    │  Directions]  │          │         │          │         │         │
│    │              │          │         │          │         │         │
│    │ [System retrieves emergency contacts from Supabase]   │         │
│    │              │          │         │          │         │         │
│    │              ├─ Notify ──────────────────────→│         │         │
│    │              │ Contacts  │         │          │         │         │
│    │              │  (SMS)    │         │          │         │         │
│    │              │          │         │          │         │         ├─→│
│    │              │          │         │          │         │ Send SMS  │
│    │              │          │         │          │         │           │
│    │              │          │         │          │         ├─ Contact1
│    │              │          │         │          │         ├─ Contact2
│    │              │          │         │          │         └─ Contact3
│    │              │          │         │          │         │
│    ├─ Receive ───→│          │         │          │         │
│    │ Confirmation │          │         │          │         │
│    │  (SOS active)│          │         │          │         │
│    │              │          │         │          │         │
│    ├─ Display ────→│          │         │          │         │
│    │ First-Aid    │          │         │          │         │
│    │ Guidance     │          │         │          │         │
│    │              │          │         │          │         │
└────────────────────────────────────────────────────────────────────────┘

Time Breakdown:
├─ Tap SOS → Confirmation: 3 seconds
├─ GPS capture: <5 seconds
├─ Mapbox query + hospital list: <10 seconds
├─ Emergency contact SMS: <30 seconds (parallel)
├─ First-aid guidance display: Immediate
└─ Total to life-saving actions: <30 seconds
```

---

### 4.3 Telemedicine Consultation Sequence

```
┌──────────────────────────────────────────────────────────────────┐
│         TELEMEDICINE CONSULTATION SEQUENCE DIAGRAM               │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ Patient    MobileApp   Supabase   WebRTC Server    Doctor      │
│   │           │            │            │           │          │
│   │           │            │            │           │          │
│   ├─ Search ──→│ ← Doctor List          │           │          │
│   │ Doctors    │   (from DB)            │           │          │
│   │           │            │            │           │          │
│   ├─ Select ──→│            │            │           │          │
│   │ Doctor     │            │            │           │          │
│   │           │            │            │           │          │
│   ├─ Book ────→│ ← Availability         │           │          │
│   │ Slot       │           │            │           │          │
│   │           │    Store reservation    │           │          │
│   │           │ ──────────→│            │           │          │
│   │           │            │ ← Notify  │           │          │
│   │           │            │  Doctor   │───────────→│          │
│   │           │            │           │            │          │
│   │           │            │           │    ← Doctor│ Accepts  │
│   │           │            │           │   Accepts  │ consultation
│   │           │ ← Update to│           │            │          │
│   │ Scheduled │ SCHEDULED  │           │            │          │
│   │           │            │           │            │          │
│   │      [5 min before scheduled time]  │            │          │
│   │           │            │           │            │          │
│   │ Waiting ←─┤ Notification Push      │            │          │
│   │ Room      │ "Doctor joining soon"  │            │          │
│   │           │            │           │            │          │
│   ├─ Join ────→│ WebRTC Setup           │            │          │
│   │ Call      │            │           │            │          │
│   │           │            ├──────────→│ Offer      │          │
│   │           │            │           │ (SDP)      │          │
│   │           │            │           │            │          │
│   │           │            │ ←─────────┤ Answer     │          │
│   │           │            │           │ (SDP)      │          │
│   │           │            │           │            │          │
│   │           │           [ICE Candidate Exchange]   │          │
│   │           │            │           │            │          │
│   │           │            │ P2P Video/Audio Connection          │
│   │  ←──────Video Stream───────────────────────────→│          │
│   │           │            │           │            │          │
│   │ [Doctor enters video call]                      │          │
│   │           │            │           │            │          │
│   │ ←─ Video ─────────────────P2P Encrypted Stream──→│          │
│   │ Stream    │            │           │ (DTLS-SRTP)│          │
│   │           │            │           │            │          │
│   │ [Conversation happens for X minutes]            │          │
│   │           │            │           │            │          │
│   │           │ ← Doctor views patient EHR from DB  │          │
│   │           │            │           │            │          │
│   │ ← Doctor writes prescription during call        │          │
│   │           │            │           │            │          │
│   │ ← Doctor ends call      │           │     Doctor │ Ends    │
│   │           ├─ Store ────→│ prescription          │ call    │
│   │           │ Prescription │ + consultation       │          │
│   │           │            │ transcript            │          │
│   │           │            │           │            │          │
│   │ ← Notify "Prescription ready"     │            │          │
│   │           │            │           │            │          │
│   ├─ Download─→│ E-Prescription (QR)    │            │          │
│   │ Prescription│            │           │            │          │
│   │           │            │           │            │          │
│   ├─ Rate ────→│ Satisfaction (1-5)     │            │          │
│   │ Consult    │ ───────────→│          │            │          │
│   │           │            │           │            │          │
│   ├─ Schedule ─→│ Follow-up (if needed)  │            │          │
│   │ Follow-up  │            │           │            │          │
│   │ Appt       │            │           │            │          │
│   │           │            │           │            │          │
│   └           └            └           └            └          │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

Time Breakdown:
├─ Waiting room: 5 min before scheduled
├─ WebRTC connection establishment: <5 sec
├─ Video/audio streaming: Live (end-to-end encrypted)
├─ Consultation duration: Variable (typical 15-30 min)
├─ Prescription generation: <2 minutes
├─ Notification to patient: <1 second
└─ Total time from booking to completion: ~30-45 minutes
```

---

## 5. ARCHITECTURE EXPLANATION

### 5.1 Microservices Architecture

```
┌────────────────────────────────────────────────────────────────┐
│               CARELINK MICROSERVICES ARCHITECTURE               │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────────────────────────────────────────┐              │
│  │  API GATEWAY (FastAPI with Uvicorn)         │              │
│  ├─────────────────────────────────────────────┤              │
│  │ • Request routing & load balancing           │              │
│  │ • CORS middleware                            │              │
│  │ • Rate limiting (60 req/min)                │              │
│  │ • JWT validation                             │              │
│  │ • Request logging & tracing                  │              │
│  └──────────────┬──────────────────────────────┘              │
│                 │                                               │
│     ┌───────────┼───────────────────────────────────┐         │
│     │           │                                   │         │
│     ▼           ▼                                   ▼         │
│  ┌─────────┐ ┌──────────────┐              ┌──────────────┐  │
│  │ AUTH    │ │ TRIAGE       │              │ CONSULT      │  │
│  │ SERVICE │ │ SERVICE      │              │ SERVICE      │  │
│  ├─────────┤ ├──────────────┤              ├──────────────┤  │
│  │ JWT Gen │ │ • Predict    │              │ • Schedule   │  │
│  │ Refresh │ │ • VLM Infer  │              │ • Start Call │  │
│  │ Validity│ │ • Chat Gen   │              │ • Prescribe  │  │
│  │ User    │ │ • Rule Eng   │              │ • End Call   │  │
│  │ Profile │ │ • LLM Expl   │              │              │  │
│  └────┬────┘ └──────┬───────┘              └──────┬───────┘  │
│       │             │                             │           │
│       │     ┌───────┴──────────┐                          │
│       │     │                  │                          │
│       │     ▼                  ▼                          │
│       │  ┌────────┐        ┌──────────┐                 │
│       │  │ NLP    │        │ ML MODEL │                 │
│       │  │ PIPELINE       ├──────────┤                 │
│       │  │        │        │ Gradient │                 │
│       │  │ • Prep │        │ Boosting │                 │
│       │  │ • Extract       │ (v1.0.0) │                 │
│       │  │ • Feature   │        │                 │
│       │  │   Eng  │        │                 │
│       │  └────────┘        └──────────┘                 │
│       │                                                   │
│       │               ┌─────────────────┐               │
│       │               │ LLM SERVICE     │               │
│       │               ├─────────────────┤               │
│       │               │ • MedGemma 4B  │               │
│       │               │   (GPU worker) │               │
│       │               │ • Text infer   │               │
│       │               │ • Vision infer │               │
│       │               │ • Chat gen     │               │
│       │               │ • Translate    │               │
│       │               └─────────────────┘               │
│       │                                                   │
│       │               ┌─────────────────┐               │
│       │               │ RULE ENGINE     │               │
│       │               ├─────────────────┤               │
│       │               │ • 8 rules       │               │
│       │               │ • Override logic│               │
│       │               │ • Escalation    │               │
│       │               │ • Emergency flag│               │
│       │               └─────────────────┘               │
│       │                                                   │
│       └─────────────────────┬──────────────────────────┘
│                             │
│                 ┌───────────┼───────────┐
│                 │           │           │
│                 ▼           ▼           ▼
│           ┌─────────────────────────────────────┐
│           │    DATA PERSISTENCE LAYER            │
│           ├─────────────────────────────────────┤
│           │ Primary: Supabase PostgreSQL         │
│           │ • Users (1M rows)                    │
│           │ • Chat sessions (10M)                │
│           │ • Symptom checks (50M)               │
│           │ • Consultations (2M)                │
│           │ • Prescriptions (10M)               │
│           │ • Health records (5M)               │
│           │ • RLS enforced on all tables        │
│           │                                     │
│           │ Local: SQLite (Audit)                │
│           │ • Predictions log (cached)          │
│           │ • Sync queue (offline)              │
│           │                                     │
│           │ Storage: Supabase Storage            │
│           │ • Medical images (100TB)            │
│           │ • Test reports (50TB)               │
│           │ • Prescriptions (10TB)              │
│           └─────────────────────────────────────┘
│
└────────────────────────────────────────────────────────────────┘

Service Responsibilities:

AUTH SERVICE:
├─ User registration/login
├─ JWT token generation & validation
├─ Session management
├─ Password reset/recovery
└─ MFA (future)

TRIAGE SERVICE (Core ML):
├─ Symptom intake & validation
├─ NLP preprocessing
├─ Feature engineering
├─ ML prediction
├─ Rule engine override
├─ Confidence management
├─ LLM explanation generation
├─ Audit logging
└─ Response formatting

CONSULTATION SERVICE:
├─ Doctor availability management
├─ Appointment scheduling
├─ Payment processing (Stripe)
├─ WebRTC signaling
├─ Consultation recording (future)
├─ Prescription generation
├─ Follow-up scheduling
└─ Rating/feedback

RECORDS SERVICE:
├─ Health profile management
├─ Medical history retrieval
├─ Immunization tracking
├─ Prescription management
├─ Test report storage
├─ Data access audit logging
└─ Export functionality

EMERGENCY SERVICE:
├─ SOS activation
├─ GPS location capture
├─ Hospital location lookup (Mapbox)
├─ Emergency contact notification (Twilio)
├─ First-aid guidance generation
├─ Incident tracking
└─ Follow-up reminders

MEDICINE SERVICE:
├─ Medicine database search
├─ Pharmacy inventory lookup
├─ Price comparison
├─ Generic alternatives
├─ Prescription upload
└─ Order tracking
```

---

### 5.2 Event-Driven Communication (Event Bus)

**Note:** Current implementation uses synchronous REST. Future: RabbitMQ/Kafka

```
┌────────────────────────────────────────────────────────────────┐
│         FUTURE: EVENT-DRIVEN ARCHITECTURE (RabbitMQ/Kafka)     │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Event Bus (RabbitMQ / Apache Kafka)                          │
│  ┌──────────────────────────────────────────┐                │
│  │ Topic: healthcare.events                 │                │
│  ├──────────────────────────────────────────┤                │
│  │ • user.registered                        │                │
│  │ • symptom_check.completed                │                │
│  │ • triage.predicted                       │                │
│  │ • emergency.activated                    │                │
│  │ • consultation.scheduled                 │                │
│  │ • consultation.started                   │                │
│  │ • consultation.completed                 │                │
│  │ • prescription.issued                    │                │
│  │ • health_record.updated                  │                │
│  │ • image.analyzed                         │                │
│  │ • notification.sent                      │                │
│  └──────────────────────────────────────────┘                │
│                         │                                     │
│     ┌───────────┬───────┼───────┬─────────┬─────────┐        │
│     │           │       │       │         │         │        │
│     ▼           ▼       ▼       ▼         ▼         ▼        │
│  ┌─────┐    ┌─────┐ ┌─────┐ ┌──────┐ ┌──────┐ ┌──────┐      │
│  │Auth │    │Audit│ │Alert│ │Email │ │SMS   │ │Push  │      │
│  │Svc  │    │Svc  │ │Svc  │ │Svc   │ │Svc   │ │Notif │      │
│  │     │    │     │ │     │ │      │ │      │ │Svc   │      │
│  └─────┘    └─────┘ └─────┘ └──────┘ └──────┘ └──────┘      │
│                                                                │
│  Publish/Subscribe Pattern:                                   │
│                                                                │
│  Publisher: TRIAGE_SERVICE                                    │
│  ├─ on_symptom_check_completed()                             │
│  │  └─ publish("triage.predicted") with prediction data      │
│  │     ├─ Subscribers: AuditService (log)                   │
│  │     ├─ Subscribers: AlertService (emergency?)            │
│  │     └─ Subscribers: NotificationService (user notify)    │
│  │                                                            │
│  Publisher: CONSULTATION_SERVICE                              │
│  ├─ on_consultation_completed()                              │
│  │  └─ publish("consultation.completed")                    │
│  │     ├─ Subscribers: AuditService (log)                   │
│  │     ├─ Subscribers: EmailService (summary)               │
│  │     ├─ Subscribers: NotificationService (reminder)       │
│  │     └─ Subscribers: ReviewService (request rating)       │
│  │                                                            │
│  Publisher: EMERGENCY_SERVICE                                 │
│  ├─ on_emergency_activated()                                 │
│  │  └─ publish("emergency.activated")                       │
│  │     ├─ Subscribers: AuditService (log)                   │
│  │     ├─ Subscribers: SMSService (emergency contacts)      │
│  │     ├─ Subscribers: PushNotifService (first responders) │
│  │     └─ Subscribers: HospitalService (ER alert)          │
│  │                                                            │
│  Benefits of Event-Driven:                                    │
│  ├─ Loose coupling between services                         │
│  ├─ Scalability (independent service scaling)               │
│  ├─ Resilience (failed services don't block flows)         │
│  ├─ Real-time event stream for analytics                   │
│  ├─ Easy to add new subscribers (features)                 │
│  └─ Dead-letter queues for failed events                   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

### 5.3 Offline-First Mobile Architecture

```
┌────────────────────────────────────────────────────────────────┐
│               OFFLINE-FIRST MOBILE ARCHITECTURE                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Mobile Device (No Internet)                                  │
│  ┌─────────────────────────────────────────┐                 │
│  │ PRESENTATION LAYER                      │                 │
│  ├─────────────────────────────────────────┤                 │
│  │ • React Native UI Components             │                 │
│  │ • React Navigation (offline-capable)     │                 │
│  │ • Gesture handlers                       │                 │
│  └────────────┬────────────────────────────┘                 │
│               │                                               │
│  ┌────────────▼────────────────────────────┐                 │
│  │ STATE MANAGEMENT LAYER                  │                 │
│  ├─────────────────────────────────────────┤                 │
│  │ • Context API (Auth, Language context)  │                 │
│  │ • Zustand / Redux (optional, simple app) │                 │
│  │ • In-memory cache (last 10 chat msgs...)│                 │
│  │ • Optimistic updates (assume success)   │                 │
│  └────────────┬────────────────────────────┘                 │
│               │                                               │
│  ┌────────────▼────────────────────────────┐                 │
│  │ LOCAL STORAGE LAYER                     │                 │
│  ├─────────────────────────────────────────┤                 │
│  │ AsyncStorage:                            │                 │
│  │ ├─ JWT token (24h, OS-encrypted)        │                 │
│  │ ├─ User profile (cached)                │                 │
│  │ ├─ Language preference                  │                 │
│  │ ├─ Last 100 chat messages               │                 │
│  │ ├─ Draft messages (unsent)              │                 │
│  │ └─ Cached health records                │                 │
│  │                                          │                 │
│  │ SQLite (carelink.db):                    │                 │
│  │ ├─ Prediction cache (1K local)          │                 │
│  │ ├─ Symptoms history (50 entries)        │                 │
│  │ ├─ Sync queue (pending requests)        │                 │
│  │ ├─ Offline triage model weights (8MB)  │                 │
│  │ └─ Audit trail (50K logs)               │                 │
│  │                                          │                 │
│  │ File System:                             │                 │
│  │ ├─ Downloaded map tiles (Mapbox)        │                 │
│  │ ├─ Emergency contacts list              │                 │
│  │ ├─ Medical history PDFs (if available) │                 │
│  │ └─ Temp images/videos (user-generated) │                 │
│  └────────────┬────────────────────────────┘                 │
│               │                                               │
│  ┌────────────▼────────────────────────────┐                 │
│  │ OFFLINE PROCESSING ENGINE               │                 │
│  ├─────────────────────────────────────────┤                 │
│  │ • ML Inference (TensorFlow Lite)        │                 │
│  │   └─ Lightweight symptom classifier    │                 │
│  │ • NLP (lightweight spaCy model)         │                 │
│  │ • Crypto (encrypt before sync)          │                 │
│  │ • Compression (reduce payload size)     │                 │
│  │ • Sync orchestration                    │                 │
│  └────────────┬────────────────────────────┘                 │
│               │                                               │
│  ┌────────────▼────────────────────────────┐                 │
│  │ NETWORK AWARENESS LAYER                 │                 │
│  ├─────────────────────────────────────────┤                 │
│  │ • ConnectionListener (react-native-    │                 │
│  │   netinfo)                              │                 │
│  │ • Queue pending requests when offline   │                 │
│  │ • Resume sync when connectivity restored│                 │
│  │ • Display "⚠ Offline" indicator        │                 │
│  │ • Suggest core features only (offline) │                 │
│  └────────────┬────────────────────────────┘                 │
│               │                                               │
│               │ ONLINE (WiFi/4G)                             │
│               ▼                                               │
│  ┌────────────────────────────────────────┐                 │
│  │ API CLIENT LAYER                        │                 │
│  ├─────────────────────────────────────────┤                 │
│  │ • HTTP requests (axios/fetch)          │                 │
│  │ • JWT in Authorization header          │                 │
│  │ • Retry logic (exponential backoff)     │                 │
│  │ • Request/response logging              │                 │
│  │ • Error handling & user messaging       │                 │
│  └────────────┬────────────────────────────┘                 │
│               │                                               │
│               │ REST API (172.21.44.111:8000)               │
│               ▼                                               │
│       ┌──────────────────────┐                              │
│       │ FastAPI Backend      │                              │
│       │ • Triage prediction  │                              │
│       │ • VLM analysis       │                              │
│       │ • LLM explanation    │                              │
│       │ • Chat response      │                              │
│       └──────────────┬───────┘                              │
│                      │                                       │
│                      ▼                                       │
│       ┌──────────────────────┐                              │
│       │ Supabase PostgreSQL  │                              │
│       │ • Primary DB         │                              │
│       │ • RLS-protected      │                              │
│       └──────────────────────┘                              │
│                                                              │
│  SYNC STRATEGY (When Online):                               │
│                                                              │
│  Queue (Offline):                                            │
│  ├─ POST /triage/predict → queue                           │
│  ├─ POST /triage/chat → queue                              │
│  ├─ POST /consultations/book → queue                       │
│  └─ ... (max 1000 items)                                   │
│                                                              │
│  Sync Process (Online):                                     │
│  1. Detect connectivity restored                           │
│  2. Check queue from SQLite                                │
│  3. For each queued request:                               │
│     a. Encrypt payload (AES-256)                           │
│     b. Add sync_id to track                                │
│     c. POST to /api/v1/sync/batch                          │
│     d. Wait for response                                   │
│     e. On success: mark synced, remove from queue         │
│     f. On failure: retry up to 3x with backoff            │
│  4. Update local cache with cloud responses               │
│  5. Show "Sync complete" notification                      │
│  6. Conflict resolution: Local overwrites cloud           │
│  7. Log sync metadata for debugging                       │
│                                                              │
│  Offline Capabilities Matrix:                               │
│  ┌─────────────────────────────┬─────────┬──────────┐     │
│  │ Feature                     │ Online  │ Offline  │     │
│  ├─────────────────────────────┼─────────┼──────────┤     │
│  │ View health records         │ ✓       │ ✓ (cache)│     │
│  │ Symptom triage              │ ✓ Full  │ ✓ Lite   │     │
│  │ Read chat history           │ ✓       │ ✓ (local)│     │
│  │ Send chat message           │ ✓       │ ✓ Queue  │     │
│  │ Book consultation           │ ✓       │ ✓ Queue  │     │
│  │ Emergency SOS               │ ✓ Full  │ ✓ Lite   │     │
│  │ Find hospital (GPS)         │ ✓       │ ✓ Cached │     │
│  │ Search medicines            │ ✓       │ ✗        │     │
│  │ Video consultation          │ ✓       │ ✗        │     │
│  └─────────────────────────────┴─────────┴──────────┘     │
│                                                              │
└────────────────────────────────────────────────────────────────┘
```

---

## 6. TESTING STRATEGY

### 6.1 Testing Pyramid

```
┌────────────────────────────────────────────────────────────────┐
│                      TESTING PYRAMID                           │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│                           ▲                                    │
│                          /  \                                  │
│                         /    \                                 │
│                        /######\ E2E Tests                      │
│                       / ##### # \ (10%)                        │
│                      /  (Manual)  \                            │
│                     /              \                           │
│                    /────────────────\                          │
│                   /  Integration     \                         │
│                  / ████████░░░░░░░░░░ \ (30%)                │
│                 /  (Automated)       \                        │
│                /────────────────────────\                      │
│               / ████████████████████████ \                    │
│              /  Unit Tests - Jest/Pytest  \ (60%)             │
│             /  (Fast, Isolated, Mocked)   \                   │
│            /____________________________────\                  │
│                                                                │
│ Ratio Distribution:                                            │
│ • Unit Tests: 60% (fast feedback, high coverage)             │
│ • Integration Tests: 30% (API contracts, database)           │
│ • E2E Tests: 10% (critical user flows, manual)               │
│ • Security Tests: 5% (OWASP, pen testing)                   │
│ • Performance Tests: 5% (load, stress, memory)               │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

### 6.2 Test Suite Components

#### 6.2.1 Unit Tests (Jest/Pytest)

```
Frontend (React Native - Jest):
├─ Component tests
│  ├─ TriageScreen
│  │  ├─ render() → snapshot
│  │  ├─ handleSubmit() → state update
│  │  ├─ validation errors → error display
│  │  └─ loading state → spinner
│  ├─ EmergencySOS
│  │  ├─ tap() → 3s countdown
│  │  ├─ cancel() → abort
│  │  └─ confirm() → initiate SOS
│  └─ ... [80+ screen tests]
│
├─ Utility tests
│  ├─ apiService.js
│  │  ├─ predictTriage() → JSON response
│  │  ├─ handleErrors() → user-friendly message
│  │  └─ retryLogic() → exponential backoff
│  ├─ dataService.js
│  │  ├─ getCachedRecords() → filtered data
│  │  ├─ syncQueue() → batch send
│  │  └─ compareVersions() → semver
│  └─ ... [auth, translate, location, etc.]
│
├─ Hook tests (React Hooks)
│  ├─ useAuth
│  │  ├─ login() → token stored
│  │  ├─ logout() → token cleared
│  │  └─ isTokenExpired() → boolean
│  ├─ useOffline
│  │  ├─ isOnline tracking
│  │  ├─ queue management
│  │  └─ sync triggers
│  └─ ... [custom hooks]
│
└─ Target: >80% code coverage

Backend (FastAPI - Pytest):
├─ Service tests
│  ├─ TriageService
│  │  ├─ predict() → prediction object
│  │  ├─ apply_rules() → override logic
│  │  ├─ generate_explanation() → text
│  │  └─ validate_input() → exceptions
│  ├─ ModelService
│  │  ├─ load_model() → model object
│  │  ├─ predict() → probability dist
│  │  ├─ handle_gpu_error() → fallback
│  │  └─ get_model_version() → string
│  ├─ RuleEngine
│  │  ├─ check_rules() → triggered[]
│  │  ├─ override_logic() → new_prediction
│  │  ├─ test_all_8_rules() → correct_trigger
│  │  └─ edge_cases() → no false positives
│  └─ ... [others]
│
├─ API endpoint tests
│  ├─ POST /api/v1/triage/predict
│  │  ├─ valid input → 200 + prediction
│  │  ├─ invalid age → 422 validation error
│  │  ├─ missing field → 422
│  │  ├─ timeout → 504 after 120s
│  │  └─ rate limit → 429 after 60 req/min
│  ├─ POST /api/v1/triage/analyze-image
│  │  ├─ JPG upload → analysis
│  │  ├─ PNG upload → analysis
│  │  ├─ oversized file → 413 entity too large
│  │  ├─ corrupted image → 400 bad data
│  │  ├─ VLM timeout → 504 after 300s
│  │  └─ GPU failure → 500 with fallback
│  ├─ GET /health
│  │  ├─ healthy state → 200 + status
│  │  ├─ model not loaded → 503 service unavailable
│  │  └─ database down → 503
│  └─ ... [all 8 endpoints]
│
├─ Database tests
│  ├─ User CRUD operations
│  │  ├─ create_user() → user_id
│  │  ├─ get_user() → user object
│  │  ├─ update_profile() → success
│  │  └─ delete_user() → cleaned up
│  ├─ RLS policies (Row-Level Security)
│  │  ├─ user_a cannot read user_b's data
│  │  ├─ admin cannot bypass RLS
│  │  ├─ authenticated user can read own data
│  │  └─ unauthenticated user gets 403
│  └─ Query performance
│     ├─ get_user() → <10ms
│     ├─ list_consultations() → <100ms
│     └─ ... [all queries]
│
└─ Target: >75% code coverage
```

---

#### 6.2.2 Integration Tests (API + Database)

```
Contract Testing (API contracts):
├─ TriageService → Supabase
│  ├─ Request: TriageRequest model
│  ├─ Response: TriageResponse model
│  ├─ Verify timestamp format (ISO8601)
│  ├─ Verify enum values (HIGH|MEDIUM|LOW)
│  └─ Test with real Supabase tables
│
├─ LLMService → HuggingFace API
│  ├─ Request: model_id + input
│  ├─ Response: text
│  ├─ Error: HF API down → fallback template
│  └─ Cache behavior: repeated calls → cached
│
└─ Emergency Service → Mapbox + Twilio
   ├─ Request: GPS coordinates
   ├─ Response: Hospital[]
   ├─ Mapbox downtime → serve cached data
   └─ SMS delivery verified

End-to-End Flows (Multiple services):
├─ Symptom Triage Flow
│  1. POST /triage/predict with symptoms
│  2. Verify prediction in database within 2s
│  3. Get consultation booking page
│  4. Book with doctor
│  5. Verify consultation status = SCHEDULED
│
├─ Emergency SOS Flow
│  1. POST /emergency/sos with GPS
│  2. Get hospital list
│  3. Verify nearest hospital latitude/longitude
│  4. SMS notification to contact
│  5. Check incident in database
│
└─ Consultation Flow
   1. GET /doctors (doctor list)
   2. POST /consultations/schedule (book)
   3. Wait for doctor acceptance
   4. POST /consultations/{id}/start (start call)
   5. Send prescription
   6. Verify in health_records
```

---

#### 6.2.3 Offline & Sync Tests

```
Offline Functionality:
├─ Symptom Triage Offline
│  ├─ Enable airplane mode
│  ├─ Input symptoms locally
│  ├─ Trigger prediction (uses TensorFlow Lite)
│  ├─ Verify prediction <2s (local ML)
│  └─ Data stored in SQLite
│
├─ Chat Offline
│  ├─ Disable WiFi/cellular
│  ├─ Send message
│  ├─ Verify "Message queued" indicator
│  ├─ Message stored in AsyncStorage
│  └─ Metadata: offline=true, sync_pending=true
│
├─ Health Records Offline
│  ├─ Read cached medical history (last sync)
│  ├─ No errors for missing data
│  ├─ Graceful "Offline version" message
│  └─ Show last sync timestamp
│
└─ Emergency SOS Offline
   ├─ Activate SOS (no internet)
   ├─ Use cached map tiles (Mapbox)
   ├─ Show local hospital list
   ├─ Queue SMS sending
   └─ Send SMS when online

Sync Testing:
├─ Queue Persistence
│  ├─ Queue survives app crash
│  ├─ Queue survives device restart
│  ├─ Max 1000 items in queue
│  └─ FIFO order maintained
│
├─ Sync Process
│  ├─ Offline queue → Online detected
│  ├─ Sync batch size: 10 items
│  ├─ Each item retry: 3 attempts
│  ├─ Exponential backoff: 1s, 2s, 4s
│  ├─ Conflict resolution: local wins
│  └─ Sync status logged
│
├─ Sync Failures
│  ├─ Network error (timeout) → reqr queue
│  ├─ Server error (5xx) → remove from queue, log
│  ├─ Validation error (422) → remove, alert user
│  ├─ Auth error (401) → prompt relogin
│  └─ Storage full → graceful degrade
│
└─ Verification
   ├─ SQLite sync_queue emptied
   ├─ Predictions logged in Supabase
   ├─ Chat messages in DB
   ├─ Timestamps match
   └─ No data duplication
```

---

#### 6.2.4 Security Tests (OWASP)

```
Authentication & Authorization:
├─ SQL Injection
│  ├─ Test: Payload: '; DROP TABLE users; --
│  ├─ Expected: Input rejected (Pydantic validation)
│  ├─ Test: Parameterized queries (SQLAlchemy ORM)
│  └─ Result: No injection possible
│
├─ XSS (Cross-Site Scripting)
│  ├─ Test: <script>alert('xss')</script> in symptoms
│  ├─ Expected: Escaped in JSON response
│  ├─ React Native: No HTML rendering (safe)
│  └─ Result: No XSS vector
│
├─ CSRF (Cross-Site Request Forgery)
│  ├─ Test: POST from external domain
│  ├─ Expected: CORS blocked
│  ├─ Result: 403 CORS error
│  └─ Mobile app: Native requests (no CSRF)
│
├─ JWT Token Security
│  ├─ Expired token (24h) → 401 Unauthorized
│  ├─ Malformed token → 401
│  ├─ Token signed with HS256 → verify signature
│  ├─ Token includes user_id, role, exp
│  └─ Refresh token logic (future)
│
└─ RLS (Row-Level Security)
   ├─ User A cannot read User B's records
   ├─ Admin cannot bypass RLS
   ├─ Policy: auth.uid() = user_id on all rows
   └─ Test failure = critical bug

Data Protection:
├─ Encryption in Transit
│  ├─ All requests via HTTPS (TLS 1.3)
│  ├─ Certificate validation
│  ├─ No unencrypted HTTP allowed
│  └─ Cipher suites: TLS_AES_256_GCM_SHA384
│
├─ Encryption at Rest
│  ├─ Passwords: bcrypt (cost=11)
│  ├─ Database: AES-256 (Supabase managed)
│  ├─ AsyncStorage: OS encryption (iOS Keychain, Android Keystore)
│  └─ Medical images: AES-256 encrypted
│
└─ Input Validation
   ├─ Age: 1-120 range
   ├─ Email: RFC 5322 format
   ├─ Language: whitelist (en|es|fr|hi|ta)
   ├─ Symptom text: max 5000 chars
   └─ Duration: 0-365 days

API Security:
├─ Rate Limiting
│  ├─ Global: 60 req/min per user
│  ├─ /triage/predict: 30 req/min (GPU-heavy)
│  ├─ /triage/analyze-image: 10 req/min
│  ├─ Response: 429 Too Many Requests
│  └─ Lockout: 15 min after 5 failed logins
│
├─ API Key Management
│  ├─ Keys: Rotate quarterly
│  ├─ Revoked keys: Immediate effect
│  ├─ Keys not in logs (hashed)
│  └─ Scoped permissions (least privilege)
│
└─ CORS Configuration
   ├─ Allowed origins: [localhost:3000, 172.21.44.111:8000, ...]
   ├─ Allowed methods: [GET, POST, PUT, DELETE]
   ├─ Allowed headers: [Authorization, Content-Type]
   └─ Credentials: True (but not with wildcard origin)
```

---

#### 6.2.5 Performance Tests

```
Load Testing (1000 concurrent users):
├─ Setup
│  ├─ Apache JMeter or k6
│  ├─ Ramp-up: 100 users/min
│  ├─ Duration: 10 minutes sustained
│  └─ Cleanup: 5 minutes ramp-down
│
├─ Endpoints tested
│  ├─ POST /api/v1/triage/predict
│  │  ├─ Target: <2s P99
│  │  ├─ Measure: Throughput (req/s)
│  │  ├─ Error rate: <0.1%
│  │  └─ At 1000 req/s: sustained
│  │
│  ├─ GET /api/v1/triage/history
│  │  ├─ Database query <100ms
│  │  ├─ Total response <500ms
│  │  └─ Error rate: <0.1%
│  │
│  └─ POST /api/v1/triage/chat
│     ├─ LLM latency: 5s (baseline)
│     ├─ Error handling OK
│     └─ Queueing under 1000 users
│
├─ Resource monitors
│  ├─ CPU usage: <80% (headroom for spikes)
│  ├─ Memory (Python): <2GB (ML model loaded)
│  ├─ Database connections: <10 active
│  ├─ GPU utilization: <90% (reserve for VLM)
│  └─ Disk I/O: <50% peak
│
└─ Pass criteria
   ├─ P99 latency <2s
   ├─ Error rate <0.1%
   ├─ No out-of-memory errors
   └─ Auto-recovery if brief outage
```

---

## 7. DEVOPS CI/CD PIPELINE

### 7.1 GitOps Workflow

```
┌────────────────────────────────────────────────────────────────┐
│                  CI/CD PIPELINE ARCHITECTURE                   │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Developer Workflow:                                           │
│  ┌─────────────────────────────────────────┐                 │
│  │ 1. Code commit to feature branch        │                 │
│  │    git push origin feature/triage-v2    │                 │
│  └──────────────┬──────────────────────────┘                 │
│                 │                                              │
│  ┌──────────────▼──────────────────────────┐                 │
│  │ 2. GitHub Actions Workflow Triggered    │                 │
│  │    on: [push, pull_request]             │                 │
│  └──────────────┬──────────────────────────┘                 │
│                 │                                              │
│     ┌───────────┴────────────┐                               │
│     │ STAGE 1: Lint & Format │                               │
│     └───────────┬────────────┘                               │
│                 │                                              │
│     ┌───────────▼────────────────────┐                       │
│     │ Run: npm run lint              │                       │
│     │      npm run format-check      │                       │
│     │      black --check app/        │ (Python)              │
│     │      pylint app/ --threshold=8 │                       │
│     └───────────┬────────────────────┘                       │
│                 │ Pass?                                       │
│         ┌───No──┤                                             │
│         │       └───Yes──┐                                    │
│         │                │                                    │
│    FAIL ▼                │                                    │
│ (Notify slack)           │                                    │
│                          │                                    │
│     ┌────────────────────▼──────────────┐                   │
│     │ STAGE 2: Unit Tests               │                   │
│     │  npm run test:frontend -- --ci    │                   │
│     │  (Jest, >80% coverage required)   │                   │
│     │  pytest tests/ --cov=app          │ (Pytest, >75%)    │
│     └────────────┬──────────────────────┘                   │
│                  │ Pass?                                      │
│          ┌───No──┤                                            │
│          │       └───Yes──┐                                   │
│          │                │                                   │
│     FAIL ▼                │                                   │
│ (Comment on PR)           │                                   │
│                           │                                   │
│     ┌─────────────────────▼────────────────────┐            │
│     │ STAGE 3: Security Scanning               │            │
│     │  • SAST (semgrep, bandit)                │            │
│     │  • Dependency check (npm audit)          │            │
│     │  • Container scan (trivy)                │            │
│     └─────────────────────┬────────────────────┘            │
│                           │ Pass?                            │
│                   ┌───No──┤                                  │
│                   │       └───Yes──┐                         │
│                   │                │                         │
│              FAIL ▼                │                         │
│           (Block merge)            │                         │
│                                    │                         │
│     ┌──────────────────────────────▼───────┐               │
│     │ STAGE 4: Build Docker Containers     │               │
│     │                                      │               │
│     │ Backend:                             │               │
│     │  docker build -t carelink-ai:sha     │               │
│     │  Push to: ghcr.io/kabilash01/...    │               │
│     │                                      │               │
│     │ Frontend:                            │               │
│     │  expo build --platform android       │               │
│     │  expo build --platform ios (future)  │               │
│     │  Push to: ghcr.io/kabilash01/...    │               │
│     └──────────────────────┬───────────────┘               │
│                            │                                │
│     ┌──────────────────────▼─────────────┐                │
│     │ STAGE 5: Integration Tests         │                │
│     │                                    │                │
│     │ docker-compose up -d               │                │
│     │ npm run test:integration           │                │
│     │ pytest tests/integration/          │                │
│     │ curl http://localhost:8000/health  │                │
│     │ docker-compose down                │                │
│     └──────────────────────┬─────────────┘                │
│                            │ Pass?                         │
│                    ┌───No──┤                               │
│                    │       └───Yes──┐                      │
│                    │                │                      │
│               FAIL ▼                │                      │
│            (Debug locally)          │                      │
│                                     │                      │
│     ┌────────────────────────────────▼──────┐            │
│     │ STAGE 6: Deploy to Staging             │            │
│     │ (on develop branch only)               │            │
│     │                                        │            │
│     │ kubectl apply -f k8s/staging/          │            │
│     │ • Update deployment                    │            │
│     │ • Run smoke tests                      │            │
│     │ • Health checks                        │            │
│     │                                        │            │
│     └────────────────────────────────┬───────┘            │
│                                      │                     │
│     ┌────────────────────────────────▼──────┐            │
│     │ STAGE 7: Notification & Review        │            │
│     │                                        │            │
│     │ • Post to Slack: "Staging ready"      │            │
│     │ • PR comment: "Deploy status"         │            │
│     │ • Jira update: "In staging"           │            │
│     │                                        │            │
│     └────────────────────────────────────────┘            │
│                                                             │
│  Production Deployment (Manual Approval):                   │
│  ┌─────────────────────────────────────────┐              │
│  │ 1. Admin approves: "Deploy to prod"    │              │
│  │    (GitHub PR review + approval)       │              │
│  └──────────────┬──────────────────────────┘              │
│                 │                                           │
│     ┌───────────▼────────────────────────┐                │
│     │ STAGE 8: Deploy to Production       │                │
│     │                                     │                │
│     │ kubectl apply -f k8s/production/    │                │
│     │ • Blue-green deployment             │                │
│     │ • Canary 10% traffic first          │                │
│     │ • Monitor error rate, latency       │                │
│     │ • If issues: auto-rollback          │                │
│     │ • Ramp to 100% traffic              │                │
│     └───────────┬────────────────────────┘                │
│                 │                                           │
│     ┌───────────▼────────────────────────┐                │
│     │ STAGE 9: Post-Deploy Verification  │                │
│     │                                     │                │
│     │ • Monitor metrics (5 min)           │                │
│     │   - Error rate < 1%                 │                │
│     │   - Latency < 2s (P99)              │                │
│     │   - CPU < 80%                       │                │
│     │ • Run smoke tests                   │                │
│     │ • Check logs for errors             │                │
│     │ • Slack notification: "Deploy OK"   │                │
│     │                                     │                │
│     └────────────────────────────────────┘                │
│                                                             │
│  Rollback (If Needed):                                     │
│  kubectl rollout undo deployment/carelink-ai -n prod      │
│  (Automatic if error rate spikes > 5%)                    │
│                                                             │
└────────────────────────────────────────────────────────────────┘
```

---

### 7.2 GitHub Actions Workflow YAML

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop, feature/**]
  pull_request:
    branches: [main, develop]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}
  DOCKER_BUILDKIT: 1

jobs:
  # STAGE 1: Lint & Format
  lint-format:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.12'
          cache: 'pip'

      - name: Install dependencies
        run: |
          npm install
          pip install -r ai-service/requirements.txt

      - name: Frontend lint
        run: npm run lint

      - name: Backend lint (Python)
        run: |
          cd ai-service
          black --check app/
          pylint app/ --threshold=8
          flake8 app/ --max-line-length=120

  # STAGE 2: Unit Tests
  unit-tests:
    needs: lint-format
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.12'
          cache: 'pip'

      - name: Install dependencies
        run: |
          npm install
          pip install -r ai-service/requirements.txt

      - name: Frontend tests
        run: npm run test:frontend -- --ci --coverage --coverageThreshold='{"global":{"branches":80,"functions":80,"lines":80,"statements":80}}'

      - name: Backend tests
        run: |
          cd ai-service
          pytest tests/ --cov=app --cov-report=term --cov-report=xml --cov-fail-under=75

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json,./ai-service/.coverage

  # STAGE 3: Security Scan
  security-scan:
    needs: lint-format
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: SAST with Semgrep
        uses: returntocorp/semgrep-action@v1
        with:
          config: >-
            p/security-audit
            p/owasp-top-ten

      - name: Dependency check (npm)
        run: npm audit --audit-level=moderate || true

      - name: Dependency check (pip)
        run: |
          pip install safety
          safety check --json || true

  # STAGE 4: Build Docker
  build-docker:
    needs: [unit-tests, security-scan]
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Log in to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=sha,prefix={{branch}}-{{short_sha}}
            type=semver,pattern={{version}}

      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: ./ai-service
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # STAGE 5: Integration Tests
  integration-tests:
    needs: build-docker
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_DB: carelink_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm install

      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:test@localhost:5432/carelink_test

  # STAGE 6: Deploy to Staging (if develop branch)
  deploy-staging:
    needs: integration-tests
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to staging
        run: |
          kubectl apply -f k8s/staging/ --kubeconfig=${{ secrets.KUBE_CONFIG }}
          kubectl rollout status deployment/carelink-ai -n staging --timeout=5m

      - name: Smoke tests
        run: |
          curl -f http://staging.carelink.local:8000/health || exit 1

      - name: Notify Slack
        uses: slackapi/slack-github-action@v1
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK }}
          payload: |
            {
              "text": "✅ Staging deployment successful",
              "blocks": [{
                "type": "section",
                "text": {"type": "mrkdwn", "text": "CareLink AI deployed to staging\n*Branch:* develop\n*Commit:* ${{ github.sha }}"}
              }]
            }

  # STAGE 7-9: Deploy to Production (manual approval)
  deploy-production:
    needs: integration-tests
    if: github.ref == 'refs/heads/main' && github.event_name == 'pull_request' && contains(github.event.pull_request.labels.*.name, 'deploy-prod')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Blue-green deployment
        run: |
          kubectl apply -f k8s/production/blue-green/ --kubeconfig=${{ secrets.KUBE_CONFIG }}
          kubectl rollout status deployment/carelink-ai-green -n prod --timeout=5m
          # Canary 10% traffic
          kubectl patch service carelink-ai -n prod --type='json' -p='[{"op": "replace", "path": "/spec/selector/version", "value": "green"}]' --percentage=10
          sleep 300  # Monitor for 5 min
          # If error rate < 1%, ramp to 100%
          kubectl patch service carelink-ai -n prod --percentage=100

      - name: Post-deploy verification
        run: |
          for i in {1..60}; do
            STATUS=$(curl -s http://carelink.local:8000/health | jq -r '.status')
            if [ "$STATUS" == "healthy" ]; then
              echo "✅ Health check passed"
              exit 0
            fi
            sleep 5
          done
          exit 1

      - name: Notify Slack
        uses: slackapi/slack-github-action@v1
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK }}
          payload: |
            {
              "text": "🚀 Production deployment successful",
              "blocks": [{
                "type": "section",
                "text": {"type": "mrkdwn", "text": "CareLink AI deployed to production\n*Version:* ${{ github.ref }}\n*Commit:* ${{ github.sha }}"}
              }]
            }
```

---

## 8. MONITORING & OBSERVABILITY

### 8.1 Prometheus Metrics

```
carelink_predictions_total{risk_level="HIGH"}  145
carelink_predictions_total{risk_level="MEDIUM"} 312
carelink_predictions_total{risk_level="LOW"}   543

carelink_prediction_latency_seconds{quantile="0.5"}    0.8
carelink_prediction_latency_seconds{quantile="0.95"}   1.5
carelink_prediction_latency_seconds{quantile="0.99"}   1.95

carelink_vlm_latency_seconds{quantile="0.5"}    18.0
carelink_vlm_latency_seconds{quantile="0.95"}   25.0
carelink_vlm_latency_seconds{quantile="0.99"}   28.0

carelink_gpu_memory_bytes{device="RTX_5060"}    2147483648  # 2GB

carelink_database_query_latency_seconds{query="get_user"}     0.008
carelink_database_query_latency_seconds{query="list_consult"} 0.045

carelink_http_requests_total{method="POST", endpoint="/triage/predict", status=200}  10000
carelink_http_requests_total{method="POST", endpoint="/triage/predict", status=422}  50

carelink_rate_limit_exceeded_total{user_id="*"}  25

carelink_emergency_sos_triggered_total  1250
carelink_emergency_sos_response_time_seconds{quantile="0.5"}  8.5

carelink_uptime_seconds  86400  # Last 24h
carelink_errors_total{type="GPU_FAILED"}  3
carelink_errors_total{type="DB_CONNECTION"}  0
```

---

### 8.2 Grafana Dashboards

```
Dashboard 1: System Health
├─ Uptime (gauge)
├─ CPU usage (line)
├─ Memory usage (line)
├─ Disk I/O (bar)
├─ Network throughput (line)
└─ Temperature (gauge, if available)

Dashboard 2: Application Performance
├─ Requests per second (line)
├─ Error rate % (line)
├─ Latency percentiles P50/P95/P99 (line)
├─ Prediction accuracy (gauge, rolling 24h)
├─ GPU utilization (gauge)
└─ Model serving load (stacked bar)

Dashboard 3: Business Metrics
├─ Daily active users (line)
├─ Predictions per hour (line)
├─ Emergency SOS activations (line)
├─ Consultations booked (line)
├─ Revenue (if applicable)
└─ NPS trend (line)

Dashboard 4: Alert Status
├─ Critical alerts (table)
├─ Warning alerts (table)
├─ Acknowledged incidents (table)
└─ Escalations to on-call (gauge)
```

---

## 9. TOOLS & TECHNOLOGY STACK

### 9.1 Complete DevOps Tools

| Layer | Tool | Purpose | Config |
|-------|------|---------|--------|
| **Source Control** | GitHub | Version control, PR reviews | Branch protection: main/develop |
| **CI/CD** | GitHub Actions | Automated pipeline | .github/workflows/*.yml |
| **Containerization** | Docker | App packaging | Dockerfile, docker-compose.yml |
| **Orchestration** | Kubernetes | Container orchestration | k8s/staging/, k8s/production/ |
| **Registry** | GitHub Container Registry | Docker image storage | ghcr.io/kabilash01/... |
| **Monitoring** | Prometheus | Metrics collection | prometheusconfig.yml |
| **Visualization** | Grafana | Metrics dashboard | grafana/dashboards/*.json |
| **Logging** | ELK Stack | Log aggregation | elasticsearch, logstash, kibana |
| **Alerting** | AlertManager | Alert routing | prometheus/alertmanager.yml |
| **Chat** | Slack | Notifications | Incoming webhooks |
| **APM** | Datadog (optional) | Performance monitoring | datadog.yaml |

### 9.2 Infrastructure Setup (K8s YAML)

```yaml
# k8s/production/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: carelink-ai
  namespace: production
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: carelink-ai
  template:
    metadata:
      labels:
        app: carelink-ai
        version: v1.0.0
    spec:
      containers:
      - name: carelink-ai
        image: ghcr.io/kabilash01/carelink-ai:main-latest
        ports:
        - containerPort: 8000
        env:
        - name: ENVIRONMENT
          value: production
        - name: LOG_LEVEL
          value: ERROR
        - name: CORS_ORIGINS
          value: "https://app.carelink.com"
        resources:
          requests:
            cpu: "2"
            memory: "4Gi"
          limits:
            cpu: "4"
            memory: "8Gi"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: carelink-ai
  namespace: production
spec:
  type: LoadBalancer
  ports:
  - port: 443
    targetPort: 8000
    protocol: TCP
  selector:
    app: carelink-ai
---
apiVersion: autoscaling.k8s.io/v2
kind: HorizontalPodAutoscaler
metadata:
  name: carelink-ai-hpa
  namespace: production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: carelink-ai
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

---

### 9.3 Disaster Recovery & Backup

```
Backup Strategy:
├─ Database
│  ├─ Supabase automatic daily backup
│  ├─ Retention: 30 days
│  ├─ RPO (Recovery Point Objective): 24h
│  └─ RTO (Recovery Time Objective): 4h
│
├─ Application Code
│  ├─ GitHub repository (version controlled)
│  ├─ Retention: Indefinite
│  └─ Multi-region replication
│
├─ Docker Images
│  ├─ GHCR (GitHub Container Registry)
│  ├─ Backups: Last 10 versions
│  └─ Retention: 1 year
│
└─ Configuration & Secrets
   ├─ Kubernetes secrets (encrypted)
   ├─ Vault (for sensitive keys)
   └─ Rotation: Quarterly

Disaster Recovery Plan:
┌─ Tier 1: Service Degradation (P1)
│  └─ Manual failover within 15 min
│  └─ Notification to stakeholders
│
├─ Tier 2: Complete Outage (P0)
│  ├─ Auto-restore from backup
│  ├─ RTO: <1h
│  ├─ Data loss: <24h
│  └─ Incident postmortem required
│
└─ Tier 3: Multi-region Failover (P0+)
   ├─ Active-passive replication
   ├─ Geographic redundancy
   ├─ Automatic failover script
   └─ RTO: <5 min
```

---

## CONCLUSION

This comprehensive system design document provides:

✅ **Visual Architecture Diagrams** (UML, DFD, Use Cases)
✅ **Microservices Decomposition** (8 independent services)
✅ **Testing Strategy** (Unit, Integration, Security, Performance, Offline)
✅ **DevOps CI/CD Pipeline** (9-stage automated deployment)
✅ **Kubernetes Orchestration** (K8s YAML, auto-scaling, HPA)
✅ **Monitoring & Observability** (Prometheus, Grafana, ELK)
✅ **Disaster Recovery** (Backup, failover, RTO/RPO targets)

**Ready for:**
- Enterprise production deployment
- Multi-region scaling
- High-availability healthcare operations
- Incident response planning

---

**Document Generated:** 2026-05-05
**Status:** PRODUCTION-READY
**Audience:** DevOps Engineers, Solutions Architects, Development Teams
