import db from '../../config/database';
import { AppError } from '../../middleware/error.middleware';
import { AuditService } from '../audit/audit.service';

/**
 * Timeline Service
 * Aggregates patient's triage, consultations, medical records, and emergencies
 * into a unified chronological timeline
 */
export class TimelineService {

    /**
     * Get complete patient timeline
     * Combines: Triage logs, Consultations, Medical Records, Emergency Events
     * Sorted by timestamp DESC (most recent first)
     */
    static async getPatientTimeline(patientId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            // Build union query to fetch all timeline events
            const query = `
                -- Triage Logs
                SELECT 
                    'TRIAGE' as type,
                    id,
                    user_id as patient_id,
                    symptoms as description,
                    severity,
                    recommended_action,
                    created_at as timestamp,
                    NULL as status,
                    NULL as doctor_name,
                    NULL as priority
                FROM triage_logs
                WHERE user_id = ?
                
                UNION ALL
                
                -- Consultations
                SELECT 
                    'CONSULTATION' as type,
                    c.id,
                    c.patient_id,
                    c.notes as description,
                    NULL as severity,
                    NULL as recommended_action,
                    c.created_at as timestamp,
                    c.status,
                    COALESCE(d.name, 'Unassigned') as doctor_name,
                    c.priority
                FROM consultations c
                LEFT JOIN users d ON c.doctor_id = d.id
                WHERE c.patient_id = ?
                
                UNION ALL
                
                -- Medical Records
                SELECT 
                    'RECORD' as type,
                    mr.id,
                    mr.patient_id,
                    mr.diagnosis as description,
                    NULL as severity,
                    mr.prescription as recommended_action,
                    mr.created_at as timestamp,
                    'CREATED' as status,
                    d.name as doctor_name,
                    NULL as priority
                FROM medical_records mr
                LEFT JOIN users d ON mr.doctor_id = d.id
                WHERE mr.patient_id = ?
                
                UNION ALL
                
                -- Emergency Events
                SELECT 
                    'EMERGENCY' as type,
                    id,
                    patient_id,
                    description,
                    NULL as severity,
                    location as recommended_action,
                    created_at as timestamp,
                    status,
                    NULL as doctor_name,
                    NULL as priority
                FROM emergency_events
                WHERE patient_id = ?
                
                ORDER BY timestamp DESC
            `;

            db.all(query, [patientId, patientId, patientId, patientId], (err, rows) => {
                if (err) {
                    console.error('Timeline query error:', err);
                    return reject(new AppError('Database error', 500));
                }

                const timeline = (rows || []).map((row: any) => {
                    const baseEvent = {
                        id: row.id,
                        type: row.type,
                        timestamp: row.timestamp
                    };

                    // Add type-specific data
                    switch (row.type) {
                        case 'TRIAGE':
                            return {
                                ...baseEvent,
                                data: {
                                    symptoms: row.description,
                                    severity: row.severity,
                                    recommended_action: row.recommended_action
                                }
                            };
                        case 'CONSULTATION':
                            return {
                                ...baseEvent,
                                data: {
                                    notes: row.description,
                                    status: row.status,
                                    doctor: row.doctor_name,
                                    priority: row.priority,
                                    priority_name: TimelineService.getPriorityName(row.priority)
                                }
                            };
                        case 'RECORD':
                            return {
                                ...baseEvent,
                                data: {
                                    diagnosis: row.description,
                                    prescription: row.recommended_action,
                                    doctor: row.doctor_name
                                }
                            };
                        case 'EMERGENCY':
                            return {
                                ...baseEvent,
                                data: {
                                    description: row.description,
                                    location: row.recommended_action,
                                    status: row.status
                                }
                            };
                        default:
                            return baseEvent;
                    }
                });

                // Log timeline access
                AuditService.log('', 'VIEW_TIMELINE', 'PATIENT', patientId, 'Patient timeline accessed', '');

                resolve(timeline);
            });
        });
    }

    /**
     * Get summary stats for timeline
     */
    static async getTimelineSummary(patientId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT
                    (SELECT COUNT(*) FROM triage_logs WHERE user_id = ?) as triage_count,
                    (SELECT COUNT(*) FROM consultations WHERE patient_id = ?) as consultation_count,
                    (SELECT COUNT(*) FROM medical_records WHERE patient_id = ?) as record_count,
                    (SELECT COUNT(*) FROM emergency_events WHERE patient_id = ?) as emergency_count,
                    (SELECT COUNT(*) FROM emergency_events WHERE patient_id = ? AND status = 'TRIGGERED') as active_emergencies,
                    (SELECT severity FROM triage_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 1) as latest_severity
            `;

            db.get(query, [patientId, patientId, patientId, patientId, patientId, patientId], (err, row: any) => {
                if (err) return reject(new AppError('Database error', 500));
                
                resolve({
                    total_events: (row?.triage_count || 0) + (row?.consultation_count || 0) + 
                                 (row?.record_count || 0) + (row?.emergency_count || 0),
                    triage_count: row?.triage_count || 0,
                    consultation_count: row?.consultation_count || 0,
                    record_count: row?.record_count || 0,
                    emergency_count: row?.emergency_count || 0,
                    active_emergencies: row?.active_emergencies || 0,
                    latest_severity: row?.latest_severity || 'UNKNOWN'
                });
            });
        });
    }

    /**
     * Helper: Map priority to name
     */
    private static getPriorityName(priority: number | null): string {
        if (priority === null) return 'N/A';
        switch (priority) {
            case 1:
                return 'HIGH';
            case 2:
                return 'MEDIUM';
            case 3:
                return 'LOW';
            default:
                return 'UNKNOWN';
        }
    }
}
