import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Gradients, Shadows } from '../../theme';
import { Button } from '../../components/common';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../i18n';

export default function LanguageSelectionScreen({ navigation }) {
  const { locale, setLocale, t } = useLanguage();
  const [selected, setSelected] = useState(locale);

  const handleContinue = async () => {
    await setLocale(selected);
    navigation.replace('Onboarding');
  };

  return (
    <LinearGradient colors={Gradients.bg} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('language.chooseLanguage')}</Text>
        <Text style={styles.subtitle}>{t('language.selectPreferred')}</Text>
      </View>

      <FlatList
        data={SUPPORTED_LANGUAGES}
        keyExtractor={(item) => item.code}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelected(item.code)}
            style={[
              styles.langItem,
              Shadows.soft,
              selected === item.code && styles.langItemActive,
            ]}
          >
            <Text style={styles.langIcon}>{item.icon}</Text>
            <View style={styles.langInfo}>
              <Text style={styles.langLabel}>{item.name}</Text>
              <Text style={styles.langNative}>{item.native}</Text>
            </View>
            {selected === item.code && (
              <Ionicons name="checkmark-circle" size={24} color={Colors.accent} />
            )}
          </TouchableOpacity>
        )}
      />

      <View style={styles.footer}>
        <Button
          title={t('common.continue')}
          onPress={handleContinue}
          size="lg"
          style={{ width: '100%' }}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 80,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: FontSizes.base,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  list: {
    paddingHorizontal: Spacing.xl,
  },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.transparent,
  },
  langItemActive: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accentLight,
  },
  langIcon: {
    fontSize: 28,
    marginRight: Spacing.md,
  },
  langInfo: {
    flex: 1,
  },
  langLabel: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semiBold,
    color: Colors.textPrimary,
  },
  langNative: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  footer: {
    padding: Spacing.xl,
  },
});
