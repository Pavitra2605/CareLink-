import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Badge } from '../../components/common';
import { useLanguage } from '../../i18n';
import { getPharmacies } from '../../services/careService';

const FILTERS = ['All', 'Government', 'Private', 'Top Rated', 'Open Now'];

export default function PharmacyResultsScreen({ navigation }) {
  const [pharmacies, setPharmacies] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useLanguage();

  const fetchPharmacies = useCallback(async (q) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPharmacies({ search: q });
      setPharmacies(data);
      setFiltered(applyFilter(data, activeFilter));
    } catch (err) {
      setError('Failed to load pharmacies. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let timer;
    timer = setTimeout(() => fetchPharmacies(search), 300);
    return () => clearTimeout(timer);
  }, [search, fetchPharmacies]);

  const applyFilter = (list, filter) => {
    switch (filter) {
      case 'Government': return list.filter(p => p.type === 'Government');
      case 'Private':    return list.filter(p => p.type === 'Private');
      case 'Top Rated':  return [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'Open Now':   return list.filter(p => p.is_open);
      default:           return list;
    }
  };

  const handleFilter = (f) => {
    setActiveFilter(f);
    setFiltered(applyFilter(pharmacies, f));
  };

  const formatHours = (p) => {
    if (!p.opening_time && !p.closing_time) return 'Hours N/A';
    return `${p.opening_time || ''} – ${p.closing_time || ''}`;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, Shadows.soft]}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('PharmacyDetail', { pharmacy: item })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <Badge
            label={item.type || 'Pharmacy'}
            variant={item.type === 'Government' ? 'info' : 'neutral'}
            size="sm"
          />
        </View>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color={Colors.amberMid} />
          <Text style={styles.rating}>{item.rating ? item.rating.toFixed(1) : 'N/A'}</Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="location" size={14} color={Colors.accent} />
          <Text style={styles.metaText} numberOfLines={1}>
            {[item.address, item.city].filter(Boolean).join(', ') || 'Address N/A'}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="time" size={14} color={Colors.textMuted} />
          <Text style={styles.metaText}>{formatHours(item)}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.priceLabel}>
          {item.city ? item.city : 'Pharmacy'}
        </Text>
        <Badge
          label={item.is_open ? 'Open' : 'Closed'}
          variant={item.is_open ? 'success' : 'error'}
          size="sm"
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title={t('medicine.pharmacyResults')} onBack={() => navigation.goBack()} />

      {/* Search */}
      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} color={Colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search pharmacies..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, activeFilter === f && styles.filterActive]}
            onPress={() => handleFilter(f)}
          >
            <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={styles.stateText}>Finding pharmacies near you...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerState}>
          <Ionicons name="alert-circle" size={48} color={Colors.error} />
          <Text style={styles.stateText}>{error}</Text>
          <TouchableOpacity onPress={() => fetchPharmacies(search)} style={styles.retryBtn}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.centerState}>
          <Ionicons name="storefront-outline" size={48} color={Colors.textMuted} />
          <Text style={styles.stateText}>No pharmacies found</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={i => String(i.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  searchRow: {
    flexDirection: 'row', alignItems: 'center', marginHorizontal: Spacing.base,
    marginTop: Spacing.sm, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
    backgroundColor: Colors.surface, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border,
  },
  searchIcon: { marginRight: Spacing.xs },
  searchInput: { flex: 1, fontSize: FontSizes.md, color: Colors.textPrimary, height: 36 },
  filterRow: {
    flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm, gap: Spacing.xs,
  },
  filterChip: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.full,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
  },
  filterActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  filterText: { fontSize: FontSizes.xs, color: Colors.textSecondary },
  filterTextActive: { color: Colors.white, fontWeight: FontWeights.semiBold },
  list: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm, paddingBottom: 40 },
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  nameRow: { flex: 1, gap: Spacing.xs },
  name: { fontSize: FontSizes.base, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  rating: { fontSize: FontSizes.sm, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  metaRow: { flexDirection: 'row', gap: Spacing.lg, marginTop: Spacing.sm, flexWrap: 'wrap' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1 },
  metaText: { fontSize: FontSizes.sm, color: Colors.textMuted, flexShrink: 1 },
  footer: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: Spacing.md, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.border,
  },
  priceLabel: { fontSize: FontSizes.sm, fontWeight: FontWeights.medium, color: Colors.textSecondary },
  centerState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  stateText: { fontSize: FontSizes.md, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.md },
  retryBtn: {
    marginTop: Spacing.md, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.sm,
    backgroundColor: Colors.accent, borderRadius: Radius.lg,
  },
  retryText: { fontSize: FontSizes.md, color: Colors.white, fontWeight: FontWeights.semiBold },
});
