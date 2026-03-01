import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button } from '../../components/common';

const questions = [
  { q: 'How long has this been happening?', options: ['Just now', 'Less than 1 hour', '1-6 hours', 'More than 6 hours'] },
  { q: 'Rate the severity (1-10)', options: ['1-3 (Mild)', '4-6 (Moderate)', '7-8 (Severe)', '9-10 (Critical)'] },
  { q: 'Is the person conscious?', options: ['Yes, fully alert', 'Drowsy / Confused', 'Unconscious but breathing', 'Not breathing'] },
  { q: 'Any bleeding?', options: ['No bleeding', 'Minor bleeding', 'Moderate bleeding', 'Heavy bleeding'] },
];

export default function SymptomQuestionnaireScreen({ navigation, route }) {
  const type = route?.params?.type || 'Emergency';
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const current = questions[step];

  const handleAnswer = (ans) => {
    setAnswers(prev => ({ ...prev, [step]: ans }));
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      navigation.navigate('SeverityResult', { type, answers });
    }
  };

  return (
    <View style={styles.container}>
      <Header title={type} onBack={() => step > 0 ? setStep(step - 1) : navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Progress */}
        <View style={styles.progressRow}>
          {questions.map((_, i) => (
            <View key={i} style={[styles.progressDot, i <= step && styles.progressDotActive]} />
          ))}
        </View>
        <Text style={styles.stepText}>Question {step + 1} of {questions.length}</Text>

        {/* Question */}
        <Text style={styles.question}>{current.q}</Text>

        {/* Options */}
        {current.options.map((opt, i) => (
          <TouchableOpacity key={i}
            style={[styles.optionCard, answers[step] === opt && styles.optionActive, Shadows.soft]}
            onPress={() => handleAnswer(opt)}>
            <View style={[styles.radio, answers[step] === opt && styles.radioActive]}>
              {answers[step] === opt && <View style={styles.radioDot} />}
            </View>
            <Text style={[styles.optionText, answers[step] === opt && { color: Colors.accent, fontWeight: FontWeights.semiBold }]}>{opt}</Text>
          </TouchableOpacity>
        ))}

        <Button title={step < questions.length - 1 ? 'Next' : 'Get Assessment'}
          variant="primary" size="lg" disabled={!answers[step]}
          onPress={handleNext} style={{ marginTop: Spacing.xl }}
          icon={<Ionicons name={step < questions.length - 1 ? 'arrow-forward' : 'checkmark-circle'} size={18} color={Colors.white} />} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md },
  progressRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },
  progressDot: { flex: 1, height: 4, borderRadius: 2, backgroundColor: Colors.border },
  progressDotActive: { backgroundColor: Colors.accent },
  stepText: { fontSize: FontSizes.sm, color: Colors.textMuted, marginBottom: Spacing.xl },
  question: { fontSize: FontSizes.xxl, fontWeight: FontWeights.bold, color: Colors.textPrimary, marginBottom: Spacing.xl, lineHeight: 32 },
  optionCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.md,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  optionActive: { borderColor: Colors.accent, backgroundColor: Colors.accent + '10' },
  radio: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.border,
    justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md,
  },
  radioActive: { borderColor: Colors.accent },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.accent },
  optionText: { fontSize: FontSizes.md, color: Colors.textPrimary, flex: 1 },
});
