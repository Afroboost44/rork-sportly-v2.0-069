import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, Ban, CheckCircle, Crown, ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '../../contexts/AppContext';

export default function AdminUsers() {
  const router = useRouter();
  const { users } = useAppContext();
  const [search, setSearch] = useState('');
  const [bannedUsers, setBannedUsers] = useState<Set<string>>(new Set());
  const [premiumUsers, setPremiumUsers] = useState<Set<string>>(new Set());

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.id.toString().includes(search)
  );

  const handleBan = (userId: string, userName: string) => {
    Alert.alert(
      'Bannir utilisateur',
      `Bannir ${userName} de la plateforme ?`,
      [
        { text: 'Annuler' },
        {
          text: 'Bannir',
          style: 'destructive',
          onPress: () => {
            const newBanned = new Set(bannedUsers);
            if (newBanned.has(userId)) {
              newBanned.delete(userId);
            } else {
              newBanned.add(userId);
            }
            setBannedUsers(newBanned);
            Alert.alert('Succès', `${userName} ${newBanned.has(userId) ? 'banni' : 'débanni'}`);
          }
        }
      ]
    );
  };

  const handleTogglePremium = (userId: string, userName: string) => {
    const newPremium = new Set(premiumUsers);
    if (newPremium.has(userId)) {
      newPremium.delete(userId);
    } else {
      newPremium.add(userId);
    }
    setPremiumUsers(newPremium);
    Alert.alert('Succès', `${userName} ${newPremium.has(userId) ? 'promu Premium' : 'rétrogradé Free'}`);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000', '#1A1A1A']}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>Gestion Utilisateurs</Text>
          <View style={{width: 40}} />
        </View>

        <View style={styles.searchBar}>
          <Search color="#666" size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher par nom ou ID..."
            placeholderTextColor="#666"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={styles.stats}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{users.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, {color: '#EF4444'}]}>{bannedUsers.size}</Text>
            <Text style={styles.statLabel}>Bannis</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, {color: '#FFD700'}]}>{premiumUsers.size}</Text>
            <Text style={styles.statLabel}>Premium</Text>
          </View>
        </View>

        <ScrollView style={styles.list} contentContainerStyle={{paddingBottom: 20}}>
          {filteredUsers.map((user) => {
            const isBanned = bannedUsers.has(user.id.toString());
            const isPremium = premiumUsers.has(user.id.toString());
            
            return (
              <View key={user.id} style={[styles.userCard, isBanned && styles.bannedCard]}>
                <View style={styles.userInfo}>
                  <View style={styles.userHeader}>
                    <Text style={styles.userName}>{user.name}</Text>
                    {isPremium && <Crown color="#FFD700" size={16} />}
                  </View>
                  <Text style={styles.userId}>ID: {user.id}</Text>
                  <Text style={styles.userRole}>{user.role.toUpperCase()}</Text>
                  {isBanned && <Text style={styles.bannedTag}>BANNI</Text>}
                </View>

                <View style={styles.actions}>
                  <TouchableOpacity
                    onPress={() => handleTogglePremium(user.id.toString(), user.name)}
                    style={[styles.actionBtn, isPremium && styles.activePremiumBtn]}
                  >
                    <Crown color={isPremium ? "#000" : "white"} size={20} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleBan(user.id.toString(), user.name)}
                    style={[styles.actionBtn, isBanned && styles.activeBanBtn]}
                  >
                    {isBanned ? (
                      <CheckCircle color="white" size={20} />
                    ) : (
                      <Ban color="white" size={20} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backBtn: {
    padding: 5,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    marginHorizontal: 20,
    marginTop: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  searchInput: {
    flex: 1,
    color: 'white',
    paddingVertical: 15,
    paddingLeft: 10,
    fontSize: 16,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#D91CD2',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#666',
    fontSize: 12,
    marginTop: 5,
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  userCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannedCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    opacity: 0.7,
  },
  userInfo: {
    flex: 1,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userId: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  userRole: {
    color: '#D91CD2',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 4,
  },
  bannedTag: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
  },
  activePremiumBtn: {
    backgroundColor: '#FFD700',
  },
  activeBanBtn: {
    backgroundColor: '#EF4444',
  },
});
