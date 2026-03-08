import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Badge } from '../../components/common';
import { useLanguage } from '../../i18n';

const mockLogs = [
  { id: '1', who: 'Dr. Priya Sharma', action: 'Viewed Medical History', when: '2 hours ago', type: 'view' },
  { id: '2', who: 'Apollo Diagnostics', action: 'Uploaded Test Report', when: '5 hours ago', type: 'upload' },
  { id: '3', who: 'Dr. Arun Kumar', action: 'Viewed Prescriptions', when: 'Yesterday', type: 'view' },
  { id: '4', who: 'St. Joseph Hospital', action: 'Emergency Access - Vitals', when: '2 days ago', type: 'emergency' },
  { id: '5', who: 'You', action: 'Shared QR Code', when: '3 days ago', type: 'share' },
  { id: '6', who: 'Dr. Priya Sharma', action: 'Downloaded Report', when: '5 days ago', type: 'download' },
  { id: '7', who: 'SRL Diagnostics', action: 'Uploaded Lab Results', when: '1 week ago', type: 'upload' },
];

const typeIcons = { view: 'eye', upload: 'cloud-upload', emergency: 'warning', share: 'share-social', download: 'download' };
const typeColors = { view: Colors.accent, upload: Colors.success, emergency: Colors.error, share: Colors.amberMid, download: Colors.info };

export default function AuditLogScreen({ navigation }) {
  const { t } = useLanguage();
  const renderItem = ({ item }) => (
    <View style={[styles.logItem, Shadows.soft]}>
      <View style={[styles.iconCircle, { backgroundColor: typeColors[item.type] + '20' }]}>
        <Ionicons name={typeIcons[item.type]} size={18} color={typeColors[item.type]} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.who}>{item.who}</Text>
        <Text style={styles.action}>{item.action}</Text>
      </View>
      <Text style={styles.when}>{item.when}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title={t('health.auditLog')} onBack={() => navigation.goBack()} />
      <FlatList data={mockLogs} keyExtractor={i => i.id} renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={[styles.infoBar, Shadows.soft]}>
            <Ionicons name="information-circle" size={18} color={Colors.accent} />
            <Text style={styles.infoText}>All access to your health records is logged here for your review.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  list: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, paddingBottom: 40 },
  infoBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.lg, gap: Spacing.sm,
  },
  infoText: { fontSize: FontSizes.sm, color: Colors.textMuted, flex: 1 },
  logItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.sm,
  },
  iconCircle: {
    width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center',
    marginRight: Spacing.md,
  },
  who: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  action: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
  when: { fontSize: FontSizes.xs, color: Colors.textMuted },
});
