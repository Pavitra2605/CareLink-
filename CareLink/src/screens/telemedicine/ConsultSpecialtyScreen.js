import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, SearchBar } from '../../components/common';
import { useLanguage } from '../../i18n';

const SPECIALTIES = [
  { id: '1', name: 'General Physician', icon: 'person', color: Colors.accent, doctors: 24 },
  { id: '2', name: 'Pediatrics', icon: 'happy', color: '#E8A857', doctors: 12 },
  { id: '3', name: 'Gynecology', icon: 'female', color: '#E75480', doctors: 8 },
  { id: '4', name: 'Cardiology', icon: 'heart', color: '#D94F4F', doctors: 6 },
  { id: '5', name: 'Dermatology', icon: 'body', color: '#2E9E6B', doctors: 10 },
  { id: '6', name: 'Orthopedics', icon: 'fitness', color: '#3498DB', doctors: 7 },
  { id: '7', name: 'ENT', icon: 'ear', color: '#9B59B6', doctors: 5 },
  { id: '8', name: 'Ophthalmology', icon: 'eye', color: '#1ABC9C', doctors: 4 },
  { id: '9', name: 'Psychiatry', icon: 'happy', color: '#E67E22', doctors: 3 },
  { id: '10', name: 'Dentistry', icon: 'medical', color: '#34495E', doctors: 9 },
];

export default function ConsultSpecialtyScreen({ navigation }) {
  const { t } = useLanguage();
  const [search, setSearch] = React.useState('');

  const filtered = SPECIALTIES.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Header title={t('telemedicine.consultSpecialty')} onBack={() => navigation.goBack()} />
      <View style={styles.content}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search specialty..."
          style={styles.search}
        />

        <FlatList
          data={filtered}
          numColumns={2}
          keyExtractor={(item) => item.id}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, Shadows.soft]}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('DoctorsList', { specialty: item.name })}
            >
              <View style={[styles.iconWrap, { backgroundColor: item.color + '15' }]}>
                <Ionicons name={item.icon} size={28} color={item.color} />
              </View>
              <Text style={styles.specName}>{item.name}</Text>
              <Text style={styles.docCount}>{item.doctors} doctors</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  content: { flex: 1, paddingHorizontal: Spacing.base },
  search: { marginVertical: Spacing.md },
  row: { justifyContent: 'space-between', marginBottom: Spacing.md },
  card: {
    width: '48%', backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.base, alignItems: 'center',
  },
  iconWrap: {
    width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm,
  },
  specName: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold, color: Colors.textPrimary, textAlign: 'center' },
  docCount: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 4 },
});
