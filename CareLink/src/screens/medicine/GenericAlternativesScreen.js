import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Badge, Button } from '../../components/common';

const alternatives = [
  { id: '1', name: 'Paracetamol 500mg (Generic)', brand: 'Unbranded', price: '₹8', saving: '73%', available: true },
  { id: '2', name: 'Dolo 500mg', brand: 'Micro Labs', price: '₹25', saving: '17%', available: true },
  { id: '3', name: 'Calpol 500mg', brand: 'GSK', price: '₹28', saving: '7%', available: true },
  { id: '4', name: 'P-500', brand: 'Cipla', price: '₹12', saving: '60%', available: false },
  { id: '5', name: 'Pacimol 500mg', brand: 'Ipca', price: '₹15', saving: '50%', available: true },
];

export default function GenericAlternativesScreen({ navigation }) {
  const renderItem = ({ item }) => (
    <View style={[styles.card, Shadows.soft]}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.brand}>{item.brand}</Text>
        </View>
        <View style={styles.priceCol}>
          <Text style={styles.price}>{item.price}</Text>
          <View style={styles.savingBadge}>
            <Text style={styles.savingText}>Save {item.saving}</Text>
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <Badge label={item.available ? 'Available' : 'Out of Stock'}
          variant={item.available ? 'success' : 'error'} size="sm" />
        {item.available && (
          <TouchableOpacity style={styles.findBtn}
            onPress={() => navigation.navigate('PharmacyResults')}>
            <Text style={styles.findText}>Find Pharmacy</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.accent} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Generic Alternatives" onBack={() => navigation.goBack()} />
      <View style={styles.infoBar}>
        <Ionicons name="information-circle" size={20} color={Colors.accent} />
        <Text style={styles.infoText}>
          Generic medicines contain the same active ingredient (Paracetamol) and are equally effective.
        </Text>
      </View>
      <FlatList data={alternatives} keyExtractor={i => i.id} renderItem={renderItem}
        contentContainerStyle={styles.list} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  infoBar: {
    flexDirection: 'row', gap: Spacing.sm, backgroundColor: Colors.accent + '10',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, alignItems: 'center',
  },
  infoText: { flex: 1, fontSize: FontSizes.sm, color: Colors.textSecondary, lineHeight: 20 },
  list: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, paddingBottom: 40 },
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.md,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  name: { fontSize: FontSizes.base, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  brand: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
  priceCol: { alignItems: 'flex-end' },
  price: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.textPrimary },
  savingBadge: {
    backgroundColor: Colors.success + '15', borderRadius: Radius.sm,
    paddingHorizontal: 6, paddingVertical: 2, marginTop: 2,
  },
  savingText: { fontSize: FontSizes.xs, fontWeight: FontWeights.semiBold, color: Colors.success },
  footer: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: Spacing.md, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.border,
  },
  findBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  findText: { fontSize: FontSizes.sm, color: Colors.accent, fontWeight: FontWeights.medium },
});
