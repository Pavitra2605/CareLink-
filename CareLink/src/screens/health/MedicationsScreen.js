import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Badge, SearchBar } from '../../components/common';

const mockMedications = [
  { id: '1', name: 'Metformin 500mg', dose: '1 tab', freq: 'Twice daily', status: 'active', refills: 2, nextRefill: '20 Jan 2025', doctor: 'Dr. Priya Sharma' },
  { id: '2', name: 'Amlodipine 5mg', dose: '1 tab', freq: 'Once daily', status: 'active', refills: 1, nextRefill: '25 Jan 2025', doctor: 'Dr. Priya Sharma' },
  { id: '3', name: 'Paracetamol 500mg', dose: '1 tab', freq: 'As needed', status: 'active', refills: 0, nextRefill: '—', doctor: 'Dr. Arun Kumar' },
  { id: '4', name: 'Amoxicillin 250mg', dose: '1 cap', freq: '3 times daily', status: 'completed', refills: 0, nextRefill: '—', doctor: 'Dr. Priya Sharma' },
  { id: '5', name: 'Ibuprofen 200mg', dose: '1 tab', freq: 'As needed', status: 'discontinued', refills: 0, nextRefill: '—', doctor: 'Dr. Vikram Reddy' },
];

const statusColors = { active: Colors.success, completed: Colors.textMuted, discontinued: Colors.error };

export default function MedicationsScreen({ navigation }) {
  const [filter, setFilter] = useState('active');
  const [search, setSearch] = useState('');

  const filtered = mockMedications.filter(m => {
    if (filter !== 'all' && m.status !== filter) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <View style={styles.container}>
      <Header title="My Medications" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <SearchBar placeholder="Search medication..." value={search} onChangeText={setSearch} />

        {/* Filter */}
        <View style={styles.filterRow}>
          {['active', 'completed', 'discontinued', 'all'].map(f => (
            <TouchableOpacity key={f}
              style={[styles.filterChip, filter === f && styles.filterActive]}
              onPress={() => setFilter(f)}>
              <Text style={[styles.filterText, filter === f && { color: Colors.white }]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Medications List */}
        {filtered.map((med) => (
          <TouchableOpacity key={med.id} style={[styles.medCard, Shadows.soft]}
            onPress={() => navigation.navigate('AdherenceLog', { medication: med })}>
            <View style={styles.medTop}>
              <View style={[styles.statusDot, { backgroundColor: statusColors[med.status] }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.medName}>{med.name}</Text>
                <Text style={styles.medDoctor}>Prescribed by {med.doctor}</Text>
              </View>
              <Badge label={med.status.charAt(0).toUpperCase() + med.status.slice(1)}
                variant={med.status === 'active' ? 'success' : med.status === 'completed' ? 'neutral' : 'error'}
                size="sm" />
            </View>
            <View style={styles.medMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="medical-outline" size={14} color={Colors.textMuted} />
                <Text style={styles.metaText}>{med.dose}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="repeat-outline" size={14} color={Colors.textMuted} />
                <Text style={styles.metaText}>{med.freq}</Text>
              </View>
              {med.refills > 0 && (
                <View style={styles.metaItem}>
                  <Ionicons name="refresh-outline" size={14} color={Colors.amberMid} />
                  <Text style={styles.metaText}>{med.refills} refills left</Text>
                </View>
              )}
            </View>
            {med.status === 'active' && med.nextRefill !== '—' && (
              <View style={styles.refillRow}>
                <Ionicons name="calendar" size={14} color={Colors.accent} />
                <Text style={styles.refillText}>Next refill: {med.nextRefill}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="medkit-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No medications found</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginVertical: Spacing.md },
  filterChip: {
    paddingVertical: 6, paddingHorizontal: Spacing.md, borderRadius: Radius.pill,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
  },
  filterActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  filterText: { fontSize: FontSizes.sm, fontWeight: FontWeights.medium, color: Colors.textSecondary },
  medCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  medTop: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: Spacing.md },
  medName: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  medDoctor: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
  medMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.lg, marginTop: Spacing.md },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: FontSizes.sm, color: Colors.textMuted },
  refillRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: Spacing.sm, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.border },
  refillText: { fontSize: FontSizes.sm, color: Colors.accent, fontWeight: FontWeights.medium },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: FontSizes.md, color: Colors.textMuted, marginTop: Spacing.md },
});
