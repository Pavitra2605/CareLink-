# CARELINK - FINALIZED IMPLEMENTATION PLAN & TECH STACK

**Version:** 2.0 - FINAL  
**Date:** February 12, 2026  
**Status:** ✅ APPROVED FOR DEVELOPMENT  

---

## 📋 EXECUTIVE SUMMARY

**CARELINK** is an offline-first, rural-focused digital healthcare platform designed to save lives by bridging the healthcare gap in low-connectivity areas. The platform combines intelligent symptom triage, asynchronous telemedicine, and emergency response in a lightweight mobile application.

### Core Innovation
- **Works offline** - Critical features function without internet
- **Safety-first** - Rule-based medical decision engine (no AI diagnosis)
- **Accessible** - Voice-enabled, multilingual, low-literacy friendly
- **Emergency-ready** - One-touch SOS with SMS fallback

---

## 🎯 PROJECT GOALS & SUCCESS METRICS

### Primary Goals
1. Reduce preventable mortality in rural areas
2. Provide immediate medical guidance without internet dependency
3. Connect patients with doctors asynchronously
4. Enable rapid emergency response

### Success Metrics (Phase 1)
- ✅ 100% offline functionality for symptom triage
- ✅ <2 seconds app launch time on low-end devices
- ✅ <500ms triage result computation
- ✅ <10 seconds emergency SMS delivery
- ✅ 80% feature availability at 0kbps bandwidth
- ✅ 100% accuracy for red-flag symptom detection

---

## 🏗️ FINALIZED ARCHITECTURE

### Architecture Pattern
**Offline-First Hybrid Architecture with Event-Driven Backend**

```
┌─────────────────────────────────────────────────────────┐
│                    MOBILE CLIENT                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ React Native + SQLite (Encrypted)                │  │
│  │ - Local Rule Engine (JSON Logic)                 │  │
│  │ - Redux State Management                         │  │
│  │ - WorkManager (Background Sync)                  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↕ (TLS 1.3)
┌─────────────────────────────────────────────────────────┐
│                   API GATEWAY LAYER                      │
│         NGINX/Kong + Rate Limiting + SSL                │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│                MICROSERVICES BACKEND                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │   Auth   │  │ Triage   │  │ Consult  │             │
│  │ Service  │  │ Service  │  │ Service  │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Records  │  │Emergency │  │ Notify   │             │
│  │ Service  │  │ Service  │  │ Service  │             │
│  └──────────┘  └──────────┘  └──────────┘             │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│              DATA & MESSAGE LAYER                        │
│  PostgreSQL | MongoDB | Redis | RabbitMQ                │
└─────────────────────────────────────────────────────────┘
```

### Why This Architecture?
- **Offline-First**: Device acts as source of truth until sync
- **Microservices**: Independent scaling per service
- **Event-Driven**: Handles async consultations efficiently
- **Resilient**: Graceful degradation (Video→Audio→Voice→Text→SMS)

---

## 💻 FINALIZED TECH STACK

### 📱 MOBILE APPLICATION (PRIMARY PLATFORM)

#### Core Framework
- **Framework**: React Native 0.74+
- **Language**: TypeScript
- **Build Tool**: Metro Bundler
- **Target**: Android (Primary) | iOS (Phase 2)

#### State Management & Data
- **State**: Redux Toolkit
- **Local Database**: WatermelonDB + SQLite
- **Encryption**: SQLCipher (AES-256)
- **Offline Queue**: Redux Persist + Background Sync

#### UI/UX Components
- **Design System**: React Native Paper (customized)
- **Navigation**: React Navigation 6.x
- **Icons**: React Native Vector Icons
- **Animations**: React Native Reanimated 3

#### Device Features
- **Voice Input**: react-native-voice / Web Speech API
- **Audio/Video**: react-native-webrtc
- **Location**: react-native-geolocation
- **SMS**: react-native-sms
- **Network Detection**: @react-native-community/netinfo

#### Background Processing
- **Sync Worker**: React Native Background Fetch
- **Task Scheduling**: @shopify/react-native-background-job

---

### 🌐 BACKEND SERVICES

#### API Layer
- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js 4.x
- **Language**: TypeScript
- **API Gateway**: Kong / NGINX
- **API Style**: RESTful + WebSocket (emergency)

#### Microservices
1. **Auth Service**: JWT + OTP validation
2. **Triage Service**: Rule engine execution
3. **Consultation Service**: Doctor-patient matching
4. **Records Service**: Health data CRUD
5. **Emergency Service**: SOS coordination
6. **Notification Service**: FCM + SMS gateway

