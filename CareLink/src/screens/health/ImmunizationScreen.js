import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Card, Badge } from '../../components/common';
import { useLanguage } from '../../i18n';

const vaccines = [
  { name: 'COVID-19 (Covishield)', date: '15 Mar 2021', dose: 'Dose 1', status: 'done' },
  { name: 'COVID-19 (Covishield)', date: '15 Jun 2021', dose: 'Dose 2', status: 'done' },
  { name: 'COVID-19 Booster', date: '10 Jan 2022', dose: 'Booster', status: 'done' },
  { name: 'Influenza (Flu Shot)', date: '05 Oct 2024', dose: 'Annual', status: 'done' },
  { name: 'Tetanus (Td)', date: '20 Aug 2019', dose: 'Booster', status: 'done' },
  { name: 'Hepatitis B', date: '—', dose: 'Due', status: 'due' },
];

export default function ImmunizationScreen({ navigation }) {
  const { t } = useLanguage();
  return (
    <View style={styles.container}>
      <Header title={t('health.immunization')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Summary */}
        <View style={[styles.summaryRow, Shadows.soft]}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNum}>5</Text>
            <Text style={styles.summaryLabel}>Completed</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNum, { color: Colors.amberMid }]}>1</Text>
            <Text style={styles.summaryLabel}>Due</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNum, { color: Colors.success }]}>0</Text>
            <Text style={styles.summaryLabel}>Overdue</Text>
          </View>
        </View>

        {/* Vaccine List */}
        <Text style={styles.sectionTitle}>Vaccination History</Text>
        {vaccines.map((v, i) => (
          <View key={i} style={[styles.vaccineCard, Shadows.soft]}>
            <View style={[styles.statusDot, { backgroundColor: v.status === 'done' ? Colors.success : Colors.amberMid }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.vaccineName}>{v.name}</Text>
              <View style={styles.metaRow}>
                {v.status === 'done' ? (
                  <>
                    <Ionicons name="calendar-outline" size={14} color={Colors.textMuted} />
                    <Text style={styles.metaText}>{v.date}</Text>
                  </>
                ) : (
                  <Text style={[styles.metaText, { color: Colors.amberMid }]}>Vaccination due</Text>
                )}
              </View>
            </View>
            <Badge label={v.dose} variant={v.status === 'done' ? 'neutral' : 'warning'} size="sm" />
          </View>
        ))}

        {/* Upcoming */}
        <Text style={styles.sectionTitle}>Upcoming Vaccinations</Text>
        <Card variant="amber">
          <View style={styles.upcomingRow}>
            <Ionicons name="shield-checkmark" size={24} color={Colors.amberMid} />
            <View style={{ flex: 1, marginLeft: Spacing.md }}>
              <Text style={styles.upName}>Hepatitis B</Text>
              <Text style={styles.upNote}>Recommended for adults at risk. Consult your doctor.</Text>
            </View>
          </View>
        </Card>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md },
  summaryRow: {
    flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: Spacing.lg, marginBottom: Spacing.lg,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryDivider: { width: 1, backgroundColor: Colors.border },
  summaryNum: { fontSize: FontSizes.xxl, fontWeight: FontWeights.bold, color: Colors.accent },
  summaryLabel: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 4 },
  sectionTitle: {
    fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  vaccineCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.sm,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: Spacing.md },
  vaccineName: { fontSize: FontSizes.md, fontWeight: FontWeights.medium, color: Colors.textPrimary },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  metaText: { fontSize: FontSizes.sm, color: Colors.textMuted },
  upcomingRow: { flexDirection: 'row', alignItems: 'center' },
  upName: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  upNote: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
});
