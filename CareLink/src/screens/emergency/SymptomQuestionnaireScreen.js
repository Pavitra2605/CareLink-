import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button } from '../../components/common';
import { useLanguage } from '../../i18n';

export default function SymptomQuestionnaireScreen({ navigation, route }) {
  const type = route?.params?.type || 'Emergency';
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const { t } = useLanguage();

  const questions = [
    { q: t('symptomQ.q1'), options: [t('symptomQ.q1o1'), t('symptomQ.q1o2'), t('symptomQ.q1o3'), t('symptomQ.q1o4')] },
    { q: t('symptomQ.q2'), options: [t('symptomQ.q2o1'), t('symptomQ.q2o2'), t('symptomQ.q2o3'), t('symptomQ.q2o4')] },
    { q: t('symptomQ.q3'), options: [t('symptomQ.q3o1'), t('symptomQ.q3o2'), t('symptomQ.q3o3'), t('symptomQ.q3o4')] },
    { q: t('symptomQ.q4'), options: [t('symptomQ.q4o1'), t('symptomQ.q4o2'), t('symptomQ.q4o3'), t('symptomQ.q4o4')] },
  ];

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
        <Text style={styles.stepText}>{t('symptomQ.questionOf', { current: step + 1, total: questions.length })}</Text>

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

        <Button title={step < questions.length - 1 ? t('common.next') : t('symptomQ.getAssessment')}
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
