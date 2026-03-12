# CareLink - Complete Tech Stack & Features Analysis

**Project Type**: Full-stack Healthcare AI Application  
**Architecture**: React Native Mobile + Python FastAPI Backend  
**Current Date**: March 2026  

---

## 📊 EXECUTIVE SUMMARY

CareLink is an enterprise-grade healthcare application combining:
- **AI-powered symptom triage** with medical image analysis
- **Telemedicine consultations** (video, audio, text)
- **Digital health records** management
- **Emergency response system** with first-aid guidance
- **Medicine/pharmacy search** with price comparison
- **Multi-language support** (English, Spanish, French)

---

## 🏗️ TECH STACK

### **Frontend: React Native + Expo**
| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | React | 19.2.0 |
| Native Framework | React Native | 0.83.2 |
| Build System | Expo | ~55.0.4 |
| Navigation | React Navigation | 7.x |
| UI Components | Expo Vector Icons | 15.1.1 |
| Authentication | AsyncStorage | 2.2.0 |
| Backend Server | React Native Web | 0.21.0 |

**Key Expo Modules**:
- `expo-camera` - Medical image capture
- `expo-image-picker` - Image/file uploads
- `expo-local-authentication` - Biometric security
- `expo-location` - GPS for nearest hospitals
- `expo-linear-gradient` - UI styling
- `expo-updates` - OTA updates

---

### **Backend: Python + FastAPI**
| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| API Framework | FastAPI | 0.109.0 | RESTful microservice |
| Server | Uvicorn | 0.27.0 | ASGI application server |
| Validation | Pydantic | 2.5.3 | Type-safe data schemas |
| ML/Classification | Scikit-Learn | 1.4.0 | Risk classification model |
| Boosting Model | XGBoost | 2.0.3 | Enhanced ML predictions |
| ML Pipeline | Joblib | 1.3.2 | Model serialization |
| Data Processing | Pandas | Latest | Data manipulation |
| Numerical | NumPy | 1.26.3 | Array operations |

---

### **AI/ML & LLM Stack**
| Component | Technology | Details |
|-----------|-----------|---------|
| **Vision-Language Model** | MedGemma 4B-IT | Medical image analysis + text generation |
| **LLM Quantization** | BitsAndBytes | 4-bit NF4 quantization for GPU efficiency |
| **Transformers** | HuggingFace | 4.50.0+ (model loading & inference) |
| **Acceleration** | Accelerate | GPU memory management |
| **Hub Integration** | HuggingFace Hub | 0.22.0+ (model downloads) |
| **Image Processing** | Pillow | 10.0.0+ (medical image handling) |

---

### **NLP Stack**
| Component | Technology | Version | Use Case |
|-----------|-----------|---------|----------|
| **NLP Engine** | spaCy | 3.7.2 | Entity extraction, tokenization |
| **HTTP Client** | httpx | 0.26.0 | Async API calls |
| **Translation** | translate-google-api | 1.0.4 | Real-time language translation |

---

### **Database Stack**
| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Cloud Database** | Supabase | PostgreSQL-based BaaS for user data, chat, health records |
| **Local Cache** | SQLite | Audit trails, prediction history |
| **ORM** | SQLAlchemy | 2.0.25 (database abstraction) |
| **Async DB** | aiosqlite | 0.19.0 (async SQLite operations) |

---

### **Security & Monitoring**
| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **JWT Authentication** | PyJWT + Cryptography | 3.3.0 | API key validation |
| **Password Hashing** | Passlib + Bcrypt | 1.7.4 | Secure credential storage |
| **Metrics** | Prometheus | 0.19.0 | Performance monitoring |
| **Structured Logging** | JSON Logger | 2.0.7 | Audit trail compliance |

---

### **Development & Testing**
| Component | Technology | Version |
|-----------|-----------|---------|
| **Testing Framework** | Pytest | 7.4.4 |
| **Async Testing** | pytest-asyncio | 0.23.3 |
| **Code Coverage** | pytest-cov | 4.1.0 |
| **Code Formatter** | Black | 24.1.1 |
| **Linter** | Flake8 | 7.0.0 |
| **Type Checker** | MyPy | 1.8.0 |

---

### **Infrastructure**
| Component | Technology |
|-----------|-----------|
| **Containerization** | Docker |
| **Orchestration** | Docker Compose |
| **Backend Port** | 8000 (Uvicorn) |
| **Frontend Build** | Expo CLI |

---

## ✨ FEATURES BREAKDOWN

### **1. 🏥 AI-Powered Symptom Triage**
**Location**: `ai-service/app/services/triage_service.py` + Mobile: `screens/symptomChecker/`

