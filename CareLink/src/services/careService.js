/**
 * CareLink Care Service
 * All Supabase data-access helpers for doctors, pharmacies,
 * appointments, consultations, prescriptions and orders.
 */
import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

// ─── Helpers ────────────────────────────────────────────────────────────────

const handleResult = ({ data, error }) => {
  if (error) throw error;
  return data;
};

// ─── Doctors ────────────────────────────────────────────────────────────────

/**
 * Fetch all available doctors, optionally filtered by specialty / search term.
 */
export const getDoctors = async ({ specialty = null, search = '' } = {}) => {
  let query = supabase
    .from('doctors')
    .select('*')
    .order('rating', { ascending: false });

  if (specialty) {
    query = query.ilike('specialty', `%${specialty}%`);
  }
  if (search) {
    query = query.ilike('full_name', `%${search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

/**
 * Fetch a single doctor by their primary-key `id`.
 */
export const getDoctorById = async (doctorId) => {
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .eq('id', doctorId)
    .single();
  if (error) throw error;
  return data;
};

// ─── Appointments ────────────────────────────────────────────────────────────

/**
 * Book a new appointment.
 */
export const bookAppointment = async ({
  patientId,
  doctorId,
  appointmentDate,   // 'YYYY-MM-DD'
  appointmentTime,   // 'HH:MM'
  mode = 'video',
  reason = null,
  durationMinutes = 30,
}) => {
  const { data, error } = await supabase
    .from('appointments')
    .insert({
      patient_id: patientId,
      doctor_id: doctorId,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      mode,
      reason,
      duration_minutes: durationMinutes,
      status: 'pending',
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

/**
 * Fetch all appointments for a patient.
 */
export const getPatientAppointments = async (patientId) => {
  const { data, error } = await supabase
    .from('appointments')
    .select('*, doctor:doctors(*)')
    .eq('patient_id', patientId)
    .order('appointment_date', { ascending: false });
  if (error) throw error;
  return data || [];
};

// ─── Consultations ───────────────────────────────────────────────────────────

/**
 * Fetch all consultations for a patient, joined with doctor info.
 */
export const getPatientConsultations = async (patientId) => {
  const { data, error } = await supabase
    .from('consultations')
    .select(`
      *,
      doctor:doctors(full_name, specialty, avatar_url, license_number),
      appointment:appointments(mode, appointment_date, appointment_time, duration_minutes, consultation_fee:doctors(consultation_fee))
    `)
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

/**
 * Fetch a single consultation by id with full joined data.
 */
export const getConsultationById = async (consultationId) => {
  const { data, error } = await supabase
    .from('consultations')
    .select(`
      *,
      doctor:doctors(full_name, specialty, license_number, avatar_url, consultation_fee),
      appointment:appointments(mode, appointment_date, appointment_time, duration_minutes),
      prescription:prescriptions(
        id, diagnosis, notes, is_fulfilled, created_at,
        items:prescription_items(*)
      )
    `)
    .eq('id', consultationId)
    .single();
  if (error) throw error;
  return data;
};

// ─── Prescriptions ───────────────────────────────────────────────────────────

/**
 * Fetch all prescriptions for a patient.
 */
export const getPatientPrescriptions = async (patientId) => {
  const { data, error } = await supabase
    .from('prescriptions')
    .select(`
      *,
      doctor:doctors(full_name, specialty, license_number),
      items:prescription_items(*)
    `)
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

/**
 * Fetch a single prescription with all items.
 */
export const getPrescriptionById = async (prescriptionId) => {
  const { data, error } = await supabase
    .from('prescriptions')
    .select(`
      *,
      doctor:doctors(full_name, specialty, license_number),
      items:prescription_items(*)
    `)
    .eq('id', prescriptionId)
    .single();
  if (error) throw error;
  return data;
};

// ─── Pharmacies ──────────────────────────────────────────────────────────────

/**
 * Fetch all open pharmacies, optionally filtered by name search.
 */
export const getPharmacies = async ({ search = '' } = {}) => {
  let query = supabase
    .from('pharmacies')
    .select('*')
    .eq('is_open', true)
    .order('rating', { ascending: false });

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

/**
 * Fetch ALL registered pharmacies (open or closed), optionally filtered by
 * name search. Used by the prescription-upload pharmacy picker.
 */
export const getRegisteredPharmacies = async ({ search = '' } = {}) => {
  let query = supabase
    .from('pharmacies')
    .select('*')
    .order('name', { ascending: true });

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

/**
 * Upload a prescription image (local URI) to Supabase Storage and return
 * the public URL. Stores under `prescription-images/<patientId>/<uuid>.jpg`.
 */
export const uploadPrescriptionImage = async (localUri, patientId) => {
  const ext = localUri.split('.').pop()?.toLowerCase() || 'jpg';
  const fileName = `${patientId}/${Date.now()}.${ext}`;

  // Read file as base64 using expo-file-system (works reliably on iOS/Android native)
  const base64 = await FileSystem.readAsStringAsync(localUri, {
    encoding: 'base64',
  });

  const mimeType =
    ext === 'png' ? 'image/png' :
    ext === 'webp' ? 'image/webp' :
    'image/jpeg';

  const { data, error } = await supabase.storage
    .from('prescription-images')
    .upload(fileName, decode(base64), { // Decode base64 to arrayBuffer for Supabase Storage
      contentType: mimeType,
      upsert: false,
    });

  if (error) throw error;

  const { data: publicData } = supabase.storage
    .from('prescription-images')
    .getPublicUrl(data.path);

  return publicData.publicUrl;
};

/**
 * Fetch inventory for a given pharmacy, joined with medicine details.
 */
export const getPharmacyInventory = async (pharmacyId) => {
  const { data, error } = await supabase
    .from('pharmacy_inventory')
    .select(`
      *,
      medicine:medicines(name, generic_name, category, dosage_form, strength, requires_prescription)
    `)
    .eq('pharmacy_id', pharmacyId)
    .eq('is_available', true)
    .order('price', { ascending: true });
  if (error) throw error;
  return data || [];
};

// ─── Orders ──────────────────────────────────────────────────────────────────

/**
 * Create an order from a list of prescription items.
 * items: [{ medicine_name, quantity, unit_price }]
 */
export const createOrder = async ({
  patientId,
  pharmacyId,
  prescriptionId = null,
  prescriptionImageUrl = null,
  items = [],
  deliveryMode = 'pickup',
  notes = null,
}) => {
  const totalAmount = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      patient_id: patientId,
      pharmacy_id: pharmacyId,
      prescription_id: prescriptionId,
      prescription_image_url: prescriptionImageUrl,
      status: 'pending',
      total_amount: totalAmount,
      payment_status: 'pending',
      delivery_mode: deliveryMode,
      notes,
    })
    .select()
    .single();

  if (orderError) throw orderError;

  const orderItems = items.map((i) => ({
    order_id: order.id,
    medicine_name: i.medicine_name,
    medicine_id: i.medicine_id ?? null,
    quantity: i.quantity,
    unit_price: i.unit_price,
    total_price: i.unit_price * i.quantity,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
  if (itemsError) throw itemsError;

  return order;
};

/**
 * Fetch all orders for a patient.
 */
export const getPatientOrders = async (patientId) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      pharmacy:pharmacies(name, phone, address),
      items:order_items(*)
    `)
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};
