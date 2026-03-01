import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, FontSizes, Spacing } from '../../theme';

export default function SearchBar({ value, onChangeText, placeholder = 'Search...', onFilter, style }) {
  return (
    <View style={[styles.container, style]}>
      <Ionicons name="search-outline" size={20} color={Colors.textMuted} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        value={value}
        onChangeText={onChangeText}
      />
      {value ? (
        <TouchableOpacity onPress={() => onChangeText('')}>
          <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
        </TouchableOpacity>
      ) : null}
      {onFilter && (
        <TouchableOpacity onPress={onFilter} style={styles.filterBtn}>
          <Ionicons name="options-outline" size={20} color={Colors.accent} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.base,
    height: 44,
  },
  input: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    marginLeft: Spacing.sm,
  },
  filterBtn: {
    marginLeft: Spacing.sm,
    padding: Spacing.xs,
  },
});