#### Communication
- **Real-time**: WebRTC (audio/video)
- **Fallback**: Twilio/MessageBird (SMS)
- **Message Queue**: RabbitMQ
- **Cache**: Redis 7.x

---

### 🗄️ DATA STORAGE

#### Databases
- **User Data**: PostgreSQL 15 (Relational)
- **Medical Records**: MongoDB 7 (Document)
- **Cache & Sessions**: Redis
- **File Storage**: AWS S3 / Azure Blob (prescriptions, images)

#### Data Sync Strategy
- **Method**: Delta Sync (only changes sent)
- **Trigger**: Network change + 15-min intervals
- **Conflict Resolution**: Last-Write-Wins (LWW) + Timestamp
- **Compression**: Gzip for payloads

---

### 🧠 DECISION ENGINE (SAFETY-FIRST)

#### Triage Logic
- **Type**: Deterministic Rule-Based Engine
- **Format**: JSON Logic Trees (embedded)
- **Execution**: Client-side (instant, offline)
- **Curated By**: Medical professionals

#### Risk Classification
- 🔴 **RED (Emergency)**: Chest pain, unconscious, severe bleeding → SOS
- 🟡 **AMBER (Urgent)**: High fever >3 days, persistent pain → Doctor queue
- 🟢 **GREEN (Home Care)**: Mild symptoms → Home remedies

#### Fail-Safe Rule
> **Default to AMBER when uncertain** - Better to over-alert than miss critical symptoms

#### NO GENERATIVE AI FOR DIAGNOSIS
- AI only for: Translation, Summarization, Voice-to-Text
- All diagnosis remains rule-based for safety

---

### 🔒 SECURITY & PRIVACY

#### Encryption
- **At Rest**: AES-256 (SQLCipher)
- **In Transit**: TLS 1.3
- **Keys**: Secure Enclave / Keystore

#### Authentication
- **Method**: Phone OTP (Firebase Auth)
- **Session**: JWT with refresh tokens
- **Expiry**: 7 days (refresh), 1 hour (access)

#### Authorization
- **Model**: Role-Based Access Control (RBAC)
- **Roles**: Patient, Doctor, Admin, Health Worker

#### Compliance
- ✅ HIPAA compliant
- ✅ GDPR ready
- ✅ Localized consent forms
- ✅ Audit logs for all medical data access

---

### 🔔 NOTIFICATIONS & MESSAGING

#### Push Notifications
- **Service**: Firebase Cloud Messaging (FCM)
- **Types**: Appointment reminders, doctor replies, medication alerts

#### SMS Fallback
- **Provider**: Twilio / MessageBird
- **Use Cases**: OTP, Emergency alerts, No-app-access scenarios

#### Emergency Protocol
1. **Trigger**: SOS button press
2. **Action**: 
   - Send SMS with GPS to pre-set contacts
   - Alert nearest hospital API
   - Trigger loud device alarm
   - Log to backend (if online)

---

### 🧪 TESTING STRATEGY

#### Test Types
- **Unit Tests**: Jest (Frontend), Mocha (Backend)
- **Integration**: Supertest (API), Detox (E2E Mobile)
- **Offline Simulation**: Network throttling tools
- **Device Testing**: Firebase Test Lab (Android fragmentation)
- **Security**: OWASP ZAP, Penetration testing

#### Critical Test Scenarios
1. ✅ Symptom check works in airplane mode
2. ✅ Data recovery after app crash during sync
3. ✅ Emergency SMS delivered in <10s
4. ✅ Triage accuracy matches medical protocols
5. ✅ Sync completes <30s on 2G network

---

### ⚙️ DEVOPS & DEPLOYMENT

#### Infrastructure
- **Cloud Provider**: AWS (Primary) / Azure (Backup)
- **Containerization**: Docker
- **Orchestration**: Kubernetes (EKS)
- **CDN**: CloudFront (static assets)

#### CI/CD Pipeline
- **Platform**: GitHub Actions
- **Stages**: 
  1. Lint & Type Check
  2. Unit Tests
  3. Build & Containerize
  4. Deploy to Staging
  5. Integration Tests
  6. Production Deploy (Blue-Green)

#### Monitoring & Logging
- **Metrics**: Prometheus + Grafana
- **Logs**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **APM**: New Relic / Datadog
- **Error Tracking**: Sentry

#### Scalability
- **Horizontal scaling** for all services
- **Auto-scaling** based on CPU/Memory
- **Database sharding** for user data
- **CDN caching** for static content

