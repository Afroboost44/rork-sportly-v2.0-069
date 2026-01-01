import { Stack, router } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, Modal, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LogOut, Settings, Crown, MapPin, Heart, Calendar, Euro, RefreshCw, Users as UsersIcon, Share2, Edit2 } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Partner, Badge } from '@/constants/types';
import React from "react";

const MY_EVENTS = [
  { id: 1, title: "Afroboost Silent Session", date: "Samedi 14:00", place: "Parc des Bastions", participants: 24, image: "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9" },
  { id: 2, title: "Cardio Afrobeat", date: "Dimanche 10:00", place: "Bord du Lac", participants: 18, image: "https://images.unsplash.com/photo-1524594152303-9fd13543fe6e" },
];

export default function ProfileScreen() {
  const { currentUser, logout, getPartnerBookings, users, resetData, switchRole, getUserBadges, matches, updateUserProfile } = useApp();
  const { language, setLanguage } = useLanguage();
  const [editModalVisible, setEditModalVisible] = React.useState(false);
  const [editName, setEditName] = React.useState('');
  const [editBio, setEditBio] = React.useState('');
  const [editPhoto, setEditPhoto] = React.useState('');

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Déconnexion', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/auth/login');
          }
        },
      ]
    );
  };

  const handleShareProfile = async () => {
    if (!currentUser) return;
    
    const deepLink = `sportly://profile/${currentUser.id}`;
    await Clipboard.setStringAsync(deepLink);
    
    Alert.alert(
      'Lien copié !',
      'Le lien de votre profil a été copié dans le presse-papier.',
      [{ text: 'OK' }]
    );
  };

  const handleEditProfile = () => {
    setEditName(currentUser?.name || '');
    setEditBio(currentUser?.bio || '');
    setEditPhoto(currentUser?.photo || '');
    setEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    const updates = {
      name: editName,
      bio: editBio,
      photo: editPhoto,
    };
    
    const success = await updateUserProfile(updates);
    if (success) {
      setEditModalVisible(false);
      Alert.alert('✅ Profil mis à jour', 'Vos modifications ont été enregistrées.');
    }
  };

  const addEvent = () => {
    Alert.alert("Nouveau cours", "Cours 'Afroboost Session' ajouté au calendrier !");
  };

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <LinearGradient
          colors={[Colors.dark.background, Colors.dark.cardBg]}
          style={styles.gradient}
        >
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Connectez-vous pour voir votre profil</Text>
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={() => router.push('/auth/login')}
            >
              <LinearGradient
                colors={[Colors.dark.primary, Colors.dark.purple]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.loginButtonText}>Se connecter</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }

  if (currentUser.role === 'admin') {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <LinearGradient
          colors={[Colors.dark.background, Colors.dark.cardBg]}
          style={styles.gradient}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Admin Dashboard</Text>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <LogOut size={24} color={Colors.dark.text} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.adminCard}>
              <Text style={styles.adminName}>{currentUser.name}</Text>
              <Text style={styles.adminRole}>Administrateur</Text>
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
    );
  }

  if (currentUser.role === 'partner') {
    const partner = currentUser as Partner;
    const bookings = getPartnerBookings(partner.id);
    
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <LinearGradient
          colors={[Colors.dark.background, Colors.dark.cardBg]}
          style={styles.gradient}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Partenaire</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <TouchableOpacity onPress={addEvent} style={{ backgroundColor: '#D91CD2', padding: 8, borderRadius: 8 }}>
                <Text style={{ color: 'white', fontWeight: '700' as const }}>+ Cours</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <LogOut size={24} color={Colors.dark.text} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            <Image source={{ uri: currentUser.photo }} style={styles.partnerPhoto} />
            <Text style={styles.partnerName}>{currentUser.name}</Text>
            <Text style={styles.partnerType}>{partner.type}</Text>
            
            <View style={styles.statsCard}>
              <View style={styles.statItem}>
                <Euro size={24} color={Colors.dark.primary} />
                <Text style={styles.statValue}>{partner.pricePerSession}€</Text>
                <Text style={styles.statLabel}>Par session</Text>
              </View>
              <View style={styles.statItem}>
                <Euro size={24} color={Colors.dark.success} />
                <Text style={styles.statValue}>{partner.revenue}€</Text>
                <Text style={styles.statLabel}>Revenus</Text>
              </View>
              <View style={styles.statItem}>
                <Heart size={24} color={Colors.dark.gold} />
                <Text style={styles.statValue}>{(partner.rating || 0).toFixed(1)}</Text>
                <Text style={styles.statLabel}>Note</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.bookingSectionTitle}>Réservations ({bookings.length})</Text>
              {bookings.length === 0 ? (
                <View style={styles.emptyBookingCard}>
                  <Calendar size={48} color={Colors.dark.textSecondary} />
                  <Text style={styles.emptyBookingText}>Aucune réservation pour le moment</Text>
                </View>
              ) : (
                bookings.map((booking: any) => {
                  const user = users.find((u: any) => u.id === booking.userId);
                  return (
                    <View key={booking.id} style={styles.bookingCard}>
                      <Image source={{ uri: user?.photo || '' }} style={styles.bookingAvatar} />
                      <View style={styles.bookingInfo}>
                        <Text style={styles.bookingUserName}>{user?.name}</Text>
                        <Text style={styles.bookingDate}>
                          {booking.date} à {booking.time}
                        </Text>
                        <View style={styles.bookingBadge}>
                          <Text style={styles.bookingPrice}>{booking.price}€</Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
    );
  }

  const user = currentUser;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <LinearGradient
        colors={[Colors.dark.background, Colors.dark.cardBg]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Profil</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <LogOut size={24} color={Colors.dark.text} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>

          <View style={styles.profileHeader}>
            <Image source={{ uri: user.photo }} style={styles.profilePhoto} />
            {user.isPremium && (
              <View style={styles.premiumBadge}>
                <Crown size={16} color={Colors.dark.gold} fill={Colors.dark.gold} />
              </View>
            )}
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditProfile}
              activeOpacity={0.8}
              accessibilityLabel="Modifier le profil"
            >
              <Edit2 size={20} color="#D91CD2" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={handleShareProfile}
              activeOpacity={0.8}
              accessibilityLabel="Partager mon profil"
            >
              <Share2 size={20} color={Colors.dark.primary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>{user.name}, {user.age}</Text>
          
          <View style={styles.infoRow}>
            <MapPin size={16} color={Colors.dark.textSecondary} />
            <Text style={styles.infoText}>{user.city}</Text>
          </View>

          <Text style={styles.bio}>{user.bio}</Text>

          <View style={styles.sportsContainer}>
            <Text style={styles.sectionTitle}>Sports pratiqués</Text>
            <View style={styles.sportsGrid}>
              {(user.sports || []).map((sport: string, index: number) => (
                <View 
                  key={`${sport}-${index}`} 
                  style={[
                    styles.sportChip,
                    sport === user.favoriteSport && styles.sportChipFavorite
                  ]}
                >
                  <Text style={[
                    styles.sportChipText,
                    sport === user.favoriteSport && styles.sportChipTextFavorite
                  ]}>
                    {sport}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Heart size={24} color={Colors.dark.primary} />
              <Text style={styles.statNumber}>{matches?.length || 0}</Text>
              <Text style={styles.statLabel}>Matchs</Text>
            </View>
          </View>

          <View style={styles.badgesContainer}>
            <Text style={styles.sectionTitle}>Trophées</Text>
            <View style={styles.badgesGrid}>
              {getUserBadges().map((badge: Badge) => (
                <View 
                  key={badge.id} 
                  style={[
                    styles.badgeCard,
                    !badge.unlocked && styles.badgeCardLocked
                  ]}
                >
                  <Text style={[
                    styles.badgeIcon,
                    !badge.unlocked && styles.badgeIconLocked
                  ]}>
                    {badge.icon}
                  </Text>
                  <Text style={[
                    styles.badgeName,
                    !badge.unlocked && styles.badgeNameLocked
                  ]}>
                    {badge.name}
                  </Text>
                  {badge.unlocked ? (
                    <Text style={styles.badgeDescription}>{badge.description}</Text>
                  ) : (
                    <Text style={styles.badgeRequirement}>{badge.requirement}</Text>
                  )}
                </View>
              ))}
            </View>
          </View>

          <View style={styles.eventsContainer}>
            <Text style={styles.sectionTitle}>Mes Événements Afroboost</Text>
            {MY_EVENTS.map(item => (
              <View key={item.id} style={styles.eventCard}>
                <Image source={{ uri: item.image }} style={styles.eventImage} />
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{item.title}</Text>
                  <Text style={styles.eventDetails}>📅 {item.date} • 📍 {item.place}</Text>
                  <Text style={styles.eventParticipants}>🎧 {item.participants} participants</Text>
                </View>
              </View>
            ))}
          </View>

          {!user.isPremium && (
            <TouchableOpacity
              style={styles.premiumButton}
              onPress={() => router.push('/premium')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#FFD700', '#FF2D95']}
                style={styles.premiumButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Crown size={24} color="#FFFFFF" />
                <Text style={styles.premiumButtonText}>Passer à Premium</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.mapButton}
            onPress={() => router.push('/map')}
            activeOpacity={0.8}
          >
            <MapPin size={20} color={Colors.dark.primary} />
            <Text style={styles.mapButtonText}>Voir les partenaires sur la carte</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.communityButton}
            onPress={() => router.push('/community')}
            activeOpacity={0.8}
          >
            <UsersIcon size={20} color={Colors.dark.purple} />
            <Text style={styles.communityButtonText}>Événements communautaires</Text>
          </TouchableOpacity>

          <View style={styles.languageContainer}>
            <Text style={styles.sectionTitle}>Langue / Language</Text>
            <View style={styles.languageButtons}>
              <TouchableOpacity
                style={[styles.languageButton, language === 'fr' && styles.languageButtonActive]}
                onPress={() => setLanguage('fr')}
              >
                <Text style={[styles.languageFlag, language === 'fr' && styles.languageFlagActive]}>🇫🇷</Text>
                <Text style={[styles.languageText, language === 'fr' && styles.languageTextActive]}>FR</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.languageButton, language === 'en' && styles.languageButtonActive]}
                onPress={() => setLanguage('en')}
              >
                <Text style={[styles.languageFlag, language === 'en' && styles.languageFlagActive]}>🇬🇧</Text>
                <Text style={[styles.languageText, language === 'en' && styles.languageTextActive]}>EN</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.languageButton, language === 'de' && styles.languageButtonActive]}
                onPress={() => setLanguage('de')}
              >
                <Text style={[styles.languageFlag, language === 'de' && styles.languageFlagActive]}>🇩🇪</Text>
                <Text style={[styles.languageText, language === 'de' && styles.languageTextActive]}>DE</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => router.push('/settings')}
            accessibilityLabel="Paramètres"
          >
            <Settings size={20} color={Colors.dark.textSecondary} />
            <Text style={styles.settingsText}>Paramètres</Text>
          </TouchableOpacity>

          {__DEV__ && (
            <View style={styles.dangerZone}>
              <Text style={styles.dangerZoneTitle}>🔧 Zone de Développement</Text>
              
              <View style={styles.devButtons}>
                <TouchableOpacity
                  style={[styles.devButton, styles.devButtonReset]}
                  onPress={() => {
                    Alert.alert(
                      'Reset Data',
                      'Êtes-vous sûr de vouloir réinitialiser toutes les données ?',
                      [
                        { text: 'Annuler', style: 'cancel' },
                        {
                          text: 'Reset',
                          style: 'destructive',
                          onPress: async () => {
                            await resetData();
                            Alert.alert('Succès', 'Les données ont été réinitialisées');
                            router.replace('/auth/login');
                          },
                        },
                      ]
                    );
                  }}
                >
                  <RefreshCw size={20} color={Colors.dark.error} />
                  <Text style={styles.devButtonTextReset}>Reset Data</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.devButton, styles.devButtonSwitch]}
                  onPress={() => {
                    Alert.alert(
                      'Switch Role',
                      'Choisissez un rôle',
                      [
                        {
                          text: 'User',
                          onPress: () => {
                            switchRole('user');
                            router.replace('/');
                          },
                        },
                        {
                          text: 'Partner',
                          onPress: () => {
                            switchRole('partner');
                            router.replace('/');
                          },
                        },
                        {
                          text: 'Admin',
                          onPress: () => {
                            switchRole('admin');
                            router.replace('/admin/dashboard');
                          },
                        },
                        { text: 'Annuler', style: 'cancel' },
                      ]
                    );
                  }}
                >
                  <UsersIcon size={20} color={Colors.dark.primary} />
                  <Text style={styles.devButtonTextSwitch}>Switch Role</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </LinearGradient>

      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>✏️ Modifier le profil</Text>
            
            <Text style={styles.inputLabel}>Nom</Text>
            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              placeholder="Votre nom"
              placeholderTextColor={Colors.dark.textSecondary}
            />
            
            <Text style={styles.inputLabel}>Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={editBio}
              onChangeText={setEditBio}
              placeholder="Décrivez-vous en quelques mots"
              placeholderTextColor={Colors.dark.textSecondary}
              multiline
              numberOfLines={3}
            />
            
            <Text style={styles.inputLabel}>URL Photo</Text>
            <TextInput
              style={styles.input}
              value={editPhoto}
              onChangeText={setEditPhoto}
              placeholder="https://..."
              placeholderTextColor={Colors.dark.textSecondary}
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveButtonText}>Sauvegarder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: Colors.dark.text,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative' as const,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#D91CD2',
  },
  premiumBadge: {
    position: 'absolute' as const,
    top: 0,
    right: '35%',
    backgroundColor: Colors.dark.cardBg,
    borderRadius: 16,
    padding: 8,
    borderWidth: 2,
    borderColor: Colors.dark.gold,
  },
  editButton: {
    position: 'absolute' as const,
    bottom: 0,
    left: '35%',
    backgroundColor: Colors.dark.cardBg,
    borderRadius: 20,
    padding: 10,
    borderWidth: 2,
    borderColor: '#D91CD2',
    shadowColor: '#D91CD2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  shareButton: {
    position: 'absolute' as const,
    bottom: 0,
    right: '35%',
    backgroundColor: Colors.dark.cardBg,
    borderRadius: 20,
    padding: 10,
    borderWidth: 2,
    borderColor: Colors.dark.primary,
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  name: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
  },
  bio: {
    fontSize: 16,
    color: Colors.dark.text,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  sportsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    marginBottom: 12,
  },
  sportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sportChip: {
    backgroundColor: '#000000',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#D91CD2',
  },
  sportChipFavorite: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  sportChipText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  sportChipTextFavorite: {
    color: Colors.dark.text,
    fontWeight: '700' as const,
  },
  statsContainer: {
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: Colors.dark.cardBg,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: Colors.dark.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginTop: 4,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.dark.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  settingsText: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    fontWeight: '600' as const,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.dark.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  loginButton: {
    borderRadius: 16,
    overflow: 'hidden',
    width: '100%',
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  adminCard: {
    backgroundColor: Colors.dark.cardBg,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.gold,
  },
  adminName: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Colors.dark.text,
    marginBottom: 8,
  },
  adminRole: {
    fontSize: 16,
    color: Colors.dark.gold,
  },
  partnerPhoto: {
    width: 120,
    height: 120,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#D91CD2',
  },
  partnerName: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  partnerType: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.cardBg,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Colors.dark.text,
  },
  section: {
    marginTop: 24,
  },
  bookingSectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    marginBottom: 16,
  },
  emptyBookingCard: {
    backgroundColor: Colors.dark.cardBg,
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  emptyBookingText: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    marginTop: 16,
    textAlign: 'center',
  },
  bookingCard: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  bookingAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  bookingInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  bookingUserName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    marginBottom: 4,
  },
  bookingDate: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginBottom: 8,
  },
  bookingBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.dark.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  bookingPrice: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  languageContainer: {
    marginBottom: 24,
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  languageButton: {
    flex: 1,
    backgroundColor: Colors.dark.cardBg,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.dark.border,
  },
  languageButtonActive: {
    borderColor: Colors.dark.primary,
    backgroundColor: Colors.dark.primary + '20',
  },
  languageFlag: {
    fontSize: 32,
    marginBottom: 8,
  },
  languageFlagActive: {
    transform: [{ scale: 1.1 }],
  },
  languageText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.dark.textSecondary,
  },
  languageTextActive: {
    color: Colors.dark.primary,
    fontWeight: '700' as const,
  },
  premiumButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  premiumButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 18,
  },
  premiumButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.dark.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    marginBottom: 24,
  },
  mapButtonText: {
    fontSize: 16,
    color: Colors.dark.text,
    fontWeight: '600' as const,
  },
  communityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.dark.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.purple,
    marginBottom: 24,
  },
  communityButtonText: {
    fontSize: 16,
    color: Colors.dark.text,
    fontWeight: '600' as const,
  },
  dangerZone: {
    marginTop: 24,
    padding: 20,
    backgroundColor: Colors.dark.error + '10',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.dark.error + '40',
  },
  dangerZoneTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  devButtons: {
    gap: 12,
  },
  devButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
  },
  devButtonReset: {
    backgroundColor: Colors.dark.error + '20',
    borderColor: Colors.dark.error,
  },
  devButtonSwitch: {
    backgroundColor: Colors.dark.primary + '20',
    borderColor: Colors.dark.primary,
  },
  devButtonTextReset: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.dark.error,
  },
  devButtonTextSwitch: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.dark.primary,
  },
  badgesContainer: {
    marginBottom: 24,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCard: {
    backgroundColor: Colors.dark.cardBg,
    borderRadius: 16,
    padding: 16,
    width: '47%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.dark.primary,
  },
  badgeCardLocked: {
    borderColor: Colors.dark.border,
    opacity: 0.5,
  },
  badgeIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  badgeIconLocked: {
    opacity: 0.3,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  badgeNameLocked: {
    color: Colors.dark.textSecondary,
  },
  badgeDescription: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  badgeRequirement: {
    fontSize: 11,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic' as const,
  },
  eventsContainer: {
    marginBottom: 24,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D91CD2',
  },
  eventImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    color: '#D91CD2',
    fontWeight: '700' as const,
    fontSize: 16,
    marginBottom: 4,
  },
  eventDetails: {
    color: '#D91CD2',
    marginTop: 4,
    fontSize: 14,
  },
  eventParticipants: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.dark.cardBg,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 2,
    borderColor: '#D91CD2',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Colors.dark.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.dark.text,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: Colors.dark.background,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: Colors.dark.text,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.dark.textSecondary,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#D91CD2',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
});
