import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Gradients } from '../../theme';
import { Button } from '../../components/common';
import { useLanguage } from '../../i18n';

const { width } = Dimensions.get('window');

export default function OnboardingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const { t } = useLanguage();

  const SLIDES = [
    {
      id: '1',
      icon: 'videocam',
      color: Colors.accent,
      title: t('onboarding.slide1Title'),
      description: t('onboarding.slide1Desc'),
    },
    {
      id: '2',
      icon: 'document-text',
      color: Colors.success,
      title: t('onboarding.slide2Title'),
      description: t('onboarding.slide2Desc'),
    },
    {
      id: '3',
      icon: 'medkit',
      color: Colors.error,
      title: t('onboarding.slide3Title'),
      description: t('onboarding.slide3Desc'),
    },
    {
      id: '4',
      icon: 'medical',
      color: Colors.amberMid,
      title: t('onboarding.slide4Title'),
      description: t('onboarding.slide4Desc'),
    },
  ];

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.replace('Login');
    }
  };

  const renderSlide = ({ item }) => (
    <View style={[styles.slide, { width }]}>
      <View style={[styles.iconCircle, { backgroundColor: item.color + '15' }]}>
        <Ionicons name={item.icon} size={64} color={item.color} />
      </View>
      <Text style={styles.slideTitle}>{item.title}</Text>
      <Text style={styles.slideDesc}>{item.description}</Text>
    </View>
  );

  return (
    <LinearGradient colors={Gradients.bg} style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={renderSlide}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        onMomentumScrollEnd={(e) => {
          setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
      />

      <View style={styles.pagination}>
        {SLIDES.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={i}
              style={[styles.dot, { width: dotWidth, opacity, backgroundColor: Colors.accent }]}
            />
          );
        })}
      </View>

      <View style={styles.footer}>
        <Button
          title={currentIndex === SLIDES.length - 1 ? t('onboarding.getStarted') : t('common.next')}
          onPress={handleNext}
          size="lg"
          style={{ flex: 1 }}
        />
      </View>

      {currentIndex < SLIDES.length - 1 && (
        <Button
          title={t('onboarding.skip')}
          variant="outline"
          onPress={() => navigation.replace('Login')}
          size="sm"
          style={styles.skipBtn}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxxl,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxl,
  },
  slideTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  slideDesc: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  skipBtn: {
    position: 'absolute',
    top: 60,
    right: Spacing.xl,
  },
});