---

## 📅 DEVELOPMENT PHASES

### 🚀 Phase 1: MVP (Months 1-3) - **CURRENT FOCUS**

#### Sprint 1-2: Foundation (Weeks 1-4)
- ✅ Project setup (React Native + Node.js)
- ✅ Authentication (Phone OTP)
- ✅ SQLite database setup
- ✅ Basic UI framework

#### Sprint 3-4: Core Triage (Weeks 5-8)
- ✅ Symptom input (text + voice)
- ✅ Local rule engine
- ✅ Risk classification (Red/Amber/Green)
- ✅ Offline functionality validation

#### Sprint 5-6: Emergency & Sync (Weeks 9-12)
- ✅ SOS button implementation
- ✅ SMS gateway integration
- ✅ Basic patient profile
- ✅ Background sync worker
- ✅ Field testing preparation

**MVP Deliverables**:
- Offline symptom checker
- Emergency SOS with SMS
- Basic health profile
- Android APK (sideload)

---

### 📈 Phase 2: Telemedicine (Months 4-6)

#### Features
- Doctor dashboard (web app)
- Async chat/voice messages
- WebRTC audio calls
- Prescription view/download
- Sync optimization (delta sync)
- Queue management

**Deliverables**:
- Doctor-patient connection
- Consultation history
- Prescription system
- Play Store release (Alpha)

---

### 🌟 Phase 3: Scale & Intelligence (Months 7+)

#### Features
- Video consultations (WebRTC)
- Voice-only navigation mode
- Pharmacy integration
- Regional language expansion
- Predictive reminders
- Analytics dashboard

**Deliverables**:
- Full telemedicine platform
- Multi-state deployment
- Partnerships with hospitals/pharmacies

---

## 👥 TEAM STRUCTURE

### Development Team
- **1x Tech Lead**: Architecture, code review
- **2x Frontend (React Native)**: Mobile UI, offline sync
- **2x Backend (Node.js)**: Microservices, APIs
- **1x DevOps**: Infrastructure, CI/CD
- **1x QA/SDET**: Testing, automation

### Product Team
- **1x Product Manager**: Roadmap, stakeholders
- **1x Clinical Advisor**: Medical protocols, triage rules
- **1x UX Designer**: User research, UI design

### External Partners
- **SMS Gateway Provider**: Twilio/MessageBird
- **Cloud Provider**: AWS
- **Medical Consultants**: Triage validation

---

## 🚨 RISKS & MITIGATION

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| Sync fails during critical update | High | Medium | ACK receipts + Exponential backoff |
| Doctors unavailable | High | High | Shift system + Backup call center |
| User misunderstands icons | High | Medium | Audio guidance + Field testing |
| Device data loss | Medium | Low | Force cloud backup on WiFi |
| Network latency spikes | Medium | High | Graceful degradation (Video→SMS) |
| Security breach | High | Low | Encryption + Regular audits |

---

## ✅ ACCEPTANCE CRITERIA

### Functional Requirements
- [ ] Symptom check works in airplane mode
- [ ] Sync recovers 100% after forced app kill
- [ ] SOS SMS delivered in <10 seconds
- [ ] App launches in <2 seconds on 2GB RAM device
- [ ] Triage result in <500ms

### Performance Requirements
- [ ] App size: <20MB
- [ ] RAM usage: <150MB
- [ ] Battery drain: <5% per hour (idle)
- [ ] Sync payload: <5KB (incremental)

### Security Requirements
- [ ] All data encrypted at rest (AES-256)
- [ ] All API calls use TLS 1.3
- [ ] No PHI stored in logs
- [ ] Consent collected before any data sharing

---

## 📚 KEY DOCUMENTS REFERENCE

1. **Implementation Plan**: [CARELINK_Implementation_Plan.md](CARELINK_Implementation_Plan.md)
2. **Tech Stack**: [techstack.txt](techstack.txt)
3. **UX Guidelines**: [ux.txt](ux.txt)
4. **Wireframes**: [wireframe_UX.txt](wireframe_UX.txt)

---

## 🎯 NEXT IMMEDIATE ACTIONS

### Week 1-2: Setup
1. ✅ Initialize React Native project
2. ✅ Setup Node.js microservices skeleton
3. ✅ Configure PostgreSQL + MongoDB
4. ✅ Setup CI/CD pipeline basics
5. ✅ Create Firebase project for Auth

