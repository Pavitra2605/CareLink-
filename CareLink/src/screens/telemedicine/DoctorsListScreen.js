import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius } from '../../theme';
import { Header, SearchBar, DoctorCard, Badge } from '../../components/common';

const MOCK_DOCTORS = [
  { id: '1', name: 'Dr. Priya Sharma', specialty: 'General Physician', rating: '4.8', available: true, languages: 'Tamil, English', waitTime: '5 min' },
  { id: '2', name: 'Dr. Rajesh Kumar', specialty: 'General Physician', rating: '4.6', available: true, languages: 'Hindi, English', waitTime: '12 min' },
  { id: '3', name: 'Dr. Anitha S.', specialty: 'General Physician', rating: '4.9', available: false, languages: 'Tamil, Telugu', waitTime: '--' },
  { id: '4', name: 'Dr. Mohammed A.', specialty: 'General Physician', rating: '4.5', available: true, languages: 'Hindi, English', waitTime: '8 min' },
];

export default function DoctorsListScreen({ navigation, route }) {
  const specialty = route?.params?.specialty || 'General Physician';
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | online | video | audio

  const filtered = MOCK_DOCTORS.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) &&
    (filter === 'all' || (filter === 'online' && d.available))
  );

  return (
    <View style={styles.container}>
      <Header title={specialty} subtitle={`${filtered.length} doctors available`} onBack={() => navigation.goBack()} />
      <View style={styles.content}>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search doctor..." style={styles.search} />

        <View style={styles.filters}>
          {['all', 'online'].map((f) => (
            <TouchableOpacity key={f} onPress={() => setFilter(f)}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}>
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f === 'all' ? 'All' : 'Online Now'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <DoctorCard
              name={item.name}
              specialty={item.specialty}
              rating={item.rating}
              available={item.available}
              languages={item.languages}
              onPress={() => navigation.navigate('DoctorProfile', { doctor: item })}
            />
          )}
          ListFooterComponent={<View style={{ height: 100 }} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  content: { flex: 1, paddingHorizontal: Spacing.base },
  search: { marginVertical: Spacing.md },
  filters: { flexDirection: 'row', marginBottom: Spacing.md, gap: Spacing.sm },
  filterChip: {
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm,
    borderRadius: Radius.pill, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
  },
  filterChipActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  filterText: { fontSize: FontSizes.sm, color: Colors.textSecondary, fontWeight: FontWeights.medium },
  filterTextActive: { color: Colors.white },
});
