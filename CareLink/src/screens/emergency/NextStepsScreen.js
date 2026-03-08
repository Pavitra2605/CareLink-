import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button, Card } from '../../components/common';
import { useLanguage } from '../../i18n';

export default function NextStepsScreen({ navigation, route }) {
  const type = route?.params?.type || 'Emergency';

  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <Header title={t('nextSteps.title')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card title={t('nextSteps.whatToDo')}>
          <View style={styles.stepItem}>
            <View style={[styles.stepNum, { backgroundColor: Colors.accent }]}><Text style={styles.stepNumText}>1</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTitle}>{t('nextSteps.visitHospital')}</Text>
              <Text style={styles.stepDesc}>{t('nextSteps.visitHospitalDesc')}</Text>
            </View>
          </View>
          <View style={styles.stepItem}>
            <View style={[styles.stepNum, { backgroundColor: Colors.amberMid }]}><Text style={styles.stepNumText}>2</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTitle}>{t('nextSteps.documentIncident')}</Text>
              <Text style={styles.stepDesc}>{t('nextSteps.documentIncidentDesc')}</Text>
            </View>
          </View>
          <View style={styles.stepItem}>
            <View style={[styles.stepNum, { backgroundColor: Colors.success }]}><Text style={styles.stepNumText}>3</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTitle}>{t('nextSteps.followUp')}</Text>
              <Text style={styles.stepDesc}>{t('nextSteps.followUpDesc')}</Text>
            </View>
          </View>
        </Card>

        {/* Warning Signs */}
        <Card title={t('nextSteps.watchWarning')} variant="amber">
          {[t('nextSteps.persistentPain'), t('nextSteps.difficultyBreathing'), t('nextSteps.dizziness'), t('nextSteps.worseningSymptoms'), t('nextSteps.highFever')].map((w, i) => (
            <View key={i} style={styles.warningRow}>
              <Ionicons name="alert-circle" size={18} color={Colors.error} />
              <Text style={styles.warningText}>{w}</Text>
            </View>
          ))}
        </Card>

        <View style={styles.actions}>
          <Button title={t('severity.findNearestHospital')} variant="primary" size="lg"
            icon={<Ionicons name="location" size={18} color={Colors.white} />}
            onPress={() => navigation.navigate('NearestHospitals')} />
          <Button title={t('nextSteps.consultOnline')} variant="outline" size="lg"
            icon={<Ionicons name="videocam" size={18} color={Colors.accent} />}
            onPress={() => navigation.navigate('ConsultSpecialty')}
            style={{ marginTop: Spacing.md }} />
          <Button title={t('nextSteps.setReminder')} variant="secondary" size="md"
            icon={<Ionicons name="alarm" size={18} color={Colors.accent} />}
            onPress={() => navigation.navigate('FollowupReminder', { type })}
            style={{ marginTop: Spacing.md }} />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md },
  stepItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: Spacing.lg },
  stepNum: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  stepNumText: { fontSize: FontSizes.sm, fontWeight: FontWeights.bold, color: Colors.white },
  stepTitle: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  stepDesc: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
  warningRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 6 },
  warningText: { fontSize: FontSizes.md, color: Colors.textSecondary },
  actions: { marginTop: Spacing.lg },
});
