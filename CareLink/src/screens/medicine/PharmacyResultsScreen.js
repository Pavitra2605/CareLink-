import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Badge, SearchBar } from '../../components/common';

const pharmacies = [
  { id: '1', name: 'Jan Aushadhi Kendra', distance: '1.2 km', type: 'Government', available: true, price: '₹18', rating: 4.0, hours: '8 AM - 9 PM' },
  { id: '2', name: 'Apollo Pharmacy', distance: '2.5 km', type: 'Private', available: true, price: '₹30', rating: 4.5, hours: '24 Hours' },
  { id: '3', name: 'MedPlus', distance: '3.1 km', type: 'Private', available: true, price: '₹28', rating: 4.2, hours: '8 AM - 10 PM' },
  { id: '4', name: 'PHC Dispensary', distance: '4.0 km', type: 'Government', available: false, price: 'Free', rating: 3.5, hours: '9 AM - 5 PM' },
  { id: '5', name: 'Netmeds Store', distance: '5.2 km', type: 'Private', available: true, price: '₹25', rating: 4.1, hours: '9 AM - 9 PM' },
];

const filters = ['All', 'Government', 'Private', 'Nearest', 'Lowest Price'];

export default function PharmacyResultsScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('All');

  const renderItem = ({ item }) => (
    <TouchableOpacity style={[styles.card, Shadows.soft]} activeOpacity={0.7}
      onPress={() => navigation.navigate('PharmacyDetail', { pharmacy: item })}>
      <View style={styles.cardHeader}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{item.name}</Text>
          <Badge label={item.type} variant={item.type === 'Government' ? 'info' : 'neutral'} size="sm" />
        </View>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color={Colors.amberMid} />
          <Text style={styles.rating}>{item.rating}</Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="location" size={14} color={Colors.accent} />
          <Text style={styles.metaText}>{item.distance}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="time" size={14} color={Colors.textMuted} />
          <Text style={styles.metaText}>{item.hours}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.price, item.price === 'Free' && { color: Colors.success }]}>{item.price}</Text>
        <Badge label={item.available ? 'In Stock' : 'Out of Stock'}
          variant={item.available ? 'success' : 'error'} size="sm" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Nearby Pharmacies" onBack={() => navigation.goBack()} />
      <View style={styles.filterRow}>
        {filters.map(f => (
          <TouchableOpacity key={f}
            style={[styles.filterChip, activeFilter === f && styles.filterActive]}
            onPress={() => setActiveFilter(f)}>
            <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList data={pharmacies} keyExtractor={i => i.id} renderItem={renderItem}
        contentContainerStyle={styles.list} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  filterRow: {
    flexDirection: 'row', paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  filterChip: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.full,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
  },
  filterActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  filterText: { fontSize: FontSizes.xs, color: Colors.textSecondary },
  filterTextActive: { color: Colors.white, fontWeight: FontWeights.semiBold },
  list: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm, paddingBottom: 40 },
  card: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  nameRow: { flex: 1, gap: Spacing.xs },
  name: { fontSize: FontSizes.base, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  rating: { fontSize: FontSizes.sm, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  metaRow: { flexDirection: 'row', gap: Spacing.lg, marginTop: Spacing.sm },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: FontSizes.sm, color: Colors.textMuted },
  footer: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: Spacing.md, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.border,
  },
  price: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.textPrimary },
});