**Features**:
- ✅ Free-text symptom input analysis
- ✅ Risk classification: **LOW / MEDIUM / HIGH**
- ✅ Confidence scoring (0-1 scale)
- ✅ Clinical safety rule engine (8 deterministic rules)
  - Critical symptom detection
  - Chest pain + cardiovascular flags
  - Infant fever protocol
  - Pregnancy-related emergencies
  - etc.
- ✅ Escalation based on confidence thresholds
- ✅ Emergency flag auto-detection
- ✅ Patient-friendly explanations
- ✅ Audit trail for compliance

**Mobile Workflow**:
1. **SymptomCheckerHomeScreen** - Welcome & body diagram
2. **SymptomInputScreen** - Free-text input
3. **ClarifyingQuestionsScreen** - Dynamic Q&A
4. **SymptomResultsScreen** - Risk visualization
5. **RecommendedActionScreen** - Next steps (doctor/ER/home care)
6. **SymptomHistoryScreen** - Past check records

---

### **2. 🤖 Medical Image Analysis (VLM)**
**Location**: `ai-service/app/services/explanation_service.py` + Mobile: `screens/ai/`

**Uses**: **MedGemma 4B-IT** (Vision-Language Model)

**Features**:
- ✅ Capture/upload medical photos
- ✅ AI analysis of medical images
- ✅ Severity assessment from images
- ✅ Finding extraction & labeling
- ✅ Integration with triage results
- ✅ Non-diagnostic reference (compliance-compliant disclaimers)

**Backend Capabilities**:
```python
POST /api/v1/triage/analyze-image
- Input: Medical image, clinical question
- Output: findings, severity labels, recommendations
```

---

### **3. 👨‍⚕️ Telemedicine Consultations**
**Location**: `screens/telemedicine/`

**Consultation Types**:
1. **Video Consultation** - Real-time video with doctors
2. **Audio Consultation** - Phone call format
3. **Text Consultation** - Chat-based support

**Workflow**:
- **ConsultSpecialtyScreen** - Choose specialty (cardiology, neurology, etc.)
- **DoctorsListScreen** - Browse available doctors
- **DoctorProfileScreen** - View credentials, ratings, availability
- **AppointmentBookingScreen** - Schedule appointment
- **WaitingRoomScreen** - Pre-call waiting area
- **ActiveVideoConsultScreen** / **ActiveAudioConsultScreen** / **ActiveTextConsultScreen** - Live consultation
- **PostConsultSummaryScreen** - Consultation summary
- **DigitalPrescriptionViewScreen** - Prescriptions from doctor
- **FollowUpSchedulingScreen** - Schedule follow-ups
- **ConsultationHistoryScreen** - Past consultations

**Features**:
- ✅ Real-time communication
- ✅ Doctor authentication & verification
- ✅ Digital prescriptions
- ✅ Appointment scheduling
- ✅ Referral system (ReferralNoticeScreen)
- ✅ History tracking

---

### **4. 📋 Digital Health Records**
**Location**: `screens/health/` + Database: Supabase tables

**Health Profile Management**:
- **HealthProfileScreen** - View complete health profile
- **EditProfileScreen** - Update personal info
- **MedicalHistoryScreen** - Past illnesses, surgeries
- **ImmunizationScreen** - Vaccination records
- **TestReportsScreen** - Lab results & medical tests
- **UploadReportScreen** - Upload new reports (PDF/images)
- **TrendAnalysisScreen** - Health metrics over time (BP, weight, glucose)
- **MedicationsScreen** - Current medications
- **AdherenceLogScreen** - Medication compliance tracking

**Data Sharing Features**:
- **QRShareScreen** - Generate shareable QR codes for records
- **DataAccessScreen** - Manage who can access records
- **AuditLogScreen** - View access history (compliance)
- **ExportDataScreen** - Download records in standard formats
- **SyncStatusScreen** - Cloud sync status

---

### **5. 🚨 Emergency Response System**
**Location**: `screens/emergency/`

**Emergency Features**:
- **EmergencyHomeScreen** - Quick emergency access (SOS)
- **IncidentSelectScreen** - Type of emergency (chest pain, severe bleeding, etc.)
- **SymptomQuestionnaireScreen** - Quick assessment questions
- **SeverityResultScreen** - Risk assessment result
- **FirstAidInstructionsScreen** - Step-by-step first aid guidance
- **NextStepsScreen** - Immediate actions (call ambulance, go to ER)
- **NearestHospitalsScreen** - Find nearest hospitals using GPS
- **EmergencyContactsScreen** - Quick call emergency contacts
- **FollowupReminderScreen** - Post-emergency follow-up reminders

