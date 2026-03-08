import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button, Card } from '../../components/common';
import { useLanguage } from '../../i18n';

const typeConfig = {
  appointment: { icon: 'calendar', color: Colors.accent, label: 'Appointment' },
  medication: { icon: 'medical', color: Colors.amberMid, label: 'Medication' },
  report: { icon: 'document-text', color: Colors.success, label: 'Report' },
  emergency: { icon: 'alert-circle', color: Colors.error, label: 'Alert' },
  pharmacy: { icon: 'medkit', color: '#9B59B6', label: 'Pharmacy' },
  system: { icon: 'settings', color: Colors.textMuted, label: 'System' },
};

export default function NotificationDetailScreen({ navigation, route }) {
  const { t } = useLanguage();
  const notification = route?.params?.notification || {
    type: 'appointment', title: 'Upcoming Appointment',
    body: 'Video consultation with Dr. Priya Sharma tomorrow at 10:00 AM',
    time: '2 hours ago',
  };
  const cfg = typeConfig[notification.type] || typeConfig.system;

  return (
    <View style={styles.container}>
      <Header title={t('notifications.detail')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.heroCard, Shadows.soft]}>
          <View style={[styles.iconCircle, { backgroundColor: cfg.color + '15' }]}>
            <Ionicons name={cfg.icon} size={32} color={cfg.color} />
          </View>
          <View style={styles.typeBadge}>
            <Text style={[styles.typeText, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
          <Text style={styles.title}>{notification.title}</Text>
          <Text style={styles.time}>{notification.time}</Text>
        </View>

        <Card title="Details" style={{ marginTop: Spacing.lg }}>
          <Text style={styles.body}>{notification.body}</Text>
        </Card>

        {notification.type === 'appointment' && (
          <View style={styles.actionRow}>
            <Button label="View Appointment" onPress={() => {}} style={{ flex: 1 }} />
            <Button label="Reschedule" variant="outline" onPress={() => {}} style={{ flex: 1 }} />
          </View>
        )}
        {notification.type === 'medication' && (
          <Button label="Mark as Taken" onPress={() => navigation.goBack()} style={{ marginTop: Spacing.lg }} />
        )}
        {notification.type === 'report' && (
          <Button label="View Report" onPress={() => {}} style={{ marginTop: Spacing.lg }} />
        )}
        {notification.type === 'pharmacy' && (
          <Button label="View Pharmacy" onPress={() => {}} style={{ marginTop: Spacing.lg }} />
        )}

        <TouchableOpacity style={styles.deleteBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="trash" size={18} color={Colors.error} />
          <Text style={styles.deleteText}>Delete Notification</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  content: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.lg, paddingBottom: 60 },
  heroCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.xl,
    alignItems: 'center',
  },
  iconCircle: {
    width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center',
    marginBottom: Spacing.md,
  },
  typeBadge: {
    backgroundColor: Colors.bgSecondary, borderRadius: Radius.full,
    paddingHorizontal: Spacing.md, paddingVertical: 3, marginBottom: Spacing.sm,
  },
  typeText: { fontSize: FontSizes.sm, fontWeight: FontWeights.semiBold },
  title: { fontSize: FontSizes.xl, fontWeight: FontWeights.bold, color: Colors.textPrimary, textAlign: 'center' },
  time: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: Spacing.xs },
  body: { fontSize: FontSizes.md, color: Colors.textSecondary, lineHeight: 24 },
  actionRow: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.lg },
  deleteBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.xs, marginTop: Spacing.xl,
  },
  deleteText: { fontSize: FontSizes.md, color: Colors.error },
});
