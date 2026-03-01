import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Badge, SearchBar } from '../../components/common';

const mockHistory = [
  { id: '1', doctor: 'Dr. Priya Sharma', specialty: 'General Physician', date: '15 Jan 2025', mode: 'video', status: 'completed', diagnosis: 'Tension Headache' },
  { id: '2', doctor: 'Dr. Arun Kumar', specialty: 'Pediatrics', date: '10 Jan 2025', mode: 'audio', status: 'completed', diagnosis: 'Common Cold' },
  { id: '3', doctor: 'Dr. Lakshmi Devi', specialty: 'Dermatology', date: '02 Jan 2025', mode: 'text', status: 'completed', diagnosis: 'Skin Allergy' },
  { id: '4', doctor: 'Dr. Rajesh Menon', specialty: 'Orthopedics', date: '20 Dec 2024', mode: 'video', status: 'cancelled', diagnosis: '' },
  { id: '5', doctor: 'Dr. Priya Sharma', specialty: 'General Physician', date: '15 Dec 2024', mode: 'audio', status: 'completed', diagnosis: 'Fever / Viral' },
];

const modeIcons = { video: 'videocam', audio: 'call', text: 'chatbubbles' };

export default function ConsultationHistoryScreen({ navigation }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filters = ['all', 'video', 'audio', 'text'];
  const filtered = mockHistory.filter(c => {
    if (filter !== 'all' && c.mode !== filter) return false;
    if (search && !c.doctor.toLowerCase().includes(search.toLowerCase()) &&
        !c.diagnosis.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity style={[styles.card, Shadows.soft]}
      onPress={() => navigation.navigate('ConsultationDetail', { consultation: item })}>
      <View style={styles.cardTop}>
        <View style={[styles.modeIcon, { backgroundColor: item.mode === 'video' ? Colors.accent : item.mode === 'audio' ? Colors.success : Colors.amberMid }]}>
          <Ionicons name={modeIcons[item.mode]} size={18} color={Colors.white} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.docName}>{item.doctor}</Text>
          <Text style={styles.specText}>{item.specialty}</Text>
        </View>
        <Badge label={item.status === 'completed' ? 'Completed' : 'Cancelled'}
          variant={item.status === 'completed' ? 'success' : 'error'} size="sm" />
      </View>
      <View style={styles.cardBottom}>
        <View style={styles.metaItem}>
          <Ionicons name="calendar-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.metaText}>{item.date}</Text>
        </View>
        {item.diagnosis ? (
          <View style={styles.metaItem}>
            <Ionicons name="medkit-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.metaText}>{item.diagnosis}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.cardChevron}>
        <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Consultation History" onBack={() => navigation.goBack()} />
      <View style={styles.searchWrap}>
        <SearchBar placeholder="Search doctor or diagnosis" value={search} onChangeText={setSearch} />
      </View>

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        {filters.map(f => (
          <TouchableOpacity key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}>
            <Text style={[styles.filterText, filter === f && { color: Colors.white }]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="document-text-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No consultations found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  searchWrap: { paddingHorizontal: Spacing.base, paddingTop: Spacing.md },
  filterRow: { flexDirection: 'row', paddingHorizontal: Spacing.base, gap: Spacing.sm, marginVertical: Spacing.md },
  filterChip: {
    paddingVertical: 6, paddingHorizontal: Spacing.md, borderRadius: Radius.pill,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
  },
  filterChipActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  filterText: { fontSize: FontSizes.sm, fontWeight: FontWeights.medium, color: Colors.textSecondary },
  list: { paddingHorizontal: Spacing.base, paddingBottom: 40 },
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.lg,
    marginBottom: Spacing.md, position: 'relative',
  },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  modeIcon: {
    width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center',
    marginRight: Spacing.md,
  },
  docName: { fontSize: FontSizes.base, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  specText: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
  cardBottom: { flexDirection: 'row', marginTop: Spacing.md, gap: Spacing.lg },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: FontSizes.sm, color: Colors.textMuted },
  cardChevron: { position: 'absolute', right: Spacing.lg, top: '50%' },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: FontSizes.md, color: Colors.textMuted, marginTop: Spacing.md },
});
