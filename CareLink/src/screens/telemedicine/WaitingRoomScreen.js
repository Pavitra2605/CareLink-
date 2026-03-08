import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Button, Card } from '../../components/common';
import { useLanguage } from '../../i18n';

export default function WaitingRoomScreen({ navigation, route }) {
  const { t } = useLanguage();
  const doctor = route?.params?.doctor || {};
  const mode = route?.params?.mode || 'video';
  const [position, setPosition] = useState(3);
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    pulse.start();

    const interval = setInterval(() => {
      setPosition((p) => {
        if (p <= 1) {
          clearInterval(interval);
          return 0;
        }
        return p - 1;
      });
    }, 5000);

    return () => { pulse.stop(); clearInterval(interval); };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]}>
          <View style={styles.innerCircle}>
            <Ionicons name={mode === 'video' ? 'videocam' : mode === 'audio' ? 'call' : 'chatbubbles'} size={40} color={Colors.accent} />
          </View>
        </Animated.View>

        <Text style={styles.statusText}>
          {position === 0 ? 'Your turn! Connecting...' : 'Waiting for Doctor'}
        </Text>
        <Text style={styles.queueText}>
          {position === 0 ? 'Please be ready' : `Queue Position: ${position}`}
        </Text>
        <Text style={styles.estimateText}>
          {position > 0 ? `Estimated wait: ~${position * 5} min` : ''}
        </Text>

        <Card style={styles.doctorCard}>
          <View style={styles.docRow}>
            <View style={styles.docAvatar}>
              <Ionicons name="person" size={24} color={Colors.accent} />
            </View>
            <View>
              <Text style={styles.docName}>{doctor.name || 'Dr. Priya Sharma'}</Text>
              <Text style={styles.docSpec}>{doctor.specialty || 'General Physician'}</Text>
            </View>
          </View>
        </Card>

        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>While you wait:</Text>
          <Text style={styles.tipItem}>• Ensure good internet connection</Text>
          <Text style={styles.tipItem}>• Find a quiet, well-lit place</Text>
          <Text style={styles.tipItem}>• Keep your health records handy</Text>
        </View>
      </View>

      <View style={styles.footer}>
        {position === 0 ? (
          <Button title="Join Consultation" onPress={() => navigation.navigate('ActiveVideoConsult', { doctor, mode })}
            size="lg" style={{ width: '100%' }} />
        ) : (
          <Button title="Leave Queue" variant="danger" onPress={() => navigation.goBack()}
            size="lg" style={{ width: '100%' }} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.xl },
  pulseCircle: {
    width: 120, height: 120, borderRadius: 60, backgroundColor: Colors.accentLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xl,
  },
  innerCircle: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center', ...Shadows.soft,
  },
  statusText: { fontSize: FontSizes.xl, fontWeight: FontWeights.bold, color: Colors.textPrimary, textAlign: 'center' },
  queueText: { fontSize: FontSizes.xxl, fontWeight: FontWeights.extraBold, color: Colors.accent, marginTop: Spacing.sm },
  estimateText: { fontSize: FontSizes.md, color: Colors.textMuted, marginTop: Spacing.xs },
  doctorCard: { width: '100%', marginTop: Spacing.xl },
  docRow: { flexDirection: 'row', alignItems: 'center' },
  docAvatar: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.accentLight,
    alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md,
  },
  docName: { fontSize: FontSizes.base, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  docSpec: { fontSize: FontSizes.sm, color: Colors.textMuted },
  tips: { marginTop: Spacing.xl, alignSelf: 'flex-start' },
  tipsTitle: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold, color: Colors.textSecondary, marginBottom: Spacing.sm },
  tipItem: { fontSize: FontSizes.md, color: Colors.textMuted, marginBottom: 4 },
  footer: { padding: Spacing.xl },
});
