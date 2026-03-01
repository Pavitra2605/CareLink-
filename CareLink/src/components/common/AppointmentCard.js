import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, FontSizes, FontWeights, Spacing, Shadows } from '../../theme';

export default function AppointmentCard({ doctor, specialty, date, time, mode, status, onPress }) {
  const modeIcon = mode === 'video' ? 'videocam' : mode === 'audio' ? 'call' : 'chatbubbles';
  const statusColors = {
    upcoming: Colors.accent,
    completed: Colors.success,
    cancelled: Colors.error,
    'in-progress': Colors.amberMid,
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={[styles.card, Shadows.soft]}>
      <View style={styles.row}>
        <View style={[styles.modeIcon, { backgroundColor: (statusColors[status] || Colors.accent) + '15' }]}>
          <Ionicons name={modeIcon} size={22} color={statusColors[status] || Colors.accent} />
        </View>
        <View style={styles.info}>
          <Text style={styles.doctor}>{doctor}</Text>
          <Text style={styles.specialty}>{specialty}</Text>
        </View>
        <View style={[styles.statusDot, { backgroundColor: statusColors[status] || Colors.accent }]} />
      </View>
      <View style={styles.meta}>
        <View style={styles.metaItem}>
          <Ionicons name="calendar-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.metaText}>{date}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.metaText}>{time}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name={modeIcon + '-outline'} size={14} color={Colors.textMuted} />
          <Text style={styles.metaText}>{mode}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  info: {
    flex: 1,
  },
  doctor: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semiBold,
    color: Colors.textPrimary,
  },
  specialty: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  meta: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.base,
  },
  metaText: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginLeft: 4,
    textTransform: 'capitalize',
  },
});