**Features**:
- ✅ One-tap emergency activation
- ✅ GPS-based hospital location
- ✅ Automatic emergency contact notification
- ✅ First-aid guidance AI
- ✅ Hospital routing integration
- ✅ Crisis navigation

---

### **6. 💊 Medicine & Pharmacy Search**
**Location**: `screens/medicine/`

**Pharmacy Integration**:
- **MedicineSearchScreen** - Search drugs by name
- **PharmacyResultsScreen** - View nearby pharmacies
- **PharmacyFilterScreen** - Filter by location, rating, price
- **PharmacyDetailScreen** - Pharmacy info, hours, contact
- **PharmacyMapViewScreen** - GPS map of pharmacies
- **MedicineDetailScreen** - Drug info, dosage, side effects
- **GenericAlternativesScreen** - Compare generic alternatives
- **PriceComparisonScreen** - Price comparison across pharmacies
- **PrescriptionUploadScreen** - Upload digital prescriptions
- **MarkPurchasedScreen** - Track medication purchases

**Features**:
- ✅ Medicine search & information
- ✅ Pharmacy locator with GPS
- ✅ Price comparison
- ✅ Generic alternative suggestions
- ✅ Digital prescription support
- ✅ Purchase tracking

---

### **7. 🔔 Smart Notifications**
**Location**: `screens/notifications/`

**Notification Types**:
- **Appointment reminders** - Upcoming doctor visits
- **Medication reminders** - Medication schedules
- **Health alerts** - Unusual readings, missed check-ups
- **Test result notifications** - Lab results ready
- **Telemedicine updates** - Doctor responses
- **Emergency follow-ups** - Post-emergency check-ins

**Screens**:
- **NotificationsListScreen** - All notifications inbox
- **NotificationDetailScreen** - Detailed notification view
- **NotificationSettingsScreen** - Manage preferences (push, email, SMS)

---

### **8. ⚙️ Settings & Personalization**
**Location**: `screens/settings/`

**User Settings**:
- **SettingsHomeScreen** - Settings dashboard
- **ProfileSettingsScreen** - Edit profile info
- **LanguageSettingsScreen** - Switch language (EN/ES/FR)
- **NotificationPrefsScreen** - Configure alerts
- **PrivacySettingsScreen** - HIPAA/privacy controls
- **HelpSupportScreen** - FAQs & support contact
- **AboutAppScreen** - App version & credits
- **FeedbackScreen** - User feedback submission

---

### **9. 🤖 AI Chat Assistant**
**Location**: `screens/ai/` + Backend: `POST /api/v1/triage/chat`

**Features**:
- ✅ Conversational health questions
- ✅ Context-aware responses using MedGemma
- ✅ Chat history persistence
- ✅ Multilingual responses
- ✅ Integration with triage context
- ✅ Follow-up question support

**Screens**:
- **AIHomeScreen** - Chat interface home
- **AIChatScreen** - Live chat with health AI

---

### **10. 🌐 Multilingual Support**
**Location**: `src/i18n/`

**Supported Languages**:
- ✅ English (en)
- ✅ Spanish (es)
- ✅ French (fr)

**Implementation**:
- Translation service integration
- Real-time language switching
- Backend multilingual responses (NLP pipeline)
- Language context management (LanguageContext.js)

---

### **11. 🔐 Authentication & Security**
**Location**: `src/context/AuthContext.js` + `ai-service/app/core/security.py`

**Authentication Features**:
- ✅ User sign-up/login
- ✅ Password reset/forgot password
- ✅ Social authentication integration
- ✅ Biometric login (expo-local-authentication)
- ✅ API key validation
- ✅ JWT token management

**Security Screens**:
- **SplashScreen** - App initialization
- **LanguageSelectionScreen** - Language preference
- **OnboardingScreen** - App walkthrough
- **LoginScreen** - User login
- **SignUpScreen** - New user registration
- **ForgotPasswordScreen** - Password recovery
- **PermissionsScreen** - Request app permissions
- **OnboardingTutorialScreen** - Feature tutorials

---

## 🗄️ DATABASE SCHEMA

### **Supabase Tables (Cloud)**

```sql
1. chat_sessions
   - Session-based chat conversations
   - User to session relationship (1:N)
   
2. chat_messages
   - Individual messages in chat
   - Supports text + image_url (medical photos)
   - Role: 'user' or 'assistant'
   
3. vlm_scans
   - Medical image analysis results
   - Stores findings, severity labels
   - model_ready flag for VLM status
   
4. symptom_checks
   - Symptom triage results
   - Prediction, confidence, triggered rules
   - Emergency flags & escalation status
   
5. medical-images Storage Bucket
   - Public file storage for medical images
   - User-based access control
   - Supabase CDN serving
```

