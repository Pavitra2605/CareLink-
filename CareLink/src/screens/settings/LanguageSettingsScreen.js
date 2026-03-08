import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button } from '../../components/common';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../i18n';

export default function LanguageSettingsScreen({ navigation }) {
  const { locale, setLocale, t } = useLanguage();
  const [selected, setSelected] = useState(locale);

  const handleApply = async () => {
    await setLocale(selected);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header title={t('languageSettings.title')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.info}>{t('languageSettings.info')}</Text>
        {SUPPORTED_LANGUAGES.map(lang => (
          <TouchableOpacity key={lang.code}
            style={[styles.langCard, selected === lang.code && styles.langActive, Shadows.soft]}
            onPress={() => setSelected(lang.code)} activeOpacity={0.7}>
            <Ionicons name={selected === lang.code ? 'radio-button-on' : 'radio-button-off'}
              size={22} color={selected === lang.code ? Colors.accent : Colors.textMuted} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.langName, selected === lang.code && { color: Colors.accent }]}>{lang.name}</Text>
              <Text style={styles.langNative}>{lang.native}</Text>
            </View>
            {selected === lang.code && <Ionicons name="checkmark-circle" size={22} color={Colors.accent} />}
          </TouchableOpacity>
        ))}
        <Button label={t('languageSettings.applyLanguage')} onPress={handleApply} style={{ marginTop: Spacing.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  content: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.lg, paddingBottom: 60 },
  info: { fontSize: FontSizes.md, color: Colors.textMuted, marginBottom: Spacing.lg, lineHeight: 22 },
  langCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.lg,
    marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border,
  },
  langActive: { borderColor: Colors.accent, backgroundColor: Colors.accent + '08' },
  langName: { fontSize: FontSizes.base, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  langNative: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
});
