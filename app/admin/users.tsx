import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, Ban, CheckCircle, Crown, ArrowLeft, RefreshCw } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { trpc } from '@/lib/trpc';

export default function AdminUsers() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  
  const { data: users = [], isLoading, refetch } = trpc.admin.getUsers.useQuery();
  const { data: stats } = trpc.admin.getStats.useQuery();
  const banMutation = trpc.admin.banUser.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const updatePlanMutation = trpc.admin.updateUserPlan.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const filteredUsers = users.filter((u: any) => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.id.includes(search)
  );

  const handleBan = (userId: string, userName: string, isCurrentlyActive: boolean) => {
    Alert.alert(
      isCurrentlyActive ? 'Bannir utilisateur' : 'Débannir utilisateur',
      `${isCurrentlyActive ? 'Bannir' : 'Débannir'} ${userName} ?`,
      [
        { text: 'Annuler' },
        {
          text: isCurrentlyActive ? 'Bannir' : 'Débannir',
          style: 'destructive',
          onPress: () => {
            banMutation.mutate({ userId });
          }
        }
      ]
    );
  };

  const handleTogglePlan = (userId: string, userName: string, currentPlan: string) => {
    const newPlan = currentPlan === 'FREE' ? 'PRO' : 'FREE';
    Alert.alert(
      'Modifier le plan',
      `Passer ${userName} en ${newPlan} ?`,
      [
        { text: 'Annuler' },
        {
          text: 'Confirmer',
          onPress: () => {
            updatePlanMutation.mutate({ userId, plan: newPlan });
          }
        }
      ]
    );
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
            <Text style={styles.statNumber}>{stats?.totalUsers || 0}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, {color: '#EF4444'}]}>{stats?.bannedUsers || 0}</Text>
            <Text style={styles.statLabel}>Bannis</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, {color: '#FFD700'}]}>{stats?.premiumUsers || 0}</Text>
            <Text style={styles.statLabel}>Premium</Text>
          </View>
          <TouchableOpacity onPress={() => refetch()} style={styles.refreshBtn}>
            <RefreshCw color="#D91CD2" size={20} />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#D91CD2" />
            <Text style={styles.loadingText}>Chargement des utilisateurs...</Text>
          </View>
        ) : filteredUsers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun utilisateur trouvé</Text>
            <TouchableOpacity onPress={() => refetch()} style={styles.retryBtn}>
              <RefreshCw color="white" size={20} />
              <Text style={styles.retryText}>Recharger</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView style={styles.list} contentContainerStyle={{paddingBottom: 20}}>
            {filteredUsers.map((user: any) => {
              const isBanned = !user.isActive;
              const isPremium = user.plan !== 'FREE';
              const quota = user.quotaUsage;
              
              return (
                <View key={user.id} style={[styles.userCard, isBanned && styles.bannedCard]}>
                  <View style={styles.userInfo}>
                    <View style={styles.userHeader}>
                      <Text style={styles.userName}>{user.name}</Text>
                      {isPremium && <Crown color="#FFD700" size={16} />}
                    </View>
                    <Text style={styles.userEmail}>{user.email}</Text>
                    <Text style={styles.userId}>ID: {user.id.substring(0, 8)}...</Text>
                    <View style={styles.tagRow}>
                      <Text style={styles.userRole}>{user.role}</Text>
                      <Text style={styles.userPlan}>{user.plan}</Text>
                    </View>
                    {quota && (
                      <Text style={styles.quotaText}>
                        Quota: {quota.dailyCount} aujourd&apos;hui | {quota.monthlyCount} ce mois | {quota.tokensUsed} tokens
                      </Text>
                    )}
                    {isBanned && <Text style={styles.bannedTag}>🚫 BANNI</Text>}
                  </View>

                  <View style={styles.actions}>
                    <TouchableOpacity
                      onPress={() => handleTogglePlan(user.id, user.name, user.plan)}
                      style={[styles.actionBtn, isPremium && styles.activePremiumBtn]}
                      disabled={banMutation.isPending || updatePlanMutation.isPending}
                    >
                      <Crown color={isPremium ? "#000" : "white"} size={20} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleBan(user.id, user.name, user.isActive)}
                      style={[styles.actionBtn, isBanned && styles.activeBanBtn]}
                      disabled={banMutation.isPending || updatePlanMutation.isPending}
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
        )}
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
  userEmail: {
    color: '#888',
    fontSize: 13,
    marginTop: 2,
  },
  userId: {
    color: '#666',
    fontSize: 11,
    marginTop: 2,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  userRole: {
    color: '#D91CD2',
    fontSize: 11,
    fontWeight: 'bold',
    backgroundColor: '#D91CD220',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  userPlan: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: 'bold',
    backgroundColor: '#FFD70020',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  quotaText: {
    color: '#10B981',
    fontSize: 11,
    marginTop: 6,
    fontWeight: '600',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#666',
    marginTop: 15,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  refreshBtn: {
    position: 'absolute',
    right: 20,
    top: 20,
    padding: 8,
  },
});
