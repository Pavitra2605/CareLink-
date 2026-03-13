import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Card, Badge, Button } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n';

const vitalCards = [
  { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: 'heart', color: Colors.error, status: 'Normal' },
  { label: 'Blood Sugar', value: '95', unit: 'mg/dL', icon: 'water', color: Colors.amberMid, status: 'Normal' },
  { label: 'Temperature', value: '98.4', unit: '°F', icon: 'thermometer', color: Colors.success, status: 'Normal' },
  { label: 'SpO2', value: '98', unit: '%', icon: 'pulse', color: Colors.accent, status: 'Normal' },
];

const quickLinks = [
  { label: 'Prescription Vault', icon: 'document-lock', screen: 'PrescriptionVault' },
  { label: 'Medical History', icon: 'folder-open', screen: 'MedicalHistory' },
  { label: 'Immunization', icon: 'shield-checkmark', screen: 'Immunization' },
  { label: 'Test Reports', icon: 'document-text', screen: 'TestReports' },
  { label: 'Medications', icon: 'medkit', screen: 'Medications' },
  { label: 'Adherence Log', icon: 'checkbox', screen: 'AdherenceLog' },
  { label: 'Trend Analysis', icon: 'trending-up', screen: 'TrendAnalysis' },
];

export default function HealthProfileScreen({ navigation }) {
  const { t } = useLanguage();
  const { profile } = useAuth();

  const displayName   = profile?.full_name   || 'My Profile';
  const displayGender = profile?.gender      || '';
  const displayAge    = profile?.age         != null ? `${profile.age} yrs` : '';
  const displayBlood  = profile?.blood_group || '';
  const subInfo       = [displayGender, displayAge, displayBlood].filter(Boolean).join(' · ');

  return (
    <View style={styles.container}>
      <Header title={t('health.title')} rightAction={
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
          <Ionicons name="create-outline" size={22} color={Colors.accent} />
        </TouchableOpacity>
      } />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Patient Info */}
        <View style={[styles.profileCard, Shadows.soft]}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={36} color={Colors.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{displayName}</Text>
            {subInfo ? <Text style={styles.info}>{subInfo}</Text> : null}
            <View style={styles.tagRow}>
              <Badge label="Diabetic" variant="warning" size="sm" />
              <Badge label="Hypertension" variant="error" size="sm" />
            </View>
          </View>
          <TouchableOpacity style={styles.qrBtn} onPress={() => navigation.navigate('QRShare')}>
            <Ionicons name="qr-code" size={24} color={Colors.accent} />
          </TouchableOpacity>
        </View>

        {/* Sync Status */}
        <TouchableOpacity style={[styles.syncRow, Shadows.soft]} onPress={() => navigation.navigate('SyncStatus')}>
          <Ionicons name="cloud-done" size={18} color={Colors.success} />
          <Text style={styles.syncText}>Last synced 5 min ago</Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
        </TouchableOpacity>

        {/* Vitals Grid */}
        <Text style={styles.sectionTitle}>Current Vitals</Text>
        <View style={styles.vitalGrid}>
          {vitalCards.map((v, i) => (
            <View key={i} style={[styles.vitalItem, Shadows.soft]}>
              <View style={[styles.vitalIcon, { backgroundColor: v.color + '20' }]}>
                <Ionicons name={v.icon} size={20} color={v.color} />
              </View>
              <Text style={styles.vitalLabel}>{v.label}</Text>
              <Text style={styles.vitalValue}>{v.value} <Text style={styles.vitalUnit}>{v.unit}</Text></Text>
              <Badge label={v.status} variant="success" size="sm" />
            </View>
          ))}
        </View>

        {/* Quick Links */}
        <Text style={styles.sectionTitle}>Health Records</Text>
        <View style={styles.linkGrid}>
          {quickLinks.map((q, i) => (
            <TouchableOpacity key={i} style={[styles.linkItem, Shadows.soft]}
              onPress={() => navigation.navigate(q.screen)}>
              <View style={styles.linkIcon}>
                <Ionicons name={q.icon} size={22} color={Colors.accent} />
              </View>
              <Text style={styles.linkLabel}>{q.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <Button title="Upload Report" variant="primary" size="md"
            icon={<Ionicons name="cloud-upload" size={18} color={Colors.white} />}
            onPress={() => navigation.navigate('UploadReport')} style={{ flex: 1 }} />
          <Button title="Export Data" variant="outline" size="md"
            icon={<Ionicons name="download-outline" size={18} color={Colors.accent} />}
            onPress={() => navigation.navigate('ExportData')} style={{ flex: 1, marginLeft: Spacing.md }} />
        </View>

        {/* Data Access */}
        <TouchableOpacity style={[styles.accessRow, Shadows.soft]}
          onPress={() => navigation.navigate('DataAccess')}>
          <Ionicons name="lock-closed" size={20} color={Colors.accent} />
          <View style={{ flex: 1, marginLeft: Spacing.md }}>
            <Text style={styles.accessTitle}>Data Access & Privacy</Text>
            <Text style={styles.accessSub}>Manage who can see your records</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.accessRow, Shadows.soft]}
          onPress={() => navigation.navigate('AuditLog')}>
          <Ionicons name="list" size={20} color={Colors.amberMid} />
          <View style={{ flex: 1, marginLeft: Spacing.md }}>
            <Text style={styles.accessTitle}>Access Audit Log</Text>
            <Text style={styles.accessSub}>View who accessed your records</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
        </TouchableOpacity>

        <View style={{ height: 90 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md },
  profileCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.xl, padding: Spacing.lg, marginBottom: Spacing.md,
  },
  avatarCircle: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.accent,
    justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md,
  },
  name: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.textPrimary },
  info: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
  tagRow: { flexDirection: 'row', gap: Spacing.xs, marginTop: Spacing.xs },
  qrBtn: { padding: Spacing.sm },
  syncRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.lg, gap: Spacing.sm,
  },
  syncText: { flex: 1, fontSize: FontSizes.sm, color: Colors.textMuted },
  sectionTitle: {
    fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  vitalGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, marginBottom: Spacing.lg },
  vitalItem: {
    width: '47%', backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.md, alignItems: 'center',
  },
  vitalIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.xs },
  vitalLabel: { fontSize: FontSizes.xs, color: Colors.textMuted, marginBottom: 4 },
  vitalValue: { fontSize: FontSizes.xl, fontWeight: FontWeights.bold, color: Colors.textPrimary },
  vitalUnit: { fontSize: FontSizes.sm, fontWeight: FontWeights.normal, color: Colors.textMuted },
  linkGrid: { gap: Spacing.sm, marginBottom: Spacing.lg },
  linkItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.lg, padding: Spacing.lg,
  },
  linkIcon: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.bgSecondary,
    justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md,
  },
  linkLabel: { flex: 1, fontSize: FontSizes.md, fontWeight: FontWeights.medium, color: Colors.textPrimary },
  actionsRow: { flexDirection: 'row', marginBottom: Spacing.md },
  accessRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.md,
  },
  accessTitle: { fontSize: FontSizes.md, fontWeight: FontWeights.medium, color: Colors.textPrimary },
  accessSub: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
});
