import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button, Card } from '../../components/common';

export default function SeverityResultScreen({ navigation, route }) {
  const type = route?.params?.type || 'Emergency';
  // Mock severity based on answers
  const severity = 'moderate'; // could be 'low', 'moderate', 'high', 'critical'

  const severityConfig = {
    low: { color: Colors.success, bg: '#E8F5E9', icon: 'shield-checkmark', label: 'Low Severity', message: 'This does not appear to be a critical emergency. Monitor symptoms and consult a doctor if they worsen.' },
    moderate: { color: Colors.amberMid, bg: '#FFF3E0', icon: 'warning', label: 'Moderate Severity', message: 'Seek medical attention soon. Follow the first aid steps below while waiting.' },
    high: { color: '#FF6D00', bg: '#FFE0B2', icon: 'alert-circle', label: 'High Severity', message: 'Immediate medical attention recommended. Call emergency services if needed.' },
    critical: { color: Colors.error, bg: '#FFEBEE', icon: 'alert', label: 'Critical — Call 108 NOW', message: 'This is a life-threatening emergency. Call 108 immediately. Start first aid now.' },
  };

  const config = severityConfig[severity];

  return (
    <View style={styles.container}>
      <Header title="Assessment Result" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Severity Banner */}
        <View style={[styles.severityCard, { backgroundColor: config.bg }]}>
          <Ionicons name={config.icon} size={56} color={config.color} />
          <Text style={[styles.severityLabel, { color: config.color }]}>{config.label}</Text>
          <Text style={styles.severityMsg}>{config.message}</Text>
        </View>

        {/* Emergency Type */}
        <Card title="Emergency Type">
          <Text style={styles.typeText}>{type}</Text>
        </Card>

        {/* Recommended Actions */}
        <Text style={styles.sectionTitle}>Recommended Actions</Text>
        <View style={styles.actionList}>
          <View style={styles.actionItem}>
            <View style={[styles.actionNum, { backgroundColor: Colors.error }]}>
              <Text style={styles.actionNumText}>1</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.actionTitle}>Stay Calm</Text>
              <Text style={styles.actionDesc}>Keep the patient calm and still. Don't panic.</Text>
            </View>
          </View>
          <View style={styles.actionItem}>
            <View style={[styles.actionNum, { backgroundColor: Colors.amberMid }]}>
              <Text style={styles.actionNumText}>2</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.actionTitle}>Apply First Aid</Text>
              <Text style={styles.actionDesc}>Follow the first aid guide for immediate care.</Text>
            </View>
          </View>
          <View style={styles.actionItem}>
            <View style={[styles.actionNum, { backgroundColor: Colors.accent }]}>
              <Text style={styles.actionNumText}>3</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.actionTitle}>Seek Medical Help</Text>
              <Text style={styles.actionDesc}>Visit the nearest hospital or call emergency services.</Text>
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.actions}>
          <Button title="View First Aid Steps" variant="primary" size="lg"
            icon={<Ionicons name="medkit" size={18} color={Colors.white} />}
            onPress={() => navigation.navigate('FirstAidInstructions', { type })} />
          <Button title="Find Nearest Hospital" variant="amber" size="lg"
            icon={<Ionicons name="location" size={18} color={Colors.white} />}
            onPress={() => navigation.navigate('NearestHospitals')}
            style={{ marginTop: Spacing.md }} />
          <Button title="Call 108 (Ambulance)" variant="danger" size="lg"
            icon={<Ionicons name="call" size={18} color={Colors.white} />}
            onPress={() => {}} style={{ marginTop: Spacing.md }} />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md },
  severityCard: {
    borderRadius: Radius.xl, padding: Spacing.xl, alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  severityLabel: { fontSize: FontSizes.xxl, fontWeight: FontWeights.bold, marginTop: Spacing.md },
  severityMsg: { fontSize: FontSizes.md, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm, lineHeight: 22 },
  typeText: { fontSize: FontSizes.lg, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  sectionTitle: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.textPrimary, marginBottom: Spacing.md, marginTop: Spacing.sm },
  actionList: { marginBottom: Spacing.lg },
  actionItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: Spacing.lg },
  actionNum: {
    width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center',
    marginRight: Spacing.md,
  },
  actionNumText: { fontSize: FontSizes.md, fontWeight: FontWeights.bold, color: Colors.white },
  actionTitle: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  actionDesc: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
  actions: { marginTop: Spacing.sm },
});
