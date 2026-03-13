import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius } from '../../theme';
import { Header, SearchBar, DoctorCard, Badge } from '../../components/common';
import { useLanguage } from '../../i18n';
import { getDoctors } from '../../services/careService';

export default function DoctorsListScreen({ navigation, route }) {
  const { t } = useLanguage();
  const specialty = route?.params?.specialty || null;
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | online
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDoctors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDoctors({ specialty, search });
      setDoctors(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [specialty, search]);

  useEffect(() => {
    const timer = setTimeout(loadDoctors, 300);
    return () => clearTimeout(timer);
  }, [loadDoctors]);

  const filtered = filter === 'online'
    ? doctors.filter((d) => d.is_available)
    : doctors;

  return (
    <View style={styles.container}>
      <Header
        title={t('telemedicine.doctorsList')}
        subtitle={loading ? 'Loading...' : `${filtered.length} doctors available`}
        onBack={() => navigation.goBack()}
      />
      <View style={styles.content}>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search doctor..." style={styles.search} />

        <View style={styles.filters}>
          {['all', 'online'].map((f) => (
            <TouchableOpacity key={f} onPress={() => setFilter(f)}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}>
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f === 'all' ? 'All' : 'Online Now'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={Colors.accent} />
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Ionicons name="alert-circle-outline" size={48} color={Colors.error} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={loadDoctors} style={styles.retryBtn}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <DoctorCard
                name={item.full_name}
                specialty={item.specialty}
                rating={String(item.rating || '0')}
                available={item.is_available}
                languages={item.bio ? '' : ''}
                onPress={() => navigation.navigate('DoctorProfile', { doctor: item })}
              />
            )}
            ListEmptyComponent={
              <View style={styles.center}>
                <Ionicons name="people-outline" size={48} color={Colors.textMuted} />
                <Text style={styles.emptyText}>No doctors found</Text>
              </View>
            }
            ListFooterComponent={<View style={{ height: 100 }} />}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  content: { flex: 1, paddingHorizontal: Spacing.base },
  search: { marginVertical: Spacing.md },
  filters: { flexDirection: 'row', marginBottom: Spacing.md, gap: Spacing.sm },
  filterChip: {
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm,
    borderRadius: Radius.pill, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
  },
  filterChipActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  filterText: { fontSize: FontSizes.sm, color: Colors.textSecondary, fontWeight: FontWeights.medium },
  filterTextActive: { color: Colors.white },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyText: { fontSize: FontSizes.md, color: Colors.textMuted, marginTop: Spacing.md },
  errorText: { fontSize: FontSizes.md, color: Colors.error, marginTop: Spacing.md, textAlign: 'center' },
  retryBtn: { marginTop: Spacing.md, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.sm, backgroundColor: Colors.accent, borderRadius: Radius.pill },
  retryText: { color: Colors.white, fontWeight: FontWeights.semiBold },
});
