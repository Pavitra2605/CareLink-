import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button, Badge } from '../../components/common';
import { useLanguage } from '../../i18n';

export default function DigitalPrescriptionViewScreen({ navigation, route }) {
  const { t } = useLanguage();
  const prescriptionDate = '15 Jan 2025';
  const doctor = route?.params?.doctor || {};

  const medications = [
    { name: 'Paracetamol 500mg', dose: '1 tab', freq: '3 times/day', duration: '5 days', instructions: 'After food' },
    { name: 'Vitamin B Complex', dose: '1 tab', freq: 'Once daily', duration: '30 days', instructions: 'Morning, after breakfast' },
    { name: 'Ibuprofen 200mg', dose: '1 tab', freq: 'As needed', duration: 'SOS', instructions: 'After food, max 3/day' },
  ];

  return (
    <View style={styles.container}>
      <Header title={t('telemedicine.digitalPrescription')} onBack={() => navigation.goBack()}
        rightAction={
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="share-social-outline" size={22} color={Colors.accent} />
          </TouchableOpacity>
        } />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header Info */}
        <View style={[styles.rxHeader, Shadows.soft]}>
          <View style={styles.rxRow}>
            <Text style={styles.rxLabel}>Rx</Text>
            <Badge label="Valid" variant="success" size="sm" />
          </View>
          <Text style={styles.rxDate}>Date: {prescriptionDate}</Text>
          <View style={styles.divider} />
          <View style={styles.docRow}>
            <View style={styles.docAvatar}>
              <Ionicons name="person" size={24} color={Colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.docName}>{doctor.name || 'Dr. Priya Sharma'}</Text>
              <Text style={styles.docSpec}>MBBS, MD · General Physician</Text>
              <Text style={styles.docReg}>Reg: TN-MED-12345</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.patRow}>
            <Text style={styles.patLabel}>Patient:</Text>
            <Text style={styles.patValue}>Rajesh Kumar · Male · 34 yrs</Text>
          </View>
          <View style={styles.patRow}>
            <Text style={styles.patLabel}>Diagnosis:</Text>
            <Text style={styles.patValue}>Tension Headache</Text>
          </View>
        </View>

        {/* Medications */}
        <Text style={styles.sectionTitle}>Medications</Text>
        {medications.map((med, idx) => (
          <View key={idx} style={[styles.medCard, Shadows.soft]}>
            <View style={styles.medHeader}>
              <View style={[styles.medIndex, { backgroundColor: idx === 0 ? Colors.accent : idx === 1 ? Colors.amberMid : Colors.info }]}>
                <Text style={styles.medIndexText}>{idx + 1}</Text>
              </View>
              <Text style={styles.medName}>{med.name}</Text>
            </View>
            <View style={styles.medGrid}>
              <View style={styles.medGridItem}>
                <Ionicons name="medical-outline" size={16} color={Colors.accent} />
                <Text style={styles.medGridLabel}>Dose</Text>
                <Text style={styles.medGridValue}>{med.dose}</Text>
              </View>
              <View style={styles.medGridItem}>
                <Ionicons name="repeat-outline" size={16} color={Colors.amberMid} />
                <Text style={styles.medGridLabel}>Frequency</Text>
                <Text style={styles.medGridValue}>{med.freq}</Text>
              </View>
              <View style={styles.medGridItem}>
                <Ionicons name="calendar-outline" size={16} color={Colors.info} />
                <Text style={styles.medGridLabel}>Duration</Text>
                <Text style={styles.medGridValue}>{med.duration}</Text>
              </View>
            </View>
            <View style={styles.instrRow}>
              <Ionicons name="information-circle-outline" size={16} color={Colors.textMuted} />
              <Text style={styles.instrText}>{med.instructions}</Text>
            </View>
          </View>
        ))}

        {/* Notes */}
        <View style={[styles.notesCard, Shadows.soft]}>
          <Text style={styles.notesTitle}>Doctor's Notes</Text>
          <Text style={styles.notesText}>
            Adequate rest recommended. Avoid screen time for extended periods.
            Increase water intake. Return if headache worsens or new symptoms develop.
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button title="Download PDF" variant="primary" size="lg"
            icon={<Ionicons name="download-outline" size={18} color={Colors.white} />}
            onPress={() => {}} />
          <Button title="Find Medicine Nearby" variant="amber" size="lg"
            icon={<Ionicons name="location-outline" size={18} color={Colors.white} />}
            onPress={() => navigation.navigate('MedicineTab', { screen: 'MedicineSearch' })}
            style={{ marginTop: Spacing.md }} />
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
  medName: { fontSize: FontSizes.base, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  medGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  medGridItem: { alignItems: 'center', flex: 1 },
  medGridLabel: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 4 },
  medGridValue: { fontSize: FontSizes.sm, fontWeight: FontWeights.medium, color: Colors.textPrimary, marginTop: 2 },
  instrRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.md, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.border },
  instrText: { fontSize: FontSizes.sm, color: Colors.textMuted, marginLeft: Spacing.xs },
  notesCard: {
    backgroundColor: Colors.amberLight || '#FFF8E1', borderRadius: Radius.lg, padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  notesTitle: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold, color: Colors.textPrimary, marginBottom: Spacing.sm },
  notesText: { fontSize: FontSizes.sm, color: Colors.textSecondary, lineHeight: 20 },
  actions: { marginTop: Spacing.sm },
});
