import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button, Card, Badge } from '../../components/common';

const presetQuestions = [
  'What could be causing my symptoms?',
  'Is this condition serious?',
  'When should I visit a hospital?',
  'What tests should I get done?',
  'Can I take any medicine for relief?',
];

export default function DoctorQuestionsScreen({ navigation }) {
  const [selected, setSelected] = useState([]);
  const [custom, setCustom] = useState('');

  const toggleQ = (q) => {
    setSelected(prev => prev.includes(q) ? prev.filter(x => x !== q) : [...prev, q]);
  };

  return (
    <View style={styles.container}>
      <Header title="Questions for Doctor" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.infoBox}>
          <Ionicons name="chatbubbles" size={28} color={Colors.accent} />
          <Text style={styles.infoTitle}>Prepare for Your Consultation</Text>
          <Text style={styles.infoDesc}>
            Select questions you'd like to ask your doctor or write your own. These will be shared during your teleconsultation.
          </Text>
        </View>

        <Text style={styles.sectionLabel}>Suggested Questions</Text>
        {presetQuestions.map((q, i) => (
          <TouchableOpacity key={i} style={[styles.questionCard, selected.includes(q) && styles.questionSelected]}
            onPress={() => toggleQ(q)} activeOpacity={0.7}>
            <Ionicons name={selected.includes(q) ? 'checkbox' : 'square-outline'}
              size={22} color={selected.includes(q) ? Colors.accent : Colors.textMuted} />
            <Text style={[styles.questionText, selected.includes(q) && { color: Colors.accent }]}>{q}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionLabel}>Your Questions</Text>
        <TextInput style={styles.input} multiline numberOfLines={3}
          placeholder="Type any additional questions here..."
          placeholderTextColor={Colors.textMuted} value={custom} onChangeText={setCustom} />

        {(selected.length > 0 || custom.trim()) && (
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>
              {selected.length + (custom.trim() ? 1 : 0)} question(s) prepared
            </Text>
          </View>
        )}

        <Button label="Book Teleconsultation" onPress={() => navigation.navigate('ConsultSpecialty')}
          style={{ marginTop: Spacing.xl }} />
        <Button label="Save Questions" variant="outline" onPress={() => navigation.goBack()}
          style={{ marginTop: Spacing.sm }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  content: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.lg, paddingBottom: 60 },
  infoBox: {
    backgroundColor: Colors.accent + '10', borderRadius: Radius.lg, padding: Spacing.xl,
    alignItems: 'center', marginBottom: Spacing.lg,
  },
  infoTitle: { fontSize: FontSizes.lg, fontWeight: FontWeights.semiBold, color: Colors.textPrimary, marginTop: Spacing.sm },
  infoDesc: { fontSize: FontSizes.md, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.xs, lineHeight: 22 },
  sectionLabel: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold, color: Colors.textPrimary, marginBottom: Spacing.sm, marginTop: Spacing.md },
  questionCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.surface,
    borderRadius: Radius.md, padding: Spacing.lg, marginBottom: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border,
  },
  questionSelected: { borderColor: Colors.accent, backgroundColor: Colors.accent + '08' },
  questionText: { flex: 1, fontSize: FontSizes.md, color: Colors.textPrimary },
  input: {
    backgroundColor: Colors.surface, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.md, fontSize: FontSizes.md, color: Colors.textPrimary,
    textAlignVertical: 'top', minHeight: 80,
  },
  summaryBox: {
    backgroundColor: Colors.success + '10', borderRadius: Radius.md, padding: Spacing.md, marginTop: Spacing.md,
  },
  summaryTitle: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold, color: Colors.success },
});
