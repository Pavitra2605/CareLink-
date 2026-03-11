import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';

const { width } = Dimensions.get('window');
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n';

const features = [
  { icon: 'chatbubble-ellipses', label: 'Health Chat', desc: 'Ask anything about your symptoms or health' },
  { icon: 'camera', label: 'Photo Analysis', desc: 'Snap a photo of a wound, rash, or symptom' },
  { icon: 'document-text', label: 'Report Help', desc: 'Get AI insights on your medical reports' },
  { icon: 'medkit', label: 'Medication Guide', desc: 'Check dosages, interactions & alternatives' },
];

export default function AIHomeScreen({ navigation }) {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const { profile } = useAuth();
  const firstName = profile?.full_name?.split(' ')[0] || 'there';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.heading}>{t('ai.title')}</Text>
          <Text style={styles.sub}>Powered by CareLink AI</Text>
        </View>

        {/* Single Chat Card */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => navigation.navigate('AIChat')}
        >
          <LinearGradient
            colors={['#C4682A', '#8B4A1E']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={[styles.mainCard, Shadows.medium]}
          >
            <View style={styles.mainCardIcon}>
              <Ionicons name="chatbubbles" size={32} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.mainCardTitle}>AI Health Assistant</Text>
              <Text style={styles.mainCardSub}>
                Chat with your AI doctor — ask questions or snap a photo for visual analysis, all in one conversation.
              </Text>
            </View>
            <View style={styles.mainCardArrow}>
              <Ionicons name="arrow-forward" size={22} color="#fff" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Features Grid */}
        <Text style={styles.sectionTitle}>What you can do</Text>
        <View style={styles.grid}>
          {features.map((f, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.featureCard, Shadows.soft]}
              activeOpacity={0.75}
              onPress={() => navigation.navigate('AIChat')}
            >
              <View style={styles.featureIconWrap}>
                <Ionicons name={f.icon} size={22} color={Colors.accent} />
              </View>
              <Text style={styles.featureLabel}>{f.label}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Ionicons name="information-circle-outline" size={16} color={Colors.textMuted} />
          <Text style={styles.disclaimerText}>
            AI responses are for informational purposes only and do not replace professional medical advice.
          </Text>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { paddingHorizontal: Spacing.base },
  header: { paddingVertical: Spacing.lg },
  heading: { fontSize: FontSizes.xxl, fontWeight: FontWeights.bold, color: Colors.textPrimary },
  sub: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
  mainCard: {
    flexDirection: 'row', alignItems: 'center', borderRadius: Radius.xl,
    padding: Spacing.lg, marginBottom: Spacing.md, gap: Spacing.md,
  },
  mainCardIcon: {
    width: 56, height: 56, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  mainCardTitle: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: '#fff' },
  mainCardSub: { fontSize: FontSizes.xs, color: 'rgba(255,255,255,0.85)', marginTop: 4, lineHeight: 16 },
  mainCardArrow: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center', alignItems: 'center',
  },
  sectionTitle: {
    fontSize: FontSizes.lg, fontWeight: FontWeights.bold,
    color: Colors.textPrimary, marginTop: Spacing.sm, marginBottom: Spacing.md,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg },
  featureCard: {
    width: (width - Spacing.base * 2 - Spacing.sm) / 2,
    backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md,
  },
  featureIconWrap: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: Colors.accent + '15',
    justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.sm,
  },
  featureLabel: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  featureDesc: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 4, lineHeight: 16 },
  disclaimer: {
    flexDirection: 'row', gap: Spacing.xs, alignItems: 'flex-start',
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.md, marginBottom: Spacing.md,
  },
  disclaimerText: { flex: 1, fontSize: FontSizes.xs, color: Colors.textMuted, lineHeight: 16 },
});
