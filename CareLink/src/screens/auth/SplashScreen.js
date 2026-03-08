import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSizes, FontWeights, Gradients } from '../../theme';
import { useLanguage } from '../../i18n';

export default function SplashScreen({ navigation }) {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const { t } = useLanguage();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('LanguageSelection');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient colors={Gradients.bg} style={styles.container}>
      <Animated.View style={[styles.logoWrap, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoIcon}>💙</Text>
        </View>
        <Text style={styles.appName}>{t('common.appName')}</Text>
        <Text style={styles.tagline}>{t('splash.tagline')}</Text>
      </Animated.View>
      <Animated.Text style={[styles.version, { opacity: fadeAnim }]}>{t('common.version')}</Animated.Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrap: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#6B6BCC',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  logoIcon: {
    fontSize: 48,
  },
  appName: {
    fontSize: FontSizes.hero,
    fontWeight: FontWeights.extraBold,
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: FontSizes.base,
    color: Colors.textMuted,
    marginTop: 8,
  },
  version: {
    position: 'absolute',
    bottom: 40,
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
  },
});
