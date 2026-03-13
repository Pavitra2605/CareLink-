import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button, Badge } from '../../components/common';
import { useLanguage } from '../../i18n';
import { useAuth } from '../../context/AuthContext';
import { getPrescriptionById } from '../../services/careService';

const formatDate = (iso) => {
  if (!iso) return '--';
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const COLORS = [Colors.accent, Colors.amberMid, Colors.info, Colors.success, Colors.error];

export default function DigitalPrescriptionViewScreen({ navigation, route }) {
  const { t } = useLanguage();
  const { user, profile } = useAuth();
  const { prescriptionId, prescription: initial, doctor: docParam } = route?.params || {};

  const [prescription, setPrescription] = useState(initial || null);
  const [loading, setLoading] = useState(!initial?.items);

  useEffect(() => {
    const id = prescriptionId || initial?.id;
    if (id && !initial?.items) {
      getPrescriptionById(id)
        .then(setPrescription)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, []);

  const handleShare = async () => {
    const rx = prescription;
    if (!rx) return;
    const items = (rx.items || []).map((m) =>
      `• ${m.medicine_name} - ${m.dosage || ''} ${m.frequency || ''} for ${m.duration || ''}`
    ).join('\n');
    await Share.share({
      message: `CareLink Digital Prescription\nDr. ${rx.doctor?.full_name || ''}\nDate: ${formatDate(rx.created_at)}\nDiagnosis: ${rx.diagnosis || ''}\n\nMedications:\n${items}`,
    });
  };

  if (loading || !prescription) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  const rx = prescription;
  const doctor = rx.doctor || docParam || {};
  const medications = rx.items || [];

  return (
    <View style={styles.container}>
      <Header
        title={t('telemedicine.digitalPrescription')}
        onBack={() => navigation.goBack()}
        rightAction={
          <TouchableOpacity onPress={handleShare}>
            <Ionicons name="share-social-outline" size={22} color={Colors.accent} />
          </TouchableOpacity>
        }
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Rx Header */}
        <View style={[styles.rxHeader, Shadows.soft]}>
          <View style={styles.rxRow}>
            <Text style={styles.rxLabel}>Rx</Text>
            <Badge label={rx.is_fulfilled ? 'Fulfilled' : 'Valid'} variant={rx.is_fulfilled ? 'neutral' : 'success'} size="sm" />
          </View>
          <Text style={styles.rxDate}>Date: {formatDate(rx.created_at)}</Text>
          <View style={styles.divider} />
          <View style={styles.docRow}>
            <View style={styles.docAvatar}>
              <Ionicons name="person" size={24} color={Colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.docName}>{doctor.full_name || 'Doctor'}</Text>
              <Text style={styles.docSpec}>{doctor.specialty || ''}</Text>
              {doctor.license_number ? (
                <Text style={styles.docReg}>Reg: {doctor.license_number}</Text>
              ) : null}
            </View>
          </View>
          <View style={styles.divider} />
          {profile ? (
            <View style={styles.patRow}>
              <Text style={styles.patLabel}>Patient:</Text>
              <Text style={styles.patValue}>
                {profile.full_name || 'Patient'}
                {profile.gender ? ` · ${profile.gender}` : ''}
                {profile.age ? ` · ${profile.age} yrs` : ''}
              </Text>
            </View>
          ) : null}
          {rx.diagnosis ? (
            <View style={styles.patRow}>
              <Text style={styles.patLabel}>Diagnosis:</Text>
              <Text style={styles.patValue}>{rx.diagnosis}</Text>
            </View>
          ) : null}
        </View>

        {/* Medications */}
        <Text style={styles.sectionTitle}>Medications</Text>
        {medications.length === 0 ? (
          <View style={styles.emptyMeds}>
            <Text style={styles.emptyText}>No medication items listed</Text>
          </View>
        ) : (
          medications.map((med, idx) => (
            <View key={med.id || idx} style={[styles.medCard, Shadows.soft]}>
              <View style={styles.medHeader}>
                <View style={[styles.medIndex, { backgroundColor: COLORS[idx % COLORS.length] }]}>
                  <Text style={styles.medIndexText}>{idx + 1}</Text>
                </View>
                <Text style={styles.medName}>{med.medicine_name}</Text>
              </View>
              <View style={styles.medGrid}>
                {med.dosage ? (
                  <View style={styles.medGridItem}>
                    <Ionicons name="medical-outline" size={16} color={Colors.accent} />
                    <Text style={styles.medGridLabel}>Dose</Text>
                    <Text style={styles.medGridValue}>{med.dosage}</Text>
                  </View>
                ) : null}
                {med.frequency ? (
                  <View style={styles.medGridItem}>
                    <Ionicons name="repeat-outline" size={16} color={Colors.amberMid} />
                    <Text style={styles.medGridLabel}>Frequency</Text>
                    <Text style={styles.medGridValue}>{med.frequency}</Text>
                  </View>
                ) : null}
                {med.duration ? (
                  <View style={styles.medGridItem}>
                    <Ionicons name="calendar-outline" size={16} color={Colors.info} />
                    <Text style={styles.medGridLabel}>Duration</Text>
                    <Text style={styles.medGridValue}>{med.duration}</Text>
                  </View>
                ) : null}
                {med.quantity ? (
                  <View style={styles.medGridItem}>
                    <Ionicons name="layers-outline" size={16} color={Colors.success} />
                    <Text style={styles.medGridLabel}>Qty</Text>
                    <Text style={styles.medGridValue}>{med.quantity}</Text>
                  </View>
                ) : null}
              </View>
              {med.instructions ? (
                <View style={styles.instrRow}>
                  <Ionicons name="information-circle-outline" size={16} color={Colors.textMuted} />
                  <Text style={styles.instrText}>{med.instructions}</Text>
                </View>
              ) : null}
            </View>
          ))
        )}

        {/* Notes */}
        {rx.notes ? (
          <View style={[styles.notesCard, Shadows.soft]}>
            <Text style={styles.notesTitle}>Doctor's Notes</Text>
            <Text style={styles.notesText}>{rx.notes}</Text>
          </View>
        ) : null}

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Find Medicine Nearby"
            variant="amber"
            size="lg"
            icon={<Ionicons name="location-outline" size={18} color={Colors.white} />}
            onPress={() => navigation.navigate('MedicineTab', { screen: 'PharmacyResults' })}
          />
          <Button
            title="Order Medicines"
            variant="primary"
            size="lg"
            icon={<Ionicons name="bag-outline" size={18} color={Colors.white} />}
            onPress={() => navigation.navigate('PrescriptionUpload', { prescriptionId: rx.id, medicineNames: medications.map((m) => m.medicine_name) })}
            style={{ marginTop: Spacing.md }}
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md },
  rxHeader: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.lg, marginBottom: Spacing.md,
  },
  rxRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rxLabel: { fontSize: 32, fontWeight: FontWeights.bold, color: Colors.accent, fontStyle: 'italic' },
  rxDate: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 4 },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.md },
  docRow: { flexDirection: 'row', alignItems: 'center' },
  docAvatar: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.accent,
    justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md,
  },
  docName: { fontSize: FontSizes.base, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  docSpec: { fontSize: FontSizes.sm, color: Colors.textSecondary, marginTop: 2 },
  docReg: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 2 },
  patRow: { flexDirection: 'row', marginTop: Spacing.xs },
  patLabel: { fontSize: FontSizes.sm, color: Colors.textMuted, width: 80 },
  patValue: { fontSize: FontSizes.sm, fontWeight: FontWeights.medium, color: Colors.textPrimary, flex: 1 },
  sectionTitle: {
    fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.textPrimary,
    marginBottom: Spacing.md, marginTop: Spacing.sm,
  },
  emptyMeds: { alignItems: 'center', paddingVertical: Spacing.xl },
  emptyText: { fontSize: FontSizes.md, color: Colors.textMuted },
  medCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  medHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  medIndex: {
    width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center',
    marginRight: Spacing.sm,
  },
  medIndexText: { fontSize: FontSizes.sm, fontWeight: FontWeights.bold, color: Colors.white },
  medName: { fontSize: FontSizes.base, fontWeight: FontWeights.semiBold, color: Colors.textPrimary, flex: 1 },
  medGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  medGridItem: { alignItems: 'center', minWidth: '22%' },
  medGridLabel: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 4 },
  medGridValue: { fontSize: FontSizes.sm, fontWeight: FontWeights.medium, color: Colors.textPrimary, marginTop: 2 },
  instrRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.md, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.border },
  instrText: { fontSize: FontSizes.sm, color: Colors.textMuted, marginLeft: Spacing.xs, flex: 1 },
  notesCard: {
    backgroundColor: '#FFF8E1', borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.lg,
  },
  notesTitle: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold, color: Colors.textPrimary, marginBottom: Spacing.sm },
  notesText: { fontSize: FontSizes.sm, color: Colors.textSecondary, lineHeight: 20 },
  actions: { marginTop: Spacing.sm },
});
