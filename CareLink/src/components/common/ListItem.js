import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, FontSizes, FontWeights, Spacing } from '../../theme';

export default function ListItem({
  title,
  subtitle,
  leftIcon,
  leftIconColor,
  rightText,
  rightElement,
  onPress,
  showChevron = true,
  bordered = true,
  style,
}) {
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.item, bordered && styles.bordered, style]}
    >
      {leftIcon && (
        <View style={[styles.iconWrap, { backgroundColor: (leftIconColor || Colors.accent) + '15' }]}>
          <Ionicons name={leftIcon} size={20} color={leftIconColor || Colors.accent} />
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {subtitle && <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>}
      </View>
      {rightText && <Text style={styles.rightText}>{rightText}</Text>}
      {rightElement && rightElement}
      {onPress && showChevron && (
        <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} style={{ marginLeft: Spacing.xs }} />
      )}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
  },
  bordered: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.medium,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  rightText: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginLeft: Spacing.sm,
  },
});
