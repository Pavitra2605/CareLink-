import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Badge } from '../../components/common';
import { useLanguage } from '../../i18n';

const accessList = [
  { name: 'Dr. Priya Sharma', role: 'General Physician', access: 'full', since: 'Jan 2024' },
  { name: 'Dr. Arun Kumar', role: 'Pediatrics', access: 'limited', since: 'Mar 2024' },
  { name: 'St. Joseph Hospital', role: 'Hospital', access: 'emergency', since: 'Dec 2023' },
  { name: 'Apollo Diagnostics', role: 'Lab', access: 'reports', since: 'Sep 2024' },
];

const accessVariant = { full: 'success', limited: 'info', emergency: 'error', reports: 'warning' };

export default function DataAccessScreen({ navigation }) {
  const { t } = useLanguage();
  const [sharing, setSharing] = useState(true);
  const [anonymous, setAnonymous] = useState(false);

  return (
    <View style={styles.container}>
      <Header title={t('health.dataAccess')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Master Toggle */}
        <View style={[styles.toggleCard, Shadows.soft]}>
          <Ionicons name="shield-checkmark" size={24} color={Colors.success} />
          <View style={{ flex: 1, marginLeft: Spacing.md }}>
            <Text style={styles.toggleTitle}>Data Sharing</Text>
            <Text style={styles.toggleSub}>Allow healthcare providers to access your records</Text>
          </View>
          <Switch value={sharing} onValueChange={setSharing}
            trackColor={{ false: Colors.border, true: Colors.accent }}
            thumbColor={Colors.white} />
        </View>

        <View style={[styles.toggleCard, Shadows.soft]}>
          <Ionicons name="eye-off" size={24} color={Colors.amberMid} />
          <View style={{ flex: 1, marginLeft: Spacing.md }}>
            <Text style={styles.toggleTitle}>Anonymous Research Data</Text>
            <Text style={styles.toggleSub}>Share anonymized data for medical research</Text>
          </View>
          <Switch value={anonymous} onValueChange={setAnonymous}
            trackColor={{ false: Colors.border, true: Colors.accent }}
            thumbColor={Colors.white} />
        </View>

        {/* Who Has Access */}
        <Text style={styles.sectionTitle}>Who Has Access</Text>
        {accessList.map((item, i) => (
          <TouchableOpacity key={i} style={[styles.accessCard, Shadows.soft]}>
            <View style={styles.accessAvatar}>
              <Ionicons name={item.role === 'Hospital' || item.role === 'Lab' ? 'business' : 'person'} size={20} color={Colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.accessName}>{item.name}</Text>
              <Text style={styles.accessRole}>{item.role} · Since {item.since}</Text>
            </View>
            <Badge label={item.access.charAt(0).toUpperCase() + item.access.slice(1)}
              variant={accessVariant[item.access]} size="sm" />
          </TouchableOpacity>
        ))}

        {/* Data Categories */}
        <Text style={styles.sectionTitle}>Data Categories</Text>
        {['Personal Information', 'Medical History', 'Test Reports', 'Prescriptions', 'Vitals & Trends', 'Consultation Records'].map((cat, i) => (
          <View key={i} style={[styles.catRow, Shadows.soft]}>
            <Ionicons name="folder" size={20} color={Colors.accent} />
            <Text style={styles.catText}>{cat}</Text>
            <Switch value={true} trackColor={{ false: Colors.border, true: Colors.accent }} thumbColor={Colors.white} />
          </View>
        ))}

        {/* Audit Log Link */}
        <TouchableOpacity style={[styles.auditLink, Shadows.soft]}
          onPress={() => navigation.navigate('AuditLog')}>
          <Ionicons name="list" size={20} color={Colors.amberMid} />
          <View style={{ flex: 1, marginLeft: Spacing.md }}>
            <Text style={styles.auditTitle}>View Access Audit Log</Text>
            <Text style={styles.auditSub}>See who viewed your data and when</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md },
  toggleCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.md,
  },
  toggleTitle: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  toggleSub: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
  sectionTitle: {
    fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.textPrimary,
    marginBottom: Spacing.md, marginTop: Spacing.md,
  },
  accessCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.sm,
  },
  accessAvatar: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.bgSecondary,
    justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md,
  },
  accessName: { fontSize: FontSizes.md, fontWeight: FontWeights.medium, color: Colors.textPrimary },
  accessRole: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
  catRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.sm, gap: Spacing.md,
  },
  catText: { flex: 1, fontSize: FontSizes.md, color: Colors.textPrimary },
  auditLink: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.lg, padding: Spacing.lg, marginTop: Spacing.md,
  },
  auditTitle: { fontSize: FontSizes.md, fontWeight: FontWeights.medium, color: Colors.textPrimary },
  auditSub: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
});
