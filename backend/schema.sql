-- Enable Foreign Keys
PRAGMA foreign_keys = ON;
-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(
        role IN (
            'PATIENT',
            'DOCTOR',
            'PHARMACIST',
            'H HOSPITAL_ADMIN',
            'SYSTEM_ADMIN',
            'CHW'
        )
    ) NOT NULL,
    phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
-- Patient Profiles
CREATE TABLE IF NOT EXISTS patient_profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    date_of_birth DATE,
    gender TEXT,
    address TEXT,
    medical_history TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- Triage Logs
CREATE TABLE IF NOT EXISTS triage_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    symptoms TEXT NOT NULL,
    severity TEXT CHECK(severity IN ('LOW', 'MEDIUM', 'HIGH')) NOT NULL,
    recommended_action TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- Consultations
CREATE TABLE IF NOT EXISTS consultations (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL,
    doctor_id TEXT,
    status TEXT CHECK(
        status IN ('REQUESTED', 'ACTIVE', 'COMPLETED', 'CANCELLED')
    ) DEFAULT 'REQUESTED',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE
    SET NULL
);
CREATE INDEX IF NOT EXISTS idx_consultations_patient ON consultations(patient_id);
CREATE INDEX IF NOT EXISTS idx_consultations_doctor ON consultations(doctor_id);
-- Medical Records
CREATE TABLE IF NOT EXISTS medical_records (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL,
    doctor_id TEXT NOT NULL,
    diagnosis TEXT NOT NULL,
    prescription TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE NO ACTION
);
CREATE INDEX IF NOT EXISTS idx_records_patient ON medical_records(patient_id);
-- Emergency Events
CREATE TABLE IF NOT EXISTS emergency_events (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL,
    status TEXT CHECK(
        status IN ('TRIGGERED', 'IN_PROGRESS', 'RESOLVED')
    ) DEFAULT 'TRIGGERED',
    description TEXT,
    location TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolved_at DATETIME,
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_emergency_patient ON emergency_events(patient_id);