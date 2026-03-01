import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, Radius, FontSizes, FontWeights, Spacing, Shadows } from '../../theme';

export default function Button({
  title,
  onPress,
  variant = 'primary', // primary | secondary | outline | danger | amber
  size = 'md', // sm | md | lg
  icon,
  loading = false,
  disabled = false,
  style,
  textStyle,
}) {
  const bgMap = {
    primary: Colors.btnPrimaryBg,
    secondary: Colors.accentLight,
    outline: Colors.transparent,
    danger: Colors.error,
    amber: Colors.amberMid,
  };
  const textMap = {
    primary: Colors.btnPrimaryText,
    secondary: Colors.accent,
    outline: Colors.btnSecondaryText,
    danger: Colors.white,
    amber: Colors.white,
  };
  const borderMap = {
    primary: Colors.transparent,
    secondary: Colors.transparent,
    outline: Colors.btnSecondaryBorder,
    danger: Colors.transparent,
    amber: Colors.transparent,
  };
  const sizeH = { sm: 36, md: 48, lg: 56 };
  const sizeFont = { sm: FontSizes.sm, md: FontSizes.base, lg: FontSizes.lg };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.base,
        {
          backgroundColor: disabled ? Colors.border : bgMap[variant],
          borderColor: disabled ? Colors.border : borderMap[variant],
          height: sizeH[size],
          paddingHorizontal: size === 'sm' ? Spacing.md : Spacing.xl,
        },
        variant === 'primary' && Shadows.soft,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textMap[variant]} size="small" />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text
            style={[
              styles.text,
              {
                color: disabled ? Colors.textMuted : textMap[variant],
                fontSize: sizeFont[size],
                marginLeft: icon ? Spacing.sm : 0,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.pill,
    borderWidth: 1.5,
  },
  text: {
    fontWeight: FontWeights.semiBold,
  },
});
