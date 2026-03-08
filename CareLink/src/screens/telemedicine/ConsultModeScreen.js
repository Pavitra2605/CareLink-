import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button, Card, Input } from '../../components/common';
import { useLanguage } from '../../i18n';

export default function ConsultModeScreen({ navigation, route }) {
  const { t } = useLanguage();
  const doctor = route?.params?.doctor || {};
  const preselectedMode = route?.params?.mode || 'video';
  const [mode, setMode] = useState(preselectedMode);
  const [symptoms, setSymptoms] = useState('');

  const modes = [
    { key: 'video', icon: 'videocam', label: 'Video Call', desc: '~500KB / 10 min', color: Colors.accent },
    { key: 'audio', icon: 'call', label: 'Audio Call', desc: '~100KB / 10 min', color: Colors.success },
    { key: 'text', icon: 'chatbubbles', label: 'Text Chat', desc: '~10KB / session', color: Colors.amberMid },
  ];

  return (
    <View style={styles.container}>
      <Header title={t('telemedicine.consultMode')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionTitle}>Select Mode</Text>
        <View style={styles.modeGrid}>
          {modes.map((m) => (
            <TouchableOpacity
              key={m.key}
              onPress={() => setMode(m.key)}
              style={[styles.modeCard, Shadows.soft, mode === m.key && { borderColor: m.color, borderWidth: 2 }]}
            >
              <View style={[styles.modeIcon, { backgroundColor: m.color + '15' }]}>
                <Ionicons name={m.icon} size={28} color={m.color} />
              </View>
              <Text style={styles.modeLabel}>{m.label}</Text>
              <Text style={styles.modeDesc}>{m.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Describe Symptoms (Optional)</Text>
        <Input
          placeholder="Briefly describe your symptoms..."
          value={symptoms}
          onChangeText={setSymptoms}
          multiline
          numberOfLines={4}
        />

        <Card title="Consultation Info" variant="accent">
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={16} color={Colors.accent} />
            <Text style={styles.infoText}>{doctor.name || 'Dr. Priya Sharma'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="medical-outline" size={16} color={Colors.accent} />
            <Text style={styles.infoText}>{doctor.specialty || 'General Physician'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name={mode === 'video' ? 'videocam-outline' : mode === 'audio' ? 'call-outline' : 'chatbubbles-outline'}
              size={16} color={Colors.accent} />
            <Text style={styles.infoText}>{mode.charAt(0).toUpperCase() + mode.slice(1)} Consultation</Text>
          </View>
        </Card>

        <Button title="Book Appointment" onPress={() => navigation.navigate('AppointmentBooking', { doctor, mode, symptoms })}
          size="lg" variant="outline" style={{ marginBottom: Spacing.md }} />
        <Button title="Join Queue Now" onPress={() => navigation.navigate('WaitingRoom', { doctor, mode, symptoms })}
          size="lg" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md },
  sectionTitle: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.textPrimary, marginBottom: Spacing.md },
  modeGrid: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl },
  modeCard: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.md, alignItems: 'center', borderWidth: 2, borderColor: Colors.transparent,
  },
  modeIcon: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm },
  modeLabel: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  modeDesc: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 4, textAlign: 'center' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  infoText: { fontSize: FontSizes.md, color: Colors.textSecondary },
});
