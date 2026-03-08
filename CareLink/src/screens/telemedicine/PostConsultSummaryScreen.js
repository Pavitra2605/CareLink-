import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button, Card, Badge } from '../../components/common';
import { useLanguage } from '../../i18n';

export default function PostConsultSummaryScreen({ navigation, route }) {
  const { t } = useLanguage();
  const doctor = route?.params?.doctor || {};

  return (
    <View style={styles.container}>
      <Header title={t('telemedicine.postConsultSummary')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.successCard, Shadows.soft]}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark-circle" size={56} color={Colors.success} />
          </View>
          <Text style={styles.successTitle}>Consultation Complete</Text>
          <Text style={styles.successSub}>Duration: 15 minutes</Text>
        </View>

        <Card title="Doctor">
          <View style={styles.row}>
            <Ionicons name="person-circle-outline" size={32} color={Colors.accent} />
            <View style={{ marginLeft: Spacing.md }}>
              <Text style={styles.docName}>{doctor.name || 'Dr. Priya Sharma'}</Text>
              <Text style={styles.docSpec}>{doctor.specialty || 'General Physician'}</Text>
            </View>
          </View>
        </Card>

        <Card title="Diagnosis">
          <Badge label="Tension Headache" variant="info" />
          <Text style={styles.noteText}>
            Bilateral tension-type headache, likely stress-related. No red flag symptoms. Mild severity.
          </Text>
        </Card>

        <Card title="Prescription Issued">
          <View style={styles.medRow}>
            <View style={styles.medDot} />
            <View style={{ flex: 1 }}>
              <Text style={styles.medName}>Paracetamol 500mg</Text>
              <Text style={styles.medDose}>1 tablet · 3 times/day · 5 days</Text>
            </View>
          </View>
          <View style={styles.medRow}>
            <View style={[styles.medDot, { backgroundColor: Colors.amberMid }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.medName}>Vitamin B Complex</Text>
              <Text style={styles.medDose}>1 tablet · Once daily · 30 days</Text>
            </View>
          </View>
          <Button title="View Full Prescription" variant="secondary" size="sm"
            onPress={() => navigation.navigate('PrescriptionView')} style={{ marginTop: Spacing.md }} />
        </Card>

        <Card title="Follow-up">
          <View style={styles.row}>
            <Ionicons name="calendar-outline" size={20} color={Colors.accent} />
            <Text style={styles.followText}>Recommended in 7 days if symptoms persist</Text>
          </View>
          <Button title="Schedule Follow-up" variant="outline" size="sm"
            onPress={() => navigation.navigate('AppointmentBooking', { doctor })} style={{ marginTop: Spacing.md }} />
        </Card>

        <Card title="Tests Recommended">
          <View style={styles.row}>
            <Ionicons name="flask-outline" size={20} color={Colors.amberMid} />
            <Text style={styles.followText}>CBC (Complete Blood Count)</Text>
          </View>
        </Card>

        <View style={styles.actions}>
          <Button title="Find Medicine Nearby" onPress={() => navigation.navigate('MedicineSearch')}
            size="lg" variant="amber" icon={<Ionicons name="medkit" size={20} color={Colors.white} />} />
          <Button title="Go to Home" onPress={() => navigation.navigate('MainTabs')}
            size="lg" variant="outline" style={{ marginTop: Spacing.md }} />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md },
  successCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.xl,
    alignItems: 'center', marginBottom: Spacing.md,
  },
  checkCircle: { marginBottom: Spacing.md },
  successTitle: { fontSize: FontSizes.xl, fontWeight: FontWeights.bold, color: Colors.textPrimary },
  successSub: { fontSize: FontSizes.md, color: Colors.textMuted, marginTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center' },
  docName: { fontSize: FontSizes.base, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  docSpec: { fontSize: FontSizes.sm, color: Colors.textMuted },
  noteText: { fontSize: FontSizes.md, color: Colors.textSecondary, marginTop: Spacing.sm, lineHeight: 20 },
  medRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  medDot: { width: 4, height: 28, borderRadius: 2, backgroundColor: Colors.accent, marginRight: Spacing.md },
  medName: { fontSize: FontSizes.md, fontWeight: FontWeights.medium, color: Colors.textPrimary },
  medDose: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
  followText: { fontSize: FontSizes.md, color: Colors.textSecondary, marginLeft: Spacing.sm },
  actions: { marginTop: Spacing.lg },
});
