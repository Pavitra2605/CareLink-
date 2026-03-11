import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Gradients, Shadows } from '../../theme';
import { QuickAction, Card, AppointmentCard, Badge } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { profile, user } = useAuth();
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'there';
  const { t } = useLanguage();

  const quickActions = [
    { icon: 'videocam', label: t('home.consultDoctor'), color: Colors.accent, onPress: () => navigation.navigate('ConsultSpecialty') },
    { icon: 'warning', label: t('home.emergencyHelp'), color: Colors.error, onPress: () => navigation.navigate('EmergencyTab', { screen: 'EmergencyHome' }) },
    { icon: 'heart', label: t('home.myHealth'), color: Colors.success, onPress: () => navigation.navigate('HealthTab', { screen: 'HealthProfile' }) },
    { icon: 'medkit', label: t('home.findMedicine'), color: Colors.amberMid, onPress: () => navigation.navigate('MedicineTab', { screen: 'MedicineSearch' }) },
    { icon: 'fitness', label: t('home.symptomChecker'), color: '#9B59B6', onPress: () => navigation.navigate('SymptomCheckerHome') },
    { icon: 'document-text', label: t('home.healthRecords'), color: '#3498DB', onPress: () => navigation.navigate('HealthTab', { screen: 'TestReports' }) },
  ];

  const mockAppointments = [
    { id: '1', doctor: 'Dr. Priya Sharma', specialty: 'General Physician', date: 'Today', time: '2:30 PM', mode: 'video', status: 'upcoming' },
    { id: '2', doctor: 'Dr. Rajesh Kumar', specialty: 'Cardiologist', date: 'Tomorrow', time: '10:00 AM', mode: 'audio', status: 'upcoming' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.greeting}>{t('home.goodMorning')}</Text>
            <Text style={styles.userName} numberOfLines={1}>{displayName}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => navigation.navigate('HealthTab', { screen: 'SyncStatus' })} style={styles.syncBadge}>
              <Ionicons name="cloud-done-outline" size={16} color={Colors.success} />
              <Text style={styles.syncText} numberOfLines={1}>{t('home.synced')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={styles.bellWrap}>
              <Ionicons name="notifications-outline" size={24} color={Colors.textPrimary} />
              <View style={styles.notifDot} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.gearBtn}>
              <Ionicons name="settings-outline" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Emergency Banner */}
        <TouchableOpacity onPress={() => navigation.navigate('EmergencyTab', { screen: 'EmergencyHome' })} activeOpacity={0.85}>
          <LinearGradient colors={['#C4682A', '#8B4A1E']} style={[styles.emergencyBanner, Shadows.medium]}>
            <View style={styles.emerIconWrap}>
              <Ionicons name="pulse" size={28} color={Colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.emerTitle}>{t('home.emergencyBannerTitle')}</Text>
              <Text style={styles.emerSub}>{t('home.emergencyBannerSub')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={Colors.white} />
          </LinearGradient>
        </TouchableOpacity>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>{t('home.quickActions')}</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((a, i) => (
            <QuickAction
              key={i}
              icon={a.icon}
              iconColor={a.color}
              label={a.label}
              onPress={a.onPress}
              style={styles.actionItem}
            />
          ))}
        </View>

        {/* Upcoming Appointments */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('home.upcomingAppointments')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ConsultationHistory')}>
            <Text style={styles.seeAll}>{t('common.seeAll')}</Text>
          </TouchableOpacity>
        </View>
        {mockAppointments.map((apt) => (
          <AppointmentCard
            key={apt.id}
            doctor={apt.doctor}
            specialty={apt.specialty}
            date={apt.date}
            time={apt.time}
            mode={apt.mode}
            status={apt.status}
            onPress={() => navigation.navigate('ConsultationHistory')}
          />
        ))}

        {/* Health Summary Card */}
        <Card title={t('home.healthSummary')} subtitle={t('home.lastUpdatedToday')}
          rightAction={<TouchableOpacity><Ionicons name="expand-outline" size={18} color={Colors.accent} /></TouchableOpacity>}
          onPress={() => navigation.navigate('HealthTab', { screen: 'HealthProfile' })}>
          <View style={styles.healthRow}>
            <View style={styles.healthMetric}>
              <Ionicons name="heart" size={20} color={Colors.error} />
              <Text style={styles.metricVal}>120/80</Text>
              <Text style={styles.metricLabel}>{t('home.bloodPressure')}</Text>
            </View>
            <View style={styles.healthMetric}>
              <Ionicons name="water" size={20} color={Colors.accent} />
              <Text style={styles.metricVal}>98</Text>
              <Text style={styles.metricLabel}>{t('home.bloodSugar')}</Text>
            </View>
            <View style={styles.healthMetric}>
              <Ionicons name="thermometer" size={20} color={Colors.amberMid} />
              <Text style={styles.metricVal}>98.6°F</Text>
              <Text style={styles.metricLabel}>{t('home.temperature')}</Text>
            </View>
          </View>
        </Card>

        {/* Medication Reminders */}
        <Card title={t('home.todaysMedications')} variant="accent"
          rightAction={<Badge label={`2 ${t('home.due')}`} variant="warning" size="sm" />}
          onPress={() => navigation.navigate('HealthTab', { screen: 'Medications' })}>
          <View style={styles.medItem}>
            <View style={styles.medPill} />
            <View style={{ flex: 1 }}>
              <Text style={styles.medName}>Metformin 500mg</Text>
              <Text style={styles.medTime}>{t('home.afterBreakfast')} · 8:00 AM</Text>
            </View>
            <TouchableOpacity style={styles.medCheck}>
              <Ionicons name="checkmark-circle-outline" size={24} color={Colors.success} />
            </TouchableOpacity>
          </View>
          <View style={styles.medItem}>
            <View style={[styles.medPill, { backgroundColor: Colors.amberMid }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.medName}>Amlodipine 5mg</Text>
              <Text style={styles.medTime}>{t('home.afterDinner')} · 8:00 PM</Text>
            </View>
            <TouchableOpacity style={styles.medCheck}>
              <Ionicons name="ellipse-outline" size={24} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Health Tips */}
        <Card title={t('home.healthTipTitle')}>
          <Text style={styles.tipText}>
            {t('home.healthTipText')}
          </Text>
        </Card>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { paddingHorizontal: Spacing.base },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  greeting: { fontSize: FontSizes.md, color: Colors.textMuted },
  userName: { fontSize: FontSizes.xxl, fontWeight: FontWeights.bold, color: Colors.textPrimary, marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flexShrink: 0, marginLeft: Spacing.sm },
  syncBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.success + '15',
    paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.pill,
    maxWidth: 120,
  },
  syncText: { fontSize: FontSizes.xs, color: Colors.success, marginLeft: 4, fontWeight: FontWeights.medium, flexShrink: 1 },
  bellWrap: { position: 'relative', padding: Spacing.xs },
  notifDot: {
    position: 'absolute', top: 6, right: 6, width: 8, height: 8,
    borderRadius: 4, backgroundColor: Colors.error,
  },
  gearBtn: { padding: Spacing.xs },
  emergencyBanner: {
    flexDirection: 'row', alignItems: 'center', borderRadius: Radius.lg,
    padding: Spacing.base, marginBottom: Spacing.lg,
  },
  emerIconWrap: {
    width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md,
  },
  emerTitle: { fontSize: FontSizes.base, fontWeight: FontWeights.bold, color: Colors.white },
  emerSub: { fontSize: FontSizes.xs, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.textPrimary, marginBottom: Spacing.md },
  seeAll: { fontSize: FontSizes.sm, color: Colors.accent, fontWeight: FontWeights.medium },
  actionsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  actionItem: { width: (width - Spacing.base * 2 - Spacing.sm * 2) / 3, marginBottom: Spacing.sm },
  healthRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: Spacing.sm },
  healthMetric: { alignItems: 'center' },
  metricVal: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.textPrimary, marginTop: 4 },
  metricLabel: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 2 },
  medItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm },
  medPill: { width: 4, height: 32, borderRadius: 2, backgroundColor: Colors.accent, marginRight: Spacing.md },
  medName: { fontSize: FontSizes.md, fontWeight: FontWeights.medium, color: Colors.textPrimary },
  medTime: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 2 },
  medCheck: { padding: Spacing.xs },
  tipText: { fontSize: FontSizes.md, color: Colors.textSecondary, lineHeight: 22 },
});
