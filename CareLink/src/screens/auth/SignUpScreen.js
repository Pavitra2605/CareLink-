import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Gradients, Radius } from '../../theme';
import { Button, Input } from '../../components/common';
import { useAuth } from '../../context/AuthContext';

export default function SignUpScreen({ navigation }) {
  const [form, setForm] = useState({ name: '', age: '', gender: '', phone: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [selectedGender, setSelectedGender] = useState('');
  const { signUp } = useAuth();

  const updateField = (key, value) => setForm({ ...form, [key]: value });
  const genders = ['Male', 'Female', 'Other'];

  const handleSignUp = async () => {
    if (!form.email || !form.password) {
      Alert.alert('Missing fields', 'Email and password are required.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }
    setLoading(true);
    const { error } = await signUp(form.email.trim(), form.password, {
      full_name: form.name,
      phone: form.phone,
      age: form.age,
      gender: selectedGender,
    });
    setLoading(false);
    if (error) {
      Alert.alert('Sign Up Failed', error.message);
    } else {
      Alert.alert('Check your email', 'A confirmation link has been sent to your email address.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    }
  };

  return (
    <LinearGradient colors={Gradients.bg} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join CareLink for better healthcare access</Text>
          </View>

          <View style={styles.form}>
            <Input label="Full Name" placeholder="Enter your full name" value={form.name} onChangeText={(v) => updateField('name', v)}
              icon={<Ionicons name="person-outline" size={20} color={Colors.textMuted} />} />
            <Input label="Age" placeholder="e.g. 28" value={form.age} onChangeText={(v) => updateField('age', v)}
              keyboardType="numeric" icon={<Ionicons name="calendar-outline" size={20} color={Colors.textMuted} />} />

            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderRow}>
              {genders.map((g) => (
                <TouchableOpacity
                  key={g}
                  onPress={() => setSelectedGender(g)}
                  style={[styles.genderChip, selectedGender === g && styles.genderChipActive]}
                >
                  <Text style={[styles.genderText, selectedGender === g && styles.genderTextActive]}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Input label="Phone Number" placeholder="Enter phone number" value={form.phone}
              onChangeText={(v) => updateField('phone', v)} keyboardType="phone-pad"
              icon={<Ionicons name="call-outline" size={20} color={Colors.textMuted} />} />
            <Input label="Email" placeholder="Enter email address" value={form.email}
              onChangeText={(v) => updateField('email', v)} keyboardType="email-address"
              autoCapitalize="none"
              icon={<Ionicons name="mail-outline" size={20} color={Colors.textMuted} />} />
            <Input label="Create Password" placeholder="Min 6 characters" value={form.password}
              onChangeText={(v) => updateField('password', v)} secureTextEntry
              icon={<Ionicons name="lock-closed-outline" size={20} color={Colors.textMuted} />} />
            <Input label="Confirm Password" placeholder="Re-enter password" value={form.confirmPassword}
              onChangeText={(v) => updateField('confirmPassword', v)} secureTextEntry
              icon={<Ionicons name="shield-checkmark-outline" size={20} color={Colors.textMuted} />} />

            <Button title="Create Account" onPress={handleSignUp} loading={loading} size="lg" style={{ marginTop: Spacing.md }} />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.xl, paddingTop: 60 },
  header: { marginBottom: Spacing.xl },
  title: { fontSize: FontSizes.xxl, fontWeight: FontWeights.bold, color: Colors.textPrimary },
  subtitle: { fontSize: FontSizes.base, color: Colors.textMuted, marginTop: 4 },
  form: { marginBottom: Spacing.xl },
  label: { fontSize: FontSizes.sm, color: Colors.textSecondary, marginBottom: Spacing.xs, fontWeight: '500' },
  genderRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.base },
  genderChip: {
    flex: 1, paddingVertical: Spacing.md, alignItems: 'center',
    borderRadius: Radius.pill, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surface,
  },
  genderChipActive: { borderColor: Colors.accent, backgroundColor: Colors.accentLight },
  genderText: { fontSize: FontSizes.md, color: Colors.textSecondary, fontWeight: FontWeights.medium },
  genderTextActive: { color: Colors.accent },
  footer: { flexDirection: 'row', justifyContent: 'center', paddingBottom: Spacing.xxl },
  footerText: { fontSize: FontSizes.md, color: Colors.textSecondary },
  footerLink: { fontSize: FontSizes.md, color: Colors.accent, fontWeight: FontWeights.semiBold },
});
