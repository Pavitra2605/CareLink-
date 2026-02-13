# CARELINK: End-to-End Implementation Plan & App Requirements

**Version:** 1.0  
**Date:** February 7, 2026  
**Author:** Senior Technical Program Manager & System Architect  
**Status:** Draft / For Review  

---

## 1️⃣ Project Overview & Scope

### 1.1 Executive Summary
CARELINK is a rural-first, offline-capable digital healthcare platform designed to bridge the gap between patients in low-connectivity areas and qualified medical professionals. By combining symptom triage, telemedicine, and emergency response into a lightweight mobile interface, CARELINK aims to reduce preventable mortality and improve healthcare access for underserved populations.

### 1.2 Core Problem
Rural populations face three critical barriers to healthcare:
1.  **Distance:** Physical remoteness from clinics and specialists.
2.  **Connectivity:** Unreliable internet infrastructure preventing standard telehealth solutions.
3.  **Triage Gap:** Lack of immediate guidance on whether symptoms require urgent care or home remedies.

### 1.3 Key Constraints & Assumptions
*   **Constraints:** High latency/intermittent bandwidth (2G/3G/Edge), low-end Android devices, low digital literacy users.
*   **Assumptions:** Shared device usage (community health workers), multi-lingual requirements, eventual consistency is acceptable for non-emergency data.

### 1.4 Scope Definition (Phase 1)
*   **In Scope:** User onboarding (OTP), Offline Symptom Check (Rule-based), Asynchronous Doctor Consultation (Voice/Text), Emergency SOS trigger, Local Health Record storage.
*   **Out of Scope:** Real-time 4K video conferencing, direct pharmacy e-commerce, automated prescription generation (without doctor sign-off), integration with national insurance backends (Phase 2).

---

## 2️⃣ Functional Requirements (App-Level)

### 2.1 User Onboarding & Authentication
*   **Core Functionality:** Phone number based login via OTP.
*   **User Actions:** Enter phone number, inputs OTP, selects language.
*   **Behavior:** Auto-detects SMS for OTP. Creates local user profile encrypted on device.
*   **Edge Cases:** No internet during first launch (allow guest mode for generic symptom check, block personalized features).

### 2.2 Symptom Input (Text & Voice)
*   **Core Functionality:** Collect patient symptoms to determine triage level.
*   **User Actions:** Select body part -> Select symptom OR hold "Mic" button to speak symptoms.
*   **Behavior:** Voice input uses on-device STT (Speech-to-Text) or compresses audio for delayed upload.
*   **Edge Cases:** Unrecognized voice input (fallback to visual icons).

### 2.3 Risk Assessment & Decision Logic
*   **Core Functionality:** Classify condition as Green (Home Care), Amber (Consult), or Red (Emergency).
*   **System Behavior:** Runs strictly on local Rule Engine. No server round-trip required for decision.
*   **Output:** Clear, color-coded instruction screen.

### 2.4 Doctor Consultation
*   **Core Functionality:** Connect patient with doctor.
*   **User Actions:** "Request Call Back" or "Start Chat".
*   **Behavior:**
    *   *Online:* WebRTC Audio call.
    *   *Offline:* Store message/request in queue; auto-sync when network is found.
*   **Edge Cases:** Call drops (auto-switch to async voice notes).

### 2.5 Emergency Detection & Response
*   **Core Functionality:** One-touch SOS.
*   **System Behavior:** Sends SMS immediately (GSM fallback) with GPS coordinates to pre-set contacts and central server. Triggers loud local alarm.

### 2.6 Digital Health Records
*   **Core Functionality:** View past consultations and basic vitals.
*   **System Behavior:** All records stored in encrypted SQLite. Syncs with MongoDB when online.

### 2.7 Offline Behavior & Data Sync
*   **Core Functionality:** "Always-on" feel.
*   **System Behavior:** Optimistic UI updates. Background sync worker (WorkManager) handles data replication. Conflict resolution favors "latest server write" for admin data, "append-only" for medical notes.

---

## 3️⃣ Non-Functional Requirements

### 3.1 Performance
*   **App Launch:** < 2 seconds on low-end Android (2GB RAM).
*   **Triage Result:** < 500ms (Local computation).
*   **Sync:** Completes < 5KB payload sync in under 30s on 2G.

### 3.2 Reliability
*   **Offline Availability:** 100% for Triage and Health Records.
*   **Crash Rate:** < 0.1% of sessions.
*   **Fault Tolerance:** Graceful degradation from Video -> Audio -> Voice Note -> Text.

### 3.3 Security & Privacy
*   **Data at Rest:** AES-256 encryption for SQLite database.
*   **Data in Transit:** TLS 1.3 enforced.
*   **Compliance:** HIPAA/GDPR compliant data handling; localized consent forms.

### 3.4 Accessibility
*   **Visual:** WCAG 2.1 AA contrast ratios. High-contrast mode support.
*   **Literacy:** Text-to-speech availability for all instruction screens.

---

## 4️⃣ Technical Architecture Planning

### 4.1 High-Level Architecture
**Hybrid Offline-First Model**
*   **Mobile (Client):** React Native + WatermelonDB/SQLite. Acts as the "source of truth" regarding user intent while offline.
*   **API Gateway:** NGINX/Kong. Routes traffic, handles SSL termination and rate limiting.
*   **Backend (Microservices):** Node.js Services (Auth, Triage, Consult, Records).
*   **Async Layer:** RabbitMQ/Redis for handling consultation requests and sync jobs.

