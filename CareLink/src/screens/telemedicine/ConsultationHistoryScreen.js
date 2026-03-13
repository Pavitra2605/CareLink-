import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Badge, SearchBar } from '../../components/common';
import { useLanguage } from '../../i18n';
import { useAuth } from '../../context/AuthContext';
import { getPatientConsultations } from '../../services/careService';

const modeIcons = { video: 'videocam', audio: 'call', text: 'chatbubbles' };

const formatDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function ConsultationHistoryScreen({ navigation }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getPatientConsultations(user.id);
      setConsultations(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { load(); }, [load]);

  const mode = (c) => c.appointment?.mode || 'video';
  const filtered = consultations.filter((c) => {
    const modeVal = mode(c);
    if (filter !== 'all' && modeVal !== filter) return false;
    const docName = c.doctor?.full_name?.toLowerCase() || '';
    const diag = (c.diagnosis || '').toLowerCase();
    if (search && !docName.includes(search.toLowerCase()) && !diag.includes(search.toLowerCase())) return false;
    return true;
  });

  const renderItem = ({ item }) => {
    const modeVal = mode(item);
    const modeColor = modeVal === 'video' ? Colors.accent : modeVal === 'audio' ? Colors.success : Colors.amberMid;
    const dateStr = formatDate(item.created_at);

    return (
      <TouchableOpacity
        style={[styles.card, Shadows.soft]}
        onPress={() => navigation.navigate('ConsultationDetail', { consultationId: item.id, consultation: item })}
      >
        <View style={styles.cardTop}>
          <View style={[styles.modeIcon, { backgroundColor: modeColor }]}>
            <Ionicons name={modeIcons[modeVal] || 'videocam'} size={18} color={Colors.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.docName}>{item.doctor?.full_name || 'Doctor'}</Text>
            <Text style={styles.specText}>{item.doctor?.specialty || ''}</Text>
          </View>
          <Badge
            label={item.status === 'completed' ? 'Completed' : item.status === 'cancelled' ? 'Cancelled' : 'Active'}
            variant={item.status === 'completed' ? 'success' : item.status === 'cancelled' ? 'error' : 'info'}
            size="sm"
          />
        </View>
        <View style={styles.cardBottom}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.metaText}>{dateStr}</Text>
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
  };

  return (
    <View style={styles.container}>
      <Header title={t('telemedicine.consultationHistory')} onBack={() => navigation.goBack()} />
      <View style={styles.searchWrap}>
        <SearchBar placeholder="Search doctor or diagnosis" value={search} onChangeText={setSearch} />
      </View>

      <View style={styles.filterRow}>
        {['all', 'video', 'audio', 'text'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && { color: Colors.white }]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
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
          <TouchableOpacity onPress={load} style={styles.retryBtn}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="document-text-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyText}>No consultations found</Text>
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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyText: { fontSize: FontSizes.md, color: Colors.textMuted, marginTop: Spacing.md },
  errorText: { fontSize: FontSizes.md, color: Colors.error, marginTop: Spacing.md, textAlign: 'center', paddingHorizontal: Spacing.xl },
  retryBtn: { marginTop: Spacing.md, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.sm, backgroundColor: Colors.accent, borderRadius: Radius.pill },
  retryText: { color: Colors.white, fontWeight: FontWeights.semiBold },
});
