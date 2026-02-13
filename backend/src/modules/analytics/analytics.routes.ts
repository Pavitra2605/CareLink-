import express from 'express';
import { AnalyticsController } from './analytics.controller';
import { protect } from '../../middleware/auth.middleware';

const router = express.Router();

router.use(protect);

/**
 * Admin dashboard metrics routes
 * All require: SYSTEM_ADMIN or HOSPITAL_ADMIN role
 */

/**
 * GET /admin/metrics
 * Comprehensive system metrics
 */
router.get('/', AnalyticsController.getMetrics);

/**
 * GET /admin/metrics/consultations
 * Consultation breakdown by priority
 */
router.get('/consultations', AnalyticsController.getConsultationMetrics);

/**
 * GET /admin/metrics/doctors
 * Doctor activity and performance
 */
router.get('/doctors', AnalyticsController.getDoctorMetrics);

/**
 * GET /admin/metrics/patients
 * Patient engagement metrics
 */
router.get('/patients', AnalyticsController.getPatientMetrics);

export default router;
