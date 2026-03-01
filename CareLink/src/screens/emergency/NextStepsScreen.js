import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button, Card } from '../../components/common';

export default function NextStepsScreen({ navigation, route }) {
  const type = route?.params?.type || 'Emergency';

  return (
    <View style={styles.container}>
      <Header title="Next Steps" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card title="What to do next">
          <View style={styles.stepItem}>
            <View style={[styles.stepNum, { backgroundColor: Colors.accent }]}><Text style={styles.stepNumText}>1</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTitle}>Visit Nearest Hospital</Text>
              <Text style={styles.stepDesc}>Get a thorough check-up even if symptoms subside.</Text>
            </View>
          </View>
          <View style={styles.stepItem}>
            <View style={[styles.stepNum, { backgroundColor: Colors.amberMid }]}><Text style={styles.stepNumText}>2</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTitle}>Document the Incident</Text>
              <Text style={styles.stepDesc}>Note down symptoms, timeline, and what happened.</Text>
            </View>
          </View>
          <View style={styles.stepItem}>
            <View style={[styles.stepNum, { backgroundColor: Colors.success }]}><Text style={styles.stepNumText}>3</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTitle}>Follow Up</Text>
              <Text style={styles.stepDesc}>Schedule a follow-up appointment within 48 hours.</Text>
            </View>
          </View>
        </Card>

        {/* Warning Signs */}
        <Card title="Watch for Warning Signs" variant="amber">
          {['Persistent pain or discomfort', 'Difficulty breathing', 'Dizziness or fainting', 'Worsening symptoms', 'Fever above 102°F'].map((w, i) => (
            <View key={i} style={styles.warningRow}>
              <Ionicons name="alert-circle" size={18} color={Colors.error} />
              <Text style={styles.warningText}>{w}</Text>
            </View>
          ))}
        </Card>

        <View style={styles.actions}>
          <Button title="Find Nearest Hospital" variant="primary" size="lg"
            icon={<Ionicons name="location" size={18} color={Colors.white} />}
            onPress={() => navigation.navigate('NearestHospitals')} />
          <Button title="Consult Doctor Online" variant="outline" size="lg"
            icon={<Ionicons name="videocam" size={18} color={Colors.accent} />}
            onPress={() => navigation.navigate('ConsultSpecialty')}
            style={{ marginTop: Spacing.md }} />
          <Button title="Set Follow-up Reminder" variant="secondary" size="md"
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
