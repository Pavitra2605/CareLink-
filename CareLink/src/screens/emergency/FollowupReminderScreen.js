import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button, Card } from '../../components/common';

const reminderOptions = [
  { id: '1h', label: '1 Hour' },
  { id: '4h', label: '4 Hours' },
  { id: '1d', label: 'Tomorrow' },
  { id: '3d', label: '3 Days' },
  { id: '1w', label: '1 Week' },
];

export default function FollowupReminderScreen({ navigation }) {
  const [selected, setSelected] = useState('1d');

  const handleSet = () => {
    const label = reminderOptions.find(o => o.id === selected)?.label;
    Alert.alert('Reminder Set', `You will be reminded in ${label} to follow up after this emergency.`);
    navigation.popToTop?.();
  };

  return (
    <View style={styles.container}>
      <Header title="Follow-Up Reminder" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconWrap}>
          <Ionicons name="alarm" size={56} color={Colors.accent} />
        </View>
        <Text style={styles.title}>Set a Follow-Up Reminder</Text>
        <Text style={styles.subtitle}>
          After an emergency, it's important to follow up with a healthcare provider. We'll remind you.
        </Text>

        <Card title="Remind Me In" style={{ marginTop: Spacing.lg }}>
          {reminderOptions.map(opt => (
            <TouchableOpacity key={opt.id} style={[styles.optionRow, selected === opt.id && styles.optionSelected]}
              onPress={() => setSelected(opt.id)}>
              <Ionicons name={selected === opt.id ? 'radio-button-on' : 'radio-button-off'}
                size={22} color={selected === opt.id ? Colors.accent : Colors.textMuted} />
              <Text style={[styles.optionLabel, selected === opt.id && { color: Colors.accent }]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </Card>

        <Card title="What to Follow Up" style={{ marginTop: Spacing.md }}>
          {['Visit a doctor or hospital', 'Complete prescribed medication', 'Upload medical documents'].map((item, i) => (
            <View key={i} style={styles.checkItem}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
              <Text style={styles.checkText}>{item}</Text>
            </View>
          ))}
        </Card>

        <Button label="Set Reminder" onPress={handleSet} style={{ marginTop: Spacing.xl }} />
        <TouchableOpacity style={styles.skipBtn} onPress={() => navigation.popToTop?.()}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  content: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.lg, paddingBottom: 60 },
  iconWrap: { alignItems: 'center', marginBottom: Spacing.md },
  title: { fontSize: FontSizes.xl, fontWeight: FontWeights.bold, color: Colors.textPrimary, textAlign: 'center' },
  subtitle: { fontSize: FontSizes.md, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.sm, lineHeight: 22 },
  optionRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingVertical: Spacing.sm, paddingHorizontal: Spacing.sm, borderRadius: Radius.md,
  },
  optionSelected: { backgroundColor: Colors.accent + '10' },
  optionLabel: { fontSize: FontSizes.base, color: Colors.textPrimary },
  checkItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.xs },
  checkText: { fontSize: FontSizes.md, color: Colors.textSecondary },
  skipBtn: { alignItems: 'center', marginTop: Spacing.md },
  skipText: { fontSize: FontSizes.md, color: Colors.textMuted },
});
