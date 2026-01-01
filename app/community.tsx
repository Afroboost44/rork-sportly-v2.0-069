import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Plus, Users, MapPin, Calendar, Clock, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { CommunityEvent, Sport } from '@/constants/types';
import Toast from '@/components/Toast';

const SPORTS: Sport[] = ['Fitness', 'Yoga', 'Tennis', 'Natation', 'Running', 'Escalade', 'Boxe', 'Danse'];

export default function CommunityScreen() {
  const { currentUser, getCommunityEvents, joinCommunityEvent, leaveCommunityEvent, users } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' as 'success' | 'error' | 'info' });

  const events = getCommunityEvents();

  if (!currentUser || currentUser.role !== 'user') {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.errorText}>Connectez-vous pour voir les événements</Text>
      </View>
    );
  }

  const user = currentUser;

  const handleJoinEvent = async (eventId: string) => {
    if (!joinCommunityEvent) return;
    const success = await joinCommunityEvent(eventId);
    if (success) {
      setToast({ visible: true, message: 'Vous avez rejoint l&apos;événement !', type: 'success' });
    } else {
      setToast({ visible: true, message: 'Impossible de rejoindre l\'événement', type: 'error' });
    }
  };

  const handleLeaveEvent = async (eventId: string) => {
    if (!leaveCommunityEvent) return;
    const success = await leaveCommunityEvent(eventId);
    if (success) {
      setToast({ visible: true, message: 'Vous avez quitté l\'événement', type: 'info' });
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <LinearGradient
        colors={[Colors.dark.background, Colors.dark.cardBg]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color={Colors.dark.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Communauté</Text>
          <TouchableOpacity 
            onPress={() => setShowCreateModal(true)}
            style={styles.addButton}
          >
            <Plus size={24} color={Colors.dark.text} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {events.length === 0 ? (
            <View style={styles.emptyState}>
              <Users size={64} color={Colors.dark.textSecondary} />
              <Text style={styles.emptyText}>Aucun événement pour le moment</Text>
              <Text style={styles.emptySubtext}>Créez le premier événement !</Text>
            </View>
          ) : (
            events.map((event: CommunityEvent) => {
              const creator = users.find((u: { id: string | number; name: string }) => u.id === event.creatorId);
              const isParticipant = event.participants.includes(user.id);
              const isFull = event.participants.length >= event.maxParticipants;

              return (
                <View key={event.id} style={styles.eventCard}>
                  <View style={styles.eventHeader}>
                    <Text style={styles.eventSport}>{event.sport}</Text>
                    <View style={styles.participantsCount}>
                      <Users size={16} color={Colors.dark.text} />
                      <Text style={styles.participantsText}>
                        {event.participants.length}/{event.maxParticipants}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventDescription}>{event.description}</Text>

                  <View style={styles.eventDetails}>
                    <View style={styles.eventDetailRow}>
                      <MapPin size={16} color={Colors.dark.textSecondary} />
                      <Text style={styles.eventDetailText}>{event.location}</Text>
                    </View>
                    <View style={styles.eventDetailRow}>
                      <Calendar size={16} color={Colors.dark.textSecondary} />
                      <Text style={styles.eventDetailText}>{event.date}</Text>
                    </View>
                    <View style={styles.eventDetailRow}>
                      <Clock size={16} color={Colors.dark.textSecondary} />
                      <Text style={styles.eventDetailText}>{event.time}</Text>
                    </View>
                  </View>

                  <Text style={styles.eventCreator}>
                    Créé par {creator?.name || 'Utilisateur'}
                  </Text>

                  {event.creatorId !== user.id && (
                    <TouchableOpacity
                      style={[
                        styles.joinButton,
                        isParticipant && styles.leaveButton,
                        isFull && !isParticipant && styles.fullButton
                      ]}
                      onPress={() => isParticipant ? handleLeaveEvent(event.id) : handleJoinEvent(event.id)}
                      disabled={isFull && !isParticipant}
                    >
                      <LinearGradient
                        colors={
                          isParticipant 
                            ? [Colors.dark.error, Colors.dark.error] 
                            : isFull 
                              ? [Colors.dark.border, Colors.dark.border]
                              : [Colors.dark.primary, Colors.dark.purple]
                        }
                        style={styles.joinButtonGradient}
                      >
                        <Text style={styles.joinButtonText}>
                          {isParticipant ? 'Quitter' : isFull ? 'Complet' : 'Participer'}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })
          )}
        </ScrollView>
      </LinearGradient>

      <CreateEventModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          setToast({ visible: true, message: 'Événement créé avec succès !', type: 'success' });
        }}
      />

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ ...toast, visible: false })}
      />
    </View>
  );
}

