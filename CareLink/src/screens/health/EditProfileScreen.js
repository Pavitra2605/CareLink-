import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button, Input } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../services/userService';

export default function EditProfileScreen({ navigation }) {
  const { user, profile, refreshProfile } = useAuth();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [blood, setBlood] = useState('');
  const [phone, setPhone] = useState('');
  const [emergency, setEmergency] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [saving, setSaving] = useState(false);

  // Populate fields from profile whenever it loads
  useEffect(() => {
    if (profile) {
      setName(profile.full_name ?? '');
      setAge(profile.age != null ? String(profile.age) : '');
      setGender(profile.gender ?? '');
      setBlood(profile.blood_group ?? '');
      setPhone(profile.phone ?? '');
      setEmergency(profile.emg_contact_phone ?? '');
      setEmergencyName(profile.emg_contact_name ?? '');
    }
  }, [profile]);

  const genders = ['Male', 'Female', 'Other'];
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    const { error } = await updateProfile(user.id, {
      full_name:         name.trim() || null,
      age:               age ? parseInt(age, 10) : null,
      gender:            gender || null,
      blood_group:       blood || null,
      phone:             phone.trim() || null,
      emg_contact_name:  emergencyName.trim() || null,
      emg_contact_phone: emergency.trim() || null,
    });
    setSaving(false);
    if (error) {
      Alert.alert('Save Failed', error.message);
    } else {
      refreshProfile();
      navigation.goBack();
    }
  };

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

        <Input label="Emergency Contact Name" value={emergencyName} onChangeText={setEmergencyName}
          leftIcon={<Ionicons name="person-add-outline" size={18} color={Colors.error} />} />
        <Input label="Emergency Contact Phone" value={emergency} onChangeText={setEmergency}
          keyboardType="phone-pad"
          leftIcon={<Ionicons name="warning-outline" size={18} color={Colors.error} />} />

        <Button
          title={saving ? 'Saving…' : 'Save Changes'}
          variant="primary"
          size="lg"
          onPress={handleSave}
          disabled={saving}
          style={{ marginTop: Spacing.lg }}
        />

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
