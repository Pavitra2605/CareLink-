import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Card } from '../../components/common';
import { useLanguage } from '../../i18n';

export default function NotificationPrefsScreen({ navigation }) {
  const { t } = useLanguage();

  const prefs = [
    { key: 'push', label: t('notificationPrefs.pushNotifications'), desc: t('notificationPrefs.pushDesc'), icon: 'notifications' },
    { key: 'sms', label: t('notificationPrefs.smsAlerts'), desc: t('notificationPrefs.smsDesc'), icon: 'chatbubble' },
    { key: 'email', label: t('notificationPrefs.emailNotifications'), desc: t('notificationPrefs.emailDesc'), icon: 'mail' },
    { key: 'sound', label: t('notificationPrefs.sound'), desc: t('notificationPrefs.soundDesc'), icon: 'volume-high' },
    { key: 'vibrate', label: t('notificationPrefs.vibration'), desc: t('notificationPrefs.vibrateDesc'), icon: 'phone-portrait' },
  ];

  const [settings, setSettings] = useState({
    push: true, sms: true, email: false, sound: true, vibrate: true,
  });

  const toggleSetting = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <View style={styles.container}>
      <Header title={t('notificationPrefs.title')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Card title={t('notificationPrefs.channels')}>
          {prefs.map((p, i) => (
            <View key={p.key} style={[styles.row, i < prefs.length - 1 && styles.rowBorder]}>
              <View style={[styles.icon, { backgroundColor: Colors.accent + '10' }]}>
                <Ionicons name={p.icon} size={20} color={Colors.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>{p.label}</Text>
                <Text style={styles.desc}>{p.desc}</Text>
              </View>
              <Switch value={settings[p.key]} onValueChange={() => toggleSetting(p.key)}
                trackColor={{ false: Colors.border, true: Colors.accent + '50' }}
                thumbColor={settings[p.key] ? Colors.accent : Colors.textMuted} />
            </View>
          ))}
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  content: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.lg, paddingBottom: 60 },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.md },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  icon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  label: { fontSize: FontSizes.md, fontWeight: FontWeights.medium, color: Colors.textPrimary },
  desc: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
});
