import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button, Input } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../services/userService';

export default function ProfileSettingsScreen({ navigation }) {
  const { user, profile, refreshProfile } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', age: '', gender: '', blood: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        name:   profile.full_name   ?? '',
        phone:  profile.phone       ?? '',
        age:    profile.age != null ? String(profile.age) : '',
        gender: profile.gender      ?? '',
        blood:  profile.blood_group ?? '',
      });
    }
  }, [profile]);

  const updateField = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const initials = form.name
    ? form.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : (user?.email?.[0] ?? '?').toUpperCase();

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    const { error } = await updateProfile(user.id, {
      full_name:   form.name.trim()  || null,
      phone:       form.phone.trim() || null,
      age:         form.age ? parseInt(form.age, 10) : null,
      gender:      form.gender       || null,
      blood_group: form.blood        || null,
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
      <Header title="Profile Settings" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <TouchableOpacity style={styles.changePhotoBtn}>
            <Ionicons name="camera" size={16} color={Colors.accent} />
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        <Input label="Full Name" value={form.name} onChangeText={v => updateField('name', v)} />
        <Input label="Phone Number" value={form.phone} onChangeText={v => updateField('phone', v)} keyboardType="phone-pad" />
        <Input label="Email" value={user?.email ?? ''} editable={false} />
        <Input label="Age" value={form.age} onChangeText={v => updateField('age', v)} keyboardType="numeric" />

        <Text style={styles.label}>Gender</Text>
        <View style={styles.chipRow}>
          {['Male', 'Female', 'Other'].map(g => (
            <TouchableOpacity key={g}
              style={[styles.chip, form.gender === g && styles.chipActive]}
              onPress={() => updateField('gender', g)}>
              <Text style={[styles.chipText, form.gender === g && styles.chipTextActive]}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Blood Group</Text>
        <View style={styles.chipRow}>
          {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
            <TouchableOpacity key={bg}
              style={[styles.chip, form.blood === bg && styles.chipActive]}
              onPress={() => updateField('blood', bg)}>
              <Text style={[styles.chipText, form.blood === bg && styles.chipTextActive]}>{bg}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button title={saving ? 'Saving…' : 'Save Changes'} onPress={handleSave} disabled={saving} style={{ marginTop: Spacing.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  content: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.lg, paddingBottom: 60 },
  avatarSection: { alignItems: 'center', marginBottom: Spacing.xl },
  avatar: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.accent,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: FontSizes.xxl, fontWeight: FontWeights.bold, color: Colors.white },
  changePhotoBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginTop: Spacing.sm },
  changePhotoText: { fontSize: FontSizes.md, color: Colors.accent, fontWeight: FontWeights.medium },
  label: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold, color: Colors.textPrimary, marginTop: Spacing.lg, marginBottom: Spacing.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  chip: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.full,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
  },
  chipActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  chipText: { fontSize: FontSizes.sm, color: Colors.textSecondary },
  chipTextActive: { color: Colors.white, fontWeight: FontWeights.semiBold },
});
