import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Image, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Send, Calendar } from 'lucide-react-native';
import { useAppContext } from '../../contexts/AppContext';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { conversations, profiles, addBooking } = useAppContext();
  
  // CORRECTION : On convertit tout en String pour comparer
  const targetUser = conversations?.find((c: any) => String(c.id) === String(id)) 
                  || profiles?.find((p: any) => String(p.id) === String(id));

  // SECOURS : Si jamais on ne trouve pas, on met un utilisateur par défaut pour éviter le crash
  const safeUser = targetUser || { 
    name: "Utilisateur", 
    photo: "https://images.unsplash.com/photo-1511367461989-f85a21fda167", 
    id: id 
  };

  const [text, setText] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: "Salut ! Ça te dit une séance de sport ?", sender: 'them' },
    { id: 2, text: "Carrément ! Tu es dispo quand ?", sender: 'me' },
  ]);

  const sendMessage = () => {
    if (text.trim().length === 0) return;
    setMessages(prev => [...prev, { id: Date.now(), text: text, sender: 'me' }]);
    setText('');
  };

  const handleBooking = () => {
    Alert.alert(
      "Paiement requis",
      "Le prix de la séance est de 25€. Choisissez votre méthode :",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "💳 Carte / Twint", 
          onPress: async () => {
            const success = await addBooking(String(id), "Séance Confirmée", new Date().toISOString());
            if (success) {
              Alert.alert("✅ Succès", "Paiement validé et demande envoyée !", [{ text: 'OK' }]);
              setMessages(prev => [...prev, { id: Date.now(), text: "✅ Réservation payée et envoyée.", sender: 'me' }]);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        <Image source={{ uri: safeUser.photo }} style={styles.avatar} />
        <Text style={styles.headerTitle}>{safeUser.name}</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.sender === 'me' ? styles.bubbleMe : styles.bubbleThem]}>
            <Text style={styles.msgText}>{item.text}</Text>
          </View>
        )}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.bookingBtnContainer}>
          <TouchableOpacity 
            onPress={handleBooking}
            style={styles.bookingBtnLarge}
            activeOpacity={0.8}
          >
            <Calendar color="white" size={20} />
            <Text style={styles.bookingBtnLargeText}>📅 RÉSERVER UNE SÉANCE (25€)</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input} 
            value={text}
            onChangeText={setText}
            placeholder="Écrire un message..." 
            placeholderTextColor="#666"
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
            <Send color="white" size={20} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#222', gap: 10 },
  backBtn: { marginRight: 15 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', flex: 1 },
  bubble: { maxWidth: '80%', padding: 12, borderRadius: 20, marginBottom: 10 },
  bubbleMe: { alignSelf: 'flex-end', backgroundColor: '#D91CD2', borderBottomRightRadius: 2 },
  bubbleThem: { alignSelf: 'flex-start', backgroundColor: '#333', borderBottomLeftRadius: 2 },
  msgText: { color: 'white', fontSize: 16 },
  inputContainer: { flexDirection: 'row', padding: 15, borderTopWidth: 1, borderTopColor: '#222', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#1A1A1A', color: 'white', borderRadius: 25, paddingHorizontal: 20, paddingVertical: 10, marginRight: 10 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#D91CD2', justifyContent: 'center', alignItems: 'center' },
  bookingBtnContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: '#222'
  },
  bookingBtnLarge: {
    flexDirection: 'row',
    backgroundColor: '#D91CD2',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#D91CD2',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8
  },
  bookingBtnLargeText: {
    color: 'white',
    fontWeight: '700' as const,
    fontSize: 16
  }
});
