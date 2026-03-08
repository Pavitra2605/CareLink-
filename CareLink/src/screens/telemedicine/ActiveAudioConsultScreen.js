import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing } from '../../theme';
import { useLanguage } from '../../i18n';

export default function ActiveAudioConsultScreen({ navigation, route }) {
  const { t } = useLanguage();
  const doctor = route?.params?.doctor || {};
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <View style={styles.avatarRing}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color={Colors.accent} />
          </View>
        </View>
        <Text style={styles.name}>{doctor.name || 'Dr. Priya Sharma'}</Text>
        <Text style={styles.specialty}>{doctor.specialty || 'General Physician'}</Text>
        <Text style={styles.timer}>{formatTime(timer)}</Text>
        <Text style={styles.status}>Connected</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={() => setMuted(!muted)} style={[styles.btn, muted && styles.btnActive]}>
          <Ionicons name={muted ? 'mic-off' : 'mic'} size={26} color={Colors.white} />
          <Text style={styles.btnLabel}>{muted ? 'Unmute' : 'Mute'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSpeaker(!speaker)} style={[styles.btn, speaker && styles.btnActive]}>
          <Ionicons name={speaker ? 'volume-high' : 'volume-medium'} size={26} color={Colors.white} />
          <Text style={styles.btnLabel}>Speaker</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <Ionicons name="chatbubble-outline" size={26} color={Colors.white} />
          <Text style={styles.btnLabel}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('PostConsultSummary', { doctor })}
          style={[styles.btn, styles.endBtn]}
        >
          <Ionicons name="call" size={26} color={Colors.white} style={{ transform: [{ rotate: '135deg' }] }} />
          <Text style={styles.btnLabel}>End</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A2E' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  avatarRing: {
    width: 130, height: 130, borderRadius: 65, borderWidth: 3, borderColor: Colors.accent + '40',
    alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xl,
  },
  avatar: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.accentLight,
    alignItems: 'center', justifyContent: 'center',
  },
  name: { fontSize: FontSizes.xl, fontWeight: FontWeights.bold, color: Colors.white },
  specialty: { fontSize: FontSizes.md, color: Colors.textMuted, marginTop: 4 },
  timer: { fontSize: FontSizes.xxxl, fontWeight: FontWeights.bold, color: Colors.white, marginTop: Spacing.xl },
  status: { fontSize: FontSizes.md, color: Colors.success, marginTop: Spacing.sm },
  controls: {
    flexDirection: 'row', justifyContent: 'center', gap: Spacing.xl,
    paddingBottom: 60, paddingHorizontal: Spacing.xxl,
  },
  btn: { alignItems: 'center', gap: Spacing.xs },
  btnActive: { opacity: 0.6 },
  btnLabel: { fontSize: FontSizes.xs, color: Colors.white },
  endBtn: {},
});
