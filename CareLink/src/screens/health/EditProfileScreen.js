import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button, Input } from '../../components/common';

export default function EditProfileScreen({ navigation }) {
  const [name, setName] = useState('Rajesh Kumar');
  const [age, setAge] = useState('34');
  const [gender, setGender] = useState('Male');
  const [blood, setBlood] = useState('A+');
  const [phone, setPhone] = useState('+91 9876543210');
  const [email, setEmail] = useState('rajesh@email.com');
  const [height, setHeight] = useState('175');
  const [weight, setWeight] = useState('72');
  const [emergency, setEmergency] = useState('+91 9876543211');
  const [allergies, setAllergies] = useState('Penicillin, Dust');

  const genders = ['Male', 'Female', 'Other'];
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  return (
    <View style={styles.container}>
      <Header title="Edit Profile" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={Colors.white} />
          </View>
          <TouchableOpacity style={styles.editAvatar}>
            <Ionicons name="camera" size={16} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <Input label="Full Name" value={name} onChangeText={setName}
          leftIcon={<Ionicons name="person-outline" size={18} color={Colors.textMuted} />} />
        <Input label="Age" value={age} onChangeText={setAge} keyboardType="numeric"
          leftIcon={<Ionicons name="calendar-outline" size={18} color={Colors.textMuted} />} />

        {/* Gender Chips */}
        <Text style={styles.label}>Gender</Text>
        <View style={styles.chipRow}>
          {genders.map(g => (
            <TouchableOpacity key={g}
              style={[styles.chip, gender === g && styles.chipActive]}
              onPress={() => setGender(g)}>
              <Text style={[styles.chipText, gender === g && { color: Colors.white }]}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Blood Type */}
        <Text style={styles.label}>Blood Group</Text>
        <View style={styles.chipRow}>
          {bloodTypes.map(b => (
            <TouchableOpacity key={b}
              style={[styles.chip, blood === b && styles.chipActive, { minWidth: 50 }]}
              onPress={() => setBlood(b)}>
              <Text style={[styles.chipText, blood === b && { color: Colors.white }]}>{b}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Input label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad"
          leftIcon={<Ionicons name="call-outline" size={18} color={Colors.textMuted} />} />
        <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address"
          leftIcon={<Ionicons name="mail-outline" size={18} color={Colors.textMuted} />} />

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Input label="Height (cm)" value={height} onChangeText={setHeight} keyboardType="numeric" />
          </View>
          <View style={{ flex: 1, marginLeft: Spacing.md }}>
            <Input label="Weight (kg)" value={weight} onChangeText={setWeight} keyboardType="numeric" />
          </View>
        </View>

        <Input label="Emergency Contact" value={emergency} onChangeText={setEmergency}
          keyboardType="phone-pad"
          leftIcon={<Ionicons name="warning-outline" size={18} color={Colors.error} />} />
        <Input label="Known Allergies" value={allergies} onChangeText={setAllergies}
          leftIcon={<Ionicons name="alert-circle-outline" size={18} color={Colors.amberMid} />} />

        <Button title="Save Changes" variant="primary" size="lg"
          onPress={() => navigation.goBack()} style={{ marginTop: Spacing.lg }} />

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md },
  avatarSection: { alignItems: 'center', marginBottom: Spacing.xl, position: 'relative' },
  avatar: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.accent,
    justifyContent: 'center', alignItems: 'center',
  },
  editAvatar: {
    position: 'absolute', bottom: 0, right: '35%', width: 30, height: 30, borderRadius: 15,
    backgroundColor: Colors.amberMid, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: Colors.surface,
  },
  label: {
    fontSize: FontSizes.sm, fontWeight: FontWeights.medium, color: Colors.textSecondary,
    marginBottom: Spacing.sm, marginTop: Spacing.md,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.sm },
  chip: {
    paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, borderRadius: Radius.pill,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
  },
  chipActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  chipText: { fontSize: FontSizes.sm, fontWeight: FontWeights.medium, color: Colors.textPrimary },
  row: { flexDirection: 'row' },
});
