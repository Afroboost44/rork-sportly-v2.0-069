import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, TextInput, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppContext } from '../../contexts/AppContext';
import { TrendingUp, Users, LogOut, PlusCircle, Zap, Trash2, Edit2, Eye, EyeOff, Bell, Check, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function PartnerDashboard() {
  const router = useRouter();
  const { user, logout, offers, addOffer, toggleOfferStatus, deleteOffer, boostOffer, bookings, updateBookingStatus, users } = useAppContext();
  
  const [tab, setTab] = useState<'offers' | 'bookings'>('offers');
  const [modalVisible, setModalVisible] = useState(false);
  
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');

  const handleCreate = () => {
    if (!title || !price) return Alert.alert("Erreur", "Champs manquants");
    addOffer({ 
      title, 
      desc, 
      price, 
      date, 
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a" 
    });
    setModalVisible(false);
    setTitle(''); 
    setPrice(''); 
    setDesc(''); 
    setDate('');
    Alert.alert("Succès", "Offre créée et active !");
  };

  const handleBoost = (id: number) => {
    Alert.alert("Booster l'offre", "Payer 5€ pour mettre cette offre en avant ?", [
      { text: "Annuler" },
      { text: "Payer & Booster", onPress: () => { boostOffer(id); Alert.alert("Boost activé 🚀"); } }
    ]);
  };

  const handleDelete = (id: number) => {
    Alert.alert("Supprimer l'offre", "Cette action est définitive.", [
      { text: "Annuler" },
      { text: "Supprimer", style: 'destructive', onPress: () => deleteOffer(id) }
    ]);
  };

  const getUserDetails = (userId: string) => {
    return users.find((u: any) => u.id.toString() === userId.toString());
  };

  const confirmed = bookings.filter((b: any) => b.status === 'confirmed');
  const totalRevenue = confirmed.reduce((acc: any, curr: any) => acc + curr.price, 0);

  return (
    <View style={styles.container}>
      <SafeAreaView style={{flex:1}}>
        
        <View style={styles.header}>
          <View>
            <Text style={styles.role}>ESPACE PARTENAIRE</Text>
            <Text style={styles.name}>{user?.name}</Text>
          </View>
          <View style={{flexDirection:'row', gap:10}}>
            <TouchableOpacity style={styles.iconBtn}><Bell color="white" size={20} /></TouchableOpacity>
            <TouchableOpacity onPress={() => { logout(); router.replace('/'); }} style={styles.iconBtn}>
              <LogOut color="#EF4444" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsRow}>
          <LinearGradient colors={['#1A1A1A', '#000']} style={styles.statCard}>
            <TrendingUp color="#D91CD2" size={24} />
            <Text style={styles.statValue}>{totalRevenue} €</Text>
            <Text style={styles.statLabel}>Revenus</Text>
          </LinearGradient>
          <LinearGradient colors={['#1A1A1A', '#000']} style={styles.statCard}>
            <Users color="#4ADE80" size={24} />
            <Text style={styles.statValue}>{offers?.length || 0}</Text>
            <Text style={styles.statLabel}>Offres actives</Text>
          </LinearGradient>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity onPress={() => setTab('offers')} style={[styles.tab, tab === 'offers' && styles.activeTab]}>
            <Text style={[styles.tabText, tab === 'offers' && styles.activeTabText]}>MES OFFRES</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTab('bookings')} style={[styles.tab, tab === 'bookings' && styles.activeTab]}>
            <Text style={[styles.tabText, tab === 'bookings' && styles.activeTabText]}>RÉSERVATIONS</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{padding: 20}}>
          
          {tab === 'offers' ? (
            <>
              <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.createBtn}>
                <PlusCircle color="white" size={24} />
                <Text style={styles.createBtnText}>CRÉER UNE OFFRE</Text>
              </TouchableOpacity>

              {offers && offers.length > 0 ? offers.map((offer: any) => (
                <View key={offer.id} style={[styles.card, !offer.active && {opacity: 0.6}]}>
                  <Image source={{ uri: offer.image }} style={styles.cardImage} />
                  <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardTitle}>{offer.title}</Text>
                      {offer.boosted && <View style={styles.badge}><Zap size={12} color="black" /><Text style={styles.badgeText}>BOOST</Text></View>}
                    </View>
                    <Text style={styles.cardDesc}>{offer.date} • {offer.price}€</Text>
                    
                    <View style={styles.cardActions}>
                      <TouchableOpacity onPress={() => toggleOfferStatus(offer.id)} style={styles.actionBtn}>
                        {offer.active ? <Eye color="#4ADE80" size={20}/> : <EyeOff color="#666" size={20}/>}
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionBtn}><Edit2 color="white" size={20}/></TouchableOpacity>
                      <TouchableOpacity onPress={() => handleBoost(offer.id)} style={styles.actionBtn}>
                        <Zap color={offer.boosted ? "#FFD700" : "white"} size={20}/>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDelete(offer.id)} style={styles.actionBtn}>
                        <Trash2 color="#EF4444" size={20}/>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>Aucune offre créée</Text>
                </View>
              )}
            </>
          ) : (
            <View>
              <Text style={{color:'white', marginBottom:15, fontSize: 16}}>Historique des réservations</Text>
              {bookings && bookings.length > 0 ? bookings.map((b: any) => {
                const clientDetails = getUserDetails(b.userId);
                return (
                  <View key={b.id} style={styles.bookingItem}>
                    <View style={{flex: 1}}>
                      <Text style={{color:'white', fontWeight:'bold'}}>{clientDetails?.name || 'Client'}</Text>
                      <Text style={{color:'#888', fontSize: 12, marginTop: 4}}>{b.date}</Text>
                    </View>
                    {b.status === 'pending' ? (
                      <View style={{flexDirection:'row', gap:10}}>
                        <TouchableOpacity onPress={() => updateBookingStatus(b.id, 'cancelled')} style={styles.smallBtnReject}>
                          <X color="white" size={20}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => updateBookingStatus(b.id, 'confirmed')} style={styles.smallBtnAccept}>
                          <Check color="white" size={20}/>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <Text style={{color: b.status === 'confirmed' ? '#4ADE80' : '#888', fontWeight:'bold', fontSize: 12}}>
                        {b.status === 'confirmed' ? 'VALIDÉ' : 'ANNULÉ'}
                      </Text>
                    )}
                  </View>
                );
              }) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>Aucune réservation</Text>
                </View>
              )}
            </View>
          )}

        </ScrollView>

        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Nouvelle Offre</Text>
              <TextInput placeholder="Titre (ex: Boxe Thaï)" placeholderTextColor="#666" style={styles.input} value={title} onChangeText={setTitle} />
              <TextInput placeholder="Description courte" placeholderTextColor="#666" style={styles.input} value={desc} onChangeText={setDesc} />
              <TextInput placeholder="Prix (€)" placeholderTextColor="#666" style={styles.input} keyboardType="numeric" value={price} onChangeText={setPrice} />
              <TextInput placeholder="Date/Horaire" placeholderTextColor="#666" style={styles.input} value={date} onChangeText={setDate} />
              
              <View style={styles.modalBtns}>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}><Text style={{color:'white'}}>Annuler</Text></TouchableOpacity>
                <TouchableOpacity onPress={handleCreate} style={styles.saveBtn}><Text style={{color:'white', fontWeight:'bold'}}>Publier</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  role: { color: '#D91CD2', fontSize: 12, fontWeight: 'bold' as const, letterSpacing: 1 },
  name: { color: 'white', fontSize: 24, fontWeight: 'bold' as const },
  iconBtn: { backgroundColor: '#1A1A1A', padding: 10, borderRadius: 10 },
  
  statsRow: { flexDirection: 'row', gap: 15, paddingHorizontal: 20, marginBottom: 10 },
  statCard: { flex: 1, padding: 15, borderRadius: 16, borderWidth: 1, borderColor: '#333', alignItems: 'center' },
  statValue: { color: 'white', fontSize: 22, fontWeight: 'bold' as const, marginVertical: 5 },
  statLabel: { color: '#666', fontSize: 12 },

  tabs: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 10 },
  tab: { marginRight: 20, paddingBottom: 10 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#D91CD2' },
  tabText: { color: '#666', fontWeight: 'bold' as const },
  activeTabText: { color: 'white' },

  createBtn: { backgroundColor: '#D91CD2', padding: 15, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginBottom: 20, shadowColor: '#D91CD2', shadowOpacity: 0.4, shadowRadius: 10 },
  createBtnText: { color: 'white', fontWeight: 'bold' as const },

  card: { backgroundColor: '#1A1A1A', borderRadius: 12, overflow: 'hidden', marginBottom: 15 },
  cardImage: { width: '100%', height: 120 },
  cardContent: { padding: 15 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' as const },
  cardDesc: { color: '#AAA', marginVertical: 5 },
  badge: { backgroundColor: '#FFD700', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, flexDirection: 'row', alignItems: 'center', gap: 4 },
  badgeText: { fontSize: 10, fontWeight: 'bold' as const },
  
  cardActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, borderTopWidth: 1, borderTopColor: '#333', paddingTop: 10 },
  actionBtn: { padding: 5 },

  bookingItem: { backgroundColor: '#111', padding: 15, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, borderLeftWidth: 3, borderLeftColor: '#D91CD2' },
  smallBtnReject: { backgroundColor: '#333', padding: 8, borderRadius: 8 },
  smallBtnAccept: { backgroundColor: '#4ADE80', padding: 8, borderRadius: 8 },

  emptyState: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#666', fontSize: 16 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#1A1A1A', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#333' },
  modalTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' as const, marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: 'black', color: 'white', padding: 12, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#333' },
  modalBtns: { flexDirection: 'row', gap: 10, marginTop: 10 },
  cancelBtn: { flex: 1, padding: 15, backgroundColor: '#333', borderRadius: 10, alignItems: 'center' },
  saveBtn: { flex: 1, padding: 15, backgroundColor: '#D91CD2', borderRadius: 10, alignItems: 'center' }
});
