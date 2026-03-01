import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Gradients } from '../../theme';
import { Button, Input } from '../../components/common';

export default function ForgotPasswordScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: phone, 2: OTP, 3: new password
  const [loading, setLoading] = useState(false);

  const handleSendOTP = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(2); }, 1000);
  };
  const handleVerifyOTP = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(3); }, 1000);
  };
  const handleResetPassword = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); navigation.navigate('Login'); }, 1000);
  };

  return (
    <LinearGradient colors={Gradients.bg} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Ionicons name="key-outline" size={48} color={Colors.accent} style={{ marginBottom: Spacing.base }} />
          <Text style={styles.title}>
            {step === 1 ? 'Forgot Password' : step === 2 ? 'Enter OTP' : 'New Password'}
          </Text>
          <Text style={styles.subtitle}>
            {step === 1 ? 'Enter your phone number to receive a verification code' :
             step === 2 ? 'We sent a code to your phone' : 'Create your new password'}
          </Text>
        </View>

        <View style={styles.form}>
          {step === 1 && (
            <>
              <Input label="Phone Number" placeholder="Enter phone number" value={phone} onChangeText={setPhone}
                keyboardType="phone-pad" icon={<Ionicons name="call-outline" size={20} color={Colors.textMuted} />} />
              <Button title="Send OTP" onPress={handleSendOTP} loading={loading} size="lg" />
            </>
          )}
          {step === 2 && (
            <>
              <Input label="Verification Code" placeholder="Enter 6-digit OTP" value={otp} onChangeText={setOtp}
                keyboardType="numeric" icon={<Ionicons name="keypad-outline" size={20} color={Colors.textMuted} />} />
              <Button title="Verify OTP" onPress={handleVerifyOTP} loading={loading} size="lg" />
            </>
          )}
          {step === 3 && (
            <>
              <Input label="New Password" placeholder="Enter new password" value={newPassword}
                onChangeText={setNewPassword} secureTextEntry
                icon={<Ionicons name="lock-closed-outline" size={20} color={Colors.textMuted} />} />
              <Button title="Reset Password" onPress={handleResetPassword} loading={loading} size="lg" />
            </>
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
