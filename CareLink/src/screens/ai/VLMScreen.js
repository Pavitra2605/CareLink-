import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { useLanguage } from '../../i18n';

const { width } = Dimensions.get('window');
const VIEWFINDER_H = 320;
const CORNER = 24;
const BORDER = 3;

const MOCK_FINDINGS = [
  { severity: 'low',    label: 'Mild Redness',     desc: 'Surface-level erythema detected. Likely minor irritation or contact dermatitis.' },
  { severity: 'medium', label: 'Possible Swelling', desc: 'Slight tissue elevation observed. Monitor for changes over 24 hours.' },
];

const severityColors = { low: Colors.success, medium: Colors.amberMid, high: Colors.error };
const severityIcons  = { low: 'checkmark-circle', medium: 'warning', high: 'alert-circle' };

export default function VLMScreen({ navigation }) {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const cameraRef = useRef(null);

  // ── Camera permission ──────────────────────────────────────
  const [permission, requestPermission] = useCameraPermissions();

  // ── UI state ───────────────────────────────────────────────
  const [facing,    setFacing]    = useState('back');   // 'back' | 'front'
  const [flash,     setFlash]     = useState('off');    // 'off' | 'torch'
  const [analysing, setAnalysing] = useState(false);
  const [results,   setResults]   = useState(null);

  // ── Analyse handler ────────────────────────────────────────
  const handleAnalyse = async () => {
    if (analysing) return;
    setAnalysing(true);
    setResults(null);
    try {
      // Capture a still frame to send to the VLM API
      if (cameraRef.current) {
        await cameraRef.current.takePictureAsync({ quality: 0.6, skipProcessing: true });
      }
    } catch (_) {}
    // TODO: send photo.uri to your VLM endpoint here.
    setTimeout(() => {
      setAnalysing(false);
      setResults(MOCK_FINDINGS);
    }, 2200);
  };

  const handleReset = () => { setResults(null); setAnalysing(false); };

  // ── Permission not yet determined ─────────────────────────
  if (!permission) return <View style={styles.container} />;

  // ── Permission denied ─────────────────────────────────────
  if (!permission.granted) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('ai.vlm')}</Text>
          <View style={{ width: 32 }} />
        </View>

        <View style={styles.permissionScreen}>
          <View style={styles.permIconWrap}>
            <Ionicons name="camera" size={52} color={Colors.accent} />
          </View>
          <Text style={styles.permTitle}>Camera Access Required</Text>
          <Text style={styles.permDesc}>
            CareLink needs access to your camera to perform live visual analysis. Your video feed is processed on-device and is never stored or shared.
          </Text>
          <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
            <LinearGradient
              colors={['#11998e', '#38ef7d']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.permBtnInner}
            >
              <Ionicons name="camera" size={20} color="#fff" />
              <Text style={styles.permBtnText}>Grant Camera Permission</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.permBack} onPress={() => navigation.goBack()}>
            <Text style={styles.permBackText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Permission granted: main camera UI ──────────────────
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('ai.vlm')}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* ── Live Camera Viewfinder ── */}
        <View style={styles.viewfinderWrap}>
          <View style={styles.cameraContainer}>
            <CameraView
              ref={cameraRef}
              style={StyleSheet.absoluteFill}
              facing={facing}
              flash={flash}
            />

            {/* Scan-corner overlay */}
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />

            {/* Centre status overlay */}
            {analysing ? (
              <View style={styles.centreOverlay}>
                <View style={styles.scanLine} />
                <Text style={styles.scanningText}>Analysing…</Text>
              </View>
            ) : results ? (
              <View style={styles.centreOverlay}>
                <Ionicons name="checkmark-circle" size={48} color={Colors.success} />
                <Text style={styles.scanDoneText}>Analysis Complete</Text>
              </View>
            ) : (
              <View style={styles.centreOverlay}>
                <Ionicons name="scan" size={40} color="rgba(255,255,255,0.55)" />
                <Text style={styles.aimText}>Point camera at the affected area</Text>
              </View>
            )}

            {/* Top-right camera controls */}
            <View style={styles.camControls}>
              <TouchableOpacity
                style={[styles.camBtn, flash !== 'off' && styles.camBtnActive]}
                onPress={() => setFlash(f => f === 'off' ? 'torch' : 'off')}
              >
                <Ionicons name={flash !== 'off' ? 'flash' : 'flash-off'} size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.camBtn}
                onPress={() => setFacing(f => f === 'back' ? 'front' : 'back')}
              >
                <Ionicons name="camera-reverse" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Analyse / Scan Again button */}
          {results ? (
            <TouchableOpacity style={styles.clearBtn} onPress={handleReset}>
              <Ionicons name="refresh" size={20} color={Colors.accent} />
              <Text style={styles.clearBtnText}>Scan Again</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.analyseBtn, analysing && styles.analyseBtnDisabled]}
              onPress={handleAnalyse}
              disabled={analysing}
            >
              <LinearGradient
                colors={analysing ? [Colors.textMuted, Colors.textMuted] : ['#11998e', '#38ef7d']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.analyseBtnInner}
              >
                <Ionicons name={analysing ? 'hourglass' : 'eye'} size={20} color="#fff" />
                <Text style={styles.analyseBtnText}>
                  {analysing ? 'Analysing…' : 'Analyse Now'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {/* Results */}
        {results && (
          <View style={styles.results}>
            <Text style={styles.resultsTitle}>AI Findings</Text>
            {results.map((r, i) => (
              <View key={i} style={[styles.findingCard, Shadows.soft]}>
                <View style={[styles.findingIcon, { backgroundColor: severityColors[r.severity] + '20' }]}>
                  <Ionicons name={severityIcons[r.severity]} size={22} color={severityColors[r.severity]} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.findingLabel}>{r.label}</Text>
                  <Text style={styles.findingDesc}>{r.desc}</Text>
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={styles.chatFollowup}
              onPress={() => navigation.navigate('AIChat')}
            >
              <Ionicons name="chatbubbles" size={18} color={Colors.accent} />
              <Text style={styles.chatFollowupText}>Discuss findings with AI Assistant</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.accent} />
            </TouchableOpacity>
          </View>
        )}

        {/* Info */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={16} color={Colors.textMuted} />
          <Text style={styles.infoText}>
            VLM (Visual Language Model) analysis is not a medical diagnosis. Always consult a healthcare professional for any medical concerns.
          </Text>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },

  // ── Header ──
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.textPrimary },

  // ── Permission screen ──
  permissionScreen: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  permIconWrap: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: Colors.accent + '18',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  permTitle: {
    fontSize: FontSizes.xl, fontWeight: FontWeights.bold,
    color: Colors.textPrimary, textAlign: 'center', marginBottom: Spacing.md,
  },
  permDesc: {
    fontSize: FontSizes.md, color: Colors.textMuted,
    textAlign: 'center', lineHeight: 22, marginBottom: Spacing.xl,
  },
  permBtn: { borderRadius: Radius.pill, overflow: 'hidden', width: '100%', marginBottom: Spacing.md },
  permBtnInner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, paddingVertical: Spacing.md + 2,
  },
  permBtnText: { fontSize: FontSizes.md, fontWeight: FontWeights.bold, color: '#fff' },
  permBack: { paddingVertical: Spacing.md },
  permBackText: { fontSize: FontSizes.md, color: Colors.textMuted },

  // ── Camera ──
  scroll: { paddingHorizontal: Spacing.base, paddingTop: Spacing.md },
  viewfinderWrap: { marginBottom: Spacing.lg },
  cameraContainer: {
    width: '100%', height: VIEWFINDER_H,
    borderRadius: Radius.xl, overflow: 'hidden',
    backgroundColor: '#000', marginBottom: Spacing.md,
    position: 'relative',
  },
  corner: {
    position: 'absolute', width: CORNER, height: CORNER,
    borderColor: '#38ef7d', borderRadius: 2,
  },
  cornerTL: { top: 16, left: 16, borderTopWidth: BORDER, borderLeftWidth: BORDER },
  cornerTR: { top: 16, right: 16, borderTopWidth: BORDER, borderRightWidth: BORDER },
  cornerBL: { bottom: 16, left: 16, borderBottomWidth: BORDER, borderLeftWidth: BORDER },
  cornerBR: { bottom: 16, right: 16, borderBottomWidth: BORDER, borderRightWidth: BORDER },
  centreOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center', alignItems: 'center', gap: Spacing.sm,
  },
  scanLine: {
    width: '65%', height: 2, backgroundColor: '#38ef7d',
    shadowColor: '#38ef7d', shadowOpacity: 0.9, shadowRadius: 8,
  },
  scanningText: { color: '#38ef7d', fontSize: FontSizes.md, fontWeight: FontWeights.semiBold },
  scanDoneText: { color: '#fff', fontSize: FontSizes.md, fontWeight: FontWeights.semiBold },
  aimText: {
    color: 'rgba(255,255,255,0.55)', fontSize: FontSizes.sm,
    textAlign: 'center', paddingHorizontal: Spacing.xl,
  },
  camControls: { position: 'absolute', top: 12, right: 12, gap: Spacing.sm },
  camBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center', alignItems: 'center',
  },
  camBtnActive: { backgroundColor: Colors.amberMid + 'CC' },
  analyseBtn: { borderRadius: Radius.pill, overflow: 'hidden' },
  analyseBtnDisabled: { opacity: 0.65 },
  analyseBtnInner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl,
  },
  analyseBtnText: { fontSize: FontSizes.md, fontWeight: FontWeights.bold, color: '#fff' },
  clearBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, paddingVertical: Spacing.md,
    borderRadius: Radius.pill, borderWidth: 1.5, borderColor: Colors.accent,
  },
  clearBtnText: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold, color: Colors.accent },

  // ── Results ──
  results: { marginBottom: Spacing.md },
  resultsTitle: {
    fontSize: FontSizes.lg, fontWeight: FontWeights.bold,
    color: Colors.textPrimary, marginBottom: Spacing.md,
  },
  findingCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.md, marginBottom: Spacing.sm,
  },
  findingIcon: {
    width: 40, height: 40, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', flexShrink: 0,
  },
  findingLabel: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  findingDesc: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2, lineHeight: 18 },
  chatFollowup: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.accent + '12', borderRadius: Radius.lg,
    padding: Spacing.md, marginTop: Spacing.sm,
    borderWidth: 1, borderColor: Colors.accent + '30',
  },
  chatFollowupText: { flex: 1, fontSize: FontSizes.sm, color: Colors.accent, fontWeight: FontWeights.medium },
  infoCard: {
    flexDirection: 'row', gap: Spacing.xs, alignItems: 'flex-start',
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.md, marginBottom: Spacing.md,
  },
  infoText: { flex: 1, fontSize: FontSizes.xs, color: Colors.textMuted, lineHeight: 16 },
});
