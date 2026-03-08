import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows, Gradients } from '../../theme';
import { Header, Card } from '../../components/common';
import { useLanguage } from '../../i18n';

export default function EmergencyHomeScreen({ navigation }) {
  const { t } = useLanguage();

  const emergencyTypes = [
    { label: t('emergency.heartAttack'), icon: 'heart', color: Colors.error },
    { label: t('emergency.stroke'), icon: 'body', color: '#9C27B0' },
    { label: t('emergency.breathingDifficulty'), icon: 'fitness', color: Colors.accent },
    { label: t('emergency.severeInjury'), icon: 'bandage', color: Colors.amberMid },
    { label: t('emergency.poisoning'), icon: 'flask', color: '#4CAF50' },
    { label: t('emergency.burns'), icon: 'flame', color: '#FF5722' },
    { label: t('emergency.seizure'), icon: 'flash', color: '#3F51B5' },
    { label: t('emergency.allergicReaction'), icon: 'alert-circle', color: '#E91E63' },
    { label: t('emergency.otherEmergency'), icon: 'help-circle', color: Colors.textMuted },
  ];
  return (
    <View style={styles.container}>
      <Header title={t('emergency.title')} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* SOS Button */}
        <TouchableOpacity onPress={() => navigation.navigate('IncidentSelect')} activeOpacity={0.8}>
          <LinearGradient colors={['#FF4444', '#CC0000']} style={styles.sosButton}>
            <Text style={styles.sosText}>{t('emergency.sos')}</Text>
            <Text style={styles.sosSub}>{t('emergency.tapForHelp')}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.quickRow}>
          <TouchableOpacity style={[styles.quickAction, Shadows.soft]}
            onPress={() => navigation.navigate('NearestHospitals')}>
            <Ionicons name="location" size={24} color={Colors.error} />
            <Text style={styles.quickLabel} numberOfLines={2}>{t('emergency.nearestHospital')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickAction, Shadows.soft]}
            onPress={() => navigation.navigate('EmergencyContacts')}>
            <Ionicons name="call" size={24} color={Colors.success} />
            <Text style={styles.quickLabel} numberOfLines={2}>{t('emergency.emergencyContacts')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickAction, Shadows.soft]}
            onPress={() => navigation.navigate('FirstAidInstructions', { type: 'General' })}>
            <Ionicons name="medkit" size={24} color={Colors.accent} />
            <Text style={styles.quickLabel} numberOfLines={2}>{t('emergency.firstAidGuide')}</Text>
          </TouchableOpacity>
        </View>

        {/* Emergency Types */}
        <Text style={styles.sectionTitle}>{t('emergency.whatsEmergency')}</Text>
        <View style={styles.typeGrid}>
          {emergencyTypes.map((item, i) => (
            <TouchableOpacity key={i} style={[styles.typeCard, Shadows.soft]}
              onPress={() => navigation.navigate('SymptomQuestionnaire', { type: item.label })}>
              <View style={[styles.typeIcon, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon} size={24} color={item.color} />
              </View>
              <Text style={styles.typeLabel} numberOfLines={2}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Emergency Info */}
        <Card variant="accent" title={t('emergency.emergencyNumbers')}>
          <View style={styles.numRow}>
            <Ionicons name="call" size={18} color={Colors.error} />
            <Text style={styles.numLabel}>{t('emergency.ambulance')}</Text>
            <Text style={styles.numValue}>108</Text>
          </View>
          <View style={styles.numRow}>
            <Ionicons name="call" size={18} color={Colors.accent} />
            <Text style={styles.numLabel}>{t('emergency.police')}</Text>
            <Text style={styles.numValue}>100</Text>
          </View>
          <View style={styles.numRow}>
            <Ionicons name="call" size={18} color={Colors.amberMid} />
            <Text style={styles.numLabel}>{t('emergency.fire')}</Text>
            <Text style={styles.numValue}>101</Text>
          </View>
        </Card>

        <View style={{ height: 90 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md },
  sosButton: {
    height: 160, borderRadius: Radius.xl, justifyContent: 'center', alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sosText: { fontSize: 48, fontWeight: FontWeights.bold, color: Colors.white, letterSpacing: 8 },
  sosSub: { fontSize: FontSizes.md, color: Colors.white + 'CC', marginTop: Spacing.xs },
  quickRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.lg },
  quickAction: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.lg, alignItems: 'center', minHeight: 90,
    justifyContent: 'center',
  },
  quickLabel: { fontSize: FontSizes.sm, fontWeight: FontWeights.medium, color: Colors.textPrimary, textAlign: 'center', marginTop: Spacing.sm, flexShrink: 1 },
  sectionTitle: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.textPrimary, marginBottom: Spacing.md },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, marginBottom: Spacing.lg },
  typeCard: {
    width: '30%', backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.md, alignItems: 'center', minHeight: 90,
    justifyContent: 'center',
  },
  typeIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.xs },
  typeLabel: { fontSize: FontSizes.xs, fontWeight: FontWeights.medium, color: Colors.textPrimary, textAlign: 'center', flexShrink: 1 },
  numRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: Spacing.md },
  numLabel: { flex: 1, fontSize: FontSizes.md, color: Colors.textPrimary },
  numValue: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.error },
});
