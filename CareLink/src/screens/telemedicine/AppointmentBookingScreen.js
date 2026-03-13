import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button, Card } from '../../components/common';
import { useLanguage } from '../../i18n';
import { useAuth } from '../../context/AuthContext';
import { bookAppointment } from '../../services/careService';

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
];

const TIME_LABELS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function AppointmentBookingScreen({ navigation, route }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const doctor = route?.params?.doctor || {};
  const mode = route?.params?.mode || 'video';
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);
  const [reason, setReason] = useState('');
  const [booking, setBooking] = useState(false);

  // Generate next 7 days starting from today
  const dates = useMemo(() => {
    const arr = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      arr.push({
        label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : DAYS[d.getDay()],
        date: `${MONTHS[d.getMonth()]} ${d.getDate()}`,
        iso: d.toISOString().split('T')[0], // 'YYYY-MM-DD'
      });
    }
    return arr;
  }, []);

  const handleConfirm = async () => {
    if (selectedTime === null) return;
    if (!user?.id) {
      Alert.alert('Not logged in', 'Please sign in to book an appointment.');
      return;
    }
    setBooking(true);
    try {
      const appt = await bookAppointment({
        patientId: user.id,
        doctorId: doctor.id,
        appointmentDate: dates[selectedDate].iso,
        appointmentTime: TIME_SLOTS[selectedTime],
        mode,
        reason: reason || null,
        durationMinutes: 30,
      });
      Alert.alert(
        'Appointment Booked!',
        `Your ${mode} appointment with ${doctor.full_name} on ${dates[selectedDate].date} at ${TIME_LABELS[selectedTime]} has been confirmed.`,
        [{ text: 'OK', onPress: () => navigation.navigate('WaitingRoom', { doctor, mode, appointmentId: appt?.id }) }]
      );
    } catch (e) {
      Alert.alert('Booking Failed', e.message || 'Could not complete booking.');
    } finally {
      setBooking(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title={t('telemedicine.bookAppointment')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card title="Doctor" variant="accent">
          <View style={styles.docRow}>
            <Ionicons name="person-circle-outline" size={36} color={Colors.accent} />
            <View style={{ marginLeft: Spacing.md }}>
              <Text style={styles.docName}>{doctor.full_name || 'Doctor'}</Text>
              <Text style={styles.docSpec}>{doctor.specialty || 'Specialist'}</Text>
              {doctor.consultation_fee ? (
                <Text style={styles.docFee}>Rs.{doctor.consultation_fee} / session</Text>
              ) : null}
            </View>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Select Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
          {dates.map((d, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setSelectedDate(i)}
              style={[styles.dateChip, selectedDate === i && styles.dateChipActive]}
            >
              <Text style={[styles.dateDay, selectedDate === i && styles.dateTextActive]}>{d.label}</Text>
              <Text style={[styles.dateNum, selectedDate === i && styles.dateTextActive]}>{d.date}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Select Time</Text>
        <View style={styles.timeGrid}>
          {TIME_LABELS.map((tl, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setSelectedTime(i)}
              style={[styles.timeChip, selectedTime === i && styles.timeChipActive]}
            >
              <Text style={[styles.timeText, selectedTime === i && styles.timeTextActive]}>{tl}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Card title="Summary" style={{ marginTop: Spacing.lg }}>
          <View style={styles.summRow}>
            <Text style={styles.summLabel}>Date</Text>
            <Text style={styles.summVal}>{dates[selectedDate]?.date}</Text>
          </View>
          <View style={styles.summRow}>
            <Text style={styles.summLabel}>Time</Text>
            <Text style={styles.summVal}>{selectedTime !== null ? TIME_LABELS[selectedTime] : '--'}</Text>
          </View>
          <View style={styles.summRow}>
            <Text style={styles.summLabel}>Mode</Text>
            <Text style={[styles.summVal, { textTransform: 'capitalize' }]}>{mode}</Text>
          </View>
          {doctor.consultation_fee ? (
            <View style={styles.summRow}>
              <Text style={styles.summLabel}>Fee</Text>
              <Text style={[styles.summVal, { color: Colors.success }]}>Rs.{doctor.consultation_fee}</Text>
            </View>
          ) : null}
        </Card>

        <Button
          title={booking ? 'Booking...' : 'Confirm Booking'}
          onPress={handleConfirm}
          size="lg"
          disabled={selectedTime === null || booking}
          style={{ marginTop: Spacing.lg }}
          icon={booking ? <ActivityIndicator size="small" color={Colors.white} /> : undefined}
        />
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
  docFee: { fontSize: FontSizes.sm, color: Colors.success, fontWeight: FontWeights.medium, marginTop: 2 },
  sectionTitle: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.textPrimary, marginTop: Spacing.lg, marginBottom: Spacing.md },
  dateScroll: { marginBottom: Spacing.md },
  dateChip: {
    alignItems: 'center', paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg,
    borderRadius: Radius.lg, backgroundColor: Colors.surface, marginRight: Spacing.sm, borderWidth: 2, borderColor: Colors.transparent,
  },
  dateChipActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
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
  summVal: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
});
