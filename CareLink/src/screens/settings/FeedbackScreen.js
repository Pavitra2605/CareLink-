import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button } from '../../components/common';
import { useLanguage } from '../../i18n';

export default function FeedbackScreen({ navigation }) {
  const [type, setType] = useState('general');
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const { t } = useLanguage();

  const feedbackTypes = [
    { key: 'bug', label: t('feedback.bugReport'), icon: 'bug' },
    { key: 'feature', label: t('feedback.featureRequest'), icon: 'bulb' },
    { key: 'general', label: t('feedback.generalFeedback'), icon: 'chatbubble' },
    { key: 'complaint', label: t('feedback.complaint'), icon: 'alert-circle' },
  ];

  const handleSubmit = () => {
    Alert.alert(t('feedback.thankYou'), t('feedback.feedbackReceived'));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header title={t('feedback.title')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionLabel}>{t('feedback.selectType')}</Text>
        <View style={styles.typeGrid}>
          {feedbackTypes.map(t => (
            <TouchableOpacity key={t.key}
              style={[styles.typeCard, type === t.key && styles.typeActive, Shadows.soft]}
              onPress={() => setType(t.key)}>
              <Ionicons name={t.icon} size={24}
                color={type === t.key ? Colors.accent : Colors.textMuted} />
              <Text style={[styles.typeLabel, type === t.key && { color: Colors.accent }]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>{t('feedback.rateExperience')}</Text>
        <View style={styles.starRow}>
          {[1, 2, 3, 4, 5].map(r => (
            <TouchableOpacity key={r} onPress={() => setRating(r)}>
              <Ionicons name={r <= rating ? 'star' : 'star-outline'} size={36}
                color={r <= rating ? Colors.amberMid : Colors.border} />
            </TouchableOpacity>
          ))}
        </View>
        {rating > 0 && (
          <Text style={styles.ratingLabel}>
            {rating === 1 ? t('feedback.poor') : rating === 2 ? t('feedback.fair') : rating === 3 ? t('feedback.good') : rating === 4 ? t('feedback.veryGood') : t('feedback.excellent')}
          </Text>
        )}

        <Text style={styles.sectionLabel}>{t('feedback.yourFeedback')}</Text>
        <TextInput style={styles.textArea} multiline numberOfLines={5}
          placeholder={t('feedback.tellUsMore')}
          placeholderTextColor={Colors.textMuted} value={feedback} onChangeText={setFeedback}
        />

        <Button label={t('feedback.submitFeedback')} onPress={handleSubmit}
          disabled={!feedback.trim() || rating === 0} style={{ marginTop: Spacing.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  content: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.lg, paddingBottom: 60 },
  sectionLabel: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold, color: Colors.textPrimary, marginTop: Spacing.lg, marginBottom: Spacing.sm },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  typeCard: {
    width: '47%', backgroundColor: Colors.surface, borderRadius: Radius.md,
    padding: Spacing.lg, alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  typeActive: { borderColor: Colors.accent, backgroundColor: Colors.accent + '08' },
  typeLabel: { fontSize: FontSizes.sm, fontWeight: FontWeights.medium, color: Colors.textSecondary, marginTop: Spacing.sm },
  starRow: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.md },
  ratingLabel: { fontSize: FontSizes.md, color: Colors.accent, textAlign: 'center', fontWeight: FontWeights.medium, marginTop: Spacing.sm },
  textArea: {
    backgroundColor: Colors.surface, borderRadius: Radius.md, borderWidth: 1,
    borderColor: Colors.border, padding: Spacing.md, fontSize: FontSizes.md,
    color: Colors.textPrimary, textAlignVertical: 'top', minHeight: 120,
  },
});
