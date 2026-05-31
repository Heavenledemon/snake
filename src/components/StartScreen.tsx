import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../styles/colors';

interface StartScreenProps {
  highScore: number;
  onStart: () => void;
}

export default function StartScreen({ highScore, onStart }: StartScreenProps) {
  // Pulsing glow animation for the title
  const glowAnim = useRef(new Animated.Value(0)).current;
  // Subtle float animation for the dragon emoji
  const floatAnim = useRef(new Animated.Value(0)).current;
  // Fade-in on mount
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();

    // Glow pulse loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.sin),
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1400,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.sin),
        }),
      ])
    ).start();

    // Float loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 1200,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
        Animated.timing(floatAnim, {
          toValue: 10,
          duration: 2400,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
      ])
    ).start();
  }, []);

  const titleGlowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1],
  });

  const buttonGlowRadius = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [12, 24],
  });

  return (
    <Animated.View style={[styles.root, { opacity: fadeAnim }]}>
      <SafeAreaView style={styles.safeArea}>
        {/* ── Decorative corner accents ── */}
        {/* <View style={styles.cornerTL} />
        <View style={styles.cornerTR} />
        <View style={styles.cornerBL} />
        <View style={styles.cornerBR} /> */}

        {/* ── Dragon mascot ── */}
        <Animated.Text
          style={[styles.dragonEmoji, { transform: [{ translateY: floatAnim }] }]}
        >
          🐉
        </Animated.Text>

        {/* ── Title ── */}
        <Animated.Text style={[styles.title, { opacity: titleGlowOpacity }]}>
          DRAGON SNAKE
        </Animated.Text>
        <Text style={styles.subtitle}>PRISM EDITION</Text>

        {/* ── Divider ── */}
        <View style={styles.divider} />

        {/* ── High score ── */}
        {highScore > 0 && (
          <View style={styles.highScoreRow}>
            <Text style={styles.highScoreLabel}>RECORD</Text>
            <Text style={styles.highScoreValue}>{highScore}</Text>
          </View>
        )}

        {/* ── Instruction tips ── */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipText}>⚡ Swipe to dash & turn</Text>
          <Text style={styles.tipText}>🔥 Eat fast for COMBO 2X</Text>
          <Text style={styles.tipText}>👻 Golden items unlock GHOST MODE</Text>
        </View>

        {/* ── Play button ── */}
        <Animated.View
          style={[
            styles.buttonGlow,
            {
              shadowRadius: buttonGlowRadius,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.playButton}
            onPress={onStart}
            activeOpacity={0.8}
          >
            <Text style={styles.playButtonText}>START GAME</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* ── Version tag ── */}
        <Text style={styles.version}>v2.0 • CYBER-PRISM</Text>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },

  dragonEmoji: {
    fontSize: 90,
    marginBottom: 20,
    textShadowColor: Colors.prismPurple,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },

  title: {
    fontSize: 38,
    fontWeight: '900',
    color: Colors.cyberCyan,
    letterSpacing: 8,
    textAlign: 'center',
    shadowColor: Colors.cyberCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.prismPurple,
    letterSpacing: 10,
    textAlign: 'center',
    marginTop: 6,
    shadowColor: Colors.prismPurple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
  },

  divider: {
    width: '50%',
    height: 1,
    backgroundColor: Colors.cyberCyan,
    opacity: 0.15,
    marginVertical: 32,
  },

  highScoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
    marginBottom: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  highScoreLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 4,
  },
  highScoreValue: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.electricMagenta,
    letterSpacing: 2,
    shadowColor: Colors.electricMagenta,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
  },

  tipsContainer: {
    gap: 10,
    marginBottom: 48,
    alignItems: 'center',
  },
  tipText: {
    fontSize: 13,
    color: Colors.textSecondary,
    letterSpacing: 1.5,
    fontWeight: '500',
  },

  buttonGlow: {
    borderRadius: 16,
    shadowColor: Colors.cyberCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    elevation: 25,
  },
  playButton: {
    backgroundColor: Colors.cyberCyan + '10',
    borderWidth: 2,
    borderColor: Colors.cyberCyan,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 48,
    minWidth: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonText: {
    color: Colors.cyberCyan,
    fontWeight: '900',
    fontSize: 20,
    letterSpacing: 4,
    textAlign: 'center',
  },

  version: {
    position: 'absolute',
    bottom: 24,
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
  },
});
