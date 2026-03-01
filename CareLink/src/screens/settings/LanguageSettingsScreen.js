import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button } from '../../components/common';

const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
];

export default function LanguageSettingsScreen({ navigation }) {
  const [selected, setSelected] = useState('en');

  return (
    <View style={styles.container}>
      <Header title="Language" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.info}>Select your preferred language. The app interface will update accordingly.</Text>
        {languages.map(lang => (
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
        <Button label="Apply Language" onPress={() => navigation.goBack()} style={{ marginTop: Spacing.xl }} />
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
