import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Badge } from '../../components/common';

const steps = [
  { title: 'Ensure Safety', desc: 'Make sure the area is safe for you and the patient. Remove any hazards.', icon: 'shield-checkmark' },
  { title: 'Check Responsiveness', desc: 'Tap the person and shout. Ask "Are you okay?" Check for breathing.', icon: 'person' },
  { title: 'Call for Help', desc: 'Call 108 (Ambulance) or ask someone nearby to call immediately.', icon: 'call' },
  { title: 'Control Bleeding', desc: 'Apply direct pressure with a clean cloth. Elevate the injured area if possible.', icon: 'bandage' },
  { title: 'Keep Patient Warm', desc: 'Cover with a blanket. Do not give food or water if unconscious.', icon: 'thermometer' },
  { title: 'Monitor Breathing', desc: 'Keep checking breathing until help arrives. Be ready to perform CPR if trained.', icon: 'pulse' },
];

export default function FirstAidInstructionsScreen({ navigation, route }) {
  const type = route?.params?.type || 'General';
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <View style={styles.container}>
      <Header title="First Aid Guide" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Type Badge */}
        <View style={styles.typeRow}>
          <Badge label={type} variant="error" />
          <Text style={styles.stepCounter}>Step {currentStep + 1} of {steps.length}</Text>
        </View>

        {/* Current Step Card */}
        <View style={[styles.stepCard, Shadows.soft]}>
          <View style={styles.stepIconCircle}>
            <Ionicons name={steps[currentStep].icon} size={36} color={Colors.accent} />
          </View>
          <Text style={styles.stepTitle}>{steps[currentStep].title}</Text>
          <Text style={styles.stepDesc}>{steps[currentStep].desc}</Text>
        </View>

        {/* Navigation */}
        <View style={styles.navRow}>
          <TouchableOpacity style={[styles.navBtn, currentStep === 0 && styles.navBtnDisabled]}
            onPress={() => currentStep > 0 && setCurrentStep(currentStep - 1)}>
            <Ionicons name="arrow-back" size={20} color={currentStep === 0 ? Colors.textMuted : Colors.accent} />
            <Text style={[styles.navText, currentStep === 0 && { color: Colors.textMuted }]}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navBtn, styles.navBtnNext]}
            onPress={() => currentStep < steps.length - 1 ? setCurrentStep(currentStep + 1) : navigation.navigate('NextSteps', { type })}>
            <Text style={styles.navTextNext}>{currentStep < steps.length - 1 ? 'Next Step' : 'What\'s Next'}</Text>
            <Ionicons name="arrow-forward" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* All Steps Overview */}
        <Text style={styles.sectionTitle}>All Steps</Text>
        {steps.map((s, i) => (
          <TouchableOpacity key={i} style={[styles.stepListItem, i === currentStep && styles.stepListActive]}
            onPress={() => setCurrentStep(i)}>
            <View style={[styles.stepNum, i <= currentStep ? { backgroundColor: Colors.accent } : { backgroundColor: Colors.border }]}>
              {i < currentStep ? (
                <Ionicons name="checkmark" size={14} color={Colors.white} />
              ) : (
                <Text style={styles.stepNumText}>{i + 1}</Text>
              )}
            </View>
            <Text style={[styles.stepListText, i === currentStep && { fontWeight: FontWeights.bold, color: Colors.accent }]}>{s.title}</Text>
          </TouchableOpacity>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md },
  typeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  stepCounter: { fontSize: FontSizes.sm, color: Colors.textMuted },
  stepCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.xl,
    alignItems: 'center', marginBottom: Spacing.lg,
  },
  stepIconCircle: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.bgSecondary,
    justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.lg,
  },
  stepTitle: { fontSize: FontSizes.xxl, fontWeight: FontWeights.bold, color: Colors.textPrimary, textAlign: 'center' },
  stepDesc: { fontSize: FontSizes.md, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.md, lineHeight: 24 },
  navRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xl },
  navBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: Spacing.md, borderRadius: Radius.lg, backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border, gap: Spacing.xs,
  },
  navBtnDisabled: { opacity: 0.5 },
  navBtnNext: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  navText: { fontSize: FontSizes.md, fontWeight: FontWeights.medium, color: Colors.accent },
  navTextNext: { fontSize: FontSizes.md, fontWeight: FontWeights.medium, color: Colors.white },
  sectionTitle: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.textPrimary, marginBottom: Spacing.md },
  stepListItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  stepListActive: { backgroundColor: Colors.accent + '10', marginHorizontal: -Spacing.base, paddingHorizontal: Spacing.base, borderRadius: Radius.md },
  stepNum: {
    width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center',
    marginRight: Spacing.md,
  },
  stepNumText: { fontSize: FontSizes.sm, fontWeight: FontWeights.bold, color: Colors.white },
  stepListText: { fontSize: FontSizes.md, color: Colors.textPrimary },
});
