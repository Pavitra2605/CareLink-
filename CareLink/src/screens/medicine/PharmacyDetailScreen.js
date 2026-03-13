import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Linking, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button, Card, Badge } from '../../components/common';
import { useLanguage } from '../../i18n';
import { getPharmacyInventory } from '../../services/careService';

export default function PharmacyDetailScreen({ route, navigation }) {
  const { pharmacy } = route.params;
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    (async () => {
      try {
        const data = await getPharmacyInventory(pharmacy.id);
        setInventory(data);
      } catch (err) {
        setError('Could not load medicine inventory.');
      } finally {
        setLoading(false);
      }
    })();
  }, [pharmacy.id]);

  const formatHours = () => {
    if (pharmacy.opening_time && pharmacy.closing_time)
      return `${pharmacy.opening_time} – ${pharmacy.closing_time}`;
    return 'Hours not available';
  };

  const fullAddress = [pharmacy.address, pharmacy.city, pharmacy.state]
    .filter(Boolean).join(', ');

  return (
    <View style={styles.container}>
      <Header title={t('medicine.pharmacyDetail')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={[styles.heroCard, Shadows.soft]}>
          <View style={styles.iconCircle}>
            <Ionicons name="medical" size={32} color={Colors.accent} />
          </View>
          <Text style={styles.heroName}>{pharmacy.name}</Text>
          <View style={styles.tagRow}>
            <Badge label={pharmacy.type || 'Pharmacy'} variant="info" />
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={16} color={Colors.amberMid} />
              <Text style={styles.ratingText}>
                {pharmacy.rating ? pharmacy.rating.toFixed(1) : 'N/A'}
              </Text>
            </View>
            <Badge
              label={pharmacy.is_open ? 'Open' : 'Closed'}
              variant={pharmacy.is_open ? 'success' : 'error'}
            />
          </View>
        </View>

        {/* Info */}
        <Card title="Information">
          {fullAddress ? (
            <View style={styles.infoRow}>
              <Ionicons name="location" size={18} color={Colors.accent} />
              <Text style={styles.infoText}>{fullAddress}</Text>
            </View>
          ) : null}
          {pharmacy.phone ? (
            <TouchableOpacity
              style={styles.infoRow}
              onPress={() => Linking.openURL(`tel:${pharmacy.phone}`)}
            >
              <Ionicons name="call" size={18} color={Colors.accent} />
              <Text style={[styles.infoText, { color: Colors.accent }]}>{pharmacy.phone}</Text>
            </TouchableOpacity>
          ) : null}
          <View style={styles.infoRow}>
            <Ionicons name="time" size={18} color={Colors.accent} />
            <Text style={styles.infoText}>{formatHours()}</Text>
          </View>
          {pharmacy.email ? (
            <View style={styles.infoRow}>
              <Ionicons name="mail" size={18} color={Colors.accent} />
              <Text style={styles.infoText}>{pharmacy.email}</Text>
            </View>
          ) : null}
        </Card>

        {/* Inventory */}
        <Card title={`Medicine Availability (${inventory.length})`} style={{ marginTop: Spacing.md }}>
          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color={Colors.accent} />
              <Text style={styles.loadingText}>Loading inventory...</Text>
            </View>
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : inventory.length === 0 ? (
            <Text style={styles.emptyText}>No medicines listed for this pharmacy.</Text>
          ) : (
            inventory.map((item) => {
              const med = item.medicine || {};
              const inStock = item.is_available && item.stock_quantity > 0;
              return (
                <View key={item.id} style={styles.medRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.medName}>{med.name || 'Unknown'}</Text>
                    {med.generic_name ? (
                      <Text style={styles.genericName}>{med.generic_name}</Text>
                    ) : null}
                    {med.strength ? (
                      <Text style={styles.medMeta}>{med.strength}{med.dosage_form ? ` · ${med.dosage_form}` : ''}</Text>
                    ) : null}
                    {item.price != null ? (
                      <Text style={styles.medPrice}>
                        ₹{Number(item.price).toFixed(2)}
                        {item.stock_quantity != null ? ` · Qty: ${item.stock_quantity}` : ''}
                      </Text>
                    ) : null}
                  </View>
                  <View style={styles.medRight}>
                    <Badge
                      label={inStock ? 'In Stock' : 'Out of Stock'}
                      variant={inStock ? 'success' : 'error'}
                      size="sm"
                    />
                    {med.requires_prescription ? (
                      <Text style={styles.rxLabel}>Rx</Text>
                    ) : null}
                  </View>
                </View>
              );
            })
          )}
        </Card>

        {/* Services */}
        {pharmacy.services && pharmacy.services.length > 0 ? (
          <Card title="Services" style={{ marginTop: Spacing.md }}>
            {pharmacy.services.map((s, i) => (
              <View key={i} style={styles.serviceRow}>
                <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
                <Text style={styles.serviceText}>{s}</Text>
              </View>
            ))}
          </Card>
        ) : null}

        {/* Actions */}
        <View style={styles.btnRow}>
          {pharmacy.phone ? (
            <Button
              label="Call"
              variant="outline"
              onPress={() => Linking.openURL(`tel:${pharmacy.phone}`)}
              style={{ flex: 1 }}
            />
          ) : null}
          <Button
            label="Order Medicines"
            onPress={() => navigation.navigate('PrescriptionUpload', { pharmacy })}
            style={{ flex: 1 }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  content: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.lg, paddingBottom: 60 },
  heroCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.xl,
    alignItems: 'center', marginBottom: Spacing.lg,
  },
  iconCircle: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.accent + '15',
    justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.md,
  },
  heroName: { fontSize: FontSizes.xl, fontWeight: FontWeights.bold, color: Colors.textPrimary },
  tagRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    marginTop: Spacing.sm, flexWrap: 'wrap', justifyContent: 'center',
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: FontSizes.sm, color: Colors.textPrimary, fontWeight: FontWeights.medium },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, paddingVertical: Spacing.xs },
  infoText: { fontSize: FontSizes.md, color: Colors.textSecondary, flex: 1 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.sm },
  loadingText: { fontSize: FontSizes.md, color: Colors.textMuted },
  errorText: { fontSize: FontSizes.md, color: Colors.error, padding: Spacing.sm },
  emptyText: { fontSize: FontSizes.md, color: Colors.textMuted, padding: Spacing.sm },
  medRow: {
    flexDirection: 'row', alignItems: 'flex-start', paddingVertical: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  medName: { fontSize: FontSizes.md, fontWeight: FontWeights.medium, color: Colors.textPrimary },
  genericName: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
  medMeta: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 2 },
  medPrice: { fontSize: FontSizes.sm, color: Colors.accent, fontWeight: FontWeights.semiBold, marginTop: 4 },
  medRight: { alignItems: 'flex-end', gap: 4 },
  rxLabel: {
    fontSize: FontSizes.xs, fontWeight: FontWeights.bold, color: Colors.white,
    backgroundColor: Colors.warning, paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: Radius.sm, overflow: 'hidden',
  },
  serviceRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 4 },
  serviceText: { fontSize: FontSizes.md, color: Colors.textSecondary },
  btnRow: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.xl },
});
