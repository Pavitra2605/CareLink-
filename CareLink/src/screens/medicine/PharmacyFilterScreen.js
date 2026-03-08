import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius } from '../../theme';
import { Header, Button } from '../../components/common';
import { useLanguage } from '../../i18n';

const filterSections = [
  {
    title: 'Pharmacy Type', key: 'type', multi: false,
    options: ['All', 'Government', 'Private', 'Jan Aushadhi'],
  },
  {
    title: 'Distance', key: 'distance', multi: false,
    options: ['Any', 'Within 2 km', 'Within 5 km', 'Within 10 km'],
  },
  {
    title: 'Availability', key: 'avail', multi: false,
    options: ['All', 'In Stock Only'],
  },
  {
    title: 'Sort By', key: 'sort', multi: false,
    options: ['Distance', 'Price: Low to High', 'Rating', 'Availability'],
  },
];

export default function PharmacyFilterScreen({ navigation }) {
  const [filters, setFilters] = useState({ type: 'All', distance: 'Any', avail: 'All', sort: 'Distance' });
  const { t } = useLanguage();

  const setFilter = (key, val) => setFilters(prev => ({ ...prev, [key]: val }));

  return (
    <View style={styles.container}>
      <Header title={t('medicine.pharmacyFilter')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        {filterSections.map(section => (
          <View key={section.key} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.optionRow}>
              {section.options.map(opt => (
                <TouchableOpacity key={opt}
                  style={[styles.optionChip, filters[section.key] === opt && styles.optionActive]}
                  onPress={() => setFilter(section.key, opt)}>
                  <Text style={[styles.optionText, filters[section.key] === opt && styles.optionTextActive]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.btnRow}>
          <Button label="Reset" variant="outline" onPress={() => setFilters({ type: 'All', distance: 'Any', avail: 'All', sort: 'Distance' })}
            style={{ flex: 1 }} />
          <Button label="Apply Filters" onPress={() => navigation.goBack()} style={{ flex: 1 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  content: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.lg, paddingBottom: 60 },
  section: { marginBottom: Spacing.xl },
  sectionTitle: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold, color: Colors.textPrimary, marginBottom: Spacing.sm },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  optionChip: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.md,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
  },
  optionActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  optionText: { fontSize: FontSizes.sm, color: Colors.textSecondary },
  optionTextActive: { color: Colors.white, fontWeight: FontWeights.semiBold },
  btnRow: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.lg },
});
