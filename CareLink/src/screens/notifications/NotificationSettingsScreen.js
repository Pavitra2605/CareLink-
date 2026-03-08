import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Card } from '../../components/common';
import { useLanguage } from '../../i18n';

const categories = [
  { key: 'appointments', label: 'Appointments', desc: 'Reminders and updates for consultations', icon: 'calendar' },
  { key: 'medications', label: 'Medications', desc: 'Dose reminders and refill alerts', icon: 'medical' },
  { key: 'reports', label: 'Test Reports', desc: 'When new reports are available', icon: 'document-text' },
  { key: 'emergency', label: 'Health Alerts', desc: 'Disease outbreaks and emergency advisories', icon: 'alert-circle' },
  { key: 'pharmacy', label: 'Pharmacy Updates', desc: 'Medicine availability notifications', icon: 'medkit' },
  { key: 'system', label: 'System', desc: 'App updates and account notifications', icon: 'settings' },
];

export default function NotificationSettingsScreen({ navigation }) {
  const { t } = useLanguage();
  const [masterToggle, setMasterToggle] = useState(true);
  const [settings, setSettings] = useState({
    appointments: true, medications: true, reports: true, emergency: true, pharmacy: false, system: true,
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <View style={styles.container}>
      <Header title={t('notifications.settings')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Master toggle */}
        <View style={[styles.masterCard, Shadows.soft]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.masterTitle}>Push Notifications</Text>
            <Text style={styles.masterDesc}>Enable or disable all notifications</Text>
          </View>
          <Switch value={masterToggle} onValueChange={setMasterToggle}
            trackColor={{ false: Colors.border, true: Colors.accent + '50' }}
            thumbColor={masterToggle ? Colors.accent : Colors.textMuted} />
        </View>

        {masterToggle && (
          <Card title="Notification Categories" style={{ marginTop: Spacing.lg }}>
            {categories.map((cat, i) => (
              <View key={cat.key} style={[styles.catRow, i < categories.length - 1 && styles.catBorder]}>
                <View style={[styles.catIcon, { backgroundColor: Colors.accent + '10' }]}>
                  <Ionicons name={cat.icon} size={20} color={Colors.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.catLabel}>{cat.label}</Text>
                  <Text style={styles.catDesc}>{cat.desc}</Text>
                </View>
                <Switch value={settings[cat.key]} onValueChange={() => toggleSetting(cat.key)}
                  trackColor={{ false: Colors.border, true: Colors.accent + '50' }}
                  thumbColor={settings[cat.key] ? Colors.accent : Colors.textMuted} />
              </View>
            ))}
          </Card>
        )}

        <Card title="Quiet Hours" style={{ marginTop: Spacing.md }}>
          <View style={styles.quietRow}>
            <Ionicons name="moon" size={20} color={Colors.accent} />
            <View style={{ flex: 1 }}>
              <Text style={styles.catLabel}>Do Not Disturb</Text>
              <Text style={styles.catDesc}>10:00 PM - 7:00 AM (except emergencies)</Text>
            </View>
            <Switch value={true} trackColor={{ false: Colors.border, true: Colors.accent + '50' }}
              thumbColor={Colors.accent} />
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  content: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.lg, paddingBottom: 60 },
  masterCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.lg, padding: Spacing.lg,
  },
  masterTitle: { fontSize: FontSizes.lg, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  masterDesc: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
  catRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.md,
  },
  catBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  catIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  catLabel: { fontSize: FontSizes.md, fontWeight: FontWeights.medium, color: Colors.textPrimary },
  catDesc: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
  quietRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.sm },
});
