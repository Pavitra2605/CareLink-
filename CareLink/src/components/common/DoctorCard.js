import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, FontSizes, FontWeights, Spacing, Shadows } from '../../theme';
import Badge from './Badge';

export default function DoctorCard({ name, specialty, rating, available, avatar, languages, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={[styles.card, Shadows.soft]}>
      <View style={styles.avatarWrap}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Ionicons name="person" size={28} color={Colors.accent} />
          </View>
        )}
        <View style={[styles.dot, { backgroundColor: available ? Colors.success : Colors.textMuted }]} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Text style={styles.specialty}>{specialty}</Text>
        <View style={styles.metaRow}>
          <Ionicons name="star" size={14} color={Colors.amberMid} />
          <Text style={styles.rating}>{rating || '4.5'}</Text>
          {languages && <Text style={styles.lang}> · {languages}</Text>}
        </View>
      </View>
      <Badge label={available ? 'Online' : 'Offline'} variant={available ? 'success' : 'neutral'} size="sm" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  avatarWrap: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  avatarPlaceholder: {
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semiBold,
    color: Colors.textPrimary,
  },
  specialty: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginLeft: 3,
  },
  lang: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
  },
});
