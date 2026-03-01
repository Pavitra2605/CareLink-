import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button, Input, Card } from '../../components/common';

export default function ProfileSettingsScreen({ navigation }) {
  const [form, setForm] = useState({
    name: 'Anitha K.', phone: '+91 98765 43210', email: 'anitha.k@email.com',
    age: '32', gender: 'Female', blood: 'B+',
  });

  const updateField = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <View style={styles.container}>
      <Header title="Profile Settings" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AK</Text>
          </View>
          <TouchableOpacity style={styles.changePhotoBtn}>
            <Ionicons name="camera" size={16} color={Colors.accent} />
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        <Input label="Full Name" value={form.name} onChangeText={v => updateField('name', v)} icon="person" />
        <Input label="Phone Number" value={form.phone} onChangeText={v => updateField('phone', v)} icon="call" />
        <Input label="Email" value={form.email} onChangeText={v => updateField('email', v)} icon="mail" />
        <Input label="Age" value={form.age} onChangeText={v => updateField('age', v)} icon="calendar" />

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

        <Button label="Save Changes" onPress={() => navigation.goBack()} style={{ marginTop: Spacing.xl }} />
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
