import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Badge } from '../../components/common';

const hospitals = [
  { id: '1', name: 'St. Joseph Hospital', distance: '2.3 km', time: '8 min', type: 'Government', emergency: true, phone: '108', rating: 4.2 },
  { id: '2', name: 'Apollo Multi-Specialty', distance: '4.5 km', time: '15 min', type: 'Private', emergency: true, phone: '044-28290200', rating: 4.5 },
  { id: '3', name: 'GH Primary Health Centre', distance: '1.2 km', time: '5 min', type: 'PHC', emergency: false, phone: '044-26780001', rating: 3.8 },
  { id: '4', name: 'Kaveri Medical Centre', distance: '5.8 km', time: '20 min', type: 'Private', emergency: true, phone: '044-24310000', rating: 4.0 },
  { id: '5', name: 'District Government Hospital', distance: '6.1 km', time: '22 min', type: 'Government', emergency: true, phone: '044-25361102', rating: 3.5 },
];

export default function NearestHospitalsScreen({ navigation }) {
  const renderItem = ({ item }) => (
    <View style={[styles.card, Shadows.soft]}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.tagRow}>
            <Badge label={item.type} variant={item.type === 'Government' ? 'info' : item.type === 'PHC' ? 'neutral' : 'warning'} size="sm" />
            {item.emergency && <Badge label="24/7 ER" variant="error" size="sm" />}
          </View>
        </View>
        <View style={styles.ratingBox}>
          <Ionicons name="star" size={14} color={Colors.amberMid} />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="location" size={16} color={Colors.accent} />
          <Text style={styles.metaText}>{item.distance}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="car" size={16} color={Colors.amberMid} />
          <Text style={styles.metaText}>{item.time}</Text>
        </View>
      </View>
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => Linking.openURL(`tel:${item.phone}`)}>
          <Ionicons name="call" size={18} color={Colors.success} />
          <Text style={[styles.actionText, { color: Colors.success }]}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => {}}>
          <Ionicons name="navigate" size={18} color={Colors.accent} />
          <Text style={[styles.actionText, { color: Colors.accent }]}>Directions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Nearest Hospitals" onBack={() => navigation.goBack()} />
      {/* Map Placeholder */}
      <View style={styles.mapPlaceholder}>
        <Ionicons name="map" size={48} color={Colors.accent} />
        <Text style={styles.mapText}>Map View</Text>
      </View>
      <FlatList data={hospitals} keyExtractor={i => i.id} renderItem={renderItem}
        contentContainerStyle={styles.list} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  mapPlaceholder: {
    height: 160, backgroundColor: Colors.bgSecondary, justifyContent: 'center', alignItems: 'center',
  },
  mapText: { fontSize: FontSizes.md, color: Colors.textMuted, marginTop: Spacing.sm },
  list: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, paddingBottom: 40 },
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  name: { fontSize: FontSizes.base, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  tagRow: { flexDirection: 'row', gap: Spacing.xs, marginTop: Spacing.xs },
  ratingBox: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: FontSizes.sm, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  metaRow: { flexDirection: 'row', gap: Spacing.lg, marginTop: Spacing.md },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: FontSizes.sm, color: Colors.textMuted },
  actionRow: { flexDirection: 'row', gap: Spacing.lg, marginTop: Spacing.md, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  actionText: { fontSize: FontSizes.md, fontWeight: FontWeights.medium },
});
