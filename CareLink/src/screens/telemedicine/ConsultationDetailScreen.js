import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button, Badge, Card } from '../../components/common';
import { useLanguage } from '../../i18n';

export default function ConsultationDetailScreen({ navigation, route }) {
  const { t } = useLanguage();
  const c = route?.params?.consultation || {};

  const modeIcons = { video: 'videocam', audio: 'call', text: 'chatbubbles' };

  return (
    <View style={styles.container}>
      <Header title={t('telemedicine.consultationDetail')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Status Banner */}
        <View style={[styles.banner, c.status === 'completed' ? { backgroundColor: '#E8F8E8' } : { backgroundColor: '#FDE8E8' }]}>
          <Ionicons name={c.status === 'completed' ? 'checkmark-circle' : 'close-circle'} size={24}
            color={c.status === 'completed' ? Colors.success : Colors.error} />
          <Text style={[styles.bannerText, { color: c.status === 'completed' ? Colors.success : Colors.error }]}>
            {c.status === 'completed' ? 'Consultation Completed' : 'Consultation Cancelled'}
          </Text>
        </View>

        {/* Doctor Card */}
        <View style={[styles.docCard, Shadows.soft]}>
          <View style={[styles.modeIcon, { backgroundColor: c.mode === 'video' ? Colors.accent : c.mode === 'audio' ? Colors.success : Colors.amberMid }]}>
            <Ionicons name={modeIcons[c.mode] || 'videocam'} size={22} color={Colors.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.docName}>{c.doctor || 'Dr. Priya Sharma'}</Text>
            <Text style={styles.docSpec}>{c.specialty || 'General Physician'}</Text>
          </View>
        </View>

        {/* Details Grid */}
        <View style={styles.detailGrid}>
          <View style={[styles.detailItem, Shadows.soft]}>
            <Ionicons name="calendar" size={20} color={Colors.accent} />
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{c.date || '15 Jan 2025'}</Text>
          </View>
          <View style={[styles.detailItem, Shadows.soft]}>
            <Ionicons name="time" size={20} color={Colors.amberMid} />
            <Text style={styles.detailLabel}>Duration</Text>
            <Text style={styles.detailValue}>15 min</Text>
          </View>
          <View style={[styles.detailItem, Shadows.soft]}>
            <Ionicons name={modeIcons[c.mode] || 'videocam'} size={20} color={Colors.success} />
            <Text style={styles.detailLabel}>Mode</Text>
            <Text style={styles.detailValue}>{(c.mode || 'Video').charAt(0).toUpperCase() + (c.mode || 'video').slice(1)}</Text>
          </View>
          <View style={[styles.detailItem, Shadows.soft]}>
            <Ionicons name="cash" size={20} color={Colors.info} />
            <Text style={styles.detailLabel}>Fee</Text>
            <Text style={styles.detailValue}>₹200</Text>
          </View>
        </View>

        {/* Diagnosis */}
        {c.diagnosis ? (
          <Card title="Diagnosis">
            <Badge label={c.diagnosis} variant="info" />
            <Text style={styles.diagNote}>
              Diagnosed during consultation. See prescription for treatment plan.
            </Text>
          </Card>
        ) : null}

        {/* Prescription */}
        {c.status === 'completed' ? (
          <Card title="Prescription">
            <View style={styles.rxRow}>
              <View style={styles.rxIcon}>
                <Ionicons name="document-text" size={20} color={Colors.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rxTitle}>Digital Prescription</Text>
                <Text style={styles.rxSub}>Issued on {c.date}</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('PrescriptionView')}>
                <Ionicons name="open-outline" size={20} color={Colors.accent} />
              </TouchableOpacity>
            </View>
          </Card>
        ) : null}

        {/* Notes */}
        <Card title="Doctor's Notes">
          <Text style={styles.notesText}>
            Patient presented with tension headache. Advised rest and medication.
            Follow-up recommended in 7 days. Avoid prolonged screen time.
          </Text>
        </Card>

        {/* Actions */}
        {c.status === 'completed' && (
          <View style={styles.actions}>
            <Button title="Book Follow-up" variant="primary" size="lg"
              icon={<Ionicons name="refresh" size={18} color={Colors.white} />}
              onPress={() => navigation.navigate('FollowUpScheduling', { doctor: { name: c.doctor, specialty: c.specialty } })} />
            <Button title="Download Summary" variant="outline" size="lg"
              icon={<Ionicons name="download-outline" size={18} color={Colors.accent} />}
              onPress={() => {}} style={{ marginTop: Spacing.md }} />
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md },
  banner: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg, borderRadius: Radius.lg, marginBottom: Spacing.md, gap: Spacing.sm,
  },
  bannerText: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold },
  docCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.xl, padding: Spacing.lg, marginBottom: Spacing.lg,
  },
  modeIcon: {
    width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center',
    marginRight: Spacing.md,
  },
  docName: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.textPrimary },
  docSpec: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, marginBottom: Spacing.lg },
  detailItem: {
    width: '47%', backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.lg, alignItems: 'center',
  },
  detailLabel: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: Spacing.sm },
  detailValue: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold, color: Colors.textPrimary, marginTop: 4 },
  diagNote: { fontSize: FontSizes.sm, color: Colors.textSecondary, marginTop: Spacing.sm, lineHeight: 20 },
  rxRow: { flexDirection: 'row', alignItems: 'center' },
  rxIcon: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.bgSecondary,
    justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md,
  },
  rxTitle: { fontSize: FontSizes.md, fontWeight: FontWeights.medium, color: Colors.textPrimary },
  rxSub: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
  notesText: { fontSize: FontSizes.sm, color: Colors.textSecondary, lineHeight: 20 },
  actions: { marginTop: Spacing.md },
});
