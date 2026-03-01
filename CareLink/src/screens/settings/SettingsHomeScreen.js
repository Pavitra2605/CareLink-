import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header } from '../../components/common';

const sections = [
  {
    title: 'Account',
    items: [
      { icon: 'person-circle', label: 'Profile Settings', screen: 'ProfileSettings', color: Colors.accent },
      { icon: 'language', label: 'Language', screen: 'LanguageSettings', color: '#3498DB' },
      { icon: 'notifications', label: 'Notifications', screen: 'NotificationPrefs', color: Colors.amberMid },
    ],
  },
  {
    title: 'Privacy & Security',
    items: [
      { icon: 'shield-checkmark', label: 'Privacy Settings', screen: 'PrivacySettings', color: Colors.success },
      { icon: 'lock-closed', label: 'Change Password', screen: null, color: '#9B59B6' },
      { icon: 'finger-print', label: 'Biometric Lock', screen: null, color: '#E67E22' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: 'help-circle', label: 'Help & Support', screen: 'HelpSupport', color: Colors.accent },
      { icon: 'information-circle', label: 'About CareLink', screen: 'AboutApp', color: '#2ECC71' },
      { icon: 'chatbubble-ellipses', label: 'Send Feedback', screen: 'Feedback', color: '#E74C3C' },
    ],
  },
];

export default function SettingsHomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Header title="Settings" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile preview */}
        <TouchableOpacity style={[styles.profileCard, Shadows.soft]}
          onPress={() => navigation.navigate('ProfileSettings')} activeOpacity={0.7}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AK</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>Anitha K.</Text>
            <Text style={styles.phone}>+91 98765 43210</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
        </TouchableOpacity>

        {sections.map((section, si) => (
          <View key={si} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={[styles.sectionCard, Shadows.soft]}>
              {section.items.map((item, ii) => (
                <TouchableOpacity key={ii}
                  style={[styles.row, ii < section.items.length - 1 && styles.rowBorder]}
                  onPress={() => item.screen && navigation.navigate(item.screen)} activeOpacity={0.7}>
                  <View style={[styles.iconCircle, { backgroundColor: item.color + '15' }]}>
                    <Ionicons name={item.icon} size={20} color={item.color} />
                  </View>
                  <Text style={styles.rowLabel}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.navigate('Login')}>
          <Ionicons name="log-out" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>CareLink v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  content: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.lg, paddingBottom: 60 },
  profileCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.lg,
  },
  avatar: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.accent,
    justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md,
  },
  avatarText: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.white },
  name: { fontSize: FontSizes.lg, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  phone: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
  section: { marginBottom: Spacing.lg },
  sectionTitle: { fontSize: FontSizes.sm, fontWeight: FontWeights.semiBold, color: Colors.textMuted, textTransform: 'uppercase', marginBottom: Spacing.sm, letterSpacing: 0.5 },
  sectionCard: { backgroundColor: Colors.surface, borderRadius: Radius.lg, overflow: 'hidden' },
  row: {
    flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, gap: Spacing.md,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  iconCircle: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  rowLabel: { flex: 1, fontSize: FontSizes.base, color: Colors.textPrimary },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, paddingVertical: Spacing.lg,
  },
  logoutText: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold, color: Colors.error },
  version: { fontSize: FontSizes.sm, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.sm },
});
