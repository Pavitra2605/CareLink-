import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button, Card, Badge } from '../../components/common';
import { useLanguage } from '../../i18n';

const pharmacy = {
  name: 'Jan Aushadhi Kendra',
  type: 'Government',
  address: '12, Main Road, Village Centre, Tamil Nadu',
  phone: '+91 44 2678 0001',
  hours: '8:00 AM - 9:00 PM',
  rating: 4.0,
  reviews: 128,
  distance: '1.2 km',
  medicines: [
    { name: 'Paracetamol 500mg', available: true, price: '₹18' },
    { name: 'Amoxicillin 250mg', available: true, price: '₹45' },
    { name: 'Metformin 500mg', available: true, price: '₹22' },
    { name: 'Cetrizine 10mg', available: false, price: '₹15' },
  ],
  services: ['Generic medicines', 'Prescription dispensing', 'Home delivery', 'Health checkup'],
};

export default function PharmacyDetailScreen({ navigation }) {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <Header title={t('medicine.pharmacyDetail')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={[styles.heroCard, Shadows.soft]}>
          <View style={styles.iconCircle}>
            <Ionicons name="medical" size={32} color={Colors.accent} />
          </View>
          <Text style={styles.name}>{pharmacy.name}</Text>
          <View style={styles.tagRow}>
            <Badge label={pharmacy.type} variant="info" />
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={16} color={Colors.amberMid} />
              <Text style={styles.ratingText}>{pharmacy.rating} ({pharmacy.reviews})</Text>
            </View>
          </View>
        </View>

        {/* Info */}
        <Card title="Information">
          {[
            { icon: 'location', text: pharmacy.address },
            { icon: 'call', text: pharmacy.phone },
            { icon: 'time', text: pharmacy.hours },
            { icon: 'navigate', text: `${pharmacy.distance} away` },
          ].map((info, i) => (
            <View key={i} style={styles.infoRow}>
              <Ionicons name={info.icon} size={18} color={Colors.accent} />
              <Text style={styles.infoText}>{info.text}</Text>
            </View>
          ))}
        </Card>

        {/* Medicines in stock */}
        <Card title="Medicine Availability" style={{ marginTop: Spacing.md }}>
          {pharmacy.medicines.map((m, i) => (
            <View key={i} style={styles.medRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.medName}>{m.name}</Text>
                <Text style={styles.medPrice}>{m.price}</Text>
              </View>
              <Badge label={m.available ? 'Available' : 'Out of Stock'}
                variant={m.available ? 'success' : 'error'} size="sm" />
            </View>
          ))}
        </Card>

        {/* Services */}
        <Card title="Services" style={{ marginTop: Spacing.md }}>
          {pharmacy.services.map((s, i) => (
            <View key={i} style={styles.serviceRow}>
              <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
              <Text style={styles.serviceText}>{s}</Text>
            </View>
          ))}
        </Card>

        <View style={styles.btnRow}>
          <Button label="Call" variant="outline" onPress={() => Linking.openURL(`tel:${pharmacy.phone}`)}
            style={{ flex: 1 }} />
          <Button label="Get Directions" onPress={() => {}} style={{ flex: 1 }} />
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
  name: { fontSize: FontSizes.xl, fontWeight: FontWeights.bold, color: Colors.textPrimary },
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginTop: Spacing.sm },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: FontSizes.sm, color: Colors.textPrimary, fontWeight: FontWeights.medium },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.xs },
  infoText: { fontSize: FontSizes.md, color: Colors.textSecondary, flex: 1 },
  medRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  medName: { fontSize: FontSizes.md, fontWeight: FontWeights.medium, color: Colors.textPrimary },
  medPrice: { fontSize: FontSizes.sm, color: Colors.accent, fontWeight: FontWeights.semiBold, marginTop: 2 },
  serviceRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 4 },
  serviceText: { fontSize: FontSizes.md, color: Colors.textSecondary },
  btnRow: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.xl },
});
