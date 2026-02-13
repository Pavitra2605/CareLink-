import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'CareLink Healthcare API',
            version: '3.0.0',
            description: 'Comprehensive healthcare management system with intelligent workflow orchestration',
            contact: {
                name: 'CareLink Team',
                email: 'support@carelink.local'
            },
            license: {
                name: 'MIT'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development Server'
            },
            {
                url: 'http://api.carelink.local',
                description: 'Production Server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT Authorization header using Bearer scheme. Example: "Authorization: Bearer eyJhbGc..."'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        role: { type: 'string', enum: ['PATIENT', 'DOCTOR', 'PHARMACIST', 'HOSPITAL_ADMIN', 'SYSTEM_ADMIN', 'CHW'] },
                        phone: { type: 'string' },
                        created_at: { type: 'string', format: 'date-time' }
                    }
                },
                TriageLog: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        user_id: { type: 'string', format: 'uuid' },
                        symptoms: { type: 'string' },
                        severity: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] },
                        recommended_action: { type: 'string' },
                        created_at: { type: 'string', format: 'date-time' }
                    }
                },
                Consultation: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        patient_id: { type: 'string', format: 'uuid' },
                        doctor_id: { type: 'string', format: 'uuid' },
                        status: { type: 'string', enum: ['REQUESTED', 'ACTIVE', 'COMPLETED', 'CANCELLED'] },
                        priority: { type: 'integer', enum: [1, 2, 3] },
                        notes: { type: 'string' },
                        created_at: { type: 'string', format: 'date-time' }
                    }
                },
                MedicalRecord: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        patient_id: { type: 'string', format: 'uuid' },
                        doctor_id: { type: 'string', format: 'uuid' },
                        diagnosis: { type: 'string' },
                        prescription: { type: 'string' },
                        notes: { type: 'string' },
                        created_at: { type: 'string', format: 'date-time' }
                    }
                },
                Emergency: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        patient_id: { type: 'string', format: 'uuid' },
                        status: { type: 'string', enum: ['TRIGGERED', 'IN_PROGRESS', 'RESOLVED'] },
                        description: { type: 'string' },
                        created_at: { type: 'string', format: 'date-time' }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        message: { type: 'string' }
                    }
                }
            }
        }
    },
    apis: ['./src/modules/*/routes.ts', './src/app.ts']
};

export const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