### 4.2 Data Flow
1.  **Symptom Check:** User Input -> Local Rule Engine (JSON Logic) -> UI Result (Instant).
2.  **Consultation:** User Request -> Local Queue -> Network Job -> API Gateway -> Consultation Service -> Doctor Dashboard.
3.  **Emergency:** User SOS -> SMS Gateway (Direct) + API (if online).

### 4.3 Why this meets Rural needs?
*   Decoupling the *decision* (triage) from the *connection* (server) ensures safety even in dead zones.
*   Microservices allow independent scaling (e.g., scaling the Triage service during flu season without affecting the Records service).

---

## 5️⃣ Data & State Management Plan

### 5.1 Storage Strategy
*   **Local (Device):** User Profile, Cached Static Content (First Aid guides), Last 50 Consultations, Pending Sync Queue.
*   **Backend (Cloud):** Full longitudinal health record, anonymized aggregate data for analytics, Doctor availability schedules.

### 5.2 Sync Strategy
*   **Technique:** "Store-and-Forward" with Delta Sync. Only changes (deltas) are sent to save bandwidth.
*   **Trigger:** Network connectivity change event + Periodic background job (every 15 min).
*   **Conflict Resolution:** Last-Write-Wins (LWW) with timestamp precision for metadata. Manual merge required for conflicting clinical notes (flagged to doctor).

---

## 6️⃣ AI / Decision Logic Planning (Safety-First)

### 6.1 Clinical Safety Engine
*   **Logic:** Deterministic "If-This-Then-That" logic trees (embedded JSON) curated by medical professionals.
*   **Restriction:** NO generative AI for diagnosis. Generative AI is ONLY allowed for "Translation" and "Summarization" of doctor notes.

### 6.2 Risk Classification
*   **Red (Emergency):** Keywords: "Chest pain", "Unconscious", "Bleeding heavy". Action: Trigger SOS, Direct to Hospital map.
*   **Amber (Urgent):** High fever > 3 days. Action: Connect to Doctor Queue (Priority).
*   **Green (Home Care):** Mild cold. Action: Show home remedies, schedule follow-up.

### 6.3 Fail-Safe
*   If the user input is ambiguous or confidence is low -> Default to **Amber (Consult Doctor)**. Better to over-alert than under-diagnose.

---

## 7️⃣ UX-Driven Implementation Planning

### 7.1 Core User Journeys
1.  **"My child has a fever"** -> Open App -> Tap Microphone -> Say "Child high fever" -> Local Logic detects keywords -> Shows "Amber" Alert -> Prompt "Call Doctor".
2.  **"No Internet Consult"** -> Open App -> Record message -> App saves locally -> Shows "Waiting for Network" icon -> Auto-uploads when signal returns -> Notification when Doctor replies.

### 7.2 Critical UX Constraints
*   **The "One Thumb" Rule:** Primary action is always bottom-center.
*   **Visual Language:** Use Red circles for stop/danger, Green for go/safe. Icons must be culturally relevant (local imagery).

---

## 8️⃣ Development Phases & Timeline

### Phase 1: MVP (Months 1-3)
*   **Goal:** Life-saving triage and basic connection.
*   **Deliverables:** Auth, Local Symptom Checker (Rule-based), SOS Button, Basic Patient Profile.
*   **Validation:** Successful offline assessment + SMS emergency trigger in field test.

### Phase 2: Telemedicine Expansion (Months 4-6)
*   **Goal:** Doctor loop closure.
*   **Deliverables:** Async Chat/Voice Notes, Doctor Dashboard (Web), Prescription view, Sync Engine optimization.

### Phase 3: Scale & Intelligence (Months 7+)
*   **Goal:** Efficiency and Ecosystem.
*   **Deliverables:** Video calls, Automated Voice Triage (NLP), Pharmacy integrations, Regional expansion.

---

## 9️⃣ Team Roles & Responsibilities

*   **Frontend (Mobile):** React Native perf optimization, Offline DB schema (SQLite), UI Component implementation.
*   **Backend:** API design, Database sharding, Security implementation, Sync logic.
*   **Clinical/Product:** Defining medical rule-sets, testing triage accuracy, safety logic verification.
*   **QA/SDET:** Network throttling simulation, Device fragmentation testing, "Chaos Monkey" for sync interruption.

---

## 🔟 Risks, Dependencies & Mitigation

| Risk Category | Risk Description | Impact | Likelihood | Mitigation Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **Technical** | Sync fails during critical update | High | Medium | Implement "Ack" (Acknowledge) receipts; Retry with exponential backoff. |
| **Operational** | Doctors not available | High | High | Implement "Shift" system; Route to backup call center if timeout > 10 min. |
| **User** | Misunderstanding UI icons | High | Medium | Audio-guidance overlay on first launch; Field UXR testing. |
| **Infrastructure** | Permanent data loss on device | Medium | Low | Force cloud backup when on WiFi; Encrypted local backups. |

---

## 1️⃣1️⃣ Validation & Success Criteria

### 11.1 Functional Validation
*   [ ] User can complete symptom check in Airplane mode.
*   [ ] Sync recovers 100% of data after forced app kill during upload.
*   [ ] SOS SMS received within 10 seconds.

### 11.2 Success Metrics (KPIs)
*   **Triage Accuracy:** 100% agreement with established medical protocols for Red flags.
*   **Offline Utility:** 80% of app features usable with 0kbps bandwidth.
*   **Latency:** <2s time-to-interactive on cold start.

---

## 1️⃣2️⃣ Final Output & Handoff
This document serves as the **Master Deployment Blueprint**.
*   **Engineers:** Use Section 4 & 5 for system design.
*   **Product:** Use Section 2 & 7 for backlog grooming.
*   **QA:** Use Section 3 & 11 for test plan creation.
