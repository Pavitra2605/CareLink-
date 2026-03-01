import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button } from '../../components/common';

const feedbackTypes = [
  { key: 'bug', label: 'Bug Report', icon: 'bug' },
  { key: 'feature', label: 'Feature Request', icon: 'bulb' },
  { key: 'general', label: 'General Feedback', icon: 'chatbubble' },
  { key: 'complaint', label: 'Complaint', icon: 'alert-circle' },
];

const ratings = [1, 2, 3, 4, 5];

export default function FeedbackScreen({ navigation }) {
  const [type, setType] = useState('general');
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    Alert.alert('Thank You!', 'Your feedback has been submitted. We appreciate your input.');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header title="Send Feedback" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionLabel}>Feedback Type</Text>
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

        <Text style={styles.sectionLabel}>Rate Your Experience</Text>
        <View style={styles.starRow}>
          {ratings.map(r => (
            <TouchableOpacity key={r} onPress={() => setRating(r)}>
              <Ionicons name={r <= rating ? 'star' : 'star-outline'} size={36}
                color={r <= rating ? Colors.amberMid : Colors.border} />
            </TouchableOpacity>
          ))}
        </View>
        {rating > 0 && (
          <Text style={styles.ratingLabel}>
            {rating === 1 ? 'Poor' : rating === 2 ? 'Fair' : rating === 3 ? 'Good' : rating === 4 ? 'Very Good' : 'Excellent'}
          </Text>
        )}

        <Text style={styles.sectionLabel}>Your Feedback</Text>
        <TextInput style={styles.textArea} multiline numberOfLines={5}
          placeholder="Tell us what you think..."
          placeholderTextColor={Colors.textMuted} value={feedback} onChangeText={setFeedback}
        />

        <Button label="Submit Feedback" onPress={handleSubmit}
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
