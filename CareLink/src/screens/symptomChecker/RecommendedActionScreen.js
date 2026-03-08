import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button, Card } from '../../components/common';
import { useLanguage } from '../../i18n';

const actions = [
  {
    icon: 'home', color: Colors.success,
    title: 'Home Care',
    items: ['Rest and stay hydrated', 'Take paracetamol for fever (as directed)', 'Monitor temperature every 4 hours', 'Eat light, easily digestible food'],
  },
  {
    icon: 'medical', color: Colors.accent,
    title: 'Medical Consultation',
    items: ['Schedule a teleconsultation within 24 hours', 'Inform the doctor about all symptoms', 'Share your symptom check report'],
  },
  {
    icon: 'alert-circle', color: Colors.error,
    title: 'Seek Immediate Help If',
    items: ['Temperature exceeds 103°F / 39.4°C', 'Difficulty breathing or chest pain', 'Persistent vomiting', 'Confusion or severe drowsiness'],
  },
];

const otcMeds = [
  { name: 'Paracetamol 500mg', use: 'For fever & pain', note: 'Max 4 tablets/day' },
  { name: 'ORS Sachets', use: 'For hydration', note: '1 sachet in 1L water' },
];

export default function RecommendedActionScreen({ navigation }) {
  const { t } = useLanguage();
  return (
    <View style={styles.container}>
      <Header title={t('symptomChecker.recommendedAction')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        {actions.map((a, i) => (
          <View key={i} style={[styles.actionCard, Shadows.soft]}>
            <View style={[styles.iconCircle, { backgroundColor: a.color + '15' }]}>
              <Ionicons name={a.icon} size={24} color={a.color} />
            </View>
            <Text style={styles.actionTitle}>{a.title}</Text>
            {a.items.map((item, j) => (
              <View key={j} style={styles.listItem}>
                <Ionicons name="checkmark-circle" size={18} color={a.color} />
                <Text style={styles.listText}>{item}</Text>
              </View>
            ))}
          </View>
        ))}

        <Text style={styles.sectionLabel}>Suggested OTC Medicines</Text>
        {otcMeds.map((m, i) => (
          <View key={i} style={[styles.medCard, Shadows.soft]}>
            <Ionicons name="medkit" size={22} color={Colors.accent} />
            <View style={{ flex: 1 }}>
              <Text style={styles.medName}>{m.name}</Text>
              <Text style={styles.medUse}>{m.use}</Text>
            </View>
            <Text style={styles.medNote}>{m.note}</Text>
          </View>
        ))}

        <Button label="Consult a Doctor" onPress={() => navigation.navigate('DoctorQuestions')}
          style={{ marginTop: Spacing.xl }} />
        <Button label="Find Nearby Pharmacy" variant="outline"
          onPress={() => {}} style={{ marginTop: Spacing.sm }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  content: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.lg, paddingBottom: 60 },
  actionCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.md,
  },
  iconCircle: {
    width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center',
    marginBottom: Spacing.md,
  },
  actionTitle: { fontSize: FontSizes.lg, fontWeight: FontWeights.semiBold, color: Colors.textPrimary, marginBottom: Spacing.sm },
  listItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 4 },
  listText: { fontSize: FontSizes.md, color: Colors.textSecondary, flex: 1 },
  sectionLabel: { fontSize: FontSizes.lg, fontWeight: FontWeights.semiBold, color: Colors.textPrimary, marginTop: Spacing.lg, marginBottom: Spacing.md },
  medCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.lg, marginBottom: Spacing.sm,
  },
  medName: { fontSize: FontSizes.base, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  medUse: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
  medNote: { fontSize: FontSizes.xs, color: Colors.accent, fontWeight: FontWeights.medium },
});
