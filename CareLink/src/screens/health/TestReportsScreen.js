import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, SearchBar, Badge, Button } from '../../components/common';
import { useLanguage } from '../../i18n';

const mockReports = [
  { id: '1', name: 'Complete Blood Count', lab: 'Apollo Diagnostics', date: '12 Jan 2025', type: 'Blood', status: 'normal' },
  { id: '2', name: 'Thyroid Panel (TSH)', lab: 'SRL Diagnostics', date: '05 Jan 2025', type: 'Blood', status: 'abnormal' },
  { id: '3', name: 'Chest X-Ray', lab: 'St. Joseph Hospital', date: '28 Dec 2024', type: 'Imaging', status: 'normal' },
  { id: '4', name: 'Urine Analysis', lab: 'Thyrocare', date: '20 Dec 2024', type: 'Urine', status: 'normal' },
  { id: '5', name: 'HbA1c', lab: 'Apollo Diagnostics', date: '15 Dec 2024', type: 'Blood', status: 'borderline' },
  { id: '6', name: 'Lipid Profile', lab: 'SRL Diagnostics', date: '10 Dec 2024', type: 'Blood', status: 'normal' },
];

const statusVariant = { normal: 'success', abnormal: 'error', borderline: 'warning' };

export default function TestReportsScreen({ navigation }) {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filters = ['all', 'Blood', 'Imaging', 'Urine'];
  const filtered = mockReports.filter(r => {
    if (filter !== 'all' && r.type !== filter) return false;
    if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity style={[styles.card, Shadows.soft]}
      onPress={() => navigation.navigate('ReportDetail', { report: item })}>
      <View style={styles.cardLeft}>
        <View style={[styles.typeIcon, { backgroundColor: item.type === 'Blood' ? Colors.error + '20' : item.type === 'Imaging' ? Colors.accent + '20' : Colors.amberMid + '20' }]}>
          <Ionicons name={item.type === 'Blood' ? 'water' : item.type === 'Imaging' ? 'scan' : 'flask'}
            size={20} color={item.type === 'Blood' ? Colors.error : item.type === 'Imaging' ? Colors.accent : Colors.amberMid} />
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.reportName}>{item.name}</Text>
        <Text style={styles.labName}>{item.lab}</Text>
        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={13} color={Colors.textMuted} />
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
      </View>
      <View style={styles.cardRight}>
        <Badge label={item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          variant={statusVariant[item.status]} size="sm" />
        <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} style={{ marginTop: Spacing.sm }} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title={t('health.testReports')} onBack={() => navigation.goBack()} />
      <View style={styles.searchWrap}>
        <SearchBar placeholder="Search reports..." value={search} onChangeText={setSearch} />
      </View>

      <View style={styles.filterRow}>
        {filters.map(f => (
          <TouchableOpacity key={f}
            style={[styles.filterChip, filter === f && styles.filterActive]}
            onPress={() => setFilter(f)}>
            <Text style={[styles.filterText, filter === f && { color: Colors.white }]}>
              {f === 'all' ? 'All' : f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList data={filtered} keyExtractor={i => i.id} renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Button title="Upload Report" variant="outline" size="sm"
            icon={<Ionicons name="cloud-upload-outline" size={16} color={Colors.accent} />}
            onPress={() => navigation.navigate('UploadReport')} style={{ marginBottom: Spacing.md }} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="document-text-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No reports found</Text>
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
  filterActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  filterText: { fontSize: FontSizes.sm, fontWeight: FontWeights.medium, color: Colors.textSecondary },
  list: { paddingHorizontal: Spacing.base, paddingBottom: 40 },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.sm,
  },
  cardLeft: { marginRight: Spacing.md },
  typeIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  reportName: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  labName: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  dateText: { fontSize: FontSizes.xs, color: Colors.textMuted },
  cardRight: { alignItems: 'flex-end' },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: FontSizes.md, color: Colors.textMuted, marginTop: Spacing.md },
});
