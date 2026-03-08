import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Badge, SearchBar } from '../../components/common';
import { useLanguage } from '../../i18n';

const history = [
  { id: '1', date: '2025-01-15', symptoms: ['Fever', 'Headache', 'Body aches'], result: 'Viral Fever', severity: 'Moderate', match: 85 },
  { id: '2', date: '2025-01-02', symptoms: ['Cough', 'Sore throat'], result: 'Common Cold', severity: 'Mild', match: 72 },
  { id: '3', date: '2024-12-20', symptoms: ['Stomach pain', 'Nausea'], result: 'Gastritis', severity: 'Moderate', match: 68 },
  { id: '4', date: '2024-11-10', symptoms: ['Joint pain', 'Fatigue'], result: 'Seasonal Flu', severity: 'Mild', match: 55 },
];

export default function SymptomHistoryScreen({ navigation }) {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const filtered = history.filter(h =>
    h.result.toLowerCase().includes(search.toLowerCase()) ||
    h.symptoms.join(' ').toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity style={[styles.card, Shadows.soft]} activeOpacity={0.7} onPress={() => {}}>
      <View style={styles.cardHeader}>
        <Text style={styles.date}>{new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
        <Badge label={item.severity} variant={item.severity === 'Mild' ? 'success' : 'warning'} size="sm" />
      </View>
      <Text style={styles.result}>{item.result}</Text>
      <Text style={styles.matchPct}>{item.match}% match</Text>
      <View style={styles.chipRow}>
        {item.symptoms.map((s, i) => (
          <View key={i} style={styles.chip}>
            <Text style={styles.chipText}>{s}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title={t('symptomChecker.history')} onBack={() => navigation.goBack()} />
      <View style={{ paddingHorizontal: Spacing.base, paddingTop: Spacing.md }}>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search history..." />
      </View>
      <FlatList data={filtered} keyExtractor={i => i.id} renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="document-text-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No symptom checks found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  list: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, paddingBottom: 40 },
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.md,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  date: { fontSize: FontSizes.sm, color: Colors.textMuted },
  result: { fontSize: FontSizes.lg, fontWeight: FontWeights.semiBold, color: Colors.textPrimary, marginTop: Spacing.xs },
  matchPct: { fontSize: FontSizes.sm, color: Colors.accent, fontWeight: FontWeights.medium, marginTop: 2 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, marginTop: Spacing.sm },
  chip: { backgroundColor: Colors.bgSecondary, borderRadius: Radius.full, paddingHorizontal: Spacing.sm, paddingVertical: 3 },
  chipText: { fontSize: FontSizes.xs, color: Colors.textSecondary },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: FontSizes.md, color: Colors.textMuted, marginTop: Spacing.md },
});
