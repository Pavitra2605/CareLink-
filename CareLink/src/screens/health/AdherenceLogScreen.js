import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Badge } from '../../components/common';
import { useLanguage } from '../../i18n';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const scheduleData = {
  'Morning': [
    { name: 'Metformin 500mg', time: '8:00 AM', taken: true },
    { name: 'Amlodipine 5mg', time: '8:00 AM', taken: true },
  ],
  'Afternoon': [
    { name: 'Metformin 500mg', time: '2:00 PM', taken: false },
  ],
  'Evening': [],
  'Night': [
    { name: 'Vitamin D', time: '9:00 PM', taken: false },
  ],
};

export default function AdherenceLogScreen({ navigation }) {
  const { t } = useLanguage();
  const [selectedDay, setSelectedDay] = useState(4); // Friday
  const [taken, setTaken] = useState({});

  const toggleTaken = (section, idx) => {
    const key = `${section}_${idx}`;
    setTaken(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Weekly adherence mock
  const weeklyAdherence = [100, 75, 100, 50, 80, 0, 0];

  return (
    <View style={styles.container}>
      <Header title={t('health.adherenceLog')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Weekly Overview */}
        <View style={[styles.weekCard, Shadows.soft]}>
          <Text style={styles.weekTitle}>This Week's Adherence</Text>
          <View style={styles.dayRow}>
            {days.map((d, i) => (
              <TouchableOpacity key={i} style={styles.dayCol} onPress={() => setSelectedDay(i)}>
                <Text style={[styles.dayLabel, selectedDay === i && { color: Colors.accent, fontWeight: FontWeights.bold }]}>{d}</Text>
                <View style={[
                  styles.dayCircle,
                  selectedDay === i && styles.dayCircleActive,
                  weeklyAdherence[i] === 100 && { backgroundColor: Colors.success + '30' },
                  weeklyAdherence[i] > 0 && weeklyAdherence[i] < 100 && { backgroundColor: Colors.amberMid + '30' },
                ]}>
                  {weeklyAdherence[i] === 100 ? (
                    <Ionicons name="checkmark" size={16} color={Colors.success} />
                  ) : weeklyAdherence[i] > 0 ? (
                    <Text style={styles.dayPercent}>{weeklyAdherence[i]}%</Text>
                  ) : (
                    <Ionicons name="remove" size={16} color={Colors.textMuted} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '72%' }]} />
          </View>
          <Text style={styles.progressText}>72% overall adherence this week</Text>
        </View>

        {/* Daily Schedule */}
        <Text style={styles.sectionTitle}>Today's Schedule</Text>
        {Object.entries(scheduleData).map(([section, meds]) => (
          <View key={section} style={{ marginBottom: Spacing.md }}>
            <Text style={styles.timeLabel}>{section}</Text>
            {meds.length === 0 ? (
              <Text style={styles.noMeds}>No medications scheduled</Text>
            ) : (
              meds.map((med, idx) => {
                const key = `${section}_${idx}`;
                const isTaken = taken[key] !== undefined ? taken[key] : med.taken;
                return (
                  <TouchableOpacity key={idx} style={[styles.medItem, Shadows.soft]}
                    onPress={() => toggleTaken(section, idx)}>
                    <View style={[styles.checkbox, isTaken && styles.checkboxChecked]}>
                      {isTaken && <Ionicons name="checkmark" size={16} color={Colors.white} />}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.medName, isTaken && styles.medNameTaken]}>{med.name}</Text>
                      <Text style={styles.medTime}>{med.time}</Text>
                    </View>
                    <Badge label={isTaken ? 'Taken' : 'Pending'}
                      variant={isTaken ? 'success' : 'warning'} size="sm" />
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        ))}

        {/* Streak */}
        <View style={[styles.streakCard, Shadows.soft]}>
          <Ionicons name="flame" size={32} color={Colors.amberMid} />
          <View style={{ flex: 1, marginLeft: Spacing.md }}>
            <Text style={styles.streakNum}>5 Day Streak!</Text>
            <Text style={styles.streakText}>Keep it up! Consistent medication adherence improves health outcomes.</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md },
  weekCard: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.lg, marginBottom: Spacing.lg },
  weekTitle: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.textPrimary, marginBottom: Spacing.md },
  dayRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.lg },
  dayCol: { alignItems: 'center' },
  dayLabel: { fontSize: FontSizes.xs, color: Colors.textMuted, marginBottom: 6 },
  dayCircle: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.bgSecondary,
    justifyContent: 'center', alignItems: 'center',
  },
  dayCircleActive: { borderWidth: 2, borderColor: Colors.accent },
  dayPercent: { fontSize: FontSizes.xs, fontWeight: FontWeights.bold, color: Colors.amberMid },
  progressBar: { height: 6, backgroundColor: Colors.bgSecondary, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.accent, borderRadius: 3 },
  progressText: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: Spacing.sm, textAlign: 'center' },
  sectionTitle: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.textPrimary, marginBottom: Spacing.md },
  timeLabel: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold, color: Colors.accent, marginBottom: Spacing.sm },
  noMeds: { fontSize: FontSizes.sm, color: Colors.textMuted, fontStyle: 'italic' },
  medItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.sm,
  },
  checkbox: {
    width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: Colors.border,
    justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md,
  },
  checkboxChecked: { backgroundColor: Colors.success, borderColor: Colors.success },
  medName: { fontSize: FontSizes.md, fontWeight: FontWeights.medium, color: Colors.textPrimary },
  medNameTaken: { textDecorationLine: 'line-through', color: Colors.textMuted },
  medTime: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
  streakCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.xl, padding: Spacing.lg, marginTop: Spacing.md,
  },
  streakNum: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.amberMid },
  streakText: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 4, lineHeight: 18 },
});
