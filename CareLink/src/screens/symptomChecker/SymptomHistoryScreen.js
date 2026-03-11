import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Badge, SearchBar } from '../../components/common';
import { useLanguage } from '../../i18n';
import { useAuth } from '../../context/AuthContext';
import { getSymptomChecks } from '../../services/historyService';

const sevMap = {
  LOW:    { label: 'Low Risk',    variant: 'success' },
  MEDIUM: { label: 'Medium Risk', variant: 'warning' },
  HIGH:   { label: 'High Risk',   variant: 'error' },
};

export default function SymptomHistoryScreen({ navigation }) {
  const { t } = useLanguage();
  const { profile } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    if (!profile?.id) { setLoading(false); return; }
    try {
      const rows = await getSymptomChecks(profile.id, 50);
      setHistory(rows || []);
    } catch (e) {
      console.warn('[SymptomHistory] load failed:', e.message);
    } finally {
      setLoading(false);
    }
  }, [profile?.id]);

  useEffect(() => { load(); }, [load]);

  const filtered = history.filter(h => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      (h.symptoms_text || '').toLowerCase().includes(q) ||
      (h.prediction || '').toLowerCase().includes(q) ||
      (h.symptoms_selected || []).join(' ').toLowerCase().includes(q)
    );
  });

  const renderItem = ({ item }) => {
    const sev = sevMap[item.prediction] || sevMap.MEDIUM;
    const confidence = Math.round((item.confidence || 0) * 100);
    const symptoms = item.symptoms_selected?.length
      ? item.symptoms_selected
      : (item.symptoms_text || '').split(/[.,;]+/).map(s => s.trim()).filter(Boolean).slice(0, 5);

    return (
      <TouchableOpacity style={[styles.card, Shadows.soft]} activeOpacity={0.7}>
        <View style={styles.cardHeader}>
          <Text style={styles.date}>
            {new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </Text>
          <Badge label={sev.label} variant={sev.variant} size="sm" />
        </View>
        <Text style={styles.result}>{item.prediction} Risk</Text>
        <Text style={styles.matchPct}>{confidence}% confidence</Text>
        <View style={styles.chipRow}>
          {symptoms.map((s, i) => (
            <View key={i} style={styles.chip}>
              <Text style={styles.chipText}>{s}</Text>
            </View>
          ))}
        </View>
        {item.emergency_flag && (
          <View style={styles.emergencyTag}>
            <Ionicons name="alert-circle" size={14} color={Colors.error} />
            <Text style={styles.emergencyTagText}>Emergency flagged</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header title={t('symptomChecker.history')} onBack={() => navigation.goBack()} />
      <View style={{ paddingHorizontal: Spacing.base, paddingTop: Spacing.md }}>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search history..." />
      </View>
      {loading ? (
        <View style={styles.empty}>
          <ActivityIndicator size="large" color={Colors.accent} />
        </View>
      ) : (
        <FlatList data={filtered} keyExtractor={i => i.id} renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="document-text-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyText}>No symptom checks found</Text>
            </View>
          }
        />
      )}
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
  emergencyTag: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: Spacing.sm },
  emergencyTagText: { fontSize: FontSizes.xs, color: Colors.error, fontWeight: FontWeights.medium },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: FontSizes.md, color: Colors.textMuted, marginTop: Spacing.md },
});
