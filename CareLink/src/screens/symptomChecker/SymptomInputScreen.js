import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button } from '../../components/common';
import { useLanguage } from '../../i18n';

const commonSymptoms = [
  'Fever', 'Headache', 'Cough', 'Sore throat', 'Body aches',
  'Nausea', 'Dizziness', 'Fatigue', 'Shortness of breath', 'Vomiting',
  'Chest pain', 'Abdominal pain', 'Joint pain', 'Rash', 'Diarrhoea',
];

const durations = ['Today', '2-3 days', '1 week', '2+ weeks', 'Ongoing'];

export default function SymptomInputScreen({ navigation, route }) {
  const { t } = useLanguage();
  const [text, setText] = useState('');
  const [selected, setSelected] = useState([]);
  const [duration, setDuration] = useState(null);

  const toggleSymptom = (s) => {
    setSelected(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const canContinue = (selected.length > 0 || text.trim().length > 0) && duration;

  return (
    <View style={styles.container}>
      <Header title={t('symptomChecker.symptomInput')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Free text */}
        <Text style={styles.sectionLabel}>Describe what you're feeling</Text>
        <TextInput style={styles.textArea} multiline numberOfLines={4}
          placeholder="e.g. I have a severe headache and mild fever since yesterday..."
          placeholderTextColor={Colors.textMuted} value={text} onChangeText={setText}
        />

        {/* Quick select */}
        <Text style={styles.sectionLabel}>Or select common symptoms</Text>
        <View style={styles.chipRow}>
          {commonSymptoms.map(s => (
            <TouchableOpacity key={s}
              style={[styles.chip, selected.includes(s) && styles.chipSelected]}
              onPress={() => toggleSymptom(s)}>
              <Text style={[styles.chipText, selected.includes(s) && styles.chipTextSelected]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Duration */}
        <Text style={styles.sectionLabel}>How long have you had these symptoms?</Text>
        <View style={styles.chipRow}>
          {durations.map(d => (
            <TouchableOpacity key={d}
              style={[styles.durChip, duration === d && styles.durChipSelected]}
              onPress={() => setDuration(d)}>
              <Text style={[styles.durText, duration === d && styles.durTextSelected]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Selected summary */}
        {selected.length > 0 && (
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>{selected.length} symptom(s) selected</Text>
            <Text style={styles.summaryList}>{selected.join(', ')}</Text>
          </View>
        )}

        <Button label="Analyze Symptoms" onPress={() => navigation.navigate('ClarifyingQuestions', {
          symptoms: selected, text, duration,
        })} disabled={!canContinue} style={{ marginTop: Spacing.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  content: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.lg, paddingBottom: 60 },
  sectionLabel: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold, color: Colors.textPrimary, marginBottom: Spacing.sm, marginTop: Spacing.lg },
  textArea: {
    backgroundColor: Colors.surface, borderRadius: Radius.md, borderWidth: 1,
    borderColor: Colors.border, padding: Spacing.md, fontSize: FontSizes.md,
    color: Colors.textPrimary, textAlignVertical: 'top', minHeight: 100,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  chip: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.full,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
  },
  chipSelected: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  chipText: { fontSize: FontSizes.sm, color: Colors.textSecondary },
  chipTextSelected: { color: Colors.white, fontWeight: FontWeights.medium },
  durChip: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.md,
    backgroundColor: Colors.bgSecondary, borderWidth: 1, borderColor: Colors.border,
  },
  durChipSelected: { backgroundColor: Colors.accent + '15', borderColor: Colors.accent },
  durText: { fontSize: FontSizes.sm, color: Colors.textSecondary },
  durTextSelected: { color: Colors.accent, fontWeight: FontWeights.semiBold },
  summaryBox: {
    backgroundColor: Colors.accent + '10', borderRadius: Radius.md, padding: Spacing.md, marginTop: Spacing.lg,
  },
  summaryTitle: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold, color: Colors.accent },
  summaryList: { fontSize: FontSizes.sm, color: Colors.textSecondary, marginTop: 4 },
});
