import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Badge } from '../../components/common';

const pharmacies = [
  { id: '1', name: 'Jan Aushadhi Kendra', lat: 12.97, lng: 80.17, distance: '1.2 km', available: true, price: '₹18', type: 'Government' },
  { id: '2', name: 'Apollo Pharmacy', lat: 12.98, lng: 80.18, distance: '2.5 km', available: true, price: '₹30', type: 'Private' },
  { id: '3', name: 'MedPlus', lat: 12.96, lng: 80.16, distance: '3.1 km', available: true, price: '₹28', type: 'Private' },
  { id: '4', name: 'PHC Dispensary', lat: 12.95, lng: 80.15, distance: '4.0 km', available: false, price: 'Free', type: 'Government' },
];

export default function PharmacyMapViewScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Header title="Pharmacy Map" onBack={() => navigation.goBack()} />
      {/* Map placeholder */}
      <View style={styles.mapPlaceholder}>
        <Ionicons name="map" size={64} color={Colors.accent} />
        <Text style={styles.mapText}>Interactive Map View</Text>
        <Text style={styles.mapSub}>Showing {pharmacies.length} pharmacies nearby</Text>
        {/* Pin markers */}
        {pharmacies.map((p, i) => (
          <View key={i} style={[styles.pin, { top: 60 + i * 50, left: 40 + i * 60 }]}>
            <Ionicons name="location" size={28} color={p.available ? Colors.success : Colors.error} />
          </View>
        ))}
      </View>

      {/* Bottom list */}
      <FlatList data={pharmacies} keyExtractor={i => i.id} horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.card, Shadows.soft]}
            onPress={() => navigation.navigate('PharmacyDetail', { pharmacy: item })} activeOpacity={0.7}>
            <Text style={styles.name}>{item.name}</Text>
            <Badge label={item.type} variant={item.type === 'Government' ? 'info' : 'neutral'} size="sm" />
            <View style={styles.metaRow}>
              <Text style={styles.distance}>{item.distance}</Text>
              <Text style={[styles.price, item.price === 'Free' && { color: Colors.success }]}>{item.price}</Text>
            </View>
            <Badge label={item.available ? 'In Stock' : 'Out of Stock'}
              variant={item.available ? 'success' : 'error'} size="sm" />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  mapPlaceholder: {
    flex: 1, backgroundColor: Colors.bgSecondary, justifyContent: 'center', alignItems: 'center',
    position: 'relative',
  },
  mapText: { fontSize: FontSizes.lg, fontWeight: FontWeights.semiBold, color: Colors.textMuted, marginTop: Spacing.sm },
  mapSub: { fontSize: FontSizes.sm, color: Colors.textMuted },
  pin: { position: 'absolute' },
  list: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md },
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.lg,
    width: 200, marginRight: Spacing.md,
  },
  name: { fontSize: FontSizes.base, fontWeight: FontWeights.semiBold, color: Colors.textPrimary, marginBottom: Spacing.xs },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: Spacing.xs },
  distance: { fontSize: FontSizes.sm, color: Colors.textMuted },
  price: { fontSize: FontSizes.sm, fontWeight: FontWeights.bold, color: Colors.textPrimary },
});
