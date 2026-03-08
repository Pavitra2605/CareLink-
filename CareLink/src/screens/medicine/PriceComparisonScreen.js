import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Badge } from '../../components/common';
import { useLanguage } from '../../i18n';

const comparisons = [
  { id: '1', pharmacy: 'Jan Aushadhi Kendra', type: 'Government', price: 18, distance: '1.2 km', available: true },
  { id: '2', pharmacy: 'MedPlus', type: 'Private', price: 28, distance: '3.1 km', available: true },
  { id: '3', pharmacy: 'Apollo Pharmacy', type: 'Private', price: 30, distance: '2.5 km', available: true },
  { id: '4', pharmacy: 'Netmeds Store', type: 'Private', price: 25, distance: '5.2 km', available: true },
  { id: '5', pharmacy: 'PHC Dispensary', type: 'Government', price: 0, distance: '4.0 km', available: false },
];

const minPrice = Math.min(...comparisons.filter(c => c.available && c.price > 0).map(c => c.price));

export default function PriceComparisonScreen({ navigation }) {
  const { t } = useLanguage();

  const renderItem = ({ item }) => {
    const isCheapest = item.price === minPrice && item.available;
    return (
      <View style={[styles.card, Shadows.soft, isCheapest && styles.cardBest]}>
        {isCheapest && (
          <View style={styles.bestBadge}>
            <Ionicons name="trophy" size={14} color={Colors.white} />
            <Text style={styles.bestText}>Best Price</Text>
          </View>
        )}
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.pharmacy}</Text>
            <Badge label={item.type} variant={item.type === 'Government' ? 'info' : 'neutral'} size="sm" />
          </View>
          <View style={styles.priceCol}>
            <Text style={styles.price}>{item.price === 0 ? 'Free' : `₹${item.price}`}</Text>
            <Text style={styles.distance}>{item.distance}</Text>
          </View>
        </View>
        <View style={styles.barWrap}>
          <View style={[styles.bar, { width: `${item.price > 0 ? (item.price / 35) * 100 : 5}%` },
            isCheapest && { backgroundColor: Colors.success }]} />
        </View>
        {!item.available && (
          <Badge label="Out of Stock" variant="error" size="sm" />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title={t('medicine.priceComparison')} onBack={() => navigation.goBack()}
        rightAction={{ icon: 'swap-vertical', onPress: () => {} }} />
      <View style={styles.summaryBar}>
        <Text style={styles.summaryText}>Paracetamol 500mg • Strip of 10</Text>
        <Text style={styles.summaryRange}>₹{minPrice} - ₹{Math.max(...comparisons.map(c => c.price))}</Text>
      </View>
      <FlatList data={comparisons} keyExtractor={i => i.id} renderItem={renderItem}
        contentContainerStyle={styles.list} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  summaryBar: {
    backgroundColor: Colors.accent + '10', paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  summaryText: { fontSize: FontSizes.md, color: Colors.textPrimary, fontWeight: FontWeights.medium },
  summaryRange: { fontSize: FontSizes.md, fontWeight: FontWeights.bold, color: Colors.accent },
  list: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, paddingBottom: 40 },
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.lg,
    marginBottom: Spacing.md, position: 'relative',
  },
  cardBest: { borderWidth: 2, borderColor: Colors.success },
  bestBadge: {
    position: 'absolute', top: -1, right: Spacing.md, backgroundColor: Colors.success,
    borderBottomLeftRadius: Radius.sm, borderBottomRightRadius: Radius.sm,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: Spacing.sm, paddingVertical: 3,
  },
  bestText: { fontSize: FontSizes.xs, fontWeight: FontWeights.bold, color: Colors.white },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  name: { fontSize: FontSizes.base, fontWeight: FontWeights.semiBold, color: Colors.textPrimary, marginBottom: 4 },
  priceCol: { alignItems: 'flex-end' },
  price: { fontSize: FontSizes.xl, fontWeight: FontWeights.bold, color: Colors.textPrimary },
  distance: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
  barWrap: { height: 6, borderRadius: 3, backgroundColor: Colors.border, marginTop: Spacing.md },
  bar: { height: 6, borderRadius: 3, backgroundColor: Colors.accent },
});