### **SQLite Tables (Local Audit)**

```sql
- Audit trail of all predictions
- HIPAA-compliant request logging
- Processing metrics (latency, model version)
```

---

## 🔌 API ENDPOINTS

### **Symptom Triage**
```
POST /api/v1/triage/predict
{
  "symptoms_text": "string",
  "age": 30,
  "duration_days": 1,
  "chronic_conditions": [],
  "language": "en|es|fr"
}

Response:
{
  "prediction": "LOW|MEDIUM|HIGH",
  "confidence": 0.85,
  "probabilities": {low: 0.1, medium: 0.2, high: 0.7},
  "rules_triggered": ["CHEST_PAIN_CARDIOVASCULAR"],
  "explanation": "Patient-friendly text",
  "emergency_flag": true,
  "escalated": false,
  "request_id": "uuid",
  "timestamp": "ISO datetime"
}
```

### **Medical Image Analysis**
```
POST /api/v1/triage/analyze-image
{
  "image": <multipart file>,
  "question": "What do you see?"
}

Response:
{
  "analysis": "VLM response text",
  "findings": [
    {"severity": "high", "label": "inflammation", "description": "..."}
  ]
}
```

### **Chat**
```
POST /api/v1/triage/chat
{
  "message": "Follow-up question",
  "session_id": "uuid"
}

Response:
{
  "response": "AI assistant reply",
  "context": {...}
}
```

### **Health & Monitoring**
```
GET /health                          - Service health check
GET /api/v1/metrics                  - Service metrics
GET /api/v1/metrics/prometheus       - Prometheus format metrics
GET /api/v1/model/info               - Model metadata
GET /api/v1/rules                    - List safety rules
POST /api/v1/model/reload            - Reload LLM
```

---

## 🛡️ Safety & Compliance Features

### **Clinical Safety Rules** (8 rules)
1. **CRITICAL_SYMPTOM_CHECK** - Immediate danger detection
2. **CHEST_PAIN_CARDIOVASCULAR** - Cardiac risk flags
3. **INFANT_FEVER** - Young children high fever
4. **PREGNANCY_COMPLICATIONS** - Obstetric emergencies
5. **SEVERE_ALLERGIC_REACTION** - Anaphylaxis detection
6. **SEVERE_BLEEDING** - Hemorrhage protocol
7. **NEUROLOGICAL_EMERGENCY** - Stroke/seizure signs
8. **RESPIRATORY_DISTRESS** - Breathing emergency

### **Confidence Controller**
- Escalates LOW → MEDIUM if confidence < 0.6
- Escalates MEDIUM → HIGH if confidence < 0.75
- Sets emergency_flag for HIGH risk predictions
- Conservative approach (safety-first)

### **Compliance**
- ✅ HIPAA-compliant logging
- ✅ Request ID tracking
- ✅ Audit trail storage
- ✅ Data encryption (Supabase)
- ✅ Row-level security (RLS) policies
- ✅ User data isolation
- ✅ Medical image storage compliance

---

## 📊 ML Pipeline Architecture

```
Input Symptoms
    ↓
[TextPreprocessor] - normalize, expand abbreviations, tokenize
    ↓
[SymptomExtractor] - spaCy entity extraction, medical vocab matching
    ↓
[FeatureEngineer] - one-hot encoding, age normalization, condition flags
    ↓
[ML Model] - Scikit-Learn + XGBoost (100 features → probability vector)
    ↓
[MedGemma LLM] - Contextual triage analysis + explanations
    ↓
[RuleEngine] - Clinical override rules (escalation only)
    ↓
[ConfidenceController] - Threshold-based escalation + emergency flag
    ↓
[ExplanationService] - Patient-friendly response generation
    ↓
Output: TriageResponse
```

---

## 🚀 Deployment Architecture

### **Backend Deployment**
```
Docker Compose:
  - Uvicorn ASGI server: 0.0.0.0:8000
  - FastAPI app with auto-reload in dev
  - Production: gunicorn + uvicorn workers
  - Health checks for container orchestration (k8s)
```

### **Frontend Deployment**
```
Expo Build:
  - iOS build via EAS (Expo Application Services)
  - Android build via gradle
  - Web build support (React Native Web)
  - OTA updates via expo-updates
```

### **Infrastructure**
```
- Supabase Cloud (PostgreSQL + Auth + Storage)
- Docker containerization
- CORS enabled for cross-domain requests
- Rate limiting: 60 requests/minute per IP
```

