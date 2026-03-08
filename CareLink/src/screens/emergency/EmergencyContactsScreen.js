import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button } from '../../components/common';
import { useLanguage } from '../../i18n';

const initialContacts = [
  { id: '1', name: 'Meena Devi', relation: 'Mother', phone: '+91 98765 43210', primary: true },
  { id: '2', name: 'Ravi Kumar', relation: 'Brother', phone: '+91 98765 43211', primary: false },
  { id: '3', name: 'Dr. Anand', relation: 'Family Doctor', phone: '+91 44 2830 0000', primary: false },
];

export default function EmergencyContactsScreen({ navigation }) {
  const [contacts] = useState(initialContacts);
  const { t } = useLanguage();

  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone.replace(/\s/g, '')}`);
  };

  const handleSOS = () => {
    Alert.alert(t('emergencyContacts.sosSent'), t('emergencyContacts.sosMessage'));
  };

  const renderContact = ({ item }) => (
    <View style={[styles.card, Shadows.soft]}>
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.nameRow}>
          <Text style={styles.contactName}>{item.name}</Text>
          {item.primary && (
            <View style={styles.primaryBadge}>
              <Text style={styles.primaryText}>{t('emergencyContacts.primary')}</Text>
            </View>
          )}
        </View>
        <Text style={styles.relation}>{item.relation}</Text>
        <Text style={styles.phone}>{item.phone}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.callBtn} onPress={() => handleCall(item.phone)}>
          <Ionicons name="call" size={20} color={Colors.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.editBtn} onPress={() => {}}>
          <Ionicons name="pencil" size={18} color={Colors.accent} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title={t('emergencyContacts.title')} onBack={() => navigation.goBack()} />
      {/* SOS All */}
      <TouchableOpacity style={styles.sosBar} onPress={handleSOS}>
        <Ionicons name="alert-circle" size={24} color={Colors.white} />
        <Text style={styles.sosText}>{t('emergencyContacts.alertAll')}</Text>
        <Ionicons name="chevron-forward" size={20} color={Colors.white} />
      </TouchableOpacity>

      <FlatList data={contacts} keyExtractor={i => i.id} renderItem={renderContact}
        contentContainerStyle={styles.list}
        ListFooterComponent={
          <View style={{ paddingTop: Spacing.md }}>
            <Button label={t('emergencyContacts.addContact')} variant="outline" onPress={() => {}} />
            <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={20} color={Colors.accent} />
              <Text style={styles.infoText}>
                {t('emergencyContacts.infoText')}
              </Text>
            </View>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  sosBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.error, paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  sosText: { color: Colors.white, fontSize: FontSizes.md, fontWeight: FontWeights.semiBold },
  list: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, paddingBottom: 40 },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.md,
  },
  avatarCircle: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.accent + '20',
    justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md,
  },
  avatarText: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.accent },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  contactName: { fontSize: FontSizes.base, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  primaryBadge: {
    backgroundColor: Colors.amberMid + '20', borderRadius: Radius.sm, paddingHorizontal: 6, paddingVertical: 2,
  },
  primaryText: { fontSize: FontSizes.xs, fontWeight: FontWeights.semiBold, color: Colors.amberMid },
  relation: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
  phone: { fontSize: FontSizes.sm, color: Colors.textSecondary, marginTop: 2 },
  actions: { alignItems: 'center', gap: Spacing.sm },
  callBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.success,
    justifyContent: 'center', alignItems: 'center',
  },
  editBtn: {
    width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: Colors.accent,
    justifyContent: 'center', alignItems: 'center',
  },
  infoCard: {
    flexDirection: 'row', gap: Spacing.sm, backgroundColor: Colors.accent + '10',
    borderRadius: Radius.md, padding: Spacing.md, marginTop: Spacing.md,
  },
  infoText: { flex: 1, fontSize: FontSizes.sm, color: Colors.textSecondary, lineHeight: 20 },
});
