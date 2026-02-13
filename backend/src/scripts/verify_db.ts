import db from '../config/database';

const verify = async () => {
    console.log('🔍 Verifying Database Integrity...');

    // 1. Check Foreign Keys
    db.get('PRAGMA foreign_keys', (err, row: any) => {
        if (err) {
            console.error('❌ Error checking foreign_keys PRAGMA:', err.message);
        } else {
            console.log(`✅ PRAGMA foreign_keys = ${row.foreign_keys === 1 ? 'ON' : 'OFF'}`);
            if (row.foreign_keys !== 1) {
                console.error('⚠️ WARNING: Foreign keys are currently OFF! This is critical for integrity.');
            }
        }
    });

    // 2. Check Tables & Indexes
    const tables = [
        'users', 'patient_profiles', 'triage_logs', 'consultations', 'medical_records', 'emergency_events', 'audit_logs'
    ];

    tables.forEach(table => {
        db.all(`PRAGMA index_list(${table})`, (err, rows) => {
            if (err) console.error(`❌ Error checking indexes for ${table}:`, err.message);
            else {
                console.log(`\n📋 Indexes for ${table}:`);
                if (rows.length === 0) console.log('   (No indexes found)');
                rows.forEach((row: any) => {
                    console.log(`   - ${row.name} (Unique: ${row.unique === 1})`);
                });
            }
        });
    });

    // 3. Check Integrity
    db.all('PRAGMA integrity_check', (err, rows) => {
        if (err) console.error('❌ Integrity Check Failed:', err.message);
        else {
            console.log('\n🏥 Database Integrity Check:');
            rows.forEach((row: any) => {
                console.log(`   ${row.integrity_check}`);
            });
        }
    });
};

// Verification runs async, give it a moment
setTimeout(verify, 1000);
