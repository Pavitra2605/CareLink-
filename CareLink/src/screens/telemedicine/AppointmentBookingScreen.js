import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button, Card } from '../../components/common';

const TIME_SLOTS = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM'];
const DATES = [
  { day: 'Today', date: 'Mar 1', available: true },
  { day: 'Tomorrow', date: 'Mar 2', available: true },
  { day: 'Mon', date: 'Mar 3', available: true },
  { day: 'Tue', date: 'Mar 4', available: false },
  { day: 'Wed', date: 'Mar 5', available: true },
];

export default function AppointmentBookingScreen({ navigation, route }) {
  const doctor = route?.params?.doctor || {};
  const mode = route?.params?.mode || 'video';
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);

  return (
    <View style={styles.container}>
      <Header title="Book Appointment" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card title="Doctor" variant="accent">
          <View style={styles.docRow}>
            <Ionicons name="person-circle-outline" size={36} color={Colors.accent} />
            <View style={{ marginLeft: Spacing.md }}>
              <Text style={styles.docName}>{doctor.name || 'Dr. Priya Sharma'}</Text>
              <Text style={styles.docSpec}>{doctor.specialty || 'General Physician'}</Text>
            </View>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Select Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
          {DATES.map((d, i) => (
            <TouchableOpacity
              key={i}
              disabled={!d.available}
              onPress={() => setSelectedDate(i)}
              style={[styles.dateChip, selectedDate === i && styles.dateChipActive, !d.available && styles.dateChipDisabled]}
            >
              <Text style={[styles.dateDay, selectedDate === i && styles.dateTextActive]}>{d.day}</Text>
              <Text style={[styles.dateNum, selectedDate === i && styles.dateTextActive]}>{d.date}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Select Time</Text>
        <View style={styles.timeGrid}>
          {TIME_SLOTS.map((t, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setSelectedTime(i)}
              style={[styles.timeChip, selectedTime === i && styles.timeChipActive]}
            >
              <Text style={[styles.timeText, selectedTime === i && styles.timeTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Card title="Summary" style={{ marginTop: Spacing.lg }}>
          <View style={styles.summRow}><Text style={styles.summLabel}>Date</Text><Text style={styles.summVal}>{DATES[selectedDate]?.date}</Text></View>
          <View style={styles.summRow}><Text style={styles.summLabel}>Time</Text><Text style={styles.summVal}>{selectedTime !== null ? TIME_SLOTS[selectedTime] : '--'}</Text></View>
          <View style={styles.summRow}><Text style={styles.summLabel}>Mode</Text><Text style={styles.summVal}>{mode}</Text></View>
        </Card>

        <Button title="Confirm Booking" onPress={() => navigation.navigate('WaitingRoom', { doctor, mode })}
          size="lg" disabled={selectedTime === null} style={{ marginTop: Spacing.lg }} />
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md },
  docRow: { flexDirection: 'row', alignItems: 'center' },
  docName: { fontSize: FontSizes.base, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  docSpec: { fontSize: FontSizes.sm, color: Colors.textMuted },
  sectionTitle: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.textPrimary, marginTop: Spacing.lg, marginBottom: Spacing.md },
  dateScroll: { marginBottom: Spacing.md },
  dateChip: {
    alignItems: 'center', paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg,
    borderRadius: Radius.lg, backgroundColor: Colors.surface, marginRight: Spacing.sm, borderWidth: 2, borderColor: Colors.transparent,
  },
  dateChipActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  dateChipDisabled: { opacity: 0.4 },
  dateDay: { fontSize: FontSizes.xs, color: Colors.textMuted, fontWeight: FontWeights.medium },
  dateNum: { fontSize: FontSizes.base, color: Colors.textPrimary, fontWeight: FontWeights.bold, marginTop: 4 },
  dateTextActive: { color: Colors.white },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  timeChip: {
    paddingVertical: Spacing.sm, paddingHorizontal: Spacing.base,
    borderRadius: Radius.pill, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
  },
  timeChipActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  timeText: { fontSize: FontSizes.sm, color: Colors.textSecondary, fontWeight: FontWeights.medium },
  timeTextActive: { color: Colors.white },
  summRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  summLabel: { fontSize: FontSizes.md, color: Colors.textMuted },
  summVal: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold, color: Colors.textPrimary, textTransform: 'capitalize' },
});
