import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows, Gradients } from '../../theme';
import { Header, Card } from '../../components/common';

const features = [
  { icon: 'body', label: 'Body Map', desc: 'Tap to select affected area', screen: 'BodyDiagram' },
  { icon: 'create', label: 'Describe Symptoms', desc: 'Type or speak your symptoms', screen: 'SymptomInput' },
  { icon: 'time', label: 'History', desc: 'View past symptom checks', screen: 'SymptomHistory' },
];

export default function SymptomCheckerHomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Header title="Symptom Checker" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Hero */}
        <LinearGradient colors={Gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.hero}>
          <Ionicons name="medical" size={48} color={Colors.white} />
          <Text style={styles.heroTitle}>AI-Powered Symptom Assessment</Text>
          <Text style={styles.heroSub}>
            Describe your symptoms for an initial assessment. This is not a diagnosis — always consult a doctor.
          </Text>
        </LinearGradient>

        {/* Feature cards */}
        {features.map((f, i) => (
          <TouchableOpacity key={i} style={[styles.featureCard, Shadows.soft]}
            onPress={() => navigation.navigate(f.screen)} activeOpacity={0.7}>
            <View style={styles.featureIcon}>
              <Ionicons name={f.icon} size={28} color={Colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.featureLabel}>{f.label}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        ))}

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Ionicons name="alert-circle-outline" size={20} color={Colors.amberMid} />
          <Text style={styles.disclaimerText}>
            This tool provides general health information only. It is not a substitute for professional medical advice, diagnosis, or treatment. In case of emergency, call 108.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  content: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.lg, paddingBottom: 60 },
  hero: { borderRadius: Radius.lg, padding: Spacing.xl, alignItems: 'center', marginBottom: Spacing.lg },
  heroTitle: { fontSize: FontSizes.xl, fontWeight: FontWeights.bold, color: Colors.white, textAlign: 'center', marginTop: Spacing.md },
  heroSub: { fontSize: FontSizes.md, color: Colors.white + 'CC', textAlign: 'center', marginTop: Spacing.sm, lineHeight: 22 },
  featureCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.md,
  },
  featureIcon: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.accent + '15',
    justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md,
  },
  featureLabel: { fontSize: FontSizes.base, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  featureDesc: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
  disclaimer: {
    flexDirection: 'row', gap: Spacing.sm, backgroundColor: Colors.amberMid + '10',
    borderRadius: Radius.md, padding: Spacing.md, marginTop: Spacing.md,
  },
  disclaimerText: { flex: 1, fontSize: FontSizes.xs, color: Colors.textSecondary, lineHeight: 18 },
});
