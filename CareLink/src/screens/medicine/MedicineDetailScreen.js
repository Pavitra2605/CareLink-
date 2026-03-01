import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button, Card, Badge } from '../../components/common';

const medicine = {
  name: 'Paracetamol 500mg',
  brand: 'Crocin',
  salt: 'Paracetamol / Acetaminophen',
  type: 'Tablet',
  rxRequired: false,
  category: 'Pain Relief & Fever',
  price: '₹30 (strip of 10)',
  manufacturer: 'GSK Consumer Healthcare',
  dosage: '1-2 tablets every 4-6 hours',
  maxDose: 'Do not exceed 8 tablets in 24 hours',
  uses: ['Fever', 'Headache', 'Toothache', 'Body aches', 'Cold & flu symptoms'],
  sideEffects: ['Nausea (rare)', 'Allergic reaction (very rare)', 'Liver damage (overdose)'],
  warnings: ['Do not use with alcohol', 'Consult doctor if symptoms persist > 3 days', 'Not for children under 6 without doctor advice'],
};

export default function MedicineDetailScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Header title="Medicine Details" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Hero */}
        <View style={[styles.heroCard, Shadows.soft]}>
          <View style={styles.pillIcon}>
            <Ionicons name="medical" size={36} color={Colors.accent} />
          </View>
          <Text style={styles.medName}>{medicine.name}</Text>
          <Text style={styles.brand}>{medicine.brand} • {medicine.manufacturer}</Text>
          <View style={styles.tagRow}>
            <Badge label={medicine.type} variant="info" size="sm" />
            <Badge label={medicine.category} variant="neutral" size="sm" />
            <Badge label={medicine.rxRequired ? 'Rx Required' : 'OTC'} variant={medicine.rxRequired ? 'warning' : 'success'} size="sm" />
          </View>
          <Text style={styles.price}>{medicine.price}</Text>
        </View>

        {/* Salt composition */}
        <Card title="Salt Composition">
          <Text style={styles.saltText}>{medicine.salt}</Text>
        </Card>

        {/* Dosage */}
        <Card title="Dosage" style={{ marginTop: Spacing.md }}>
          <View style={styles.dosageRow}>
            <Ionicons name="medical" size={18} color={Colors.accent} />
            <Text style={styles.dosageText}>{medicine.dosage}</Text>
          </View>
          <View style={styles.dosageRow}>
            <Ionicons name="alert-circle" size={18} color={Colors.amberMid} />
            <Text style={styles.dosageText}>{medicine.maxDose}</Text>
          </View>
        </Card>

        {/* Uses */}
        <Card title="Common Uses" style={{ marginTop: Spacing.md }}>
          {medicine.uses.map((u, i) => (
            <View key={i} style={styles.listRow}>
              <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
              <Text style={styles.listText}>{u}</Text>
            </View>
          ))}
        </Card>

        {/* Side effects */}
        <Card title="Side Effects" style={{ marginTop: Spacing.md }}>
          {medicine.sideEffects.map((s, i) => (
            <View key={i} style={styles.listRow}>
              <Ionicons name="warning" size={18} color={Colors.amberMid} />
              <Text style={styles.listText}>{s}</Text>
            </View>
          ))}
        </Card>

        {/* Warnings */}
        <Card title="Warnings" variant="amber" style={{ marginTop: Spacing.md }}>
          {medicine.warnings.map((w, i) => (
            <View key={i} style={styles.listRow}>
              <Ionicons name="alert-circle" size={18} color={Colors.error} />
              <Text style={styles.listText}>{w}</Text>
            </View>
          ))}
        </Card>

        <View style={styles.btnRow}>
          <Button label="Find Pharmacy" onPress={() => navigation.navigate('PharmacyResults')} style={{ flex: 1 }} />
          <Button label="Alternatives" variant="outline"
            onPress={() => navigation.navigate('GenericAlternatives')} style={{ flex: 1 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  content: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.lg, paddingBottom: 60 },
  heroCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.xl,
    alignItems: 'center', marginBottom: Spacing.lg,
  },
  pillIcon: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.accent + '15',
    justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.md,
  },
  medName: { fontSize: FontSizes.xl, fontWeight: FontWeights.bold, color: Colors.textPrimary },
  brand: { fontSize: FontSizes.md, color: Colors.textMuted, marginTop: Spacing.xs },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, marginTop: Spacing.md, justifyContent: 'center' },
  price: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.accent, marginTop: Spacing.md },
  saltText: { fontSize: FontSizes.md, color: Colors.textSecondary },
  dosageRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.xs },
  dosageText: { fontSize: FontSizes.md, color: Colors.textSecondary, flex: 1 },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 4 },
  listText: { fontSize: FontSizes.md, color: Colors.textSecondary, flex: 1 },
  btnRow: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.xl },
});
