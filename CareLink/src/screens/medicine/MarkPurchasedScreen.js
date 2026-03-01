import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button, Card, Badge } from '../../components/common';

const medicines = [
  { id: '1', name: 'Paracetamol 500mg', pharmacy: 'Jan Aushadhi Kendra', price: '₹18', purchased: false },
  { id: '2', name: 'Amoxicillin 250mg', pharmacy: 'Apollo Pharmacy', price: '₹85', purchased: true },
  { id: '3', name: 'ORS Sachets', pharmacy: 'MedPlus', price: '₹40', purchased: false },
];

export default function MarkPurchasedScreen({ navigation }) {
  const [items, setItems] = useState(medicines);

  const togglePurchased = (id) => {
    setItems(prev => prev.map(m => m.id === id ? { ...m, purchased: !m.purchased } : m));
  };

  const purchasedCount = items.filter(m => m.purchased).length;

  const handleDone = () => {
    Alert.alert('Updated', `${purchasedCount} medicine(s) marked as purchased.`);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header title="Mark Purchased" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.progressBox}>
          <Text style={styles.progressTitle}>Purchase Progress</Text>
          <Text style={styles.progressCount}>{purchasedCount} of {items.length}</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(purchasedCount / items.length) * 100}%` }]} />
          </View>
        </View>

        {items.map(item => (
          <TouchableOpacity key={item.id} style={[styles.card, Shadows.soft, item.purchased && styles.cardDone]}
            onPress={() => togglePurchased(item.id)} activeOpacity={0.7}>
            <Ionicons name={item.purchased ? 'checkbox' : 'square-outline'}
              size={24} color={item.purchased ? Colors.success : Colors.textMuted} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.medName, item.purchased && styles.medNameDone]}>{item.name}</Text>
              <Text style={styles.pharmacy}>{item.pharmacy}</Text>
            </View>
            <Text style={styles.price}>{item.price}</Text>
          </TouchableOpacity>
        ))}

        <Card title="Tip" style={{ marginTop: Spacing.lg }}>
          <View style={styles.tipRow}>
            <Ionicons name="bulb" size={20} color={Colors.amberMid} />
            <Text style={styles.tipText}>
              Mark medicines as purchased to track your medication completion and help us improve availability data.
            </Text>
          </View>
        </Card>

        <Button label="Done" onPress={handleDone} style={{ marginTop: Spacing.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  content: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.lg, paddingBottom: 60 },
  progressBox: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.lg,
    ...Shadows.soft,
  },
  progressTitle: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  progressCount: { fontSize: FontSizes.xl, fontWeight: FontWeights.bold, color: Colors.accent, marginTop: Spacing.xs },
  progressBar: { height: 8, borderRadius: 4, backgroundColor: Colors.border, marginTop: Spacing.md },
  progressFill: { height: 8, borderRadius: 4, backgroundColor: Colors.success },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.lg, marginBottom: Spacing.sm,
  },
  cardDone: { backgroundColor: Colors.success + '08', borderWidth: 1, borderColor: Colors.success + '30' },
  medName: { fontSize: FontSizes.base, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  medNameDone: { textDecorationLine: 'line-through', color: Colors.textMuted },
  pharmacy: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
  price: { fontSize: FontSizes.md, fontWeight: FontWeights.bold, color: Colors.textPrimary },
  tipRow: { flexDirection: 'row', gap: Spacing.sm },
  tipText: { flex: 1, fontSize: FontSizes.sm, color: Colors.textSecondary, lineHeight: 20 },
});
