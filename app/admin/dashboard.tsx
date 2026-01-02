import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LogOut, ShieldCheck, Users, DollarSign, Settings, UserCog, Activity, Database } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '../../contexts/AppContext';
import { trpc } from '@/lib/trpc';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout, users, bookings, offers } = useAppContext();
  const [isSeeding, setIsSeeding] = useState(false);
  
  const seedMutation = trpc.admin.seedDatabase.useMutation({
    onSuccess: (data) => {
      setIsSeeding(false);
      Alert.alert(
        '✅ Succès',
        data.message + '\n\nAllez dans "Gestion Utilisateurs" pour voir la liste.',
        [{ text: 'OK' }]
      );
    },
    onError: (error) => {
      setIsSeeding(false);
      Alert.alert('❌ Erreur', error.message);
    },
  });

  const handleSeedDatabase = () => {
    Alert.alert(
      '⚠️ Réinitialiser les données',
      'Cela va SUPPRIMER toutes les données existantes et créer 8 utilisateurs de test.\n\nContinuer ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: () => {
            setIsSeeding(true);
            seedMutation.mutate();
          },
        },
      ]
    );
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      console.log('⚠️ Not admin, redirecting to login');
      router.replace('/admin/login');
    }
  }, [user, router]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.price, 0);
  const commission = (totalRevenue * 0.15).toFixed(0);
  const activeOffers = offers.filter(o => o.active).length;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000', '#1A1A1A', '#000']}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.iconBadge}>
              <ShieldCheck color="#D91CD2" size={32} />
            </View>
            <View>
              <Text style={styles.title}>SUPER ADMIN</Text>
              <Text style={styles.subtitle}>Sportly v2.0 • SQLite Dev Mode</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => { logout(); router.replace('/'); }} style={styles.headerBtn}>
            <LogOut color="#EF4444" size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.statsGrid}>
            <LinearGradient colors={['#1A1A1A', '#000']} style={styles.statCard}>
              <Users color="#D91CD2" size={28} />
              <Text style={styles.statNumber}>{users.length}</Text>
              <Text style={styles.statLabel}>Utilisateurs</Text>
            </LinearGradient>

            <LinearGradient colors={['#1A1A1A', '#000']} style={styles.statCard}>
              <DollarSign color="#4ADE80" size={28} />
              <Text style={styles.statNumber}>{commission}€</Text>
              <Text style={styles.statLabel}>Commission</Text>
            </LinearGradient>

            <LinearGradient colors={['#1A1A1A', '#000']} style={styles.statCard}>
              <Activity color="#FFD700" size={28} />
              <Text style={styles.statNumber}>{activeOffers}</Text>
              <Text style={styles.statLabel}>Offres Actives</Text>
            </LinearGradient>
          </View>

          <Text style={styles.sectionTitle}>Actions Administrateur</Text>

          <TouchableOpacity 
            onPress={handleSeedDatabase}
            style={styles.actionCard}
            disabled={isSeeding}
          >
            <LinearGradient
              colors={['#D91CD2', '#A913A1']}
              style={styles.actionCardGradient}
            >
              <View style={styles.actionIcon}>
                {isSeeding ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Database color="white" size={24} />
                )}
              </View>
              <View style={styles.actionContent}>
                <Text style={[styles.actionTitle, {color: 'white'}]}>
                  {isSeeding ? 'Réinitialisation...' : 'Réinitialiser les données (SEED)'}
                </Text>
                <Text style={[styles.actionDesc, {color: '#FFE5FF'}]}>
                  Créer 8 utilisateurs de test avec quotas
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('/admin/users')}
            style={styles.actionCard}
          >
            <LinearGradient
              colors={['#1A1A1A', '#111']}
              style={styles.actionCardGradient}
            >
              <View style={styles.actionIcon}>
                <UserCog color="#D91CD2" size={24} />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Gestion Utilisateurs</Text>
                <Text style={styles.actionDesc}>Bannir, promouvoir, gérer les quotas</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            disabled
          >
            <LinearGradient
              colors={['#1A1A1A', '#111']}
              style={[styles.actionCardGradient, {opacity: 0.5}]}
            >
              <View style={styles.actionIcon}>
                <Settings color="#666" size={24} />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Paramètres Système</Text>
                <Text style={styles.actionDesc}>Prochainement disponible</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>📋 Instructions</Text>
            <Text style={styles.infoText}>1. Cliquez sur &quot;Réinitialiser les données&quot; ci-dessus</Text>
            <Text style={styles.infoText}>2. Accédez à &quot;Gestion Utilisateurs&quot;</Text>
            <Text style={styles.infoText}>3. Testez le bannissement de Pierre Martin</Text>
            <Text style={[styles.infoText, {marginTop: 10, color: '#D91CD2'}]}>Base de données : SQLite locale (dev.db)</Text>
          </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconBadge: {
    backgroundColor: '#1A1A1A',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D91CD2',
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  subtitle: {
    color: '#666',
    fontSize: 11,
    marginTop: 2,
  },
  headerBtn: {
    backgroundColor: '#1A1A1A',
    padding: 10,
    borderRadius: 10,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  statNumber: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  statLabel: {
    color: '#666',
    fontSize: 11,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  actionCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
  },
  actionIcon: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 10,
    marginRight: 15,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  actionDesc: {
    color: '#666',
    fontSize: 13,
  },
  infoBox: {
    backgroundColor: '#1A1A1A',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#D91CD2',
  },
  infoTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoText: {
    color: '#888',
    fontSize: 13,
    marginBottom: 6,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
