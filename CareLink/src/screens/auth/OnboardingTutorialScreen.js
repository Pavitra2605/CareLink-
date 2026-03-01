import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Gradients } from '../../theme';
import { Button } from '../../components/common';

const { width } = Dimensions.get('window');

const TIPS = [
  { id: '1', icon: 'home', title: 'Your Dashboard', desc: 'Access all features from the home screen — consult doctors, check symptoms, find medicines.' },
  { id: '2', icon: 'heart', title: 'Health Records', desc: 'Tap "My Health" to view and manage your complete medical history.' },
  { id: '3', icon: 'warning', title: 'Emergency Help', desc: 'Use the red SOS button for immediate first-aid guidance.' },
  { id: '4', icon: 'sync', title: 'Works Offline', desc: 'Your records are saved locally and sync automatically when connected.' },
];

export default function OnboardingTutorialScreen({ navigation }) {
  const [index, setIndex] = useState(0);
  const flatListRef = useRef(null);

  return (
    <LinearGradient colors={Gradients.bg} style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={TIPS}
        horizontal pagingEnabled showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={styles.iconCircle}>
              <Ionicons name={item.icon} size={48} color={Colors.accent} />
            </View>
            <Text style={styles.tipTitle}>{item.title}</Text>
            <Text style={styles.tipDesc}>{item.desc}</Text>
          </View>
        )}
      />
      <View style={styles.dots}>
        {TIPS.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>
      <View style={styles.footer}>
        <Button title="Start Using CareLink" onPress={() => navigation.replace('Main')} size="lg" style={{ width: '100%' }} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  slide: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xxxl },
  iconCircle: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.accentLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xl,
  },
  tipTitle: { fontSize: FontSizes.xl, fontWeight: FontWeights.bold, color: Colors.textPrimary, textAlign: 'center' },
  tipDesc: { fontSize: FontSizes.base, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.md, lineHeight: 22 },
  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: Spacing.xl },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.border, marginHorizontal: 4 },
  dotActive: { backgroundColor: Colors.accent, width: 20 },
  footer: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xxl },
});