function CreateEventModal({ visible, onClose, onSuccess }: { visible: boolean; onClose: () => void; onSuccess: () => void }) {
  const { currentUser, createCommunityEvent } = useApp();
  const [title, setTitle] = useState('');
  const [sport, setSport] = useState<Sport>('Fitness');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('10');

  const handleCreate = async () => {
    if (!currentUser || currentUser.role !== 'user') return;
    if (!title || !location || !date || !time) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    const success = await createCommunityEvent({
      creatorId: currentUser.id,
      title,
      sport,
      location,
      date,
      time,
      description,
      participants: [currentUser.id],
      maxParticipants: parseInt(maxParticipants) || 10
    });

    if (success) {
      setTitle('');
      setLocation('');
      setDate('');
      setTime('');
      setDescription('');
      setMaxParticipants('10');
      onSuccess();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Créer un événement</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={Colors.dark.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.label}>Titre *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Running Dimanche Matin"
              placeholderTextColor={Colors.dark.textSecondary}
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>Sport *</Text>
            <View style={styles.sportSelector}>
              {SPORTS.map(s => (
                <TouchableOpacity
                  key={s}
                  style={[styles.sportOption, sport === s && styles.sportOptionSelected]}
                  onPress={() => setSport(s)}
                >
                  <Text style={[styles.sportOptionText, sport === s && styles.sportOptionTextSelected]}>
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Lieu *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Parc de la Tête d'Or"
              placeholderTextColor={Colors.dark.textSecondary}
              value={location}
              onChangeText={setLocation}
            />

            <Text style={styles.label}>Date *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 2025-02-15"
              placeholderTextColor={Colors.dark.textSecondary}
              value={date}
              onChangeText={setDate}
            />

            <Text style={styles.label}>Heure *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 10:00"
              placeholderTextColor={Colors.dark.textSecondary}
              value={time}
              onChangeText={setTime}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Décrivez votre événement..."
              placeholderTextColor={Colors.dark.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.label}>Nombre max de participants</Text>
            <TextInput
              style={styles.input}
              placeholder="10"
              placeholderTextColor={Colors.dark.textSecondary}
              value={maxParticipants}
              onChangeText={setMaxParticipants}
              keyboardType="number-pad"
            />

            <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
              <LinearGradient
                colors={[Colors.dark.primary, Colors.dark.purple]}
                style={styles.createButtonGradient}
              >
                <Text style={styles.createButtonText}>Créer l&apos;événement</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Colors.dark.text,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.dark.textSecondary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginTop: 8,
  },
  eventCard: {
    backgroundColor: Colors.dark.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventSport: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.dark.primary,
    backgroundColor: Colors.dark.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  participantsCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  participantsText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: Colors.dark.text,
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  eventDetails: {
    gap: 8,
    marginBottom: 12,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventDetailText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  eventCreator: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    fontStyle: 'italic' as const,
    marginBottom: 12,
  },
  joinButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  leaveButton: {
    opacity: 0.8,
  },
  fullButton: {
    opacity: 0.5,
  },
  joinButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  joinButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: Colors.dark.cardBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Colors.dark.text,
  },
  modalContent: {
    padding: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.dark.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.dark.text,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  sportSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  sportOption: {
    backgroundColor: Colors.dark.background,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  sportOptionSelected: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  sportOptionText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  sportOptionTextSelected: {
    color: Colors.dark.text,
    fontWeight: '700' as const,
  },
  createButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
  },
  createButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  errorText: {
    fontSize: 18,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginTop: 100,
  },
});
