import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button, Badge, Card } from '../../components/common';
import { useLanguage } from '../../i18n';

export default function DoctorProfileScreen({ navigation, route }) {
  const { t } = useLanguage();
  const doctor = route?.params?.doctor || { name: 'Dr. Priya Sharma', specialty: 'General Physician', rating: '4.8', available: true, languages: 'Tamil, English' };

  return (
    <View style={styles.container}>
      <Header title={t('telemedicine.doctorProfile')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.profileCard, Shadows.soft]}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color={Colors.accent} />
            </View>
            <View style={[styles.dot, { backgroundColor: doctor.available ? Colors.success : Colors.textMuted }]} />
          </View>
          <Text style={styles.name}>{doctor.name}</Text>
          <Text style={styles.specialty}>{doctor.specialty}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="star" size={16} color={Colors.amberMid} />
              <Text style={styles.metaText}>{doctor.rating}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color={Colors.textMuted} />
              <Text style={styles.metaText}>10+ yrs</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="people-outline" size={16} color={Colors.textMuted} />
              <Text style={styles.metaText}>500+ patients</Text>
            </View>
          </View>
          <Badge label={doctor.available ? 'Available Now' : 'Offline'} variant={doctor.available ? 'success' : 'neutral'} />
        </View>

        <Card title="About">
          <Text style={styles.aboutText}>
            Experienced physician with expertise in preventive medicine, chronic disease management, and rural healthcare delivery. Fluent in {doctor.languages}.
          </Text>
        </Card>

        <Card title="Qualifications">
          <View style={styles.qualItem}>
            <Ionicons name="school-outline" size={18} color={Colors.accent} />
            <Text style={styles.qualText}>MBBS — JIPMER Puducherry</Text>
          </View>
          <View style={styles.qualItem}>
            <Ionicons name="ribbon-outline" size={18} color={Colors.accent} />
            <Text style={styles.qualText}>MD Internal Medicine</Text>
          </View>
        </Card>

        <Card title="Languages">
          <View style={styles.langRow}>
            {(doctor.languages || 'Tamil, English').split(', ').map((l) => (
              <Badge key={l} label={l} variant="info" style={{ marginRight: Spacing.sm }} />
            ))}
          </View>
        </Card>

        <Card title="Availability">
          <Text style={styles.availText}>Mon-Fri: 9:00 AM - 5:00 PM</Text>
          <Text style={styles.availText}>Sat: 9:00 AM - 1:00 PM</Text>
          <Text style={[styles.availText, { color: Colors.textMuted }]}>Sun: Closed</Text>
        </Card>

        <View style={styles.actions}>
          <Button title="Video Consultation" onPress={() => navigation.navigate('ConsultMode', { doctor, mode: 'video' })} size="lg"
            icon={<Ionicons name="videocam" size={20} color={Colors.white} />} style={{ flex: 1, marginRight: Spacing.sm }} />
          <Button title="Audio" onPress={() => navigation.navigate('ConsultMode', { doctor, mode: 'audio' })} variant="outline" size="lg"
            icon={<Ionicons name="call" size={20} color={Colors.btnSecondaryText} />} style={{ flex: 0.6 }} />
        </View>
        <Button title="Text Chat" variant="secondary" onPress={() => navigation.navigate('ConsultMode', { doctor, mode: 'text' })} size="lg"
          icon={<Ionicons name="chatbubbles-outline" size={20} color={Colors.accent} />} style={styles.chatBtn} />

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
  aboutText: { fontSize: FontSizes.md, color: Colors.textSecondary, lineHeight: 22 },
  qualItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  qualText: { fontSize: FontSizes.md, color: Colors.textSecondary },
  langRow: { flexDirection: 'row', flexWrap: 'wrap' },
  availText: { fontSize: FontSizes.md, color: Colors.textSecondary, marginBottom: 4 },
  actions: { flexDirection: 'row', marginTop: Spacing.md },
  chatBtn: { marginTop: Spacing.sm },
});
