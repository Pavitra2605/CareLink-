<div align="center">

# 🏥 CareLink

### AI-Powered Healthcare Platform

**A comprehensive healthcare solution combining AI symptom triage, telemedicine, digital health records, and emergency response**

[![React Native](https://img.shields.io/badge/React_Native-0.83-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~55.0-000020.svg)](https://expo.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688.svg)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB.svg)](https://www.python.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E.svg)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
  - [Backend Setup](#backend-ai-service-setup)
  - [Frontend Setup](#frontend-mobile-app-setup)
  - [Database Setup](#database-setup)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)
- [Disclaimer](#%EF%B8%8F-disclaimer)

---

## 🌟 Overview

**CareLink** is an enterprise-grade, AI-powered healthcare platform that bridges the gap between patients and medical care. It combines cutting-edge machine learning, natural language processing, and telemedicine capabilities to provide:

- 🤖 **Intelligent symptom triage** with ML-based risk assessment (LOW/MEDIUM/HIGH)
- 🩺 **Medical image analysis** using Vision-Language Models (VLM)
- 👨‍⚕️ **Telemedicine consultations** (video, audio, text)
- 📋 **Digital health records** management with HIPAA-compliant storage
- 🚨 **Emergency response system** with GPS hospital location and first-aid guidance
- 💊 **Medicine & pharmacy search** with price comparison
- 🌐 **Multilingual support** (English, Spanish, French)

---

## ✨ Features

### 🏥 AI-Powered Symptom Triage
- Free-text symptom input with NLP extraction
- Machine learning risk classification (LOW/MEDIUM/HIGH)
- Clinical safety rule engine with 8+ deterministic rules
- Confidence-based escalation for quality control
- Patient-friendly explanations in multiple languages
- Emergency flag auto-detection
- Complete audit trail for compliance

### 🤖 Medical Image Analysis
- Medical photo capture and upload
- AI-powered image analysis using **MedGemma 4B-IT** Vision-Language Model
- Severity assessment from medical images
- Finding extraction and labeling
- Non-diagnostic reference with compliance disclaimers

### 👨‍⚕️ Telemedicine Consultations
- **Video consultations** with real-time video streaming
- **Audio consultations** for phone-based support
- **Text consultations** via secure chat
- Doctor authentication and verification
- Digital prescriptions and referrals
- Appointment scheduling and reminders
- Consultation history tracking

### 📋 Digital Health Records
- Complete health profile management
- Medical history, immunizations, test reports
- Medication tracking with adherence monitoring
- Trend analysis for health metrics (BP, glucose, weight)
- QR code sharing for emergency access
- Data access audit logs (HIPAA-compliant)
- Export in standard formats

### 🚨 Emergency Response System
- One-tap SOS emergency activation
- GPS-based nearest hospital location
- Automatic emergency contact notification
- AI-guided first-aid instructions
- Crisis navigation with step-by-step guidance
- Post-emergency follow-up reminders

### 💊 Medicine & Pharmacy Search
- Comprehensive medicine database search
- GPS-based pharmacy locator
- Real-time price comparison across pharmacies
- Generic alternative suggestions
- Digital prescription upload
- Purchase tracking

### 🔔 Smart Notifications
- Appointment reminders
- Medication schedules and adherence alerts
- Health alerts for unusual readings
- Test result notifications
- Telemedicine updates

### 🌐 Multilingual Support
- English, Spanish, French
- Real-time language switching
- AI responses in user's preferred language

---

## 🛠️ Tech Stack

### Frontend (Mobile App)

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Framework | React Native | 0.83.2 | Cross-platform mobile development |
| Build System | Expo | ~55.0.4 | Development & build toolchain |
| UI Library | React | 19.2.0 | Component architecture |
| Navigation | React Navigation | 7.x | Screen navigation |
| State Management | Context API | - | Global state management |
| Backend Client | Supabase JS | 2.98.0 | Database & auth integration |
| Storage | AsyncStorage | 2.2.0 | Local data persistence |

**Key Expo Modules:**
- `expo-camera` - Medical image capture
- `expo-image-picker` - Image/file uploads
- `expo-local-authentication` - Biometric security
- `expo-location` - GPS for hospital location
- `expo-print` & `expo-sharing` - Document export
- `expo-updates` - Over-the-air updates

### Backend (AI Service)

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| API Framework | FastAPI | 0.109.0 | RESTful microservice |
| Server | Uvicorn | 0.27.0 | ASGI application server |
| ML Framework | Scikit-Learn | 1.4.0 | Risk classification |
| Boosting Model | XGBoost | 2.0.3 | Enhanced predictions |
| NLP Engine | spaCy | 3.7.2 | Entity extraction & tokenization |
| LLM Framework | HuggingFace Transformers | 4.50+ | Vision-Language Models |
| Model Optimization | BitsAndBytes | 0.43+ | 4-bit quantization for GPU |
| VLM Model | MedGemma 4B-IT | Latest | Medical image analysis |
| Data Processing | Pandas + NumPy | Latest | Feature engineering |

**Security & Monitoring:**
- JWT authentication with `python-jose`
- Password hashing with `passlib[bcrypt]`
- Prometheus metrics export
- Structured JSON logging

### Database & Storage

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Primary Database | Supabase (PostgreSQL) | User data, health records, chat history |
| Local Database | SQLite | Audit trails, prediction cache |
| ORM | SQLAlchemy | Database abstraction layer |
| File Storage | Supabase Storage | Medical images, test reports |

### Infrastructure

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Containerization | Docker | Backend deployment |
| Orchestration | Docker Compose | Local development |
| CI/CD | GitHub Actions | Automated testing & deployment |
| Mobile Deployment | Expo EAS | Android/iOS builds |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Mobile App (React Native)               │
│  ┌─────────┐  ┌──────────┐  ┌─────────┐  ┌──────────────┐ │
│  │ Symptom │  │   Tele   │  │ Health  │  │  Emergency   │ │
│  │  Triage │  │ Medicine │  │ Records │  │   Response   │ │
│  └────┬────┘  └────┬─────┘  └────┬────┘  └──────┬───────┘ │
└───────┼────────────┼─────────────┼───────────────┼─────────┘
        │            │             │               │
        └────────────┴─────────────┴───────────────┘
                            │
                    ┌───────▼────────┐
                    │  API Gateway   │
                    └───────┬────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌───────▼────────┐  ┌──────▼──────┐
│  AI Microservice│  │    Supabase    │  │  External   │
│   (FastAPI)     │  │   PostgreSQL   │  │   APIs      │
│                 │  │                │  │             │
│ ┌─────────────┐ │  │ ┌────────────┐ │  │ - Maps      │
│ │ ML Model    │ │  │ │ Users      │ │  │ - Pharmacy  │
│ │ Triage      │ │  │ │ Health Rec │ │  │ - Translation│
│ └─────────────┘ │  │ │ Chat Hist  │ │  └─────────────┘
│ ┌─────────────┐ │  │ │ Appts      │ │
│ │ VLM Model   │ │  │ └────────────┘ │
│ │ MedGemma 4B │ │  │                │
│ └─────────────┘ │  │ ┌────────────┐ │
│ ┌─────────────┐ │  │ │  Storage   │ │
│ │ NLP Engine  │ │  │ │  (Images)  │ │
│ │ spaCy       │ │  │ └────────────┘ │
│ └─────────────┘ │  └────────────────┘
│ ┌─────────────┐ │
│ │ Rules Engine│ │
│ │ Clinical    │ │
│ └─────────────┘ │
└─────────────────┘
```

### Request Flow (Symptom Triage Example)

```
User Input → NLP Processing → Feature Engineering → ML Classification
    ↓              ↓                  ↓                    ↓
Symptom Text   Entity Extract    Feature Vector      Risk Prediction
    ↓              ↓                  ↓                    ↓
                Clinical Rules Engine Override (if triggered)
                              ↓
                   Confidence Controller Check
                              ↓
                   Explanation Generation (LLM)
                              ↓
                    JSON Response to Mobile
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### For Frontend Development
- **Node.js** >= 16.x ([Download](https://nodejs.org/))
- **npm** or **yarn** (comes with Node.js)
- **Expo CLI** (install via `npm install -g expo-cli`)
- **Android Studio** (for Android development) or **Xcode** (for iOS development)
- **Expo Go** app on your mobile device (for testing)

### For Backend Development
- **Python** >= 3.11 ([Download](https://www.python.org/downloads/))
- **pip** (Python package manager)
- **virtualenv** or **venv** for virtual environments
- **Docker** & **Docker Compose** (optional, for containerized deployment)
- **CUDA-capable GPU** (optional, for VLM model - falls back to CPU)

### For Database
- **Supabase Account** ([Sign up free](https://supabase.com/))
- **Supabase CLI** (optional, for local development)

---

## 🚀 Getting Started

### Backend (AI Service) Setup

1. **Navigate to AI service directory**
   ```bash
   cd ai-service
   ```

2. **Create Python virtual environment**
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Download spaCy language model**
   ```bash
   python -m spacy download en_core_web_sm
   ```

5. **Set up environment variables**
   
   Create a `.env` file in the `ai-service` directory:
   ```bash
   # Environment
   ENVIRONMENT=development
   DEBUG=true
   LOG_LEVEL=INFO
   
   # Server Configuration
   HOST=0.0.0.0
   PORT=8000
   CORS_ORIGINS=http://localhost:3000,http://localhost:19006
   
   # Model Configuration
   MODEL_VERSION=v1.0.0
   CONFIDENCE_THRESHOLD=0.6
   ESCALATION_THRESHOLD=0.75
   
   # Security
   API_KEY_ENABLED=false
   API_KEY=your-secret-api-key-here
   
   # Monitoring
   ENABLE_METRICS=true
   ENABLE_AUDIT_LOGGING=true
   ```

6. **Generate training data and train ML model**
   ```bash
   # Generate synthetic training data
   python data/synthetic_generator.py
   
   # Train the ML model
   python training/train_model.py
   ```

7. **Run the AI service**
   ```bash
   # Development mode with auto-reload
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   
   # Or use Docker
   docker-compose up -d
   ```

8. **Verify installation**
   
   Open your browser and navigate to:
   - API Documentation: http://localhost:8000/docs
   - Health Check: http://localhost:8000/health
   - Metrics: http://localhost:8000/api/v1/metrics

### Frontend (Mobile App) Setup

1. **Navigate to mobile app directory**
   ```bash
   cd CareLink
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Supabase**
   
   Create a `src/config/supabase.js` file:
   ```javascript
   export const SUPABASE_URL = 'https://your-project.supabase.co';
   export const SUPABASE_ANON_KEY = 'your-anon-key-here';
   ```
   
   Get these values from your [Supabase Dashboard](https://app.supabase.com/).

4. **Configure AI Service endpoint**
   
   Update `src/services/aiService.js` with your backend URL:
   ```javascript
   const AI_SERVICE_URL = 'http://localhost:8000'; // or your deployed URL
   ```

5. **Run database migrations**
   ```bash
   npm run db:push
   ```

6. **Seed initial data (optional)**
   ```bash
   npm run seed
   ```

7. **Start the development server**
   ```bash
   npm start
   # or
   expo start
   ```

8. **Run on device/emulator**
   - Press `a` for Android emulator
   - Press `i` for iOS simulator (macOS only)
   - Scan QR code with Expo Go app on your physical device

### Database Setup

#### Option 1: Cloud Supabase (Recommended)

1. **Create a Supabase project**
   - Go to [Supabase Dashboard](https://app.supabase.com/)
   - Click "New Project"
   - Note your project URL and anon key

2. **Run database migrations**
   ```bash
   cd supabase
   npx supabase db push
   ```

3. **Set up storage buckets**
   
   In Supabase Dashboard → Storage, create buckets:
   - `medical-images` (for medical photos)
   - `health-reports` (for test results, PDFs)
   - `profile-pictures` (for user avatars)

#### Option 2: Local Supabase (Development)

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Initialize Supabase locally**
   ```bash
   cd supabase
   supabase start
   ```

3. **Access local services**
   - API: http://localhost:54321
   - Studio: http://localhost:54323
   - Database: postgresql://postgres:postgres@localhost:54322/postgres

---

## 🎯 Running the Application

### Full Stack (Recommended)

1. **Terminal 1 - Backend AI Service**
   ```bash
   cd ai-service
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Terminal 2 - Mobile App**
   ```bash
   cd CareLink
   npm start
   ```

3. **Terminal 3 - Supabase (if local)**
   ```bash
   cd supabase
   supabase start
   ```

4. **Open Expo Go** on your mobile device and scan the QR code

### Docker Deployment (Production-like)

```bash
# From ai-service directory
docker-compose up -d

# Verify services
docker-compose ps
docker-compose logs -f carelink-ai
```

### Building Mobile App

#### Development Build
```bash
cd CareLink
eas build --profile development --platform android
```

#### Production Build
```bash
# Android
eas build --profile production --platform android

# iOS (requires Apple Developer account)
eas build --profile production --platform ios
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Key Endpoints

#### 1. Symptom Triage Prediction
```http
POST /triage/predict
Content-Type: application/json

{
  "symptoms_text": "I have chest pain and shortness of breath",
  "age": 45,
  "duration_days": 1,
  "chronic_conditions": ["diabetes", "hypertension"],
  "language": "en"
}
```

**Response:**
```json
{
  "prediction": "HIGH",
  "probabilities": {
    "low": 0.05,
    "medium": 0.15,
    "high": 0.80
  },
  "confidence": 0.89,
  "rules_triggered": ["CHEST_PAIN_CARDIOVASCULAR"],
  "explanation": "Based on your symptoms, immediate medical attention is recommended...",
  "emergency_flag": true,
  "escalated": false,
  "model_version": "v1.0.0",
  "request_id": "req_abc123",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### 2. Medical Image Analysis
```http
POST /triage/analyze-image
Content-Type: multipart/form-data

image: <binary file>
clinical_question: "What does this rash look like?"
```

#### 3. AI Chat
```http
POST /triage/chat
Content-Type: application/json

{
  "message": "What should I do for a headache?",
  "context": {
    "previous_messages": [],
    "user_profile": {}
  },
  "language": "en"
}
```

#### 4. Health Check
```http
GET /health
```

#### 5. Metrics (Prometheus)
```http
GET /api/v1/metrics/prometheus
```

### Interactive API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 🧪 Testing

### Backend Tests

```bash
cd ai-service

# Run all tests
pytest tests/ -v

# Run with coverage report
pytest tests/ --cov=app --cov-report=html

# Run specific test file
pytest tests/test_routes.py -v

# View coverage report
open htmlcov/index.html  # On macOS
```

### Frontend Tests

```bash
cd CareLink

# Run tests (when configured)
npm test

# Run linting
npm run lint
```

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Symptom triage with various inputs
- [ ] Medical image upload and analysis
- [ ] Telemedicine appointment booking
- [ ] Health records viewing and editing
- [ ] Emergency SOS activation
- [ ] Medicine search and pharmacy location
- [ ] Language switching (EN/ES/FR)
- [ ] Notification preferences
- [ ] Profile settings update

---

## 🚢 Deployment

### Backend Deployment

#### Docker (Recommended)
```bash
cd ai-service

# Build image
docker build -t carelink-ai:latest .

# Run container
docker run -d \
  -p 8000:8000 \
  -e ENVIRONMENT=production \
  -e API_KEY_ENABLED=true \
  -e API_KEY=your-production-key \
  --name carelink-ai \
  carelink-ai:latest
```

#### Cloud Platforms

**AWS EC2 / Google Cloud / Azure VM:**
1. Set up virtual machine with Python 3.11+
2. Clone repository
3. Install dependencies
4. Configure systemd service
5. Set up reverse proxy (Nginx)
6. Configure SSL with Let's Encrypt

**Heroku:**
```bash
heroku create carelink-ai
git subtree push --prefix ai-service heroku main
```

**Railway / Render:**
- Connect GitHub repository
- Set build command: `pip install -r requirements.txt`
- Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Frontend Deployment

#### Expo EAS Build
```bash
cd CareLink

# Configure EAS
eas build:configure

# Build for Android
eas build --platform android --profile production

# Build for iOS
eas build --platform ios --profile production

# Submit to stores
eas submit --platform android
eas submit --platform ios
```

#### Web Deployment (Expo Web)
```bash
npm run web

# Build for production
expo build:web

# Deploy to Netlify/Vercel
netlify deploy --dir=web-build --prod
```

### Database Deployment

Supabase automatically handles:
- Database backups
- Scaling
- Security updates
- SSL encryption

For production:
1. Upgrade to Supabase Pro plan (if needed)
2. Set up database backups
3. Configure row-level security (RLS) policies
4. Enable Point-in-Time Recovery (PITR)

---

## 📁 Project Structure

```
CareLink-/
├── CareLink/                      # Mobile app (React Native + Expo)
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── context/              # Context providers (Auth, Language)
│   │   ├── i18n/                 # Internationalization (EN/ES/FR)
│   │   ├── navigation/           # React Navigation setup
│   │   ├── screens/              # All app screens
│   │   │   ├── ai/               # AI chat screens
│   │   │   ├── auth/             # Login, signup, onboarding
│   │   │   ├── emergency/        # Emergency response
│   │   │   ├── health/           # Health records
│   │   │   ├── home/             # Home dashboard
│   │   │   ├── medicine/         # Medicine search
│   │   │   ├── notifications/    # Notifications
│   │   │   ├── settings/         # Settings
│   │   │   ├── symptomChecker/   # Symptom triage
│   │   │   └── telemedicine/     # Telemedicine
│   │   ├── services/             # API services
│   │   │   ├── aiService.js      # AI backend integration
│   │   │   ├── supabase.js       # Supabase client
│   │   │   ├── medicineService.js
│   │   │   └── translationService.js
│   │   └── theme/                # UI theming
│   ├── assets/                   # Images, fonts, icons
│   ├── App.js                    # Root component
│   ├── app.json                  # Expo configuration
│   ├── eas.json                  # EAS Build configuration
│   └── package.json              # Dependencies
│
├── ai-service/                    # Backend AI microservice (FastAPI)
│   ├── app/
│   │   ├── api/                  # API routes & schemas
│   │   ├── core/                 # Configuration, logging, security
│   │   ├── services/             # Business logic
│   │   │   ├── triage_service.py      # ML triage
│   │   │   ├── rule_engine.py         # Clinical rules
│   │   │   ├── confidence_controller.py
│   │   │   └── explanation_service.py # LLM explanations
│   │   ├── models/               # ML model artifacts
│   │   ├── nlp/                  # NLP preprocessing
│   │   ├── monitoring/           # Metrics & audit logs
│   │   └── main.py               # FastAPI app
│   ├── data/                     # Training data
│   │   └── synthetic_generator.py
│   ├── training/                 # Model training scripts
│   │   └── train_model.py
│   ├── tests/                    # Test suite
│   ├── Dockerfile                # Docker configuration
│   ├── docker-compose.yml        # Local deployment
│   ├── requirements.txt          # Python dependencies
│   └── README.md                 # AI service docs
│
├── supabase/                      # Database & backend
│   ├── migrations/               # Database migrations
│   ├── config.toml               # Supabase configuration
│   └── seed.sql                  # Initial data
│
├── original_assets/              # Design assets
├── PRESENTATION_ANALYSIS.md      # Technical documentation
└── README.md                     # This file
```

---

## 🤝 Contributing

We welcome contributions to CareLink! Here's how you can help:

### Development Workflow

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/carelink.git
   cd carelink
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clean, documented code
   - Follow existing code style
   - Add tests for new features
   - Update documentation as needed

4. **Test your changes**
   ```bash
   # Backend tests
   cd ai-service && pytest tests/ -v
   
   # Frontend linting
   cd CareLink && npm run lint
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```
   
   Use conventional commits:
   - `feat:` new feature
   - `fix:` bug fix
   - `docs:` documentation
   - `style:` formatting
   - `refactor:` code restructuring
   - `test:` adding tests
   - `chore:` maintenance

6. **Push and create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Standards

- **Frontend**: Follow React Native best practices, use functional components
- **Backend**: Follow PEP 8, use type hints, document functions
- **Commit Messages**: Use conventional commits format
- **Testing**: Aim for >80% code coverage
- **Documentation**: Update README and inline comments

### Areas for Contribution

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🌐 Translations (add new languages)
- 🎨 UI/UX enhancements
- ⚡ Performance optimizations
- 🧪 Test coverage improvements

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 CareLink Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## ⚠️ Disclaimer

**IMPORTANT: THIS SOFTWARE IS FOR EDUCATIONAL AND DEMONSTRATION PURPOSES ONLY**

### 🚨 Not for Clinical Use

CareLink is a **demonstration project** and is **NOT intended for actual clinical use** without proper:

- ✅ Medical device regulatory approval (FDA, CE, etc.)
- ✅ Clinical validation studies
- ✅ HIPAA compliance certification
- ✅ Professional liability insurance
- ✅ Medical oversight and governance
- ✅ Data security audits
- ✅ Legal review in your jurisdiction

### Medical Disclaimer

- This application **does NOT replace professional medical advice**
- **Always consult a qualified healthcare provider** for medical concerns
- The AI predictions are **probabilistic and may be inaccurate**
- **Do NOT use for emergency medical situations** - call emergency services (911, etc.)
- The application is provided "AS IS" without warranty of any kind

### Data Privacy

- Implement proper PHI (Protected Health Information) safeguards before production use
- Ensure compliance with HIPAA, GDPR, and local healthcare data regulations
- Use end-to-end encryption for sensitive data
- Obtain proper informed consent from users

### Liability

The developers and contributors assume **NO liability** for:
- Medical decisions made based on this application
- Data breaches or security incidents
- Regulatory violations
- Any damages arising from use of this software

**For production healthcare deployment, consult with:**
- Healthcare legal experts
- Medical device regulatory consultants
- HIPAA compliance specialists
- Licensed medical professionals

---

## 📞 Support & Contact

### Documentation
- 📚 [Full Documentation](./docs)
- 🔧 [AI Service API Docs](./ai-service/README.md)
- 📊 [Presentation Analysis](./PRESENTATION_ANALYSIS.md)

### Community
- 💬 [GitHub Discussions](https://github.com/yourusername/carelink/discussions)
- 🐛 [Issue Tracker](https://github.com/yourusername/carelink/issues)
- 📧 Email: support@carelink.example.com

### Quick Links
- [Feature Requests](https://github.com/yourusername/carelink/issues/new?template=feature_request.md)
- [Bug Reports](https://github.com/yourusername/carelink/issues/new?template=bug_report.md)
- [Security Issues](mailto:security@carelink.example.com)

---

## 🙏 Acknowledgments

- **MedGemma** - Medical Vision