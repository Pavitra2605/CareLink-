import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Card, SearchBar } from '../../components/common';

const faqs = [
  { q: 'How do I book a teleconsultation?', a: 'Go to Home > Consult Doctor, select a specialty, choose a doctor, and pick a time slot.' },
  { q: 'Is my health data safe?', a: 'Yes. All data is encrypted end-to-end and stored securely following healthcare data protection standards.' },
  { q: 'How do I find nearby pharmacies?', a: 'Use the Medicine tab to search for a medicine. Available pharmacies with stock and prices will be shown.' },
  { q: 'Can I use CareLink offline?', a: 'Basic features like viewing saved records and first-aid guides work offline. Data syncs when you reconnect.' },
  { q: 'How to change my language?', a: 'Go to Settings > Language and select your preferred language.' },
];

const contactOptions = [
  { icon: 'call', label: 'Call Support', desc: 'Toll-free: 1800-XXX-XXXX', action: () => Linking.openURL('tel:1800123456') },
  { icon: 'chatbubble', label: 'Chat with Us', desc: 'Available 9 AM - 6 PM', action: () => {} },
  { icon: 'mail', label: 'Email', desc: 'support@carelink.in', action: () => Linking.openURL('mailto:support@carelink.in') },
];

export default function HelpSupportScreen({ navigation }) {
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState('');

  const filteredFaqs = faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={styles.container}>
      <Header title="Help & Support" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search help topics..." />

        <Text style={styles.sectionLabel}>Frequently Asked Questions</Text>
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

        <Text style={styles.sectionLabel}>Contact Us</Text>
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
