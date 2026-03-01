import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Card, Button } from '../../components/common';

const dataItems = [
  { key: 'location', label: 'Location Access', desc: 'Required for nearest hospital/pharmacy', icon: 'location' },
  { key: 'camera', label: 'Camera Access', desc: 'For prescriptions and video consultations', icon: 'camera' },
  { key: 'analytics', label: 'Usage Analytics', desc: 'Help improve the app experience', icon: 'analytics' },
  { key: 'sharing', label: 'Data Sharing with Doctors', desc: 'Share health records during consultations', icon: 'people' },
  { key: 'crashReport', label: 'Crash Reports', desc: 'Automatically send crash reports', icon: 'bug' },
];

export default function PrivacySettingsScreen({ navigation }) {
  const [settings, setSettings] = useState({
    location: true, camera: true, analytics: true, sharing: true, crashReport: false,
  });

  const toggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <View style={styles.container}>
      <Header title="Privacy Settings" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.infoBox}>
          <Ionicons name="shield-checkmark" size={24} color={Colors.success} />
          <Text style={styles.infoText}>
            Your data is encrypted end-to-end and stored securely. You control what data is shared.
          </Text>
        </View>

        <Card title="Permissions & Data">
          {dataItems.map((item, i) => (
            <View key={item.key} style={[styles.row, i < dataItems.length - 1 && styles.rowBorder]}>
              <View style={[styles.icon, { backgroundColor: Colors.accent + '10' }]}>
                <Ionicons name={item.icon} size={20} color={Colors.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.desc}>{item.desc}</Text>
              </View>
              <Switch value={settings[item.key]} onValueChange={() => toggle(item.key)}
                trackColor={{ false: Colors.border, true: Colors.accent + '50' }}
                thumbColor={settings[item.key] ? Colors.accent : Colors.textMuted} />
            </View>
          ))}
        </Card>

        <Card title="Data Management" style={{ marginTop: Spacing.md }}>
          <Button label="Download My Data" variant="outline" onPress={() => {}} style={{ marginBottom: Spacing.sm }} />
          <Button label="Delete My Account" variant="danger" onPress={() => {}} />
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  content: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.lg, paddingBottom: 60 },
  infoBox: {
    flexDirection: 'row', gap: Spacing.sm, backgroundColor: Colors.success + '10',
    borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.lg,
  },
  infoText: { flex: 1, fontSize: FontSizes.sm, color: Colors.textSecondary, lineHeight: 20 },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.md },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  icon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  label: { fontSize: FontSizes.md, fontWeight: FontWeights.medium, color: Colors.textPrimary },
  desc: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
});
