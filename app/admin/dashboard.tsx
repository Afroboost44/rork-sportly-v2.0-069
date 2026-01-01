import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LogOut, ShieldCheck, Users, DollarSign } from 'lucide-react-native';
import { useAppContext } from '../../contexts/AppContext';

export default function AdminDashboard() {
  const router = useRouter();
  const { logout } = useAppContext();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ShieldCheck color="#D91CD2" size={32} />
        <Text style={styles.title}>ADMINISTRATION</Text>
      </View>

      <ScrollView contentContainerStyle={{padding: 20}}>
        <View style={styles.statRow}>
          <View style={styles.card}>
            <Users color="white" size={24} />
            <Text style={styles.number}>1,042</Text>
            <Text style={styles.label}>Utilisateurs</Text>
          </View>
          <View style={styles.card}>
            <DollarSign color="#4ADE80" size={24} />
            <Text style={styles.number}>3,250€</Text>
            <Text style={styles.label}>Commissions</Text>
          </View>
        </View>

        <Text style={{color:'#666', marginTop:20, textAlign:'center'}}>Système opérationnel v2.0</Text>
      </ScrollView>

      <TouchableOpacity onPress={() => { logout(); router.replace('/'); }} style={styles.logoutBtn}>
        <LogOut color="white" size={20} />
        <Text style={{color:'white', fontWeight:'bold'}}>Déconnexion Admin</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#333' },
  title: { color: 'white', fontSize: 20, fontWeight: 'bold', marginTop: 10, letterSpacing: 2 },
  statRow: { flexDirection: 'row', gap: 15 },
  card: { flex: 1, backgroundColor: '#1A1A1A', padding: 20, borderRadius: 15, alignItems: 'center' },
  number: { color: 'white', fontSize: 24, fontWeight: 'bold', marginVertical: 10 },
  label: { color: '#888', fontSize: 12 },
  logoutBtn: { backgroundColor: '#EF4444', margin: 20, padding: 15, borderRadius: 10, flexDirection: 'row', justifyContent: 'center', gap: 10 }
});
