import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Badge, Button } from '../../components/common';
import { useLanguage } from '../../i18n';

const syncItems = [
  { label: 'Health Profile', status: 'synced', time: '2 min ago', icon: 'person' },
  { label: 'Vitals', status: 'synced', time: '5 min ago', icon: 'pulse' },
  { label: 'Medications', status: 'synced', time: '10 min ago', icon: 'medkit' },
  { label: 'Test Reports', status: 'syncing', time: 'In progress...', icon: 'document-text' },
  { label: 'Consultation History', status: 'synced', time: '1 hour ago', icon: 'videocam' },
  { label: 'Immunization Records', status: 'error', time: 'Failed - Retry', icon: 'shield-checkmark' },
];

const statusIcon = { synced: 'checkmark-circle', syncing: 'sync', error: 'alert-circle' };
const statusColor = { synced: Colors.success, syncing: Colors.accent, error: Colors.error };

export default function SyncStatusScreen({ navigation }) {
  const { t } = useLanguage();
  return (
    <View style={styles.container}>
      <Header title={t('health.syncStatus')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Overall Status */}
        <View style={[styles.overallCard, Shadows.soft]}>
          <Ionicons name="cloud-done" size={48} color={Colors.success} />
          <Text style={styles.overallTitle}>Data Mostly Synced</Text>
          <Text style={styles.overallSub}>Last full sync: 5 minutes ago</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '85%' }]} />
          </View>
          <Text style={styles.progressText}>5 of 6 categories synced</Text>
        </View>

        {/* Sync Items */}
        <Text style={styles.sectionTitle}>Sync Details</Text>
        {syncItems.map((item, i) => (
          <View key={i} style={[styles.syncRow, Shadows.soft]}>
            <View style={[styles.syncIcon, { backgroundColor: statusColor[item.status] + '20' }]}>
              <Ionicons name={item.icon} size={20} color={statusColor[item.status]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.syncLabel}>{item.label}</Text>
              <Text style={[styles.syncTime, item.status === 'error' && { color: Colors.error }]}>{item.time}</Text>
            </View>
            <Ionicons name={statusIcon[item.status]} size={22} color={statusColor[item.status]} />
          </View>
        ))}

        {/* Storage Info */}
        <View style={[styles.storageCard, Shadows.soft]}>
          <Text style={styles.storageTitle}>Offline Storage</Text>
          <View style={styles.storageBar}>
            <View style={[styles.storageFill, { width: '35%' }]} />
          </View>
          <View style={styles.storageRow}>
            <Text style={styles.storageText}>35 MB used</Text>
            <Text style={styles.storageText}>100 MB available</Text>
          </View>
        </View>

        <Button title="Sync Now" variant="primary" size="lg"
          icon={<Ionicons name="sync" size={18} color={Colors.white} />}
          onPress={() => {}} style={{ marginTop: Spacing.md }} />

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md },
  overallCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.xl,
    alignItems: 'center', marginBottom: Spacing.lg,
  },
  overallTitle: { fontSize: FontSizes.xl, fontWeight: FontWeights.bold, color: Colors.textPrimary, marginTop: Spacing.md },
  overallSub: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 4 },
  progressBar: { width: '80%', height: 6, backgroundColor: Colors.bgSecondary, borderRadius: 3, overflow: 'hidden', marginTop: Spacing.lg },
  progressFill: { height: '100%', backgroundColor: Colors.success, borderRadius: 3 },
  progressText: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: Spacing.sm },
  sectionTitle: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.textPrimary, marginBottom: Spacing.md },
  syncRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.sm,
  },
  syncIcon: {
    width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center',
    marginRight: Spacing.md,
  },
  syncLabel: { fontSize: FontSizes.md, fontWeight: FontWeights.medium, color: Colors.textPrimary },
  syncTime: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
  storageCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.lg, marginTop: Spacing.lg,
  },
  storageTitle: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold, color: Colors.textPrimary, marginBottom: Spacing.md },
  storageBar: { height: 8, backgroundColor: Colors.bgSecondary, borderRadius: 4, overflow: 'hidden' },
  storageFill: { height: '100%', backgroundColor: Colors.amberMid, borderRadius: 4 },
  storageRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.sm },
  storageText: { fontSize: FontSizes.sm, color: Colors.textMuted },
});