---

## 📈 Monitoring & Metrics

### **Prometheus Metrics**
```
- Request latency (ms)
- Model inference time
- API endpoint hit counts
- Prediction distribution (LOW/MEDIUM/HIGH)
- Rule trigger frequencies
- Error rate tracking
```

### **Audit Logging**
```
- All triage requests logged to SQLite
- Request ID for traceability
- Timestamp, user info, predictions
- Triggered rules & explanations
- Model version tracking
```

---

## 💾 Configuration Management

### **Environment Variables** (`.env`)
```
ENVIRONMENT=development
APP_VERSION=1.0.0
HOST=0.0.0.0
PORT=8000

# Model
MODEL_PATH=app/models/risk_model.pkl
LLM_MODEL_NAME=llama3.2
LLM_DEVICE=cuda

# Database
DATABASE_URL=sqlite:///./carelink.db

# Security
API_KEY_ENABLED=false
SAFETY_RULES_ENABLED=true
CONFIDENCE_THRESHOLD=0.6
ESCALATION_THRESHOLD=0.75

# Monitoring
ENABLE_METRICS=true
ENABLE_AUDIT_LOGGING=true
```

---

## 📚 Testing Infrastructure

### **Test Coverage**
```
- test_quick.py - Fast smoke tests
- test_model.py - ML model inference tests
- test_full.py - End-to-end integration tests
- test_routes.py - API endpoint tests
- test_rules.py - Safety rule engine tests
- test_startup.py - Service startup tests
```

### **Tools**
- Pytest + pytest-asyncio
- Code coverage tracking
- Async test support

---

## 🎯 PROJECT STATISTICS

| Category | Count |
|----------|-------|
| **Mobile Screens** | 50+ (auth, home, telemedicine, health, emergency, symptoms, medicine, notifications, settings, AI) |
| **API Endpoints** | 10+ (triage, analysis, chat, health, metrics) |
| **Database Tables** | 4 main + 1 storage bucket |
| **Safety Rules** | 8 clinical rules |
| **ML Features** | 100 engineered features |
| **Languages** | 3 (EN, ES, FR) |
| **Dependencies** | 30+ Python + 25+ JavaScript |

---

## 🎓 KEY HIGHLIGHTS FOR PRESENTATION

1. **End-to-End Healthcare Solution**
   - From symptom input → diagnosis → doctor consultation → prescriptions → medicine delivery
   - Covers entire patient journey

2. **Advanced AI Integration**
   - Medical image analysis (MedGemma 4B-IT)
   - Multi-stage ML pipeline (sklearn + XGBoost + LLM)
   - Clinical safety rule engine

3. **Production-Grade Architecture**
   - Async processing (FastAPI + uvicorn)
   - Type-safe validation (Pydantic)
   - HIPAA compliance ready
   - Comprehensive audit logging

4. **User Experience**
   - Multiple consultation modalities (video, audio, text)
   - Telemedicine integration
   - Real-time emergency response
   - Personalized health tracking

5. **Scalability**
   - Docker containerization
   - Microservice architecture
   - Cloud database (Supabase)
   - Rate limiting & monitoring

6. **Compliance & Security**
   - Data encryption
   - Role-based access control (RLS)
   - Audit trails
   - Patient data isolation

---

## 📋 TECH STACK SUMMARY TABLE

| Layer | Technology Stack |
|-------|------------------|
| **Frontend** | React Native 0.83.2 + Expo 55.0.4 + React Navigation 7.x |
| **Backend** | FastAPI 0.109 + Uvicorn 0.27 + Pydantic 2.5 |
| **ML/AI** | Scikit-Learn 1.4 + XGBoost 2.0 + MedGemma 4B-IT + Transformers 4.50 |
| **NLP** | spaCy 3.7 + HuggingFace |
| **Database** | Supabase (PostgreSQL) + SQLite (audit) |
| **Storage** | Supabase Storage (medical images) |
| **Monitoring** | Prometheus 0.19 + JSON logging |
| **Security** | JWT + Bcrypt + CORS |
| **Testing** | Pytest 7.4 + pytest-asyncio |
| **Infrastructure** | Docker + Docker Compose |

---

## 🔄 Key Integrations

1. **Supabase** - Cloud infrastructure, auth, storage
2. **HuggingFace** - Model hub for MedGemma
3. **Prometheus** - Metrics collection
4. **Expo** - Mobile build & distribution
5. **Google Translate API** - Real-time translations (via translate-google-api)

---

*Generated: March 2026*  
*For CareLink Presentation*
