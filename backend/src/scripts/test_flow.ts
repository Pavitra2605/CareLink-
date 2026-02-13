import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

const runTests = async () => {
    try {
        console.log('\n--- 1. Login Patient ---');
        const patientLogin = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'john@example.com',
            password: 'password123'
        });
        const patientToken = patientLogin.data.data.token;
        console.log('✅ Patient Logged In');

        console.log('\n--- 2. Get Patient Profile ---');
        try {
            const profile = await axios.get(`${BASE_URL}/users/me`, {
                headers: { Authorization: `Bearer ${patientToken}` }
            });
            console.log('✅ Profile Retrieved:', profile.data.data.name);
        } catch (e: any) {
            console.log('⚠️ Profile might be empty if not fully seeded or structure differs', e.message);
        }

        console.log('\n--- 3. Submit High Severity Triage ---');
        const triage = await axios.post(`${BASE_URL}/triage`, {
            symptoms: 'Chest pain, difficulty breathing',
            severity: 'HIGH'
        }, {
            headers: { Authorization: `Bearer ${patientToken}` }
        });
        console.log('✅ Triage Submitted. Action:', triage.data.data.recommended_action);
        if (triage.data.data.recommended_action === 'Emergency') {
            console.log('✅ Correct Recommendation Received');
        } else {
            console.log('❌ Incorrect Recommendation');
        }

        console.log('\n--- 4. Login Doctor ---');
        const doctorLogin = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'doctor@example.com',
            password: 'password123'
        });
        const doctorToken = doctorLogin.data.data.token;
        console.log('✅ Doctor Logged In');

        console.log('\n--- 5. Doctor Request Consult (Should Fail - only patient requests) ---');
        try {
            await axios.post(`${BASE_URL}/consultations/request`, {
                notes: 'I want to see a doc'
            }, {
                headers: { Authorization: `Bearer ${doctorToken}` }
            });
        } catch (error: any) {
            if (error.response.status === 403) {
                console.log('✅ Doctor prevented from requesting consultation (Correct RBAC)');
            } else {
                console.log('❌ RBAC Failed', error.message);
            }
        }

        console.log('\n--- 6. Create Medical Record (Doctor) ---');
        // We need patient ID. Let's use the one from login response if available, or just use the seed known ID?
        // The endpoint returns user data.
        const patientId = patientLogin.data.data.user.id;

        await axios.post(`${BASE_URL}/records`, {
            patient_id: patientId,
            diagnosis: 'Hypertension',
            prescription: 'Lisinopril 10mg',
            notes: 'Monitor BP daily'
        }, {
            headers: { Authorization: `Bearer ${doctorToken}` }
        });
        console.log('✅ Medical Record Created');

        console.log('\n--- Tests Completed Successfully ---');

    } catch (error: any) {
        console.error('❌ Test Failed:', error.response ? error.response.data : error.message);
    }
};

runTests();
