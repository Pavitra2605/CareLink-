import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button, Card, Badge } from '../../components/common';
import { useLanguage } from '../../i18n';

const results = [
  { id: 1, name: 'Viral Fever', match: 85, severity: 'Moderate', icon: 'thermometer' },
  { id: 2, name: 'Common Cold', match: 60, severity: 'Mild', icon: 'water' },
  { id: 3, name: 'Seasonal Flu', match: 45, severity: 'Moderate', icon: 'snow' },
];

const sevConfig = {
  Mild: { color: Colors.success, bg: Colors.success + '15' },
  Moderate: { color: Colors.amberMid, bg: Colors.amberMid + '15' },
  Severe: { color: Colors.error, bg: Colors.error + '15' },
};

export default function SymptomResultsScreen({ navigation }) {
  const { t } = useLanguage();
  return (
    <View style={styles.container}>
      <Header title={t('symptomChecker.results')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Ionicons name="information-circle" size={20} color={Colors.accent} />
          <Text style={styles.disclaimerText}>
            These results are AI-generated suggestions, not medical diagnoses. Please consult a healthcare professional.
          </Text>
        </View>

        {/* Top result */}
        <View style={[styles.topCard, Shadows.soft]}>
          <View style={styles.topIconWrap}>
            <Ionicons name={results[0].icon} size={32} color={Colors.accent} />
          </View>
          <Text style={styles.topName}>{results[0].name}</Text>
          <Text style={styles.topMatch}>{results[0].match}% match</Text>
          <Badge label={results[0].severity}
            variant={results[0].severity === 'Mild' ? 'success' : results[0].severity === 'Moderate' ? 'warning' : 'error'} />
          <View style={styles.matchBar}>
            <View style={[styles.matchFill, { width: `${results[0].match}%` }]} />
          </View>
        </View>

        {/* Other possibilities */}
        <Text style={styles.sectionLabel}>Other Possibilities</Text>
        {results.slice(1).map(r => (
          <View key={r.id} style={[styles.resultCard, Shadows.soft]}>
            <Ionicons name={r.icon} size={24} color={Colors.accent} />
            <View style={{ flex: 1 }}>
              <Text style={styles.resultName}>{r.name}</Text>
              <View style={styles.miniBar}>
                <View style={[styles.miniFill, { width: `${r.match}%` }]} />
              </View>
            </View>
            <Text style={styles.matchPercent}>{r.match}%</Text>
            <Badge label={r.severity}
              variant={r.severity === 'Mild' ? 'success' : r.severity === 'Moderate' ? 'warning' : 'error'} size="sm" />
          </View>
        ))}

        {/* Actions */}
        <Text style={styles.sectionLabel}>Recommended Actions</Text>
        <Button label="View Recommended Actions" onPress={() => navigation.navigate('RecommendedAction')}
          style={{ marginBottom: Spacing.sm }} />
        <Button label="Consult a Doctor Now" variant="secondary"
          onPress={() => navigation.navigate('DoctorQuestions')} style={{ marginBottom: Spacing.sm }} />
        <Button label="Save to Health Records" variant="outline" onPress={() => {}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  content: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.lg, paddingBottom: 60 },
  disclaimer: {
    flexDirection: 'row', gap: Spacing.sm, backgroundColor: Colors.accent + '10',
    borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.lg,
  },
  disclaimerText: { flex: 1, fontSize: FontSizes.sm, color: Colors.textSecondary, lineHeight: 20 },
  topCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.xl,
    alignItems: 'center', marginBottom: Spacing.lg,
  },
  topIconWrap: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.accent + '15',
    justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.md,
  },
  topName: { fontSize: FontSizes.xl, fontWeight: FontWeights.bold, color: Colors.textPrimary },
  topMatch: { fontSize: FontSizes.lg, color: Colors.accent, fontWeight: FontWeights.semiBold, marginVertical: Spacing.xs },
  matchBar: { width: '100%', height: 8, borderRadius: 4, backgroundColor: Colors.border, marginTop: Spacing.md },
  matchFill: { height: 8, borderRadius: 4, backgroundColor: Colors.accent },
  sectionLabel: { fontSize: FontSizes.lg, fontWeight: FontWeights.semiBold, color: Colors.textPrimary, marginBottom: Spacing.md, marginTop: Spacing.md },
  resultCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.surface,
    borderRadius: Radius.md, padding: Spacing.lg, marginBottom: Spacing.sm,
  },
  resultName: { fontSize: FontSizes.base, fontWeight: FontWeights.medium, color: Colors.textPrimary },
  miniBar: { height: 4, borderRadius: 2, backgroundColor: Colors.border, marginTop: 4, width: '100%' },
  miniFill: { height: 4, borderRadius: 2, backgroundColor: Colors.accent },
  matchPercent: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold, color: Colors.accent },
});
