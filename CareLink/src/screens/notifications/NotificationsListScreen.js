import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Badge } from '../../components/common';

const notifications = [
  { id: '1', type: 'appointment', title: 'Upcoming Appointment', body: 'Video consultation with Dr. Priya Sharma tomorrow at 10:00 AM', time: '2 hours ago', read: false },
  { id: '2', type: 'medication', title: 'Medication Reminder', body: 'Time to take Paracetamol 500mg (Evening dose)', time: '3 hours ago', read: false },
  { id: '3', type: 'report', title: 'Test Report Ready', body: 'Your blood test report from District Hospital is now available', time: '5 hours ago', read: true },
  { id: '4', type: 'emergency', title: 'Health Alert', body: 'Dengue advisory issued for your area. Take preventive measures.', time: 'Yesterday', read: true },
  { id: '5', type: 'pharmacy', title: 'Medicine Available', body: 'Amoxicillin 250mg is now available at Jan Aushadhi Kendra', time: 'Yesterday', read: true },
  { id: '6', type: 'system', title: 'Profile Updated', body: 'Your health profile has been synced successfully', time: '2 days ago', read: true },
];

const typeConfig = {
  appointment: { icon: 'calendar', color: Colors.accent },
  medication: { icon: 'medical', color: Colors.amberMid },
  report: { icon: 'document-text', color: Colors.success },
  emergency: { icon: 'alert-circle', color: Colors.error },
  pharmacy: { icon: 'medkit', color: '#9B59B6' },
  system: { icon: 'settings', color: Colors.textMuted },
};

const filters = ['All', 'Unread', 'Appointments', 'Medications', 'Reports'];

export default function NotificationsListScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = notifications.filter(n => {
    if (activeFilter === 'Unread') return !n.read;
    if (activeFilter === 'Appointments') return n.type === 'appointment';
    if (activeFilter === 'Medications') return n.type === 'medication';
    if (activeFilter === 'Reports') return n.type === 'report';
    return true;
  });

  const renderItem = ({ item }) => {
    const cfg = typeConfig[item.type];
    return (
      <TouchableOpacity style={[styles.card, !item.read && styles.cardUnread, Shadows.soft]}
        onPress={() => navigation.navigate('NotificationDetail', { notification: item })} activeOpacity={0.7}>
        <View style={[styles.iconCircle, { backgroundColor: cfg.color + '15' }]}>
          <Ionicons name={cfg.icon} size={22} color={cfg.color} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, !item.read && styles.titleUnread]}>{item.title}</Text>
            {!item.read && <View style={styles.dot} />}
          </View>
          <Text style={styles.body} numberOfLines={2}>{item.body}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Notifications" onBack={() => navigation.goBack()}
        rightAction={{ icon: 'settings-outline', onPress: () => navigation.navigate('NotificationSettings') }} />
      <View style={styles.filterRow}>
        {filters.map(f => (
          <TouchableOpacity key={f}
            style={[styles.filterChip, activeFilter === f && styles.filterActive]}
            onPress={() => setActiveFilter(f)}>
            <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList data={filtered} keyExtractor={i => i.id} renderItem={renderItem}
        contentContainerStyle={styles.list} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  filterRow: {
    flexDirection: 'row', paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm, gap: Spacing.xs,
  },
  filterChip: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.full,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
  },
  filterActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  filterText: { fontSize: FontSizes.xs, color: Colors.textSecondary },
  filterTextActive: { color: Colors.white, fontWeight: FontWeights.semiBold },
  list: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm, paddingBottom: 40 },
  card: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.sm,
  },
  cardUnread: { borderLeftWidth: 3, borderLeftColor: Colors.accent },
  iconCircle: {
    width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center',
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  title: { fontSize: FontSizes.base, fontWeight: FontWeights.medium, color: Colors.textPrimary },
  titleUnread: { fontWeight: FontWeights.semiBold },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.accent },
  body: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2, lineHeight: 20 },
  time: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: Spacing.xs },
});
