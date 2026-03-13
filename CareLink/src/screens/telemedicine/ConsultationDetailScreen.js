import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button, Badge, Card } from '../../components/common';
import { useLanguage } from '../../i18n';
import { getConsultationById } from '../../services/careService';

const modeIcons = { video: 'videocam', audio: 'call', text: 'chatbubbles' };

const formatDate = (iso) => {
  if (!iso) return '--';
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function ConsultationDetailScreen({ navigation, route }) {
  const { t } = useLanguage();
  const { consultationId, consultation: initial } = route?.params || {};
  const [consultation, setConsultation] = useState(initial || null);
  const [loading, setLoading] = useState(!initial?.doctor);

  useEffect(() => {
    const id = consultationId || initial?.id;
    if (id && !initial?.doctor) {
      getConsultationById(id)
        .then(setConsultation)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, []);

  if (loading || !consultation) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  const c = consultation;
  const appt = c.appointment || {};
  const doctor = c.doctor || {};
  const prescription = c.prescription;
  const modeVal = appt.mode || 'video';
  const modeColor = modeVal === 'video' ? Colors.accent : modeVal === 'audio' ? Colors.success : Colors.amberMid;
  const dateStr = formatDate(c.created_at);

  const durationMs = c.started_at && c.ended_at
    ? new Date(c.ended_at) - new Date(c.started_at)
    : null;
  const durationMins = durationMs ? Math.round(durationMs / 60000) : null;

  return (
    <View style={styles.container}>
      <Header title={t('telemedicine.consultationDetail')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Status Banner */}
        <View style={[
          styles.banner,
          c.status === 'completed'
            ? { backgroundColor: '#E8F8E8' }
            : c.status === 'active'
            ? { backgroundColor: '#E8F0FF' }
            : { backgroundColor: '#FDE8E8' },
        ]}>
          <Ionicons
            name={c.status === 'completed' ? 'checkmark-circle' : c.status === 'active' ? 'time' : 'close-circle'}
            size={24}
            color={c.status === 'completed' ? Colors.success : c.status === 'active' ? Colors.accent : Colors.error}
          />
          <Text style={[styles.bannerText, {
            color: c.status === 'completed' ? Colors.success : c.status === 'active' ? Colors.accent : Colors.error,
          }]}>
            {c.status === 'completed' ? 'Consultation Completed' : c.status === 'active' ? 'Consultation Active' : 'Consultation Cancelled'}
          </Text>
        </View>

        {/* Doctor Card */}
        <View style={[styles.docCard, Shadows.soft]}>
          <View style={[styles.modeIcon, { backgroundColor: modeColor }]}>
            <Ionicons name={modeIcons[modeVal]} size={22} color={Colors.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.docName}>{doctor.full_name || 'Doctor'}</Text>
            <Text style={styles.docSpec}>{doctor.specialty || ''}</Text>
          </View>
        </View>

        {/* Detail Grid */}
        <View style={styles.detailGrid}>
          <View style={[styles.detailItem, Shadows.soft]}>
            <Ionicons name="calendar" size={20} color={Colors.accent} />
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{dateStr}</Text>
          </View>
          <View style={[styles.detailItem, Shadows.soft]}>
            <Ionicons name="time" size={20} color={Colors.amberMid} />
            <Text style={styles.detailLabel}>Duration</Text>
            <Text style={styles.detailValue}>{durationMins !== null ? `${durationMins} min` : '--'}</Text>
          </View>
          <View style={[styles.detailItem, Shadows.soft]}>
            <Ionicons name={modeIcons[modeVal]} size={20} color={Colors.success} />
            <Text style={styles.detailLabel}>Mode</Text>
            <Text style={styles.detailValue}>{modeVal.charAt(0).toUpperCase() + modeVal.slice(1)}</Text>
          </View>
          <View style={[styles.detailItem, Shadows.soft]}>
            <Ionicons name="cash" size={20} color={Colors.info} />
            <Text style={styles.detailLabel}>Fee</Text>
            <Text style={styles.detailValue}>
              {doctor.consultation_fee ? `Rs.${doctor.consultation_fee}` : '--'}
            </Text>
          </View>
        </View>

        {/* Symptoms */}
        {c.symptoms ? (
          <Card title="Symptoms">
            <Text style={styles.notesText}>{c.symptoms}</Text>
          </Card>
        ) : null}

        {/* Diagnosis */}
        {c.diagnosis ? (
          <Card title="Diagnosis">
            <Badge label={c.diagnosis} variant="info" />
            <Text style={styles.diagNote}>
              Diagnosed during consultation. See prescription for treatment plan.
            </Text>
          </Card>
        ) : null}

        {/* Doctor's Notes */}
        {c.notes ? (
          <Card title="Doctor's Notes">
            <Text style={styles.notesText}>{c.notes}</Text>
          </Card>
        ) : null}

        {/* Follow-up */}
        {c.follow_up_date ? (
          <Card title="Follow-up">
            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={18} color={Colors.accent} />
              <Text style={[styles.notesText, { marginLeft: 8 }]}>
                Recommended on {formatDate(c.follow_up_date)}
              </Text>
            </View>
          </Card>
        ) : null}

        {/* Prescription */}
        {prescription ? (
          <Card title="Prescription">
            <View style={styles.rxRow}>
              <View style={styles.rxIcon}>
                <Ionicons name="document-text" size={20} color={Colors.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rxTitle}>Digital Prescription</Text>
                <Text style={styles.rxSub}>
                  Issued on {formatDate(prescription.created_at)}
                  {prescription.is_fulfilled ? ' · Fulfilled' : ''}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('PrescriptionView', {
                  prescriptionId: prescription.id,
                  doctor,
                })}
              >
                <Ionicons name="open-outline" size={20} color={Colors.accent} />
              </TouchableOpacity>
            </View>
          </Card>
        ) : null}

        {/* Actions */}
        {c.status === 'completed' && (
          <View style={styles.actions}>
            <Button
              title="Book Follow-up"
              variant="primary"
              size="lg"
              icon={<Ionicons name="refresh" size={18} color={Colors.white} />}
              onPress={() => navigation.navigate('AppointmentBooking', { doctor: { ...doctor, id: c.doctor_id }, mode: 'video' })}
            />
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
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.xs },
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
