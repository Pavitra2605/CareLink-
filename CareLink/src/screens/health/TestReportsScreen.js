import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, SearchBar, Badge, Button } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n';
import { getTestReports } from '../../services/careService';

const statusVariant = { normal: 'success', abnormal: 'error', borderline: 'warning' };

export default function TestReportsScreen({ navigation }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const filters = ['all', 'Blood', 'Imaging', 'Urine', 'Pathology'];

  const fetchReports = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await getTestReports(user.id);
      setReports(data);
    } catch (err) {
      console.warn('Failed to load test reports:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchReports);
    return unsubscribe;
  }, [navigation, fetchReports]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchReports();
  };

  const filtered = reports.filter(r => {
    if (filter !== 'all' && r.report_type !== filter) return false;
    if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={[styles.card, Shadows.soft]}
      onPress={() => navigation.navigate('ReportDetail', { report: item })}>
      <View style={styles.cardLeft}>
        <View style={[styles.typeIcon, { backgroundColor: item.report_type === 'Blood' ? Colors.error + '20' : item.report_type === 'Imaging' ? Colors.accent + '20' : Colors.amberMid + '20' }]}>
          <Ionicons name={item.report_type === 'Blood' ? 'water' : item.report_type === 'Imaging' ? 'scan' : 'flask'}
            size={20} color={item.report_type === 'Blood' ? Colors.error : item.report_type === 'Imaging' ? Colors.accent : Colors.amberMid} />
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.reportName} numberOfLines={1}>{item.name}</Text>
        {item.lab_name ? <Text style={styles.labName}>{item.lab_name}</Text> : null}
        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={13} color={Colors.textMuted} />
          <Text style={styles.dateText}>{formatDate(item.test_date || item.created_at)}</Text>
        </View>
      </View>
      <View style={styles.cardRight}>
        <Badge label={(item.status || 'Normal').charAt(0).toUpperCase() + (item.status || 'Normal').slice(1)}
           variant={statusVariant[item.status || 'normal']} size="sm" />
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
        <FlatList 
          data={filters}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item: f }) => (
            <TouchableOpacity
              style={[styles.filterChip, filter === f && styles.filterActive]}
              onPress={() => setFilter(f)}>
              <Text style={[styles.filterText, filter === f && { color: Colors.white }]}>
                {f === 'all' ? 'All' : f}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={{ marginTop: Spacing.md, color: Colors.textMuted }}>Loading Reports...</Text>
        </View>
      ) : (
        <FlatList data={filtered} keyExtractor={i => i.id} renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.accent]} />}
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  searchWrap: { paddingHorizontal: Spacing.base, paddingTop: Spacing.md },
  filterRow: { flexDirection: 'row', paddingHorizontal: Spacing.base, marginVertical: Spacing.md },
  filterChip: {
    paddingVertical: 6, paddingHorizontal: Spacing.md, borderRadius: Radius.pill,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
    marginRight: Spacing.sm,
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
