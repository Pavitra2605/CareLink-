import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, SearchBar } from '../../components/common';
import { useLanguage } from '../../i18n';

const recentSearches = ['Paracetamol', 'Amoxicillin', 'Metformin', 'Omeprazole'];
const categories = [
  { icon: 'medkit', label: 'All Medicines', color: Colors.accent },
  { icon: 'fitness', label: 'Pain Relief', color: Colors.error },
  { icon: 'thermometer', label: 'Fever', color: Colors.amberMid },
  { icon: 'heart', label: 'Heart & BP', color: '#E74C3C' },
  { icon: 'water', label: 'Diabetes', color: '#3498DB' },
  { icon: 'leaf', label: 'Ayurveda', color: Colors.success },
  { icon: 'nutrition', label: 'Supplements', color: '#9B59B6' },
  { icon: 'bandage', label: 'First Aid', color: '#E67E22' },
];

const popularMeds = [
  { id: '1', name: 'Paracetamol 500mg', brand: 'Crocin', price: '₹30', available: true },
  { id: '2', name: 'Amoxicillin 250mg', brand: 'Mox', price: '₹85', available: true },
  { id: '3', name: 'Cetrizine 10mg', brand: 'Cetzine', price: '₹40', available: false },
  { id: '4', name: 'Omeprazole 20mg', brand: 'Omez', price: '₹65', available: true },
];

export default function MedicineSearchScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <Header title={t('medicine.searchMedicine')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search medicine name or salt..."
          showFilter onFilter={() => {}} />

        {/* Recent */}
        {!search && (
          <>
            <Text style={styles.sectionLabel}>Recent Searches</Text>
            <View style={styles.chipRow}>
              {recentSearches.map((r, i) => (
                <TouchableOpacity key={i} style={styles.chip} onPress={() => setSearch(r)}>
                  <Ionicons name="time" size={14} color={Colors.textMuted} />
                  <Text style={styles.chipText}>{r}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionLabel}>Categories</Text>
            <View style={styles.catGrid}>
              {categories.map((c, i) => (
                <TouchableOpacity key={i} style={[styles.catItem, Shadows.soft]} activeOpacity={0.7}>
                  <View style={[styles.catIcon, { backgroundColor: c.color + '15' }]}>
                    <Ionicons name={c.icon} size={24} color={c.color} />
                  </View>
                  <Text style={styles.catLabel}>{c.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionLabel}>Popular Medicines</Text>
            {popularMeds.map(m => (
              <TouchableOpacity key={m.id} style={[styles.medCard, Shadows.soft]}
                onPress={() => navigation.navigate('MedicineDetail', { medicine: m })} activeOpacity={0.7}>
                <View style={styles.medIcon}>
                  <Ionicons name="medical" size={22} color={Colors.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.medName}>{m.name}</Text>
                  <Text style={styles.medBrand}>{m.brand}</Text>
                </View>
                <View style={styles.medRight}>
                  <Text style={styles.medPrice}>{m.price}</Text>
                  <Text style={[styles.medAvail, { color: m.available ? Colors.success : Colors.error }]}>
                    {m.available ? 'Available' : 'Out of stock'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  content: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.lg, paddingBottom: 90 },
  sectionLabel: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold, color: Colors.textPrimary, marginTop: Spacing.lg, marginBottom: Spacing.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.surface,
    borderRadius: Radius.full, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
    borderWidth: 1, borderColor: Colors.border,
  },
  chipText: { fontSize: FontSizes.sm, color: Colors.textSecondary },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  catItem: {
    width: '23%', backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.sm,
    alignItems: 'center',
  },
  catIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.xs },
  catLabel: { fontSize: FontSizes.xs, color: Colors.textPrimary, textAlign: 'center', fontWeight: FontWeights.medium },
  medCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.md, padding: Spacing.lg, marginBottom: Spacing.sm,
  },
  medIcon: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.accent + '15',
    justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md,
  },
  medName: { fontSize: FontSizes.base, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  medBrand: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
  medRight: { alignItems: 'flex-end' },
  medPrice: { fontSize: FontSizes.base, fontWeight: FontWeights.bold, color: Colors.textPrimary },
  medAvail: { fontSize: FontSizes.xs, fontWeight: FontWeights.medium, marginTop: 2 },
});
