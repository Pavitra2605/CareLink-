import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radius, FontSizes, FontWeights, Spacing } from '../../theme';

export default function Badge({ label, variant = 'info', size = 'md', style }) {
  const bgMap = {
    success: Colors.success + '20',
    warning: Colors.warning + '20',
    error: Colors.error + '20',
    info: Colors.accentLight,
    neutral: Colors.bgSecondary,
  };
  const textMap = {
    success: Colors.success,
    warning: Colors.warning,
    error: Colors.error,
    info: Colors.accent,
    neutral: Colors.textSecondary,
  };
  const fontSize = size === 'sm' ? FontSizes.xs : FontSizes.sm;
  const padV = size === 'sm' ? 2 : 4;
  const padH = size === 'sm' ? 6 : 10;

  return (
    <View style={[styles.badge, { backgroundColor: bgMap[variant], paddingVertical: padV, paddingHorizontal: padH }, style]}>
      <Text style={[styles.text, { color: textMap[variant], fontSize }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: Radius.pill,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: FontWeights.semiBold,
  },
});
