import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button, Badge, Card } from '../../components/common';
import { useLanguage } from '../../i18n';
import { getDoctorById } from '../../services/careService';

export default function DoctorProfileScreen({ navigation, route }) {
  const { t } = useLanguage();
  const initialDoctor = route?.params?.doctor || {};
  const [doctor, setDoctor] = useState(initialDoctor);
  const [loading, setLoading] = useState(!initialDoctor.full_name);

  useEffect(() => {
    if (!doctor.full_name && doctor.id) {
      getDoctorById(doctor.id)
        .then(setDoctor)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={t('telemedicine.doctorProfile')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.profileCard, Shadows.soft]}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color={Colors.accent} />
            </View>
            <View style={[styles.dot, { backgroundColor: doctor.is_available ? Colors.success : Colors.textMuted }]} />
          </View>
          <Text style={styles.name}>{doctor.full_name}</Text>
          <Text style={styles.specialty}>{doctor.specialty}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="star" size={16} color={Colors.amberMid} />
              <Text style={styles.metaText}>{Number(doctor.rating || 0).toFixed(1)}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color={Colors.textMuted} />
              <Text style={styles.metaText}>{doctor.experience_years || 0} yrs exp</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="people-outline" size={16} color={Colors.textMuted} />
              <Text style={styles.metaText}>{doctor.total_consultations || 0} patients</Text>
            </View>
          </View>
          <View style={styles.feeRow}>
            <Ionicons name="cash-outline" size={16} color={Colors.success} />
            <Text style={styles.feeText}>Rs.{doctor.consultation_fee || 0} / session</Text>
          </View>
          <Badge
            label={doctor.is_available ? 'Available Now' : 'Offline'}
            variant={doctor.is_available ? 'success' : 'neutral'}
          />
        </View>

        {doctor.bio ? (
          <Card title="About">
            <Text style={styles.aboutText}>{doctor.bio}</Text>
          </Card>
        ) : null}

        {doctor.license_number ? (
          <Card title="License and Registration">
            <View style={styles.qualItem}>
              <Ionicons name="ribbon-outline" size={18} color={Colors.accent} />
              <Text style={styles.qualText}>Reg. No: {doctor.license_number}</Text>
            </View>
          </Card>
        ) : null}

        <Card title="Consultation Fee">
          <View style={styles.qualItem}>
            <Ionicons name="cash-outline" size={18} color={Colors.success} />
            <Text style={styles.qualText}>Rs.{doctor.consultation_fee || 0} per consultation</Text>
          </View>
        </Card>

        <View style={styles.actions}>
          <Button
            title="Video Consult"
            onPress={() => navigation.navigate('AppointmentBooking', { doctor, mode: 'video' })}
            size="lg"
            icon={<Ionicons name="videocam" size={20} color={Colors.white} />}
            style={{ flex: 1, marginRight: Spacing.sm }}
          />
          <Button
            title="Audio"
            onPress={() => navigation.navigate('AppointmentBooking', { doctor, mode: 'audio' })}
            variant="outline"
            size="lg"
            icon={<Ionicons name="call" size={20} color={Colors.btnSecondaryText} />}
            style={{ flex: 0.6 }}
          />
        </View>
        <Button
          title="Text Chat"
          variant="secondary"
          onPress={() => navigation.navigate('AppointmentBooking', { doctor, mode: 'text' })}
          size="lg"
          icon={<Ionicons name="chatbubbles-outline" size={20} color={Colors.accent} />}
          style={styles.chatBtn}
        />

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.xxl },
  profileCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.xl,
    alignItems: 'center', marginVertical: Spacing.md,
  },
  avatarWrap: { position: 'relative', marginBottom: Spacing.md },
  avatar: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.accentLight,
    alignItems: 'center', justifyContent: 'center',
  },
  dot: {
    width: 16, height: 16, borderRadius: 8, position: 'absolute', bottom: 2, right: 2,
    borderWidth: 3, borderColor: Colors.surface,
  },
  name: { fontSize: FontSizes.xl, fontWeight: FontWeights.bold, color: Colors.textPrimary },
  specialty: { fontSize: FontSizes.md, color: Colors.textMuted, marginTop: 4, marginBottom: Spacing.md },
  metaRow: { flexDirection: 'row', gap: Spacing.lg, marginBottom: Spacing.md },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: FontSizes.sm, color: Colors.textSecondary },
  feeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.md },
  feeText: { fontSize: FontSizes.md, color: Colors.success, fontWeight: FontWeights.semiBold },
  aboutText: { fontSize: FontSizes.md, color: Colors.textSecondary, lineHeight: 22 },
  qualItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  qualText: { fontSize: FontSizes.md, color: Colors.textSecondary },
  actions: { flexDirection: 'row', marginTop: Spacing.md },
  chatBtn: { marginTop: Spacing.sm },
});
