import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Heart, RefreshCw } from 'lucide-react-native';
import { useAppContext } from '../../contexts/AppContext';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const { profiles, swipeRight, swipeLeft, isLoading } = useAppContext();
  
  const [currentIndex, setCurrentIndex] = useState(0);

  const safeProfiles = profiles || [];
  const currentProfile = safeProfiles[currentIndex];

  const handleSwipe = (action: 'like' | 'pass') => {
    if (!currentProfile) return;

    if (action === 'like') {
      if (swipeRight) swipeRight(currentProfile);
    } else {
      if (swipeLeft) swipeLeft(currentProfile.id);
    }

    setCurrentIndex(prev => prev + 1);
  };

  const handleReset = () => setCurrentIndex(0);

  if (isLoading) {
    return <View style={[styles.container, styles.center]}><ActivityIndicator color="#D91CD2" /></View>;
  }

  if (!currentProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <RefreshCw size={50} color="#666" />
          <Text style={styles.textWhite}>C&apos;est tout pour le moment !</Text>
          <TouchableOpacity onPress={handleReset} style={styles.btnReset}>
            <Text style={styles.textBtn}>Revoir les profils</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image 
          key={currentIndex}
          source={{ uri: currentProfile.photo }} 
          style={styles.image} 
          resizeMode="cover" 
        />
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.9)']} style={styles.gradient}>
          <Text style={styles.name}>{currentProfile.name}, {currentProfile.age}</Text>
          <Text style={styles.info}>{currentProfile.sport} • {currentProfile.city}</Text>
        </LinearGradient>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={() => handleSwipe('pass')} style={[styles.roundBtn, styles.passBtn]}>
          <X size={32} color="#EF4444" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSwipe('like')} style={[styles.roundBtn, styles.likeBtn]}>
          <Heart size={40} color="white" fill="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { height: height * 0.72, width: width, backgroundColor: '#222', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, overflow: 'hidden', zIndex: 1, shadowColor: "#D91CD2", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10, borderWidth: 1, borderColor: 'rgba(217, 28, 210, 0.3)' },
  image: { width: '100%', height: '100%' },
  gradient: { position: 'absolute', bottom: 0, width: '100%', padding: 20, paddingBottom: 40 },
  name: { color: 'white', fontSize: 32, fontWeight: 'bold' },
  info: { color: '#D91CD2', fontSize: 18, marginTop: 5 },
  buttonsContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: -35, zIndex: 100, elevation: 10 },
  roundBtn: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginHorizontal: 15, shadowColor:'#000', shadowOpacity:0.5, elevation:5 },
  passBtn: { backgroundColor: '#1A1A1A', borderWidth: 1, borderColor: '#333' },
  likeBtn: { backgroundColor: '#D91CD2', width: 80, height: 80, borderRadius: 40, shadowColor: '#D91CD2', shadowOpacity: 0.8, shadowRadius: 20, elevation: 15 },
  textWhite: { color: 'white', marginTop: 20, fontSize: 18 },
  btnReset: { marginTop: 20, padding: 10, backgroundColor: '#333', borderRadius: 8 },
  textBtn: { color: 'white' }
});
