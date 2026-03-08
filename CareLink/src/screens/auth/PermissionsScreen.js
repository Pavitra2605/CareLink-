import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Gradients, Shadows } from '../../theme';
import { Button } from '../../components/common';
import { useLanguage } from '../../i18n';

export default function PermissionsScreen({ navigation }) {
  const [perms, setPerms] = useState({ location: true, camera: true, microphone: true, storage: true, notifications: true });
  const { t } = useLanguage();

  const PERMISSIONS = [
    { key: 'location', icon: 'location', title: t('permissions.location'), desc: t('permissions.locationDesc') },
    { key: 'camera', icon: 'camera', title: t('permissions.camera'), desc: t('permissions.cameraDesc') },
    { key: 'microphone', icon: 'mic', title: t('permissions.microphone'), desc: t('permissions.microphoneDesc') },
    { key: 'storage', icon: 'folder', title: t('permissions.storage'), desc: t('permissions.storageDesc') },
    { key: 'notifications', icon: 'notifications', title: t('permissions.notifications'), desc: t('permissions.notificationsDesc') },
  ];

  const toggle = (key) => setPerms({ ...perms, [key]: !perms[key] });

  return (
    <LinearGradient colors={Gradients.bg} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('permissions.title')}</Text>
          <Text style={styles.subtitle}>{t('permissions.subtitle')}</Text>
        </View>

        {PERMISSIONS.map((p) => (
          <View key={p.key} style={[styles.permItem, Shadows.soft]}>
            <View style={[styles.iconWrap, { backgroundColor: Colors.accent + '15' }]}>
              <Ionicons name={p.icon} size={22} color={Colors.accent} />
            </View>
            <View style={styles.permInfo}>
              <Text style={styles.permTitle}>{p.title}</Text>
              <Text style={styles.permDesc}>{p.desc}</Text>
            </View>
            <Switch
              value={perms[p.key]}
              onValueChange={() => toggle(p.key)}
              trackColor={{ false: Colors.border, true: Colors.accent }}
              thumbColor={Colors.white}
            />
          </View>
        ))}

        <View style={styles.footer}>
          <Button title={t('common.continue')} onPress={() => navigation.replace('OnboardingTutorial')} size="lg" style={{ width: '100%' }} />
          <Button title={t('permissions.skipForNow')} variant="outline" onPress={() => navigation.replace('Main')} size="md"
            style={{ width: '100%', marginTop: Spacing.md }} />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.xl, paddingTop: 60 },
  header: { marginBottom: Spacing.xl },
  title: { fontSize: FontSizes.xxl, fontWeight: FontWeights.bold, color: Colors.textPrimary },
  subtitle: { fontSize: FontSizes.base, color: Colors.textMuted, marginTop: 4 },
  permItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.lg, padding: Spacing.base, marginBottom: Spacing.md,
  },
  iconWrap: {
    width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md,
  },
  permInfo: { flex: 1 },
  permTitle: { fontSize: FontSizes.base, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  permDesc: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 2 },
  footer: { marginTop: Spacing.xl, paddingBottom: Spacing.xxl },
});
