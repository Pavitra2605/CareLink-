import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Linking, Modal, SafeAreaView, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Badge, MapboxView } from '../../components/common';

/* ── Hospital data with Chennai coordinates ──────────────────────────── */
const hospitals = [
  {
    id: '1', name: 'St. Joseph Hospital',
    distance: '2.3 km', time: '8 min', type: 'Government',
    emergency: true, phone: '108', rating: 4.2,
    lat: 13.0833, lng: 80.2710,
  },
  {
    id: '2', name: 'Apollo Multi-Specialty',
    distance: '4.5 km', time: '15 min', type: 'Private',
    emergency: true, phone: '044-28290200', rating: 4.5,
    lat: 13.0569, lng: 80.2425,
  },
  {
    id: '3', name: 'GH Primary Health Centre',
    distance: '1.2 km', time: '5 min', type: 'PHC',
    emergency: false, phone: '044-26780001', rating: 3.8,
    lat: 13.0878, lng: 80.2785,
  },
  {
    id: '4', name: 'Kaveri Medical Centre',
    distance: '5.8 km', time: '20 min', type: 'Private',
    emergency: true, phone: '044-24310000', rating: 4.0,
    lat: 13.0475, lng: 80.2574,
  },
  {
    id: '5', name: 'District Government Hospital',
    distance: '6.1 km', time: '22 min', type: 'Government',
    emergency: true, phone: '044-25361102', rating: 3.5,
    lat: 13.0960, lng: 80.2690,
  },
];

/* Centre of all markers */
const MAP_CENTER = [80.2640, 13.0740];

export default function NearestHospitalsScreen({ navigation }) {
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [highlightedId, setHighlightedId] = useState(null);
  const listRef = useRef(null);

  const handleMarkerPress = (id) => {
    setHighlightedId(id);
    const idx = hospitals.findIndex(h => h.id === id);
    if (idx !== -1 && listRef.current) {
      listRef.current.scrollToIndex({ index: idx, animated: true, viewPosition: 0.1 });
    }
  };

  const openDirections = (item) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}&travelmode=driving`;
    Linking.openURL(url);
  };

  const renderItem = ({ item }) => {
    const isHighlighted = item.id === highlightedId;
    return (
      <View style={[
        styles.card, Shadows.soft,
        isHighlighted && styles.cardHighlighted,
      ]}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.tagRow}>
              <Badge
                label={item.type}
                variant={item.type === 'Government' ? 'info' : item.type === 'PHC' ? 'neutral' : 'warning'}
                size="sm"
              />
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
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => Linking.openURL(`tel:${item.phone}`)}
          >
            <Ionicons name="call" size={18} color={Colors.success} />
            <Text style={[styles.actionText, { color: Colors.success }]}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => openDirections(item)}
          >
            <Ionicons name="navigate" size={18} color={Colors.accent} />
            <Text style={[styles.actionText, { color: Colors.accent }]}>Directions</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Nearest Hospitals" onBack={() => navigation.goBack()} />

      {/* ── Inline Mapbox map ────────────────────────────────────────── */}
      <View style={styles.mapWrapper}>
        <MapboxView
          hospitals={hospitals}
          center={MAP_CENTER}
          zoom={11.5}
          style={styles.map}
          onMarkerPress={handleMarkerPress}
        />
        {/* Expand button */}
        <TouchableOpacity
          style={styles.expandBtn}
          onPress={() => setMapModalVisible(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="expand" size={18} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* ── Hospital list ────────────────────────────────────────────── */}
      <FlatList
        ref={listRef}
        data={hospitals}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        onScrollToIndexFailed={() => {}}
      />

      {/* ── Full-screen map modal ────────────────────────────────────── */}
      <Modal
        visible={mapModalVisible}
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setMapModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <StatusBar barStyle="dark-content" />
          {/* Modal header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setMapModalVisible(false)}
              style={styles.modalClose}
            >
              <Ionicons name="chevron-down" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Nearest Hospitals</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Full-screen map */}
          <MapboxView
            hospitals={hospitals}
            center={MAP_CENTER}
            zoom={11.5}
            style={styles.fullMap}
            onMarkerPress={(id) => {
              setHighlightedId(id);
            }}
          />

          {/* Legend */}
          <View style={styles.legend}>
            <LegendItem color="#3B7FCC" label="Government" />
            <LegendItem color="#D94F4F" label="Private" />
            <LegendItem color="#2E9E6B" label="PHC" />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

function LegendItem({ color, label }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },

  /* ── Inline map ──────────────────────────────────────────────────── */
  mapWrapper: {
    height: 220,
    marginHorizontal: Spacing.base,
    marginTop: Spacing.md,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...Shadows.medium,
  },
  map: { flex: 1 },
  expandBtn: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.accent,
    borderRadius: Radius.sm,
    padding: 6,
    ...Shadows.soft,
  },

  /* ── List ────────────────────────────────────────────────────────── */
  list: { paddingHorizontal: Spacing.base, paddingTop: Spacing.md, paddingBottom: 40 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  cardHighlighted: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accentLight,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  name: { fontSize: FontSizes.base, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  tagRow: { flexDirection: 'row', gap: Spacing.xs, marginTop: Spacing.xs },
  ratingBox: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: FontSizes.sm, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  metaRow: { flexDirection: 'row', gap: Spacing.lg, marginTop: Spacing.md },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: FontSizes.sm, color: Colors.textMuted },
  actionRow: {
    flexDirection: 'row', gap: Spacing.lg,
    marginTop: Spacing.md, paddingTop: Spacing.md,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  actionText: { fontSize: FontSizes.md, fontWeight: FontWeights.medium },

  /* ── Full-screen modal ───────────────────────────────────────────── */
  modalContainer: { flex: 1, backgroundColor: Colors.surface },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  modalClose: { width: 40, alignItems: 'flex-start' },
  modalTitle: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.textPrimary },
  fullMap: { flex: 1 },

  /* ── Legend ──────────────────────────────────────────────────────── */
  legend: {
    flexDirection: 'row', justifyContent: 'center', gap: Spacing.lg,
    paddingVertical: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendLabel: { fontSize: FontSizes.sm, color: Colors.textSecondary },
});
