import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button, Badge, Card } from '../../components/common';

export default function ReferralNoticeScreen({ navigation, route }) {
  return (
    <View style={styles.container}>
      <Header title="Referral Notice" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Referral Banner */}
        <View style={[styles.referralBanner, Shadows.soft]}>
          <View style={styles.referIcon}>
            <Ionicons name="swap-horizontal" size={32} color={Colors.accent} />
          </View>
          <Text style={styles.referTitle}>Specialist Referral</Text>
          <Text style={styles.referSub}>Your doctor has referred you to a specialist for further evaluation.</Text>
        </View>

        {/* From Doctor */}
        <Card title="Referred By">
          <View style={styles.docRow}>
            <View style={[styles.avatar, { backgroundColor: Colors.accent }]}>
              <Ionicons name="person" size={22} color={Colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.docName}>Dr. Priya Sharma</Text>
              <Text style={styles.docSpec}>General Physician</Text>
            </View>
          </View>
        </Card>

        {/* To Specialist */}
        <Card title="Referred To">
          <View style={styles.docRow}>
            <View style={[styles.avatar, { backgroundColor: Colors.amberMid }]}>
              <Ionicons name="person" size={22} color={Colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.docName}>Dr. Vikram Reddy</Text>
              <Text style={styles.docSpec}>Neurologist</Text>
              <Badge label="Available" variant="success" size="sm" style={{ marginTop: 4, alignSelf: 'flex-start' }} />
            </View>
          </View>
        </Card>

        {/* Reason */}
        <Card title="Referral Reason">
          <Text style={styles.reasonText}>
            Persistent headaches unresponsive to standard treatment over 2 weeks.
            Need neurological evaluation to rule out underlying conditions.
          </Text>
          <View style={styles.urgencyRow}>
            <Badge label="Moderate Urgency" variant="warning" />
          </View>
        </Card>

        {/* Summary */}
        <Card title="Clinical Summary">
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Symptoms</Text>
            <Text style={styles.summaryValue}>Bilateral headache, photosensitivity, neck stiffness</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Duration</Text>
            <Text style={styles.summaryValue}>14 days</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Medications Tried</Text>
            <Text style={styles.summaryValue}>Paracetamol 500mg, Ibuprofen 200mg</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Response</Text>
            <Text style={styles.summaryValue}>Minimal improvement</Text>
          </View>
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <Button title="Book Specialist Appointment" variant="primary" size="lg"
            icon={<Ionicons name="calendar" size={18} color={Colors.white} />}
            onPress={() => navigation.navigate('AppointmentBooking', { doctor: { name: 'Dr. Vikram Reddy', specialty: 'Neurologist' } })} />
          <Button title="View Specialist Profile" variant="outline" size="lg"
            onPress={() => navigation.navigate('DoctorProfile', { doctor: { name: 'Dr. Vikram Reddy', specialty: 'Neurologist' } })}
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
  referralBanner: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.xl,
    alignItems: 'center', marginBottom: Spacing.lg,
  },
  referIcon: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.bgSecondary,
    justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.md,
  },
  referTitle: { fontSize: FontSizes.xl, fontWeight: FontWeights.bold, color: Colors.textPrimary },
  referSub: { fontSize: FontSizes.md, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.sm, lineHeight: 20 },
  docRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center',
    marginRight: Spacing.md,
  },
  docName: { fontSize: FontSizes.base, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  docSpec: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
  reasonText: { fontSize: FontSizes.md, color: Colors.textSecondary, lineHeight: 22 },
  urgencyRow: { marginTop: Spacing.md },
  summaryItem: { marginBottom: Spacing.md },
  summaryLabel: { fontSize: FontSizes.sm, color: Colors.textMuted, marginBottom: 2 },
  summaryValue: { fontSize: FontSizes.md, fontWeight: FontWeights.medium, color: Colors.textPrimary },
  actions: { marginTop: Spacing.md },
});
