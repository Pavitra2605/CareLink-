import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button, Badge } from '../../components/common';
import { useLanguage } from '../../i18n';
import { useAuth } from '../../context/AuthContext';
import { predictTriage, durationToDays } from '../../services/aiService';
import { saveSymptomCheck } from '../../services/historyService';

const sevConfig = {
  LOW:    { color: Colors.success, bg: Colors.success + '15', label: 'Low Risk',    icon: 'checkmark-circle' },
  MEDIUM: { color: Colors.amberMid, bg: Colors.amberMid + '15', label: 'Medium Risk', icon: 'warning' },
  HIGH:   { color: Colors.error,   bg: Colors.error + '15',   label: 'High Risk',   icon: 'alert-circle' },
};

export default function SymptomResultsScreen({ navigation, route }) {
  const { t } = useLanguage();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [triageResult, setTriageResult] = useState(null);
  const [error, setError] = useState(null);

  const params = route.params || {};

  useEffect(() => {
    (async () => {
      try {
        // Build symptoms text from the selected symptoms + free text
        const selectedSymptoms = params.symptoms || [];
        const freeText = params.text || '';
        const symptomsText =
          [freeText, ...selectedSymptoms].filter(Boolean).join('. ') ||
          'General discomfort';

        // Extract chronic conditions from clarifying answers (question 3)
        const answers = params.answers || {};
        const chronicRaw = answers[3] || [];
        const chronicConditions = Array.isArray(chronicRaw)
          ? chronicRaw.filter(c => c !== 'None')
          : [];

        const durationDays = durationToDays(params.duration);
        const age = profile?.age || 30;

        const result = await predictTriage({
          symptomsText,
          age,
          durationDays,
          chronicConditions,
          language: 'en',
        });

        setTriageResult(result);

        // Persist to Supabase
        if (profile?.id) {
          saveSymptomCheck(profile.id, {
            symptomsText,
            symptomsSelected: selectedSymptoms,
            duration: params.duration,
            answers,
            prediction: result.prediction,
            confidence: result.confidence,
            probabilities: result.probabilities,
            rulesTriggered: result.rules_triggered,
            explanation: result.explanation,
            emergencyFlag: result.emergency_flag,
            escalated: result.escalated,
            modelVersion: result.model_version,
            requestId: result.request_id,
          }).catch(e => console.warn('[SymptomResults] save failed:', e.message));
        }
      } catch (err) {
        console.warn('[SymptomResults] Triage error:', err.message);
        setError(err.message || 'Could not analyze symptoms. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title={t('symptomChecker.results')} onBack={() => navigation.goBack()} />
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={styles.loadingText}>Analyzing your symptoms with AI…</Text>
        </View>
      </View>
    );
  }

  if (error || !triageResult) {
    return (
      <View style={styles.container}>
        <Header title={t('symptomChecker.results')} onBack={() => navigation.goBack()} />
        <View style={styles.loadingWrap}>
          <Ionicons name="alert-circle" size={48} color={Colors.error} />
          <Text style={[styles.loadingText, { color: Colors.error }]}>
            {error || 'Something went wrong'}
          </Text>
          <Button label="Try Again" onPress={() => navigation.goBack()} style={{ marginTop: Spacing.lg }} />
        </View>
      </View>
    );
  }

  const prediction = triageResult.prediction;
  const sev = sevConfig[prediction] || sevConfig.MEDIUM;
  const probs = triageResult.probabilities || {};

  return (
    <View style={styles.container}>
      <Header title={t('symptomChecker.results')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Ionicons name="information-circle" size={20} color={Colors.accent} />
          <Text style={styles.disclaimerText}>
            These results are AI-generated suggestions, not medical diagnoses. Please consult a healthcare professional.
          </Text>
        </View>

        {/* Emergency banner */}
        {triageResult.emergency_flag && (
          <View style={[styles.emergencyBanner, Shadows.soft]}>
            <Ionicons name="alert-circle" size={24} color="#fff" />
            <Text style={styles.emergencyText}>
              Emergency care recommended. Please seek immediate medical attention.
            </Text>
          </View>
        )}

        {/* Main risk card */}
        <View style={[styles.topCard, Shadows.soft]}>
          <View style={[styles.topIconWrap, { backgroundColor: sev.bg }]}>
            <Ionicons name={sev.icon} size={32} color={sev.color} />
          </View>
          <Text style={styles.topName}>{sev.label}</Text>
          <Text style={[styles.topMatch, { color: sev.color }]}>
            {Math.round((triageResult.confidence || 0) * 100)}% confidence
          </Text>
          <Badge
            label={prediction}
            variant={prediction === 'LOW' ? 'success' : prediction === 'MEDIUM' ? 'warning' : 'error'}
          />
          <View style={styles.matchBar}>
            <View style={[styles.matchFill, {
              width: `${Math.round((triageResult.confidence || 0) * 100)}%`,
              backgroundColor: sev.color,
            }]} />
          </View>
        </View>

        {/* Probability breakdown */}
        <Text style={styles.sectionLabel}>Risk Breakdown</Text>
        {['low', 'medium', 'high'].map(level => (
          <View key={level} style={[styles.resultCard, Shadows.soft]}>
            <Ionicons
              name={sevConfig[level.toUpperCase()]?.icon || 'ellipse'}
              size={24}
              color={sevConfig[level.toUpperCase()]?.color || Colors.accent}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.resultName}>{level.charAt(0).toUpperCase() + level.slice(1)} Risk</Text>
              <View style={styles.miniBar}>
                <View style={[styles.miniFill, {
                  width: `${Math.round((probs[level] || 0) * 100)}%`,
                  backgroundColor: sevConfig[level.toUpperCase()]?.color,
                }]} />
              </View>
            </View>
            <Text style={styles.matchPercent}>{Math.round((probs[level] || 0) * 100)}%</Text>
          </View>
        ))}

        {/* Clinical rules triggered */}
        {triageResult.rules_triggered?.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>Safety Rules Triggered</Text>
            {triageResult.rules_triggered.map((rule, i) => (
              <View key={i} style={[styles.ruleCard, Shadows.soft]}>
                <Ionicons name="shield-checkmark" size={20} color={Colors.error} />
                <Text style={styles.ruleText}>
                  {rule.replace(/_/g, ' ')}
                </Text>
              </View>
            ))}
          </>
        )}

        {/* AI Explanation */}
        {triageResult.explanation && (
          <>
            <Text style={styles.sectionLabel}>AI Explanation</Text>
            <View style={[styles.explanationCard, Shadows.soft]}>
              <Ionicons name="sparkles" size={20} color={Colors.accent} />
              <Text style={styles.explanationText}>{triageResult.explanation}</Text>
            </View>
          </>
        )}

        {/* Actions */}
        <Text style={styles.sectionLabel}>Recommended Actions</Text>
        <Button label="View Recommended Actions" onPress={() => navigation.navigate('RecommendedAction', {
          triageResult,
        })} style={{ marginBottom: Spacing.sm }} />
        <Button label="Discuss with AI Assistant" variant="secondary"
          onPress={() => navigation.navigate('AIHome', {
            screen: 'AIChat',
            params: {
              triageContext: {
                risk_level: prediction,
                symptoms_text: [params.text, ...(params.symptoms || [])].filter(Boolean).join(', '),
                explanation: triageResult.explanation,
              }
            }
          })} style={{ marginBottom: Spacing.sm }} />
        <Button label="Consult a Doctor Now" variant="outline"
          onPress={() => navigation.navigate('DoctorQuestions')} style={{ marginBottom: Spacing.sm }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  content: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.lg, paddingBottom: 60 },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  loadingText: { marginTop: Spacing.md, fontSize: FontSizes.md, color: Colors.textMuted, textAlign: 'center' },
  disclaimer: {
    flexDirection: 'row', gap: Spacing.sm, backgroundColor: Colors.accent + '10',
    borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.lg,
  },
  disclaimerText: { flex: 1, fontSize: FontSizes.sm, color: Colors.textSecondary, lineHeight: 20 },
  emergencyBanner: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.error, borderRadius: Radius.md,
    padding: Spacing.md, marginBottom: Spacing.lg,
  },
  emergencyText: { flex: 1, color: '#fff', fontSize: FontSizes.md, fontWeight: FontWeights.semiBold },
  topCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.xl,
    alignItems: 'center', marginBottom: Spacing.lg,
  },
  topIconWrap: {
    width: 64, height: 64, borderRadius: 32,
    justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.md,
  },
  topName: { fontSize: FontSizes.xl, fontWeight: FontWeights.bold, color: Colors.textPrimary },
  topMatch: { fontSize: FontSizes.lg, fontWeight: FontWeights.semiBold, marginVertical: Spacing.xs },
  matchBar: { width: '100%', height: 8, borderRadius: 4, backgroundColor: Colors.border, marginTop: Spacing.md },
  matchFill: { height: 8, borderRadius: 4 },
  sectionLabel: { fontSize: FontSizes.lg, fontWeight: FontWeights.semiBold, color: Colors.textPrimary, marginBottom: Spacing.md, marginTop: Spacing.md },
  resultCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.surface,
    borderRadius: Radius.md, padding: Spacing.lg, marginBottom: Spacing.sm,
  },
  resultName: { fontSize: FontSizes.base, fontWeight: FontWeights.medium, color: Colors.textPrimary },
  miniBar: { height: 4, borderRadius: 2, backgroundColor: Colors.border, marginTop: 4, width: '100%' },
  miniFill: { height: 4, borderRadius: 2 },
  matchPercent: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold, color: Colors.accent },
  ruleCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.error + '08', borderRadius: Radius.md,
    padding: Spacing.md, marginBottom: Spacing.xs,
    borderLeftWidth: 3, borderLeftColor: Colors.error,
  },
  ruleText: { flex: 1, fontSize: FontSizes.sm, color: Colors.textPrimary, textTransform: 'capitalize' },
  explanationCard: {
    flexDirection: 'row', gap: Spacing.sm, backgroundColor: Colors.surface,
    borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.md,
  },
  explanationText: { flex: 1, fontSize: FontSizes.sm, color: Colors.textSecondary, lineHeight: 20 },
});
