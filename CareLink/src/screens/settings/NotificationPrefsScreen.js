import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Card } from '../../components/common';

const prefs = [
  { key: 'push', label: 'Push Notifications', desc: 'Receive alerts on your device', icon: 'notifications' },
  { key: 'sms', label: 'SMS Alerts', desc: 'Important alerts via text message', icon: 'chatbubble' },
  { key: 'email', label: 'Email Notifications', desc: 'Summary and reports via email', icon: 'mail' },
  { key: 'sound', label: 'Sound', desc: 'Play sound for notifications', icon: 'volume-high' },
  { key: 'vibrate', label: 'Vibration', desc: 'Vibrate on notification', icon: 'phone-portrait' },
];

export default function NotificationPrefsScreen({ navigation }) {
  const [settings, setSettings] = useState({
    push: true, sms: true, email: false, sound: true, vibrate: true,
  });

  const toggleSetting = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <View style={styles.container}>
      <Header title="Notification Preferences" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Card title="Channels">
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
