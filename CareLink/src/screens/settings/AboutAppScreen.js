import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Gradients, Shadows } from '../../theme';
import { Header, Card } from '../../components/common';
import { useLanguage } from '../../i18n';

export default function AboutAppScreen({ navigation }) {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <Header title={t('about.title')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <LinearGradient colors={Gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <Text style={styles.logo}>{t('about.logo')}</Text>
          <Text style={styles.version}>{t('about.version')}</Text>
          <Text style={styles.tagline}>{t('about.tagline')}</Text>
        </LinearGradient>

        <Card title={t('about.aboutCardTitle')}>
          <Text style={styles.aboutText}>
            {t('about.description')}
          </Text>
        </Card>

        <Card title={t('about.features')} style={{ marginTop: Spacing.md }}>
          {[t('about.featureTelemedicine'), t('about.featureAI'), t('about.featureRecords'), t('about.featureMedicine'), t('about.featureEmergency'), t('about.featureLanguage')].map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </Card>

        <Card title={t('about.legal')} style={{ marginTop: Spacing.md }}>
          {[
            { label: t('about.termsOfService'), icon: 'document-text' },
            { label: t('about.privacyPolicy'), icon: 'shield-checkmark' },
            { label: t('about.licenses'), icon: 'code-slash' },
          ].map((item, i) => (
            <TouchableOpacity key={i} style={styles.legalRow}>
              <Ionicons name={item.icon} size={18} color={Colors.accent} />
              <Text style={styles.legalText}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </Card>

        <Text style={styles.copyright}>{t('about.copyright')}</Text>
        <Text style={styles.madeWith}>{t('about.madeWith')}</Text>
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
