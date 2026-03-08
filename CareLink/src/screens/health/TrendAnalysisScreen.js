import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Badge } from '../../components/common';
import { useLanguage } from '../../i18n';

const { width: SCREEN_W } = Dimensions.get('window');
const CHART_W = SCREEN_W - 64;
const CHART_H = 160;

const metrics = [
  { key: 'bp', label: 'Blood Pressure', icon: 'heart', color: Colors.error, unit: 'mmHg',
    data: [120, 118, 125, 130, 122, 119, 120], labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
  { key: 'sugar', label: 'Blood Sugar', icon: 'water', color: Colors.amberMid, unit: 'mg/dL',
    data: [95, 102, 98, 110, 92, 88, 95], labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
  { key: 'weight', label: 'Weight', icon: 'fitness', color: Colors.accent, unit: 'kg',
    data: [72, 72.5, 71.8, 72.2, 71.5, 71.3, 71], labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
];

function SimpleChart({ data, color, height = CHART_H }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <View style={[styles.chartArea, { height }]}>
      {data.map((v, i) => {
        const barH = ((v - min) / range) * (height - 40) + 20;
        return (
          <View key={i} style={styles.barCol}>
            <Text style={[styles.barValue, { color }]}>{v}</Text>
            <View style={[styles.bar, { height: barH, backgroundColor: color + '40', borderColor: color }]} />
          </View>
        );
      })}
    </View>
  );
}

export default function TrendAnalysisScreen({ navigation }) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState('bp');
  const [period, setPeriod] = useState('week');

  const metric = metrics.find(m => m.key === selected);
  const periods = ['week', 'month', '3months', '6months'];

  return (
    <View style={styles.container}>
      <Header title={t('health.trendAnalysis')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Metric Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabRow}>
          {metrics.map(m => (
            <TouchableOpacity key={m.key}
              style={[styles.tab, selected === m.key && { backgroundColor: m.color }]}
              onPress={() => setSelected(m.key)}>
              <Ionicons name={m.icon} size={18} color={selected === m.key ? Colors.white : m.color} />
              <Text style={[styles.tabText, selected === m.key && { color: Colors.white }]}>{m.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Period Filter */}
        <View style={styles.periodRow}>
          {periods.map(p => (
            <TouchableOpacity key={p}
              style={[styles.periodChip, period === p && styles.periodActive]}
              onPress={() => setPeriod(p)}>
              <Text style={[styles.periodText, period === p && { color: Colors.white }]}>
                {p === 'week' ? '1W' : p === 'month' ? '1M' : p === '3months' ? '3M' : '6M'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chart */}
        <View style={[styles.chartCard, Shadows.soft]}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>{metric.label}</Text>
            <Badge label={metric.unit} variant="neutral" size="sm" />
          </View>
          <SimpleChart data={metric.data} color={metric.color} />
          <View style={styles.labelRow}>
            {metric.labels.map((l, i) => (
              <Text key={i} style={styles.labelText}>{l}</Text>
            ))}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          <View style={[styles.statItem, Shadows.soft]}>
            <Text style={styles.statLabel}>Average</Text>
            <Text style={[styles.statValue, { color: metric.color }]}>
              {Math.round(metric.data.reduce((a, b) => a + b, 0) / metric.data.length)}
            </Text>
            <Text style={styles.statUnit}>{metric.unit}</Text>
          </View>
          <View style={[styles.statItem, Shadows.soft]}>
            <Text style={styles.statLabel}>Highest</Text>
            <Text style={[styles.statValue, { color: Colors.error }]}>{Math.max(...metric.data)}</Text>
            <Text style={styles.statUnit}>{metric.unit}</Text>
          </View>
          <View style={[styles.statItem, Shadows.soft]}>
            <Text style={styles.statLabel}>Lowest</Text>
            <Text style={[styles.statValue, { color: Colors.success }]}>{Math.min(...metric.data)}</Text>
            <Text style={styles.statUnit}>{metric.unit}</Text>
          </View>
        </View>

        {/* Insights */}
        <View style={[styles.insightCard, Shadows.soft]}>
          <Ionicons name="bulb" size={24} color={Colors.amberMid} />
          <View style={{ flex: 1, marginLeft: Spacing.md }}>
            <Text style={styles.insightTitle}>AI Insight</Text>
            <Text style={styles.insightText}>
              Your {metric.label.toLowerCase()} has remained within normal range this week. 
              Keep maintaining your current lifestyle habits.
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md },
  tabRow: { marginBottom: Spacing.md },
  tab: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg, borderRadius: Radius.pill, backgroundColor: Colors.surface,
    marginRight: Spacing.sm, gap: Spacing.xs, borderWidth: 1, borderColor: Colors.border,
  },
  tabText: { fontSize: FontSizes.sm, fontWeight: FontWeights.medium, color: Colors.textPrimary },
  periodRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  periodChip: {
    paddingVertical: 6, paddingHorizontal: Spacing.md, borderRadius: Radius.pill,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
  },
  periodActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  periodText: { fontSize: FontSizes.sm, fontWeight: FontWeights.medium, color: Colors.textSecondary },
  chartCard: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.lg, marginBottom: Spacing.lg },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  chartTitle: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.textPrimary },
  chartArea: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: 4 },
  barCol: { alignItems: 'center', flex: 1 },
  barValue: { fontSize: FontSizes.xs, fontWeight: FontWeights.medium, marginBottom: 4 },
  bar: { width: 20, borderRadius: 10, borderWidth: 1.5 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.sm },
  labelText: { fontSize: FontSizes.xs, color: Colors.textMuted, flex: 1, textAlign: 'center' },
  statsGrid: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.lg },
  statItem: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.md, alignItems: 'center',
  },
  statLabel: { fontSize: FontSizes.xs, color: Colors.textMuted },
  statValue: { fontSize: FontSizes.xl, fontWeight: FontWeights.bold, marginTop: 4 },
  statUnit: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 2 },
  insightCard: {
    flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: Radius.xl,
    padding: Spacing.lg,
  },
  insightTitle: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  insightText: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 4, lineHeight: 20 },
});