### Week 3-4: Core Development
1. ✅ Implement phone OTP authentication
2. ✅ Build symptom input screen (text + voice)
3. ✅ Integrate local SQLite database
4. ✅ Create rule engine (JSON logic)
5. ✅ Implement offline detection

### Week 5-6: Triage System
1. ✅ Build risk classification logic
2. ✅ Design result screens (Red/Amber/Green)
3. ✅ Add home remedy recommendations
4. ✅ Test offline functionality

### Week 7-8: Emergency
1. ✅ Implement SOS button
2. ✅ Integrate SMS gateway
3. ✅ Add GPS location capture
4. ✅ Test emergency flow end-to-end

---

## 💡 TECHNICAL DECISIONS RATIONALE

### Why React Native?
- Cross-platform code sharing (Android/iOS)
- Large community and library ecosystem
- Good performance for business logic apps
- Easier to find developers

### Why Node.js Backend?
- JavaScript/TypeScript consistency with frontend
- Non-blocking I/O ideal for real-time features
- Large package ecosystem (npm)
- Easy microservices implementation

### Why PostgreSQL + MongoDB?
- PostgreSQL: Structured user data, transactions
- MongoDB: Flexible medical records schema
- Best of both worlds (relational + document)

### Why SQLite on Device?
- Zero-config embedded database
- Excellent offline performance
- Built-in encryption (SQLCipher)
- Cross-platform support

### Why Rule-Based (Not AI)?
- Medical safety requires deterministic decisions
- No "black box" behavior
- Easier to validate and audit
- Faster inference (no model loading)
- Works offline instantly

---

## 📊 PROJECT TIMELINE SUMMARY

```
Month 1-3  : MVP (Offline Triage + Emergency)
Month 4-6  : Telemedicine (Doctor Connection)
Month 7-9  : Scale (Video, Analytics, Integrations)
Month 10+  : Regional Expansion & Partnerships
```

---

## 🏁 DEFINITION OF DONE

### Phase 1 MVP is Complete When:
✅ User can register with phone OTP  
✅ User can check symptoms offline  
✅ User receives accurate triage (Red/Amber/Green)  
✅ User can trigger emergency SOS  
✅ SMS sent with GPS coordinates  
✅ Data syncs when network returns  
✅ App tested on 10+ low-end devices  
✅ Security audit passed  
✅ Field test with 50+ real users  

---

## 🎓 LESSONS & BEST PRACTICES

### Development Guidelines
1. **Mobile First**: Test on slowest device first
2. **Offline First**: Every feature must handle no network
3. **Security First**: Encrypt everything, trust no input
4. **Accessibility First**: Test with screen readers, voice nav

### Code Standards
- TypeScript strict mode enabled
- ESLint + Prettier configured
- 80%+ test coverage target
- Code review required for all PRs
- Documentation in code (TSDoc)

---

## 📞 SUPPORT & ESCALATION

### Technical Issues
- **Frontend**: Mobile Team Lead
- **Backend**: API Team Lead
- **DevOps**: Infrastructure Lead

### Product Issues
- **Feature Clarification**: Product Manager
- **Medical Protocol**: Clinical Advisor
- **UX Questions**: UX Designer

### Emergency Escalation
- **Critical Bug**: Immediately to Tech Lead
- **Security Issue**: CISO + Tech Lead
- **Compliance Issue**: Legal + Product Manager

---

## 🌟 VISION STATEMENT

> "CARELINK aims to make quality healthcare accessible to every person, regardless of their location, connectivity, or economic status. By leveraging technology thoughtfully and prioritizing offline-first design, we will save lives and improve health outcomes in underserved communities."

---

## ✍️ APPROVAL & SIGN-OFF

- [ ] **Tech Lead**: Architecture Approved
- [ ] **Product Manager**: Requirements Validated
- [ ] **Clinical Advisor**: Medical Safety Verified
- [ ] **UX Designer**: User Experience Validated
- [ ] **DevOps Lead**: Infrastructure Ready
- [ ] **QA Lead**: Test Strategy Approved

**Date of Approval**: _________________

**Ready for Development**: ✅ **YES** / ⬜ NO

---

## 📝 VERSION HISTORY

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | Feb 7, 2026 | Initial draft | Technical Program Manager |
| 2.0 | Feb 12, 2026 | **Finalized with all tech stack decisions** | System Architect |

---

**Document Status**: ✅ **FINALIZED & APPROVED FOR IMPLEMENTATION**

**Next Review Date**: After Phase 1 MVP Completion (May 2026)

---

*This document is the single source of truth for CARELINK implementation. All development work should reference and align with this plan.*
