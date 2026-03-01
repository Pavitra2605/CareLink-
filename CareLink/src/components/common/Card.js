import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Radius, Spacing, Shadows, FontSizes, FontWeights } from '../../theme';

export default function Card({
  children,
  title,
  subtitle,
  onPress,
  rightAction,
  style,
  contentStyle,
  variant = 'default', // default | accent | amber | outlined
}) {
  const bgMap = {
    default: Colors.surface,
    accent: Colors.accentLight,
    amber: Colors.amberGlow,
    outlined: Colors.surface,
  };
  const borderMap = {
    default: Colors.transparent,
    accent: Colors.accent,
    amber: Colors.amberMid,
    outlined: Colors.border,
  };

  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.card,
        Shadows.soft,
        {
          backgroundColor: bgMap[variant],
          borderColor: borderMap[variant],
          borderWidth: variant === 'outlined' || variant === 'accent' ? 1 : 0,
        },
        style,
      ]}
    >
      {(title || rightAction) && (
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            {title && <Text style={styles.title}>{title}</Text>}
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          {rightAction && rightAction}
        </View>
      )}
      <View style={contentStyle}>{children}</View>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
