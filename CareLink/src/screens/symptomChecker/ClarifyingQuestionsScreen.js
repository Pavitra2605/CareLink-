import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button } from '../../components/common';
import { useLanguage } from '../../i18n';

const questions = [
  {
    id: 1,
    question: 'Have you experienced any of these additional symptoms?',
    options: ['Chills', 'Sweating', 'Loss of appetite', 'Trouble sleeping', 'None of these'],
    multi: true,
  },
  {
    id: 2,
    question: 'How severe is the pain on a scale of 1-5?',
    options: ['1 - Mild', '2 - Slight', '3 - Moderate', '4 - Severe', '5 - Very Severe'],
    multi: false,
  },
  {
    id: 3,
    question: 'Do you have any pre-existing conditions?',
    options: ['Diabetes', 'Hypertension', 'Asthma', 'Heart disease', 'None'],
    multi: true,
  },
  {
    id: 4,
    question: 'Are you currently taking any medication?',
    options: ['Yes, prescribed', 'Yes, over-the-counter', 'No'],
    multi: false,
  },
];

export default function ClarifyingQuestionsScreen({ navigation, route }) {
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const current = questions[step];

  const toggleAnswer = (opt) => {
    if (current.multi) {
      const prev = answers[current.id] || [];
      setAnswers({
        ...answers,
        [current.id]: prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt],
      });
    } else {
      setAnswers({ ...answers, [current.id]: opt });
    }
  };

  const isSelected = (opt) => {
    const ans = answers[current.id];
    return current.multi ? (ans || []).includes(opt) : ans === opt;
  };

  const canNext = current.multi ? (answers[current.id] || []).length > 0 : !!answers[current.id];
  const isLast = step === questions.length - 1;

  return (
    <View style={styles.container}>
      <Header title={t('symptomChecker.clarifyingQuestions')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Progress */}
        <View style={styles.progressRow}>
          {questions.map((_, i) => (
            <View key={i} style={[styles.progressDot, i <= step && styles.progressDotActive]} />
          ))}
        </View>
        <Text style={styles.stepLabel}>Question {step + 1} of {questions.length}</Text>

        <Text style={styles.question}>{current.question}</Text>
        {current.multi && <Text style={styles.hint}>Select all that apply</Text>}

        {current.options.map(opt => (
          <TouchableOpacity key={opt} style={[styles.optionCard, isSelected(opt) && styles.optionSelected]}
            onPress={() => toggleAnswer(opt)} activeOpacity={0.7}>
            <Ionicons name={isSelected(opt)
              ? (current.multi ? 'checkbox' : 'radio-button-on')
              : (current.multi ? 'square-outline' : 'radio-button-off')}
              size={22} color={isSelected(opt) ? Colors.accent : Colors.textMuted} />
            <Text style={[styles.optionText, isSelected(opt) && styles.optionTextSelected]}>{opt}</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.btnRow}>
          {step > 0 && (
            <Button label="Back" variant="outline" onPress={() => setStep(s => s - 1)} style={{ flex: 1 }} />
          )}
          <Button label={isLast ? 'Get Results' : 'Next'}
            onPress={() => isLast ? navigation.navigate('SymptomResults', {
              answers,
              symptoms: route.params?.symptoms || [],
              text: route.params?.text || '',
              duration: route.params?.duration || 'Today',
            }) : setStep(s => s + 1)}
            disabled={!canNext} style={{ flex: 1 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  content: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.lg, paddingBottom: 60 },
  progressRow: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  progressDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.border },
  progressDotActive: { backgroundColor: Colors.accent },
  stepLabel: { fontSize: FontSizes.sm, color: Colors.textMuted, textAlign: 'center', marginBottom: Spacing.lg },
  question: { fontSize: FontSizes.lg, fontWeight: FontWeights.semiBold, color: Colors.textPrimary, marginBottom: Spacing.sm },
  hint: { fontSize: FontSizes.sm, color: Colors.textMuted, marginBottom: Spacing.md },
  optionCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.surface,
    borderRadius: Radius.md, padding: Spacing.lg, marginBottom: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border,
  },
  optionSelected: { borderColor: Colors.accent, backgroundColor: Colors.accent + '08' },
  optionText: { fontSize: FontSizes.base, color: Colors.textPrimary },
  optionTextSelected: { color: Colors.accent, fontWeight: FontWeights.medium },
  btnRow: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.xl },
});
