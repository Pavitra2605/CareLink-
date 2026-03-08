import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, FontSizes, FontWeights, Spacing, Shadows } from '../../theme';

export default function QuickAction({ icon, iconColor, label, onPress, badge, style }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.container, Shadows.soft, style]}>
      <View style={[styles.iconCircle, { backgroundColor: iconColor ? `${iconColor}20` : Colors.accentLight }]}>
        <Ionicons name={icon} size={26} color={iconColor || Colors.accent} />
        {badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.label} numberOfLines={2}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    width: 100,
    minHeight: 110,
    justifyContent: 'center',
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
    flexShrink: 1,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: FontWeights.bold,
    color: Colors.white,
  },
});
