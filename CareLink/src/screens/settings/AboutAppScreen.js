import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Gradients, Shadows } from '../../theme';
import { Header, Card } from '../../components/common';

export default function AboutAppScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Header title="About CareLink" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <LinearGradient colors={Gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <Text style={styles.logo}>CareLink</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
          <Text style={styles.tagline}>Rural Healthcare Accessibility Platform</Text>
        </LinearGradient>

        <Card title="About">
          <Text style={styles.aboutText}>
            CareLink is a comprehensive digital health platform designed to improve healthcare accessibility for rural communities. 
            It connects patients with doctors through telemedicine, provides symptom assessment tools, tracks health records, 
            and helps locate nearby pharmacies with medicine availability.
          </Text>
        </Card>

        <Card title="Features" style={{ marginTop: Spacing.md }}>
          {['Telemedicine (Video/Audio/Text)', 'AI Symptom Checker', 'Digital Health Records', 'Medicine Finder', 'Emergency Services', 'Multi-language Support'].map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </Card>

        <Card title="Legal" style={{ marginTop: Spacing.md }}>
          {[
            { label: 'Terms of Service', icon: 'document-text' },
            { label: 'Privacy Policy', icon: 'shield-checkmark' },
            { label: 'Open Source Licenses', icon: 'code-slash' },
          ].map((item, i) => (
            <TouchableOpacity key={i} style={styles.legalRow}>
              <Ionicons name={item.icon} size={18} color={Colors.accent} />
              <Text style={styles.legalText}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </Card>

        <Text style={styles.copyright}>© 2025 CareLink. All rights reserved.</Text>
        <Text style={styles.madeWith}>Made with ❤️ for rural India</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  content: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.lg, paddingBottom: 60 },
  hero: { borderRadius: Radius.lg, padding: Spacing.xxl, alignItems: 'center', marginBottom: Spacing.lg },
  logo: { fontSize: 32, fontWeight: FontWeights.bold, color: Colors.white },
  version: { fontSize: FontSizes.md, color: Colors.white + 'CC', marginTop: Spacing.xs },
  tagline: { fontSize: FontSizes.sm, color: Colors.white + '99', marginTop: Spacing.xs },
  aboutText: { fontSize: FontSizes.md, color: Colors.textSecondary, lineHeight: 24 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 4 },
  featureText: { fontSize: FontSizes.md, color: Colors.textSecondary },
  legalRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  legalText: { flex: 1, fontSize: FontSizes.md, color: Colors.textPrimary },
  copyright: { fontSize: FontSizes.sm, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.xl },
  madeWith: { fontSize: FontSizes.sm, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.xs },
});
