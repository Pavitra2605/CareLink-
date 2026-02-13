-- Enable Foreign Keys (Must be run on every connection, but good to document)
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
            'HOSPITAL_ADMIN',
            'SYSTEM_ADMIN',
            'CHW'
        )
    ) NOT NULL,
    phone TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
-- Patient Profiles
CREATE TABLE IF NOT EXISTS patient_profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    date_of_birth DATE NOT NULL,
    gender TEXT NOT NULL,
    address TEXT NOT NULL,
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
CREATE INDEX IF NOT EXISTS idx_triage_user ON triage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_triage_severity ON triage_logs(severity);
CREATE INDEX IF NOT EXISTS idx_triage_user_created ON triage_logs(user_id, created_at DESC);
-- Consultations
CREATE TABLE IF NOT EXISTS consultations (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL,
    doctor_id TEXT,
    status TEXT CHECK(
        status IN ('REQUESTED', 'ACTIVE', 'COMPLETED', 'CANCELLED')
    ) DEFAULT 'REQUESTED',
    priority INTEGER CHECK(priority IN (1, 2, 3)) DEFAULT 3,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE
    SET NULL
);
CREATE INDEX IF NOT EXISTS idx_consultations_patient ON consultations(patient_id);
CREATE INDEX IF NOT EXISTS idx_consultations_doctor ON consultations(doctor_id);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);
CREATE INDEX IF NOT EXISTS idx_consultations_priority ON consultations(priority);
CREATE INDEX IF NOT EXISTS idx_consultations_priority_status ON consultations(priority, status);
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
CREATE INDEX IF NOT EXISTS idx_records_doctor ON medical_records(doctor_id);
-- Emergency Events
CREATE TABLE IF NOT EXISTS emergency_events (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL,
    triage_id TEXT,
    status TEXT CHECK(
        status IN ('TRIGGERED', 'IN_PROGRESS', 'RESOLVED')
    ) DEFAULT 'TRIGGERED',
    description TEXT,
    location TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolved_at DATETIME,
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (triage_id) REFERENCES triage_logs(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_emergency_patient ON emergency_events(patient_id);
CREATE INDEX IF NOT EXISTS idx_emergency_status ON emergency_events(status);
CREATE INDEX IF NOT EXISTS idx_emergency_created ON emergency_events(created_at DESC);
-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT NOT NULL,
    details TEXT,
    ip_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_resource ON audit_logs(resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_date ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_user_date ON audit_logs(user_id, created_at DESC);