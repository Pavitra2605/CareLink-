import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button } from '../../components/common';

export default function ExportDataScreen({ navigation }) {
  const [format, setFormat] = useState('pdf');
  const [sections, setSections] = useState(['profile', 'vitals', 'medications']);

  const formats = [
    { key: 'pdf', label: 'PDF', icon: 'document-text', desc: 'Best for sharing with doctors' },
    { key: 'csv', label: 'CSV', icon: 'grid', desc: 'Spreadsheet format' },
    { key: 'json', label: 'JSON', icon: 'code-slash', desc: 'For digital systems' },
  ];

  const dataOptions = [
    { key: 'profile', label: 'Personal Profile', icon: 'person' },
    { key: 'vitals', label: 'Vitals & Trends', icon: 'pulse' },
    { key: 'medications', label: 'Medications', icon: 'medkit' },
    { key: 'reports', label: 'Test Reports', icon: 'document-text' },
    { key: 'history', label: 'Medical History', icon: 'folder-open' },
    { key: 'consultations', label: 'Consultations', icon: 'videocam' },
    { key: 'immunization', label: 'Immunization', icon: 'shield-checkmark' },
  ];

  const toggleSection = (key) => {
    setSections(prev => prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key]);
  };

  return (
    <View style={styles.container}>
      <Header title="Export Health Data" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Format Selection */}
        <Text style={styles.sectionTitle}>Export Format</Text>
        <View style={styles.formatRow}>
          {formats.map(f => (
            <TouchableOpacity key={f.key}
              style={[styles.formatCard, format === f.key && styles.formatActive, Shadows.soft]}
              onPress={() => setFormat(f.key)}>
              <Ionicons name={f.icon} size={28}
                color={format === f.key ? Colors.white : Colors.accent} />
              <Text style={[styles.formatLabel, format === f.key && { color: Colors.white }]}>{f.label}</Text>
              <Text style={[styles.formatDesc, format === f.key && { color: Colors.white + 'CC' }]}>{f.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Data Selection */}
        <Text style={styles.sectionTitle}>Select Data</Text>
        {dataOptions.map(d => {
          const selected = sections.includes(d.key);
          return (
            <TouchableOpacity key={d.key} style={[styles.dataRow, Shadows.soft]}
              onPress={() => toggleSection(d.key)}>
              <View style={[styles.checkbox, selected && styles.checkboxChecked]}>
                {selected && <Ionicons name="checkmark" size={16} color={Colors.white} />}
              </View>
              <Ionicons name={d.icon} size={20} color={Colors.accent} style={{ marginRight: Spacing.md }} />
              <Text style={styles.dataLabel}>{d.label}</Text>
            </TouchableOpacity>
          );
        })}

        {/* Date Range */}
        <Text style={styles.sectionTitle}>Date Range</Text>
        <View style={styles.dateRow}>
          {['Last 3 months', 'Last 6 months', 'Last year', 'All time'].map((label, i) => (
            <TouchableOpacity key={i} style={[styles.dateChip, i === 0 && styles.dateActive]}>
              <Text style={[styles.dateText, i === 0 && { color: Colors.white }]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button title="Export Data" variant="primary" size="lg"
          disabled={sections.length === 0}
          icon={<Ionicons name="download" size={18} color={Colors.white} />}
          onPress={() => {}} style={{ marginTop: Spacing.lg }} />

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md },
  sectionTitle: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.textPrimary, marginBottom: Spacing.md, marginTop: Spacing.sm },
  formatRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.lg },
  formatCard: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.lg,
    alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  formatActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  formatLabel: { fontSize: FontSizes.md, fontWeight: FontWeights.bold, color: Colors.textPrimary, marginTop: Spacing.sm },
  formatDesc: { fontSize: FontSizes.xs, color: Colors.textMuted, textAlign: 'center', marginTop: 4 },
  dataRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.sm,
  },
  checkbox: {
    width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: Colors.border,
    justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md,
  },
  checkboxChecked: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  dataLabel: { flex: 1, fontSize: FontSizes.md, color: Colors.textPrimary },
  dateRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  dateChip: {
    paddingVertical: 8, paddingHorizontal: Spacing.md, borderRadius: Radius.pill,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
  },
  dateActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  dateText: { fontSize: FontSizes.sm, fontWeight: FontWeights.medium, color: Colors.textSecondary },
});
