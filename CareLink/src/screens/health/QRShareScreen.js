import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n';

export default function QRShareScreen({ navigation }) {
  const { t } = useLanguage();
  const { user, profile } = useAuth();

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  // Generate a stable short ID from the user UUID
  const shortId = user?.id ? user.id.replace(/-/g, '').slice(0, 8).toUpperCase() : '00000000';
  const healthId = `CARELINK-${new Date().getFullYear()}-${shortId}`;

  const handleShare = async () => {
    try {
      const slug = displayName.toLowerCase().replace(/\s+/g, '-');
      await Share.share({ message: `CareLink Health Profile: https://carelink.health/profile/${slug}` });
    } catch (e) {}
  };

  return (
    <View style={styles.container}>
      <Header title={t('health.qrShare')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* QR Code Placeholder */}
        <View style={[styles.qrCard, Shadows.soft]}>
          <Text style={styles.title}>Your Health QR Code</Text>
          <Text style={styles.subtitle}>Show this to healthcare providers for quick access to your health records.</Text>

          <View style={styles.qrPlaceholder}>
            <Ionicons name="qr-code" size={160} color={Colors.accent} />
          </View>

          <Text style={styles.patientName}>{displayName}</Text>
          <Text style={styles.healthId}>{healthId}</Text>
        </View>

        {/* Info Cards */}
        <View style={styles.infoGrid}>
          <View style={[styles.infoItem, Shadows.soft]}>
            <Ionicons name="shield-checkmark" size={24} color={Colors.success} />
            <Text style={styles.infoTitle}>Encrypted</Text>
            <Text style={styles.infoSub}>Data is encrypted in transit</Text>
          </View>
          <View style={[styles.infoItem, Shadows.soft]}>
            <Ionicons name="time" size={24} color={Colors.amberMid} />
            <Text style={styles.infoTitle}>Temporary</Text>
            <Text style={styles.infoSub}>QR expires in 15 minutes</Text>
          </View>
        </View>

        {/* What's shared */}
        <View style={[styles.sharedCard, Shadows.soft]}>
          <Text style={styles.sharedTitle}>Information Shared</Text>
          {['Basic Profile', 'Blood Group', 'Allergies', 'Current Medications', 'Recent Vitals'].map((item, i) => (
            <View key={i} style={styles.sharedRow}>
              <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
              <Text style={styles.sharedText}>{item}</Text>
            </View>
          ))}
          <View style={styles.sharedRow}>
            <Ionicons name="close-circle" size={18} color={Colors.error} />
            <Text style={styles.sharedText}>Full Medical History (not shared)</Text>
          </View>
        </View>

        {/* Actions */}
        <Button title="Share QR Code" variant="primary" size="lg"
          icon={<Ionicons name="share-social" size={18} color={Colors.white} />}
          onPress={handleShare} />
        <Button title="Regenerate Code" variant="outline" size="lg"
          icon={<Ionicons name="refresh" size={18} color={Colors.accent} />}
          onPress={() => {}} style={{ marginTop: Spacing.md }} />
        <Button title="Manage Shared Data" variant="secondary" size="md"
          onPress={() => navigation.navigate('DataAccess')} style={{ marginTop: Spacing.md }} />

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md },
  qrCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.xl,
    alignItems: 'center', marginBottom: Spacing.lg,
  },
  title: { fontSize: FontSizes.xl, fontWeight: FontWeights.bold, color: Colors.textPrimary },
  subtitle: { fontSize: FontSizes.sm, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.xs, marginBottom: Spacing.lg },
  qrPlaceholder: {
    width: 200, height: 200, justifyContent: 'center', alignItems: 'center',
    backgroundColor: Colors.bgPrimary, borderRadius: Radius.lg, marginBottom: Spacing.lg,
  },
  patientName: { fontSize: FontSizes.lg, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  healthId: { fontSize: FontSizes.sm, color: Colors.accent, marginTop: 4, fontFamily: 'monospace' },
  infoGrid: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.lg },
  infoItem: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.lg, alignItems: 'center',
  },
  infoTitle: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold, color: Colors.textPrimary, marginTop: Spacing.sm },
  infoSub: { fontSize: FontSizes.xs, color: Colors.textMuted, textAlign: 'center', marginTop: 4 },
  sharedCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sharedTitle: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.textPrimary, marginBottom: Spacing.md },
  sharedRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 6 },
  sharedText: { fontSize: FontSizes.md, color: Colors.textSecondary },
});
