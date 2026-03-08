import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Gradients } from '../../theme';
import { Button, Input } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { t } = useLanguage();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('auth.missingFields'), t('auth.enterEmailPassword'));
      return;
    }
    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);
    if (error) {
      Alert.alert(t('auth.loginFailed'), error.message);
    }
    // Navigation is handled automatically by auth state change in AppNavigator
  };

  return (
    <LinearGradient colors={Gradients.bg} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Text style={{ fontSize: 36 }}>💙</Text>
            </View>
            <Text style={styles.title}>{t('auth.welcomeBack')}</Text>
            <Text style={styles.subtitle}>{t('auth.signInContinue')}</Text>
          </View>

          <View style={styles.form}>
            <Input
              label={t('auth.email')}
              placeholder={t('auth.emailPlaceholder')}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              icon={<Ionicons name="mail-outline" size={20} color={Colors.textMuted} />}
            />
            <Input
              label={t('auth.password')}
              placeholder={t('auth.passwordPlaceholder')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              icon={<Ionicons name="lock-closed-outline" size={20} color={Colors.textMuted} />}
            />

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotBtn}>
              <Text style={styles.forgotText}>{t('auth.forgotPassword')}</Text>
            </TouchableOpacity>

            <Button
              title={t('auth.signIn')}
              onPress={handleLogin}
              loading={loading}
              size="lg"
              style={styles.loginBtn}
            />

            <View style={styles.divider}>
              <View style={styles.line} />
              <Text style={styles.orText}>{t('common.or')}</Text>
              <View style={styles.line} />
            </View>

            <Button
              title={t('auth.signInBiometrics')}
              variant="secondary"
              onPress={() => {}}
              size="lg"
              icon={<Ionicons name="finger-print-outline" size={22} color={Colors.accent} />}
              style={styles.bioBtn}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('auth.noAccount')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.footerLink}>{t('auth.signUp')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.xl, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: Spacing.xxl },
  logoCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.base,
    shadowColor: '#6B6BCC', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 16, elevation: 4,
  },
  title: { fontSize: FontSizes.xxl, fontWeight: FontWeights.bold, color: Colors.textPrimary },
  subtitle: { fontSize: FontSizes.base, color: Colors.textMuted, marginTop: 4 },
  form: { marginBottom: Spacing.xl },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: Spacing.lg },
  forgotText: { fontSize: FontSizes.sm, color: Colors.accent, fontWeight: FontWeights.medium },
  loginBtn: { width: '100%', marginBottom: Spacing.lg },
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.lg },
  line: { flex: 1, height: 1, backgroundColor: Colors.border },
  orText: { marginHorizontal: Spacing.md, color: Colors.textMuted, fontSize: FontSizes.sm },
  bioBtn: { width: '100%' },
  footer: { flexDirection: 'row', justifyContent: 'center', paddingBottom: Spacing.xxl },
  footerText: { fontSize: FontSizes.md, color: Colors.textSecondary },
  footerLink: { fontSize: FontSizes.md, color: Colors.accent, fontWeight: FontWeights.semiBold },
});
