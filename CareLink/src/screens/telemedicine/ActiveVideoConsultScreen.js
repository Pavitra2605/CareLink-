import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius } from '../../theme';

const { width } = Dimensions.get('window');

export default function ActiveVideoConsultScreen({ navigation, route }) {
  const doctor = route?.params?.doctor || {};
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      {/* Remote Video Placeholder */}
      <View style={styles.remoteVideo}>
        <View style={styles.remotePlaceholder}>
          <Ionicons name="person" size={80} color={Colors.textMuted} />
          <Text style={styles.remoteText}>{doctor.name || 'Dr. Priya Sharma'}</Text>
        </View>
      </View>

      {/* Self Video Preview */}
      <View style={styles.selfVideo}>
        {cameraOff ? (
          <Ionicons name="person" size={30} color={Colors.white} />
        ) : (
          <Ionicons name="camera" size={30} color={Colors.white} />
        )}
      </View>

      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.qualityBadge}>
          <Ionicons name="wifi" size={14} color={Colors.success} />
          <Text style={styles.qualityText}>720p</Text>
        </View>
        <Text style={styles.timer}>{formatTime(timer)}</Text>
        <TouchableOpacity onPress={() => {}} style={styles.topBtn}>
          <Ionicons name="expand-outline" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Bottom Controls */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={() => setMuted(!muted)} style={[styles.controlBtn, muted && styles.controlBtnActive]}>
          <Ionicons name={muted ? 'mic-off' : 'mic'} size={24} color={Colors.white} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCameraOff(!cameraOff)} style={[styles.controlBtn, cameraOff && styles.controlBtnActive]}>
          <Ionicons name={cameraOff ? 'videocam-off' : 'videocam'} size={24} color={Colors.white} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}} style={styles.controlBtn}>
          <Ionicons name="share-outline" size={24} color={Colors.white} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}} style={styles.controlBtn}>
          <Ionicons name="chatbubble-outline" size={24} color={Colors.white} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('PostConsultSummary', { doctor })}
          style={[styles.controlBtn, styles.endBtn]}
        >
          <Ionicons name="call" size={24} color={Colors.white} style={{ transform: [{ rotate: '135deg' }] }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A2E' },
  remoteVideo: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  remotePlaceholder: { alignItems: 'center' },
  remoteText: { fontSize: FontSizes.lg, color: Colors.textMuted, marginTop: Spacing.md },
  selfVideo: {
    position: 'absolute', top: 100, right: Spacing.base,
    width: 100, height: 140, borderRadius: Radius.md, backgroundColor: '#2A2A4A',
    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)',
  },
  topBar: {
    position: 'absolute', top: 50, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.base,
  },
  qualityBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.pill,
  },
  qualityText: { fontSize: FontSizes.xs, color: Colors.white, marginLeft: 4 },
  timer: { fontSize: FontSizes.lg, color: Colors.white, fontWeight: FontWeights.semiBold },
  topBtn: { padding: Spacing.sm },
  controls: {
    position: 'absolute', bottom: 40, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'center', gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  controlBtn: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  controlBtnActive: { backgroundColor: 'rgba(255,255,255,0.35)' },
  endBtn: { backgroundColor: Colors.error },
});
