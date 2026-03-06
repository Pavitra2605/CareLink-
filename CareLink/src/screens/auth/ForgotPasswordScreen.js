import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Gradients } from '../../theme';
import { Button, Input } from '../../components/common';
import { useAuth } from '../../context/AuthContext';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Missing field', 'Please enter your email address.');
      return;
    }
    setLoading(true);
    const { error } = await resetPassword(email.trim());
    setLoading(false);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <LinearGradient colors={Gradients.bg} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Ionicons name="key-outline" size={48} color={Colors.accent} style={{ marginBottom: Spacing.base }} />
          <Text style={styles.title}>{sent ? 'Email Sent!' : 'Forgot Password'}</Text>
          <Text style={styles.subtitle}>
            {sent
              ? `A password reset link has been sent to ${email}`
              : 'Enter your email address to receive a reset link'}
          </Text>
        </View>

        <View style={styles.form}>
          {!sent ? (
            <>
              <Input
                label="Email"
                placeholder="Enter your email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                icon={<Ionicons name="mail-outline" size={20} color={Colors.textMuted} />}
              />
              <Button title="Send Reset Link" onPress={handleResetPassword} loading={loading} size="lg" />
            </>
          ) : (
            <Button title="Back to Login" onPress={() => navigation.navigate('Login')} size="lg" />
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.xl, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: Spacing.xxl },
  title: { fontSize: FontSizes.xxl, fontWeight: FontWeights.bold, color: Colors.textPrimary },
  subtitle: { fontSize: FontSizes.base, color: Colors.textMuted, marginTop: 4, textAlign: 'center' },
  form: {},
});
