import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

interface TestResult {
    name: string;
    success: boolean;
    message: string;
}

const results: TestResult[] = [];

async function test(name: string, fn: () => Promise<any>): Promise<void> {
    try {
        await fn();
        results.push({ name, success: true, message: 'Passed' });
        console.log(`✅ ${name}`);
    } catch (error: any) {
        results.push({ 
            name, 
            success: false, 
            message: error?.response?.data?.message || error?.message || 'Unknown error' 
        });
        console.log(`❌ ${name}: ${error?.response?.data?.message || error?.message}`);
    }
}

async function runTests() {
    console.log('\n🚀 LAYER 2 ENHANCEMENTS TEST SUITE\n');

    let patientToken = '';
    let doctorToken = '';
    let triageId = '';
    let consultationId = '';
    let emergencyId = '';

    // TEST 1: Register Patient
    await test('Register Patient', async () => {
        const response = await axios.post(`${BASE_URL}/auth/register`, {
            name: 'Jane Patient L2',
            email: `jane-l2-${Date.now()}@test.com`,
            password: 'password123',
            role: 'PATIENT',
            phone: '+1-555-111-1111'
        });
        patientToken = response.data.data.token;
        if (!patientToken) throw new Error('No token received');
    });

    // TEST 2: Register Doctor
    await test('Register Doctor', async () => {
        const response = await axios.post(`${BASE_URL}/auth/register`, {
            name: 'Dr. Smith L2',
            email: `docsmith-l2-${Date.now()}@test.com`,
            password: 'password123',
            role: 'DOCTOR',
            phone: '+1-555-222-2222'
        });
        doctorToken = response.data.data.token;
        if (!doctorToken) throw new Error('No token received');
    });

    // TEST 3: Create HIGH severity triage (should auto-escalate)
    await test('Create HIGH Severity Triage (Auto-escalation)', async () => {
        const response = await axios.post(`${BASE_URL}/triage`, {
            symptoms: 'Severe chest pain, difficulty breathing',
            severity: 'HIGH'
        }, {
            headers: { Authorization: `Bearer ${patientToken}` }
        });

        triageId = response.data.data.id;
        if (!response.data.data.autoEscalated) {
            throw new Error('Should be auto-escalated');
        }
    });

    // TEST 4: Verify Emergency Auto-Created
    await test('Verify Emergency Auto-Escalation', async () => {
        // Give system time to create emergency
        await new Promise(r => setTimeout(r, 500));
        
        const response = await axios.get(`${BASE_URL}/emergency/me`, {
            headers: { Authorization: `Bearer ${patientToken}` }
        });

        if (response.data.data.length === 0) {
            throw new Error('No emergency events found');
        }
        emergencyId = response.data.data[0].id;
    });

    // TEST 5: Request Consultation (should be Priority 1 due to HIGH triage)
    await test('Request Consultation with Auto-Priority', async () => {
        const response = await axios.post(`${BASE_URL}/consultations/request`, {
            notes: 'Need urgent consultation'
        }, {
            headers: { Authorization: `Bearer ${patientToken}` }
        });

        consultationId = response.data.data.id;
        if (response.data.data.priority !== 1) {
            throw new Error(`Expected priority 1, got ${response.data.data.priority}`);
        }
    });

    // TEST 6: Get Doctor Queue (should see pending consultation)
    await test('Get Doctor Queue', async () => {
        const response = await axios.get(`${BASE_URL}/consultations/queue`, {
            headers: { Authorization: `Bearer ${doctorToken}` }
        });

        if (!Array.isArray(response.data.data) || response.data.data.length === 0) {
            throw new Error('Queue should not be empty');
        }

        const consultation = response.data.data.find((c: any) => c.consultation_id === consultationId);
        if (!consultation) {
            throw new Error('Consultation not found in queue');
        }

        if (consultation.priority !== 1) {
            throw new Error('Consultation should have priority 1');
        }
    });

    // TEST 7: Accept Consultation
    await test('Doctor Accept Consultation', async () => {
        const response = await axios.patch(
            `${BASE_URL}/consultations/${consultationId}/status`,
            { status: 'ACTIVE' },
            { headers: { Authorization: `Bearer ${doctorToken}` } }
        );

        if (response.data.data.status !== 'ACTIVE') {
            throw new Error('Consultation should be ACTIVE');
        }
    });

    // TEST 8: Get Patient Timeline
    await test('Get Patient Timeline', async () => {
        const userResponse = await axios.get(`${BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${patientToken}` }
        });

        const response = await axios.get(
            `${BASE_URL}/patients/${userResponse.data.data.id}/timeline`,
            { headers: { Authorization: `Bearer ${patientToken}` } }
        );

        const timeline = response.data.data.timeline;
        if (!Array.isArray(timeline)) {
            throw new Error('Timeline should be an array');
        }

        // Should have triage and consultation events
        const types = timeline.map((e: any) => e.type);
        if (!types.includes('TRIAGE')) {
            throw new Error('Timeline should include TRIAGE events');
        }
    });

    // TEST 9: Get Admin Metrics
    await test('Get Admin Metrics (requires SYSTEM_ADMIN)', async () => {
        // Register admin
        const adminResponse = await axios.post(`${BASE_URL}/auth/register`, {
            name: 'Admin User L2',
            email: `admin-l2-${Date.now()}@test.com`,
            password: 'password123',
            role: 'SYSTEM_ADMIN',
            phone: '+1-555-333-3333'
        });

        const adminToken = adminResponse.data.data.token;

        const metricsResponse = await axios.get(`${BASE_URL}/admin/metrics`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });

        const data = metricsResponse.data.data;
        if (!data.users || !data.consultations || !data.triage) {
            throw new Error('Invalid metrics structure');
        }

        if (data.consultations.total < 1) {
            throw new Error('Should have at least 1 consultation');
        }
    });

    // TEST 10: Complete Consultation
    await test('Doctor Complete Consultation', async () => {
        const response = await axios.patch(
            `${BASE_URL}/consultations/${consultationId}/status`,
            { status: 'COMPLETED' },
            { headers: { Authorization: `Bearer ${doctorToken}` } }
        );

        if (response.data.data.status !== 'COMPLETED') {
            throw new Error('Consultation should be COMPLETED');
        }
    });

    // TEST 11: Verify Timeline Updated
    await test('Verify Timeline Includes Completed Consultation', async () => {
        // Use the first patient ID from earlier tests
        const getResponse = await axios.get(`${BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${patientToken}` }
        });

        const timelineResponse = await axios.get(
            `${BASE_URL}/patients/${getResponse.data.data.id}/timeline`,
            { headers: { Authorization: `Bearer ${patientToken}` } }
        );

        const timeline = timelineResponse.data.data.timeline;
        const completedConsultation = timeline.find(
            (e: any) => e.type === 'CONSULTATION' && e.data.status === 'COMPLETED'
        );

        if (!completedConsultation) {
            throw new Error('Timeline should include completed consultation');
        }
    });

    // TEST 12: Test Access Control
    await test('Verify Timeline Access Control (Patient cant view other timelines)', async () => {
        try {
            // Register another patient
            const anotherPatientResponse = await axios.post(`${BASE_URL}/auth/register`, {
                name: 'Another Patient',
                email: `other-${Date.now()}@test.com`,
                password: 'password123',
                role: 'PATIENT',
                phone: '+1-555-444-4444'
            });

            const anotherPatientId = anotherPatientResponse.data.data.user.id;
            const anotherToken = anotherPatientResponse.data.data.token;

            // Try to access with our patient token
            await axios.get(
                `${BASE_URL}/patients/${anotherPatientId}/timeline`,
                { headers: { Authorization: `Bearer ${patientToken}` } }
            );

            throw new Error('Should have been denied');
        } catch (error: any) {
            if (error?.response?.status !== 403) {
                throw error;
            }
        }
    });

    // SUMMARY
    console.log('\n' + '='.repeat(60));
    console.log('TEST SUMMARY');
    console.log('='.repeat(60));

    const passed = results.filter(r => r.success).length;
    const total = results.length;

    results.forEach(r => {
        console.log(`${r.success ? '✅' : '❌'} ${r.name}`);
    });

    console.log('\n' + '='.repeat(60));
    console.log(`RESULTS: ${passed}/${total} tests passed`);
    console.log('='.repeat(60) + '\n');

    if (passed === total) {
        console.log('🎉 ALL LAYER 2 TESTS PASSED!\n');
    } else {
        console.log(`⚠️  ${total - passed} test(s) failed\n`);
    }

    process.exit(passed === total ? 0 : 1);
}

// Run tests
runTests().catch(error => {
    console.error('Test suite error:', error);
    process.exit(1);
});
