import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button, Card } from '../../components/common';

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
];

export default function FollowUpSchedulingScreen({ navigation, route }) {
  const doctor = route?.params?.doctor || {};
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedMode, setSelectedMode] = useState('video');

  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      day: d.toLocaleDateString('en', { weekday: 'short' }),
      date: d.getDate(),
      month: d.toLocaleDateString('en', { month: 'short' }),
      full: d.toLocaleDateString(),
    };
  });

  const modes = [
    { key: 'video', icon: 'videocam', label: 'Video' },
    { key: 'audio', icon: 'call', label: 'Audio' },
    { key: 'text', icon: 'chatbubbles', label: 'Text' },
  ];

  return (
    <View style={styles.container}>
      <Header title="Schedule Follow-up" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Doctor Info */}
        <View style={[styles.docCard, Shadows.soft]}>
          <View style={styles.docAvatar}>
            <Ionicons name="person" size={28} color={Colors.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.docName}>{doctor.name || 'Dr. Priya Sharma'}</Text>
            <Text style={styles.docSpec}>{doctor.specialty || 'General Physician'}</Text>
          </View>
          <View style={styles.recBadge}>
            <Ionicons name="refresh" size={14} color={Colors.accent} />
            <Text style={styles.recText}>Follow-up</Text>
          </View>
        </View>

        {/* Consultation Mode */}
        <Text style={styles.sectionTitle}>Consultation Mode</Text>
        <View style={styles.modeRow}>
          {modes.map(m => (
            <TouchableOpacity key={m.key}
              style={[styles.modeChip, selectedMode === m.key && styles.modeChipActive]}
              onPress={() => setSelectedMode(m.key)}>
              <Ionicons name={m.icon} size={20}
                color={selectedMode === m.key ? Colors.white : Colors.accent} />
              <Text style={[styles.modeLabel, selectedMode === m.key && { color: Colors.white }]}>{m.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date Selection */}
        <Text style={styles.sectionTitle}>Select Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateRow}>
          {next7Days.map((d, idx) => (
            <TouchableOpacity key={idx}
              style={[styles.dateChip, selectedDate === idx && styles.dateChipActive]}
              onPress={() => setSelectedDate(idx)}>
              <Text style={[styles.dateDay, selectedDate === idx && { color: Colors.white }]}>{d.day}</Text>
              <Text style={[styles.dateNum, selectedDate === idx && { color: Colors.white }]}>{d.date}</Text>
              <Text style={[styles.dateMon, selectedDate === idx && { color: Colors.white }]}>{d.month}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Time Slots */}
        <Text style={styles.sectionTitle}>Select Time</Text>
        <View style={styles.timeGrid}>
          {timeSlots.map((t, idx) => (
            <TouchableOpacity key={idx}
              style={[styles.timeChip, selectedTime === idx && styles.timeChipActive]}
              onPress={() => setSelectedTime(idx)}>
              <Text style={[styles.timeText, selectedTime === idx && { color: Colors.white }]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notes Area */}
        <Card title="Notes for Follow-up">
          <View style={styles.noteBox}>
            <Text style={styles.noteText}>
              Previous diagnosis: Tension Headache{'\n'}
              Doctor recommended follow-up if symptoms persist beyond 7 days.
            </Text>
          </View>
        </Card>

        {/* Confirm */}
        <Button title="Confirm Follow-up" size="lg" variant="primary"
          disabled={selectedDate === null || selectedTime === null}
          onPress={() => navigation.navigate('PostConsultSummary', { doctor })}
          style={{ marginTop: Spacing.md }}
          icon={<Ionicons name="checkmark-circle" size={20} color={Colors.white} />} />

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md },
  docCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.xl, padding: Spacing.lg, marginBottom: Spacing.lg,
  },
  docAvatar: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.accent,
    justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md,
  },
  docName: { fontSize: FontSizes.base, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  docSpec: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
  recBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.accentLight || '#E8F5FE',
    paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.pill,
  },
  recText: { fontSize: FontSizes.xs, fontWeight: FontWeights.medium, color: Colors.accent, marginLeft: 4 },
  sectionTitle: {
    fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  modeRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.lg },
  modeChip: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: Spacing.md, borderRadius: Radius.lg,
    borderWidth: 1.5, borderColor: Colors.accent, gap: Spacing.xs,
  },
  modeChipActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  modeLabel: { fontSize: FontSizes.md, fontWeight: FontWeights.medium, color: Colors.accent },
  dateRow: { marginBottom: Spacing.lg },
  dateChip: {
    alignItems: 'center', paddingVertical: Spacing.md, paddingHorizontal: 18,
    borderRadius: Radius.lg, backgroundColor: Colors.surface, marginRight: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border,
  },
  dateChipActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  dateDay: { fontSize: FontSizes.xs, color: Colors.textMuted, marginBottom: 4 },
  dateNum: { fontSize: FontSizes.xl, fontWeight: FontWeights.bold, color: Colors.textPrimary },
  dateMon: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 4 },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg },
  timeChip: {
    paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md,
    borderRadius: Radius.pill, backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border,
  },
  timeChipActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  timeText: { fontSize: FontSizes.sm, fontWeight: FontWeights.medium, color: Colors.textPrimary },
  noteBox: { backgroundColor: Colors.bgSecondary, borderRadius: Radius.md, padding: Spacing.md },
  noteText: { fontSize: FontSizes.sm, color: Colors.textSecondary, lineHeight: 20 },
});
