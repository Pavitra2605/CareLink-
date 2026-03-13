import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, ActivityIndicator, FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button, Card, Badge } from '../../components/common';
import { useLanguage } from '../../i18n';
import { useAuth } from '../../context/AuthContext';
import {
  getPatientPrescriptions,
  getPharmacies,
  createOrder,
} from '../../services/careService';

const DELIVERY_MODES = [
  { id: 'pickup', label: 'Self Pickup', icon: 'walk' },
  { id: 'delivery', label: 'Home Delivery', icon: 'bicycle' },
];

export default function PrescriptionUploadScreen({ route, navigation }) {
  const { user } = useAuth();
  const { t } = useLanguage();

  // Pre-filled params from previous screens
  const prefillPrescriptionId = route.params?.prescriptionId || null;
  const prefillPharmacy = route.params?.pharmacy || null;

  const [prescriptions, setPrescriptions] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedRx, setSelectedRx] = useState(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState(prefillPharmacy);
  const [deliveryMode, setDeliveryMode] = useState('pickup');
  const [loadingRx, setLoadingRx] = useState(true);
  const [loadingPharmacies, setLoadingPharmacies] = useState(!prefillPharmacy);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(prefillPrescriptionId ? 2 : 1); // 1=pick rx, 2=pick pharmacy+mode

  // Fetch digital prescriptions
  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      try {
        const data = await getPatientPrescriptions(user.id);
        setPrescriptions(data);
        if (prefillPrescriptionId) {
          const pre = data.find(p => p.id === prefillPrescriptionId) || null;
          setSelectedRx(pre);
        }
      } catch (_) {
        // silently fail – user can still proceed if no prescriptions
      } finally {
        setLoadingRx(false);
      }
    })();
  }, [user?.id]);

  // Fetch pharmacies if not pre-filled
  useEffect(() => {
    if (prefillPharmacy) return;
    (async () => {
      try {
        const data = await getPharmacies({});
        setPharmacies(data);
      } catch (_) { }
      finally { setLoadingPharmacies(false); }
    })();
  }, []);

  const handleSelectRx = (rx) => {
    setSelectedRx(rx === selectedRx ? null : rx);
  };

  const handleSelectPharmacy = (ph) => {
    setSelectedPharmacy(ph === selectedPharmacy ? null : ph);
  };

  const handleSubmit = async () => {
    if (!selectedPharmacy) {
      Alert.alert('Select Pharmacy', 'Please choose a pharmacy to order from.');
      return;
    }
    if (!user?.id) {
      Alert.alert('Not logged in', 'Please log in to place an order.');
      return;
    }
    try {
      setSubmitting(true);
      // Build order items from selected prescription, or minimal if no rx
      const items = selectedRx?.items?.map(i => ({
        medicine_id: i.medicine_id,
        quantity: i.quantity || 1,
        unit_price: 0,
      })) || [];

      await createOrder({
        patientId: user.id,
        pharmacyId: selectedPharmacy.id,
        prescriptionId: selectedRx?.id || null,
        items,
        deliveryMode,
        notes: selectedRx
          ? `Digital prescription order – Prescription #${selectedRx.id?.slice(0, 8)}`
          : 'Order without digital prescription',
      });

      Alert.alert(
        'Order Placed',
        'Your order has been submitted. The pharmacy will confirm availability shortly.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (err) {
      Alert.alert('Order Failed', err.message || 'Could not place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Step 1: Select Prescription ──────────────────────────────────────────
  const renderStep1 = () => (
    <>
      <View style={styles.infoBox}>
        <Ionicons name="document-text" size={32} color={Colors.accent} />
        <Text style={styles.infoTitle}>Choose a Prescription</Text>
        <Text style={styles.infoDesc}>
          Select one of your digital prescriptions to order medicines, or skip if you have a physical prescription.
        </Text>
      </View>

      {loadingRx ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator color={Colors.accent} />
          <Text style={styles.loadingText}>Loading prescriptions...</Text>
        </View>
      ) : prescriptions.length === 0 ? (
        <View style={[styles.emptyState, Shadows.soft]}>
          <Ionicons name="document-outline" size={40} color={Colors.textMuted} />
          <Text style={styles.emptyText}>No digital prescriptions found.</Text>
          <Text style={styles.emptyHint}>You can still proceed and inform the pharmacy.</Text>
        </View>
      ) : (
        prescriptions.map((rx) => {
          const selected = selectedRx?.id === rx.id;
          const doctor = rx.doctor || {};
          return (
            <TouchableOpacity
              key={rx.id}
              style={[styles.rxCard, Shadows.soft, selected && styles.rxCardSelected]}
              activeOpacity={0.8}
              onPress={() => handleSelectRx(rx)}
            >
              <View style={styles.rxCardHeader}>
                <View>
                  <Text style={styles.rxTitle}>
                    Dr. {doctor.full_name || 'Unknown Doctor'}
                  </Text>
                  <Text style={styles.rxDate}>
                    {rx.created_at
                      ? new Date(rx.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                      : 'Date N/A'}
                  </Text>
                </View>
                <View style={styles.rxRight}>
                  <Badge
                    label={rx.is_fulfilled ? 'Fulfilled' : 'Active'}
                    variant={rx.is_fulfilled ? 'neutral' : 'success'}
                    size="sm"
                  />
                  {selected && <Ionicons name="checkmark-circle" size={22} color={Colors.accent} style={{ marginTop: 4 }} />}
                </View>
              </View>
              {rx.diagnosis ? (
                <Text style={styles.rxDiagnosis} numberOfLines={1}>Dx: {rx.diagnosis}</Text>
              ) : null}
              {rx.items?.length > 0 ? (
                <Text style={styles.rxMeds} numberOfLines={2}>
                  {rx.items.map(i => i.medicine_name || i.medicine_id).join(', ')}
                </Text>
              ) : null}
            </TouchableOpacity>
          );
        })
      )}

      <Button
        label={selectedRx ? 'Continue with Prescription' : 'Continue Without Prescription'}
        onPress={() => setStep(2)}
        style={{ marginTop: Spacing.lg }}
      />
    </>
  );

  // ── Step 2: Select Pharmacy + Delivery Mode ───────────────────────────────
  const renderStep2 = () => (
    <>
      {/* Selected Rx Summary */}
      {selectedRx ? (
        <Card title="Selected Prescription" style={{ marginBottom: Spacing.md }}>
          <View style={styles.selectedRxRow}>
            <Ionicons name="document-text" size={20} color={Colors.accent} />
            <View style={{ flex: 1 }}>
              <Text style={styles.selectedRxTitle}>
                Dr. {selectedRx.doctor?.full_name || 'Doctor'}
              </Text>
              {selectedRx.items?.length > 0 ? (
                <Text style={styles.selectedRxMeds} numberOfLines={1}>
                  {selectedRx.items.map(i => i.medicine_name || 'Medicine').join(', ')}
                </Text>
              ) : null}
            </View>
            <TouchableOpacity onPress={() => { setSelectedRx(null); setStep(1); }}>
              <Text style={styles.changeLink}>Change</Text>
            </TouchableOpacity>
          </View>
        </Card>
      ) : (
        <View style={styles.noRxBanner}>
          <Ionicons name="information-circle" size={18} color={Colors.warning} />
          <Text style={styles.noRxText}>Proceeding without a digital prescription</Text>
        </View>
      )}

      {/* Pharmacy Selection */}
      {prefillPharmacy ? (
        <Card title="Pharmacy" style={{ marginBottom: Spacing.md }}>
          <View style={styles.selectedPharmacyRow}>
            <Ionicons name="storefront" size={20} color={Colors.accent} />
            <View style={{ flex: 1, marginLeft: Spacing.sm }}>
              <Text style={styles.selectedPharmacyName}>{prefillPharmacy.name}</Text>
              <Text style={styles.selectedPharmacyAddr} numberOfLines={1}>
                {[prefillPharmacy.address, prefillPharmacy.city].filter(Boolean).join(', ')}
              </Text>
            </View>
            <Badge label={prefillPharmacy.is_open ? 'Open' : 'Closed'} variant={prefillPharmacy.is_open ? 'success' : 'error'} size="sm" />
          </View>
        </Card>
      ) : (
        <Card title="Select Pharmacy" style={{ marginBottom: Spacing.md }}>
          {loadingPharmacies ? (
            <ActivityIndicator color={Colors.accent} style={{ marginVertical: Spacing.md }} />
          ) : pharmacies.length === 0 ? (
            <Text style={styles.emptyText}>No pharmacies available.</Text>
          ) : (
            pharmacies.map((ph) => {
              const sel = selectedPharmacy?.id === ph.id;
              return (
                <TouchableOpacity
                  key={ph.id}
                  style={[styles.pharmacyOption, sel && styles.pharmacyOptionSelected]}
                  onPress={() => handleSelectPharmacy(ph)}
                  activeOpacity={0.8}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.pharmacyOptionName}>{ph.name}</Text>
                    <Text style={styles.pharmacyOptionAddr} numberOfLines={1}>
                      {[ph.city, ph.state].filter(Boolean).join(', ')}
                    </Text>
                  </View>
                  <View style={styles.pharmacyOptionRight}>
                    <Badge label={ph.is_open ? 'Open' : 'Closed'} variant={ph.is_open ? 'success' : 'error'} size="sm" />
                    {sel && <Ionicons name="checkmark-circle" size={20} color={Colors.accent} />}
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </Card>
      )}

      {/* Delivery Mode */}
      <Card title="Delivery Mode" style={{ marginBottom: Spacing.md }}>
        <View style={styles.modeRow}>
          {DELIVERY_MODES.map((m) => (
            <TouchableOpacity
              key={m.id}
              style={[styles.modeCard, deliveryMode === m.id && styles.modeCardActive]}
              onPress={() => setDeliveryMode(m.id)}
            >
              <Ionicons
                name={m.icon}
                size={28}
                color={deliveryMode === m.id ? Colors.white : Colors.accent}
              />
              <Text style={[styles.modeLabel, deliveryMode === m.id && styles.modeLabelActive]}>
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <View style={styles.stepBtnRow}>
        <Button
          label="Back"
          variant="outline"
          onPress={() => { if (!prefillPrescriptionId) setStep(1); else navigation.goBack(); }}
          style={{ flex: 1 }}
        />
        <Button
          label={submitting ? 'Placing Order...' : 'Place Order'}
          onPress={handleSubmit}
          disabled={submitting || (!selectedPharmacy && !prefillPharmacy)}
          style={{ flex: 2 }}
        />
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <Header title="Order Medicines" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Step Indicator */}
        <View style={styles.stepRow}>
          {[{ n: 1, label: 'Prescription' }, { n: 2, label: 'Pharmacy' }].map((s) => (
            <View key={s.n} style={styles.stepItem}>
              <View style={[styles.stepDot, step >= s.n && styles.stepDotActive]}>
                <Text style={[styles.stepNum, step >= s.n && styles.stepNumActive]}>{s.n}</Text>
              </View>
              <Text style={[styles.stepLabel, step >= s.n && styles.stepLabelActive]}>{s.label}</Text>
            </View>
          ))}
          <View style={styles.stepLine} />
        </View>

        {step === 1 ? renderStep1() : renderStep2()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  content: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.lg, paddingBottom: 60 },

  // Step indicator
  stepRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.xl, position: 'relative',
  },
  stepItem: { alignItems: 'center', flex: 1 },
  stepDot: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.surface,
    borderWidth: 2, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center',
  },
  stepDotActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  stepNum: { fontSize: FontSizes.sm, fontWeight: FontWeights.bold, color: Colors.textMuted },
  stepNumActive: { color: Colors.white },
  stepLabel: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 4 },
  stepLabelActive: { color: Colors.accent, fontWeight: FontWeights.semiBold },
  stepLine: {
    position: 'absolute', top: 16, left: '25%', right: '25%',
    height: 2, backgroundColor: Colors.border,
  },

  // Info box
  infoBox: {
    backgroundColor: Colors.accent + '10', borderRadius: Radius.lg, padding: Spacing.xl,
    alignItems: 'center', marginBottom: Spacing.lg,
  },
  infoTitle: { fontSize: FontSizes.lg, fontWeight: FontWeights.semiBold, color: Colors.textPrimary, marginTop: Spacing.sm },
  infoDesc: { fontSize: FontSizes.md, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.xs, lineHeight: 22 },

  // Loading / empty
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.lg, justifyContent: 'center' },
  loadingText: { fontSize: FontSizes.md, color: Colors.textMuted },
  emptyState: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.xl,
    alignItems: 'center', marginBottom: Spacing.md,
  },
  emptyText: { fontSize: FontSizes.md, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.sm },
  emptyHint: { fontSize: FontSizes.sm, color: Colors.textMuted, textAlign: 'center', marginTop: 4 },

  // Rx card
  rxCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.lg,
    marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border,
  },
  rxCardSelected: { borderColor: Colors.accent, borderWidth: 2 },
  rxCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  rxTitle: { fontSize: FontSizes.base, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  rxDate: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
  rxRight: { alignItems: 'flex-end', gap: 4 },
  rxDiagnosis: { fontSize: FontSizes.sm, color: Colors.textSecondary, marginTop: Spacing.xs },
  rxMeds: { fontSize: FontSizes.sm, color: Colors.accent, marginTop: 4 },

  // Selected rx summary
  selectedRxRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  selectedRxTitle: { fontSize: FontSizes.md, fontWeight: FontWeights.medium, color: Colors.textPrimary },
  selectedRxMeds: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
  changeLink: { fontSize: FontSizes.sm, color: Colors.accent, fontWeight: FontWeights.semiBold },

  // No-rx banner
  noRxBanner: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.warning + '15', borderRadius: Radius.md,
    padding: Spacing.md, marginBottom: Spacing.md,
  },
  noRxText: { fontSize: FontSizes.sm, color: Colors.warning, flex: 1 },

  // Pharmacy options
  selectedPharmacyRow: { flexDirection: 'row', alignItems: 'center' },
  selectedPharmacyName: { fontSize: FontSizes.md, fontWeight: FontWeights.medium, color: Colors.textPrimary },
  selectedPharmacyAddr: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
  pharmacyOption: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  pharmacyOptionSelected: { backgroundColor: Colors.accent + '08', marginHorizontal: -Spacing.md, paddingHorizontal: Spacing.md },
  pharmacyOptionName: { fontSize: FontSizes.md, fontWeight: FontWeights.medium, color: Colors.textPrimary },
  pharmacyOptionAddr: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
  pharmacyOptionRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },

  // Delivery mode
  modeRow: { flexDirection: 'row', gap: Spacing.md, paddingTop: Spacing.sm },
  modeCard: {
    flex: 1, alignItems: 'center', paddingVertical: Spacing.lg, borderRadius: Radius.lg,
    borderWidth: 2, borderColor: Colors.border, backgroundColor: Colors.surface, gap: Spacing.sm,
  },
  modeCardActive: { borderColor: Colors.accent, backgroundColor: Colors.accent },
  modeLabel: { fontSize: FontSizes.sm, fontWeight: FontWeights.medium, color: Colors.textSecondary },
  modeLabelActive: { color: Colors.white },

  // Buttons
  stepBtnRow: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.md },
});
