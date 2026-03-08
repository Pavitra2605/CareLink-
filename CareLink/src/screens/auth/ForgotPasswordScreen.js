import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Gradients } from '../../theme';
import { Button, Input } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();
  const { t } = useLanguage();

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert(t('auth.missingField'), t('auth.enterEmail'));
      return;
    }
    setLoading(true);
    const { error } = await resetPassword(email.trim());
    setLoading(false);
    if (error) {
      Alert.alert(t('common.error'), error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <LinearGradient colors={Gradients.bg} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Ionicons name="key-outline" size={48} color={Colors.accent} style={{ marginBottom: Spacing.base }} />
          <Text style={styles.title}>{sent ? t('auth.emailSent') : t('auth.forgotPasswordTitle')}</Text>
          <Text style={styles.subtitle}>
            {sent
              ? `${t('auth.resetLinkSent')} ${email}`
              : t('auth.enterEmailReset')}
          </Text>
        </View>

        <View style={styles.form}>
          {!sent ? (
            <>
              <Input
                label={t('auth.email')}
                placeholder={t('auth.emailPlaceholder')}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                icon={<Ionicons name="mail-outline" size={20} color={Colors.textMuted} />}
              />
              <Button title={t('auth.sendResetLink')} onPress={handleResetPassword} loading={loading} size="lg" />
            </>
          ) : (
            <Button title={t('auth.backToLogin')} onPress={() => navigation.navigate('Login')} size="lg" />
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
