import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows, Gradients } from '../../theme';
import { Header, Card } from '../../components/common';

const emergencyTypes = [
  { label: 'Heart Attack', icon: 'heart', color: Colors.error },
  { label: 'Stroke', icon: 'body', color: '#9C27B0' },
  { label: 'Breathing Difficulty', icon: 'fitness', color: Colors.accent },
  { label: 'Severe Injury', icon: 'bandage', color: Colors.amberMid },
  { label: 'Poisoning', icon: 'flask', color: '#4CAF50' },
  { label: 'Burns', icon: 'flame', color: '#FF5722' },
  { label: 'Seizure', icon: 'flash', color: '#3F51B5' },
  { label: 'Allergic Reaction', icon: 'alert-circle', color: '#E91E63' },
  { label: 'Other', icon: 'help-circle', color: Colors.textMuted },
];

export default function EmergencyHomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Header title="Emergency" />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* SOS Button */}
        <TouchableOpacity onPress={() => navigation.navigate('IncidentSelect')} activeOpacity={0.8}>
          <LinearGradient colors={['#FF4444', '#CC0000']} style={styles.sosButton}>
            <Text style={styles.sosText}>SOS</Text>
            <Text style={styles.sosSub}>Tap for Emergency Help</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.quickRow}>
          <TouchableOpacity style={[styles.quickAction, Shadows.soft]}
            onPress={() => navigation.navigate('NearestHospitals')}>
            <Ionicons name="location" size={24} color={Colors.error} />
            <Text style={styles.quickLabel}>Nearest{'\n'}Hospital</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickAction, Shadows.soft]}
            onPress={() => navigation.navigate('EmergencyContacts')}>
            <Ionicons name="call" size={24} color={Colors.success} />
            <Text style={styles.quickLabel}>Emergency{'\n'}Contacts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickAction, Shadows.soft]}
            onPress={() => navigation.navigate('FirstAidInstructions', { type: 'General' })}>
            <Ionicons name="medkit" size={24} color={Colors.accent} />
            <Text style={styles.quickLabel}>First Aid{'\n'}Guide</Text>
          </TouchableOpacity>
        </View>

        {/* Emergency Types */}
        <Text style={styles.sectionTitle}>What's the emergency?</Text>
        <View style={styles.typeGrid}>
          {emergencyTypes.map((t, i) => (
            <TouchableOpacity key={i} style={[styles.typeCard, Shadows.soft]}
              onPress={() => navigation.navigate('SymptomQuestionnaire', { type: t.label })}>
              <View style={[styles.typeIcon, { backgroundColor: t.color + '20' }]}>
                <Ionicons name={t.icon} size={24} color={t.color} />
              </View>
              <Text style={styles.typeLabel}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Emergency Info */}
        <Card variant="accent" title="Emergency Numbers">
          <View style={styles.numRow}>
            <Ionicons name="call" size={18} color={Colors.error} />
            <Text style={styles.numLabel}>Ambulance</Text>
            <Text style={styles.numValue}>108</Text>
          </View>
          <View style={styles.numRow}>
            <Ionicons name="call" size={18} color={Colors.accent} />
            <Text style={styles.numLabel}>Police</Text>
            <Text style={styles.numValue}>100</Text>
          </View>
          <View style={styles.numRow}>
            <Ionicons name="call" size={18} color={Colors.amberMid} />
            <Text style={styles.numLabel}>Fire</Text>
            <Text style={styles.numValue}>101</Text>
          </View>
        </Card>

        <View style={{ height: 40 }} />
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
    padding: Spacing.lg, alignItems: 'center',
  },
  quickLabel: { fontSize: FontSizes.sm, fontWeight: FontWeights.medium, color: Colors.textPrimary, textAlign: 'center', marginTop: Spacing.sm },
  sectionTitle: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.textPrimary, marginBottom: Spacing.md },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, marginBottom: Spacing.lg },
  typeCard: {
    width: '30%', backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.md, alignItems: 'center',
  },
  typeIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.xs },
  typeLabel: { fontSize: FontSizes.xs, fontWeight: FontWeights.medium, color: Colors.textPrimary, textAlign: 'center' },
  numRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: Spacing.md },
  numLabel: { flex: 1, fontSize: FontSizes.md, color: Colors.textPrimary },
  numValue: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.error },
});
