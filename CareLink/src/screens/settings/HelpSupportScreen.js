import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Card, SearchBar } from '../../components/common';
import { useLanguage } from '../../i18n';

export default function HelpSupportScreen({ navigation }) {
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState('');
  const { t } = useLanguage();

  const faqs = [
    { q: t('helpSupport.faqBookConsult'), a: t('helpSupport.faqBookConsultA') },
    { q: t('helpSupport.faqDataSafe'), a: t('helpSupport.faqDataSafeA') },
    { q: t('helpSupport.faqPharmacy'), a: t('helpSupport.faqPharmacyA') },
    { q: t('helpSupport.faqOffline'), a: t('helpSupport.faqOfflineA') },
    { q: t('helpSupport.faqLanguage'), a: t('helpSupport.faqLanguageA') },
  ];

  const contactOptions = [
    { icon: 'call', label: t('helpSupport.callSupport'), desc: t('helpSupport.callDesc'), action: () => Linking.openURL('tel:1800123456') },
    { icon: 'chatbubble', label: t('helpSupport.chatWithUs'), desc: t('helpSupport.chatDesc'), action: () => {} },
    { icon: 'mail', label: t('helpSupport.emailLabel'), desc: t('helpSupport.emailDesc'), action: () => Linking.openURL('mailto:support@carelink.in') },
  ];

  const filteredFaqs = faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={styles.container}>
      <Header title={t('helpSupport.title')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <SearchBar value={search} onChangeText={setSearch} placeholder={t('helpSupport.searchPlaceholder')} />

        <Text style={styles.sectionLabel}>{t('helpSupport.faq')}</Text>
        {filteredFaqs.map((faq, i) => (
          <TouchableOpacity key={i} style={[styles.faqCard, Shadows.soft]}
            onPress={() => setExpanded(expanded === i ? null : i)} activeOpacity={0.7}>
            <View style={styles.faqHeader}>
              <Text style={styles.faqQ}>{faq.q}</Text>
              <Ionicons name={expanded === i ? 'chevron-up' : 'chevron-down'} size={18} color={Colors.textMuted} />
            </View>
            {expanded === i && <Text style={styles.faqA}>{faq.a}</Text>}
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionLabel}>{t('helpSupport.contactUs')}</Text>
        {contactOptions.map((opt, i) => (
          <TouchableOpacity key={i} style={[styles.contactCard, Shadows.soft]}
            onPress={opt.action} activeOpacity={0.7}>
            <View style={styles.contactIcon}>
              <Ionicons name={opt.icon} size={22} color={Colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactLabel}>{opt.label}</Text>
              <Text style={styles.contactDesc}>{opt.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  content: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.lg, paddingBottom: 60 },
  sectionLabel: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold, color: Colors.textPrimary, marginTop: Spacing.lg, marginBottom: Spacing.sm },
  faqCard: { backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.lg, marginBottom: Spacing.sm },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQ: { fontSize: FontSizes.md, fontWeight: FontWeights.medium, color: Colors.textPrimary, flex: 1, marginRight: Spacing.sm },
  faqA: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: Spacing.sm, lineHeight: 20 },
  contactCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.lg, marginBottom: Spacing.sm,
  },
  contactIcon: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.accent + '15',
    justifyContent: 'center', alignItems: 'center',
  },
  contactLabel: { fontSize: FontSizes.md, fontWeight: FontWeights.medium, color: Colors.textPrimary },
  contactDesc: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
});
