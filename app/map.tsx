import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Modal, ScrollView } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, MapPin, Star, DollarSign } from 'lucide-react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/colors';
import { Partner } from '@/constants/types';

const CITY_COORDINATES: Record<string, { latitude: number; longitude: number }> = {
  'Paris': { latitude: 48.8566, longitude: 2.3522 },
  'Lyon': { latitude: 45.7640, longitude: 4.8357 },
  'Marseille': { latitude: 43.2965, longitude: 5.3698 },
};

export default function MapScreen() {
  const { partners } = useApp();
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const region = useMemo(() => ({
    latitude: 48.8566,
    longitude: 2.3522,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  }), []);

  const partnersWithCoords = useMemo(() => {
    return partners.map((partner) => ({
      ...partner,
      coordinate: CITY_COORDINATES[partner.city] || CITY_COORDINATES['Paris'],
    }));
  }, [partners]);

  const handleMarkerPress = (partner: any) => {
    setSelectedPartner(partner);
  };

  const handleBooking = () => {
    setShowBookingModal(false);
    setSelectedPartner(null);
    router.push('/(tabs)');
  };

  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.webContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Carte des Partenaires</Text>
            <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
              <X size={24} color={Colors.dark.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.webFallback}>
            <MapPin size={64} color={Colors.dark.primary} />
            <Text style={styles.webFallbackTitle}>Carte Interactive</Text>
            <Text style={styles.webFallbackText}>
              La carte interactive est disponible sur mobile.
            </Text>
            
            <ScrollView style={styles.partnersList}>
              {partners.map((partner) => (
                <View key={partner.id} style={styles.partnerCard}>
                  <View style={styles.partnerInfo}>
                    <Text style={styles.partnerName}>{partner.name}</Text>
                    <View style={styles.partnerMeta}>
                      <MapPin size={14} color={Colors.dark.textSecondary} />
                      <Text style={styles.partnerCity}>{partner.city}</Text>
                      <Star size={14} color="#FFD700" style={{ marginLeft: 12 }} />
                      <Text style={styles.partnerRating}>{(partner as any).rating || 0}</Text>
                    </View>
                    <Text style={styles.partnerPrice}>{partner.pricePerSession} CHF / session</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Carte des Partenaires</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <X size={24} color={Colors.dark.text} />
        </TouchableOpacity>
      </View>

      <MapView
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={region}
        customMapStyle={darkMapStyle}
      >
        {partnersWithCoords.map((partner) => (
          <Marker
            key={partner.id}
            coordinate={partner.coordinate}
            onPress={() => handleMarkerPress(partner)}
          >
            <View style={styles.markerContainer}>
              <View style={styles.marker}>
                <MapPin size={20} color="#FFFFFF" fill={Colors.dark.primary} />
              </View>
            </View>
          </Marker>
        ))}
      </MapView>

      {selectedPartner && (
        <View style={styles.calloutCard}>
          <View style={styles.calloutHeader}>
            <View style={styles.calloutHeaderLeft}>
              <Text style={styles.calloutTitle}>{selectedPartner.name}</Text>
              <View style={styles.calloutMeta}>
                <MapPin size={14} color={Colors.dark.textSecondary} />
                <Text style={styles.calloutCity}>{selectedPartner.city}</Text>
                <Star size={14} color="#FFD700" style={{ marginLeft: 8 }} />
                <Text style={styles.calloutRating}>{(selectedPartner as any).rating || 0}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setSelectedPartner(null)}>
              <X size={20} color={Colors.dark.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.calloutDescription} numberOfLines={2}>
            {selectedPartner.description}
          </Text>

          <View style={styles.calloutFooter}>
            <View style={styles.priceContainer}>
              <DollarSign size={16} color={Colors.dark.primary} />
              <Text style={styles.price}>{selectedPartner.pricePerSession} CHF</Text>
              <Text style={styles.priceLabel}>/ session</Text>
            </View>

            <TouchableOpacity onPress={() => setShowBookingModal(true)}>
              <LinearGradient
                colors={['#FF2D95', '#A020F0']}
                style={styles.bookButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.bookButtonText}>Réserver</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Modal
        visible={showBookingModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBookingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Réservation</Text>
            <Text style={styles.modalText}>
              Pour réserver une séance, rendez-vous dans vos conversations et proposez une séance à votre match !
            </Text>
            <TouchableOpacity onPress={handleBooking}>
              <LinearGradient
                colors={['#FF2D95', '#A020F0']}
                style={styles.modalButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.modalButtonText}>Compris !</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1A1A1A' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8A8A8A' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1A1A1A' }] },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#2A2A2A' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6A6A6A' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#2A2A2A' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#8A8A8A' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0A0A0A' }],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.dark.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.dark.primary,
  },
  calloutCard: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    backgroundColor: Colors.dark.cardBg,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  calloutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  calloutHeaderLeft: {
    flex: 1,
  },
  calloutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 6,
  },
  calloutMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calloutCity: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    marginLeft: 4,
  },
  calloutRating: {
    fontSize: 13,
    color: '#FFD700',
    marginLeft: 4,
    fontWeight: '600',
  },
  calloutDescription: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  calloutFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginLeft: 4,
  },
  priceLabel: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    marginLeft: 4,
  },
  bookButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  bookButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: Colors.dark.cardBg,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButton: {
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  webContainer: {
    flex: 1,
  },
  webFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  webFallbackTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginTop: 24,
    marginBottom: 12,
  },
  webFallbackText: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  partnersList: {
    width: '100%',
    maxWidth: 600,
  },
  partnerCard: {
    backgroundColor: Colors.dark.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  partnerInfo: {
    flex: 1,
  },
  partnerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 8,
  },
  partnerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  partnerCity: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    marginLeft: 4,
  },
  partnerRating: {
    fontSize: 13,
    color: '#FFD700',
    marginLeft: 4,
    fontWeight: '600',
  },
  partnerPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.primary,
  },
});
