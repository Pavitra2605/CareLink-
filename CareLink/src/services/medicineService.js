import { supabase } from './supabase';

/**
 * Medicine & Pharmacy Service
 */

// Helper to calculate distance between two coordinates in km
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // Ensure inputs are numbers
  const nLat1 = parseFloat(lat1);
  const nLon1 = parseFloat(lon1);
  const nLat2 = parseFloat(lat2);
  const nLon2 = parseFloat(lon2);

  if (!nLat1 || !nLon1 || !nLat2 || !nLon2) return 9999;
  
  const R = 6371; // Radius of the earth in km
  const dLat = (nLat2 - nLat1) * (Math.PI / 180);
  const dLon = (nLon2 - nLon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(nLat1 * (Math.PI / 180)) * Math.cos(nLat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return parseFloat(d.toFixed(1));
};

export const medicineService = {
  /**
   * Search medicines by name or generic name
   */
  async searchMedicines(query) {
    if (!query) return [];
    
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .or(`name.ilike.%${query}%,generic_name.ilike.%${query}%,brand.ilike.%${query}%`)
      .limit(20);

    if (error) throw error;
    return data;
  },

  /**
   * Get medicine details with availability in nearby pharmacies
   */
  async getMedicineAvailability(medicineId, userLat, userLon) {
    // 1. Get medicine details
    const { data: medicine, error: medError } = await supabase
      .from('medicines')
      .select('*')
      .eq('id', medicineId)
      .single();
    
    if (medError) throw medError;

    // 2. Get inventory for this medicine from all pharmacies
    const { data: inventory, error: invError } = await supabase
      .from('pharmacy_inventory')
      .select(`
        *,
        pharmacy:pharmacies (*)
      `)
      .eq('medicine_id', medicineId)
      .gt('stock_quantity', 0)
      .eq('is_available', true);

    if (invError) throw invError;

    // 3. Process and sort by distance/rate
    const availability = inventory.map(item => {
      const pharmacy = item.pharmacy;
      const distance = calculateDistance(userLat, userLon, pharmacy.latitude, pharmacy.longitude);
      return {
        ...item,
        distance,
        pharmacy_name: pharmacy.name,
        pharmacy_address: pharmacy.address,
        rating: pharmacy.rating
      };
    }).sort((a, b) => a.distance - b.distance);

    return { medicine, availability };
  },

  /**
   * Find nearest pharmacies
   */
  async getNearbyPharmacies(lat, lon, radiusKm = 10) {
    // In a real app with PostGIS, use ST_DWithin.
    // Here we fetch all (assuming reasonable count) and filter client-side.
    const { data, error } = await supabase
      .from('pharmacies')
      .select('*')
      .eq('is_open', true); // Optional: only open ones

    if (error) throw error;

    return data
      .map(p => ({
        ...p,
        distance: calculateDistance(lat, lon, p.latitude, p.longitude)
      }))
      .sort((a, b) => a.distance - b.distance)
      // .filter(p => p.distance <= radiusKm); // strict filtering optional
  },

  /**
   * Upload prescription image
   */
  async uploadPrescription(uri, userId) {
    // Basic implementation: upload file to 'prescriptions' bucket
    // Note: Assuming bucket exists and policies allow upload
    const filename = `prescriptions/${userId}/${Date.now()}.jpg`;
    
    const formData = new FormData();
    formData.append('file', {
      uri,
      name: 'prescription.jpg',
      type: 'image/jpeg',
    });

    const { data, error } = await supabase.storage
      .from('prescriptions')
      .upload(filename, formData, {
        contentType: 'image/jpeg',
        upsert: false
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('prescriptions')
      .getPublicUrl(filename);
      
    return publicUrl;
  },

  /**
   * Create an order
   */
  async createOrder({
    patient_id,
    pharmacy_id,
    items = [], // Array of { medicine_id, quantity, unit_price }
    prescription_url = null, // Store in notes for now
    delivery_mode = 'pickup'
  }) {
    let notes = '';
    if (prescription_url) {
      notes = `Prescription URL: ${prescription_url}`;
    }

    // 1. Create Order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        patient_id,
        pharmacy_id,
        status: 'pending',
        delivery_mode,
        notes, // Store prescription URL here
        payment_status: 'pending'
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Create Order Items if any
    if (items.length > 0) {
      const orderItems = items.map(item => ({
        order_id: order.id,
        medicine_id: item.medicine_id,
        medicine_name: item.medicine_name, // Assuming passed for simplicity or fetch
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.quantity * item.unit_price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) throw itemsError;
    }

    return order;
  }
};
