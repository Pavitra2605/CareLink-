import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header } from '../../components/common';

const incidents = [
  { label: 'Accident / Injury', icon: 'car', color: Colors.error, desc: 'Road accident, fall, or physical injury' },
  { label: 'Chest Pain', icon: 'heart', color: '#E91E63', desc: 'Pain or tightness in the chest area' },
  { label: 'Breathing Problem', icon: 'fitness', color: Colors.accent, desc: 'Difficulty breathing or shortness of breath' },
  { label: 'Bleeding', icon: 'water', color: '#F44336', desc: 'Severe or uncontrolled bleeding' },
  { label: 'Unconscious Person', icon: 'person', color: '#9C27B0', desc: 'Person not responding' },
  { label: 'Fever / Infection', icon: 'thermometer', color: Colors.amberMid, desc: 'Very high fever with other symptoms' },
  { label: 'Poisoning / Overdose', icon: 'flask', color: '#4CAF50', desc: 'Accidental or intentional poisoning' },
  { label: 'Snake / Animal Bite', icon: 'bug', color: '#795548', desc: 'Bite from snake, dog, or insect' },
  { label: 'Burn Injury', icon: 'flame', color: '#FF5722', desc: 'Burns from fire, chemicals, or hot liquids' },
  { label: 'Pregnancy Emergency', icon: 'woman', color: '#E040FB', desc: 'Labor, bleeding, or complications' },
];

export default function IncidentSelectScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Header title="Select Emergency Type" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.subtitle}>Select the type of emergency for guided assistance</Text>
        {incidents.map((item, i) => (
          <TouchableOpacity key={i} style={[styles.card, Shadows.soft]}
            onPress={() => navigation.navigate('SymptomQuestionnaire', { type: item.label })}>
            <View style={[styles.iconBox, { backgroundColor: item.color + '20' }]}>
              <Ionicons name={item.icon} size={24} color={item.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.desc}>{item.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md },
  subtitle: { fontSize: FontSizes.md, color: Colors.textMuted, marginBottom: Spacing.lg },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.sm,
  },
  iconBox: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  label: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  desc: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
});
