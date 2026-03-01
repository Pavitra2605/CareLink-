import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Card, Badge, ListItem } from '../../components/common';

const conditions = [
  { name: 'Type 2 Diabetes', since: '2020', status: 'Ongoing', icon: 'water', color: Colors.amberMid },
  { name: 'Hypertension', since: '2021', status: 'Controlled', icon: 'heart', color: Colors.error },
  { name: 'Appendectomy', since: '2015', status: 'Resolved', icon: 'cut', color: Colors.success },
];

const allergies = [
  { name: 'Penicillin', severity: 'Severe', reaction: 'Anaphylaxis' },
  { name: 'Dust Mites', severity: 'Mild', reaction: 'Rhinitis' },
];

const familyHistory = [
  { relation: 'Father', condition: 'Heart Disease' },
  { relation: 'Mother', condition: 'Diabetes Type 2' },
  { relation: 'Grandmother', condition: 'Hypertension' },
];

export default function MedicalHistoryScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Header title="Medical History" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Current Conditions */}
        <Text style={styles.sectionTitle}>Current & Past Conditions</Text>
        {conditions.map((c, i) => (
          <View key={i} style={[styles.condCard, Shadows.soft]}>
            <View style={[styles.condIcon, { backgroundColor: c.color + '20' }]}>
              <Ionicons name={c.icon} size={20} color={c.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.condName}>{c.name}</Text>
              <Text style={styles.condSince}>Since {c.since}</Text>
            </View>
            <Badge label={c.status}
              variant={c.status === 'Ongoing' ? 'warning' : c.status === 'Controlled' ? 'info' : 'success'}
              size="sm" />
          </View>
        ))}

        {/* Allergies */}
        <Text style={styles.sectionTitle}>Allergies</Text>
        <Card>
          {allergies.map((a, i) => (
            <View key={i} style={[styles.allergyRow, i > 0 && { borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: Spacing.md }]}>
              <Ionicons name="alert-circle" size={20} color={a.severity === 'Severe' ? Colors.error : Colors.amberMid} />
              <View style={{ flex: 1, marginLeft: Spacing.md }}>
                <Text style={styles.allergyName}>{a.name}</Text>
                <Text style={styles.allergyDetail}>Reaction: {a.reaction}</Text>
              </View>
              <Badge label={a.severity} variant={a.severity === 'Severe' ? 'error' : 'warning'} size="sm" />
            </View>
          ))}
        </Card>

        {/* Surgeries / Procedures */}
        <Text style={styles.sectionTitle}>Surgeries & Procedures</Text>
        <Card>
          <ListItem title="Appendectomy" subtitle="Laparoscopic · 2015"
            leftIcon={<Ionicons name="cut" size={20} color={Colors.accent} />} />
          <ListItem title="Wisdom Tooth Extraction" subtitle="2019"
            leftIcon={<Ionicons name="medical" size={20} color={Colors.accent} />} showDivider={false} />
        </Card>

        {/* Family History */}
        <Text style={styles.sectionTitle}>Family History</Text>
        <Card>
          {familyHistory.map((f, i) => (
            <View key={i} style={[styles.familyRow, i > 0 && { borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: Spacing.sm }]}>
              <Ionicons name="people" size={18} color={Colors.textMuted} />
              <Text style={styles.familyRelation}>{f.relation}</Text>
              <Text style={styles.familyCond}>{f.condition}</Text>
            </View>
          ))}
        </Card>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md },
  sectionTitle: {
    fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.textPrimary,
    marginBottom: Spacing.md, marginTop: Spacing.sm,
  },
  condCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.sm,
  },
  condIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  condName: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  condSince: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
  allergyRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  allergyName: { fontSize: FontSizes.md, fontWeight: FontWeights.medium, color: Colors.textPrimary },
  allergyDetail: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
  familyRow: { flexDirection: 'row', alignItems: 'center', paddingBottom: Spacing.sm, gap: Spacing.sm },
  familyRelation: { fontSize: FontSizes.md, fontWeight: FontWeights.medium, color: Colors.textPrimary, width: 100 },
  familyCond: { fontSize: FontSizes.md, color: Colors.textSecondary, flex: 1 },
});
