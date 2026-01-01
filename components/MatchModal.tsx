import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, MessageCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import Colors from '@/constants/colors';
import { User } from '@/constants/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface MatchModalProps {
  visible: boolean;
  currentUser: User;
  matchedUser: User;
  onClose: () => void;
}

export default function MatchModal({ visible, currentUser, matchedUser, onClose }: MatchModalProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const heartScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Animated.sequence([
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.spring(heartScale, {
          toValue: 1,
          tension: 40,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
      heartScale.setValue(0);
    }
  }, [visible, scaleAnim, fadeAnim, heartScale]);

  if (!visible) return null;

  const conversationId = [currentUser.id, matchedUser.id].sort().join('_');

  const handleMessage = () => {
    onClose();
    router.push(`/chat/${conversationId}`);
  };

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={[Colors.dark.background, Colors.dark.cardBg]}
        style={styles.gradient}
      >
        <View style={styles.container}>
          <Animated.View
            style={[
              styles.heartContainer,
              {
                transform: [{ scale: heartScale }],
              },
            ]}
          >
            <LinearGradient
              colors={[Colors.dark.primary, Colors.dark.purple]}
              style={styles.heartBackground}
            >
              <Heart size={64} color="#FFF" fill="#FFF" />
            </LinearGradient>
          </Animated.View>

          <Text style={styles.title}>IT&apos;S A MATCH!</Text>
          <Text style={styles.subtitle}>
            Vous et {matchedUser.name} êtes maintenant connectés
          </Text>

          <Animated.View
            style={[
              styles.profilesContainer,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.profileImageContainer}>
              <Image source={{ uri: currentUser.photo }} style={styles.profileImage} />
              <View style={styles.profileBorder} />
            </View>

            <View style={styles.profileImageContainer}>
              <Image source={{ uri: matchedUser.photo }} style={styles.profileImage} />
              <View style={styles.profileBorder} />
            </View>
          </Animated.View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.messageButton}
              onPress={handleMessage}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[Colors.dark.primary, Colors.dark.purple]}
                style={styles.messageButtonGradient}
              >
                <MessageCircle size={24} color="#FFF" />
                <Text style={styles.messageButtonText}>Envoyer un message</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.continueButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>Continuer à swiper</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10000,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: SCREEN_WIDTH - 48,
    alignItems: 'center',
    paddingVertical: 40,
  },
  heartContainer: {
    marginBottom: 24,
  },
  heartBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 15,
  },
  title: {
    fontSize: 48,
    fontWeight: '800' as const,
    color: Colors.dark.text,
    letterSpacing: 2,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 24,
    lineHeight: 24,
  },
  profilesContainer: {
    flexDirection: 'row',
    gap: -30,
    marginBottom: 40,
  },
  profileImageContainer: {
    position: 'relative' as const,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: Colors.dark.background,
  },
  profileBorder: {
    position: 'absolute' as const,
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 64,
    borderWidth: 3,
    borderColor: Colors.dark.primary,
  },
  actions: {
    width: '100%',
    gap: 16,
  },
  messageButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  messageButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 12,
  },
  messageButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  continueButton: {
    paddingVertical: 18,
    alignItems: 'center',
    backgroundColor: Colors.dark.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.textSecondary,
  },
});
