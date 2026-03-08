import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header } from '../../components/common';
import { useLanguage } from '../../i18n';

export default function IncidentSelectScreen({ navigation }) {
  const { t } = useLanguage();

  const incidents = [
    { label: t('incident.accidentInjury'), icon: 'car', color: Colors.error, desc: t('incident.accidentDesc') },
    { label: t('incident.chestPain'), icon: 'heart', color: '#E91E63', desc: t('incident.chestPainDesc') },
    { label: t('incident.breathingProblem'), icon: 'fitness', color: Colors.accent, desc: t('incident.breathingDesc') },
    { label: t('incident.bleeding'), icon: 'water', color: '#F44336', desc: t('incident.bleedingDesc') },
    { label: t('incident.unconscious'), icon: 'person', color: '#9C27B0', desc: t('incident.unconsciousDesc') },
    { label: t('incident.feverInfection'), icon: 'thermometer', color: Colors.amberMid, desc: t('incident.feverDesc') },
    { label: t('incident.poisoningOverdose'), icon: 'flask', color: '#4CAF50', desc: t('incident.poisoningDesc') },
    { label: t('incident.animalBite'), icon: 'bug', color: '#795548', desc: t('incident.animalBiteDesc') },
    { label: t('incident.burnInjury'), icon: 'flame', color: '#FF5722', desc: t('incident.burnDesc') },
    { label: t('incident.pregnancyEmergency'), icon: 'woman', color: '#E040FB', desc: t('incident.pregnancyDesc') },
  ];
  return (
    <View style={styles.container}>
      <Header title={t('incident.selectType')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.subtitle}>{t('incident.subtitle')}</Text>
        {incidents.map((item, i) => (
          <TouchableOpacity key={i} style={[styles.card, Shadows.soft]}
            onPress={() => navigation.navigate('SymptomQuestionnaire', { type: item.label })}>
            <View style={[styles.iconBox, { backgroundColor: item.color + '20' }]}>
              <Ionicons name={item.icon} size={24} color={item.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.desc}>{item.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
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
  subtitle: { fontSize: FontSizes.md, color: Colors.textMuted, marginBottom: Spacing.lg },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.sm,
  },
  iconBox: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  label: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  desc: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
});
