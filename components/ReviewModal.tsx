import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Star } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useState } from 'react';
import { Partner } from '@/constants/types';

interface ReviewModalProps {
  visible: boolean;
  onClose: () => void;
  partner: Partner | null;
  bookingId: string;
  onSubmit: (rating: number, comment: string) => void;
}

export default function ReviewModal({ visible, onClose, partner, bookingId, onSubmit }: ReviewModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');

  const handleSubmit = () => {
    if (rating === 0) {
      return;
    }
    onSubmit(rating, comment);
    setRating(0);
    setComment('');
    onClose();
  };

  if (!partner) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <LinearGradient
            colors={[Colors.dark.cardBg, Colors.dark.background]}
            style={styles.content}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Noter votre séance</Text>
              <TouchableOpacity
                onPress={onClose}
                style={styles.closeButton}
                accessibilityLabel="Fermer"
              >
                <X size={24} color={Colors.dark.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.partnerName}>{partner.name}</Text>
              <Text style={styles.subtitle}>Comment s&apos;est passée votre séance ?</Text>

              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRating(star)}
                    style={styles.starButton}
                    accessibilityLabel={`${star} étoile${star > 1 ? 's' : ''}`}
                  >
                    <Star
                      size={48}
                      color={star <= rating ? Colors.dark.gold : Colors.dark.textSecondary}
                      fill={star <= rating ? Colors.dark.gold : 'transparent'}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              {rating > 0 && (
                <Text style={styles.ratingText}>
                  {rating === 1 && '⭐ Décevant'}
                  {rating === 2 && '⭐⭐ Moyen'}
                  {rating === 3 && '⭐⭐⭐ Bien'}
                  {rating === 4 && '⭐⭐⭐⭐ Très bien'}
                  {rating === 5 && '⭐⭐⭐⭐⭐ Excellent'}
                </Text>
              )}

              <View style={styles.commentContainer}>
                <Text style={styles.label}>Votre avis (optionnel)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Partagez votre expérience..."
                  placeholderTextColor={Colors.dark.textSecondary}
                  value={comment}
                  onChangeText={setComment}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  maxLength={500}
                />
                <Text style={styles.charCount}>{comment.length}/500</Text>
              </View>

              <TouchableOpacity
                style={[styles.submitButton, rating === 0 && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={rating === 0}
                accessibilityLabel="Envoyer l'avis"
              >
                <LinearGradient
                  colors={rating === 0 ? [Colors.dark.border, Colors.dark.border] : [Colors.dark.primary, Colors.dark.purple]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitGradient}
                >
                  <Text style={[styles.submitText, rating === 0 && styles.submitTextDisabled]}>
                    Envoyer mon avis
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  container: {
    maxHeight: '90%',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Colors.dark.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partnerName: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.dark.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  starButton: {
    padding: 4,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.dark.gold,
    textAlign: 'center',
    marginBottom: 24,
  },
  commentContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.text,
    marginBottom: 12,
  },
  input: {
    backgroundColor: Colors.dark.background,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: Colors.dark.text,
    minHeight: 120,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  charCount: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    textAlign: 'right',
    marginTop: 8,
  },
  submitButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  submitText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  submitTextDisabled: {
    color: Colors.dark.textSecondary,
  },
});
