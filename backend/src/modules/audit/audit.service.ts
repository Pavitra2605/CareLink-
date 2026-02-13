import db from '../../config/database';
import { v4 as uuidv4 } from 'uuid';

export class AuditService {
    static log(userId: string, action: string, resourceType: string, resourceId: string, details?: string, ip?: string) {
        // Fire and forget - don't await in critical path usually, but here we can just run it.
        const id = uuidv4();
        const detailsStr = details ? JSON.stringify(details) : null;

        db.run(
            'INSERT INTO audit_logs (id, user_id, action, resource_type, resource_id, details, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, userId, action, resourceType, resourceId, detailsStr, ip],
            (err) => {
                if (err) {
                    console.error('Failed to write audit log:', err.message);
                }
            }
        );
    }
}
