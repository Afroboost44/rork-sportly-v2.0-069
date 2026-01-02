import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ShieldCheck, Lock, Mail } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppContext } from '../../contexts/AppContext';

export default function AdminLogin() {
  const router = useRouter();
  const { user, setUser } = useAppContext();
  const [email, setEmail] = useState('admin@sportly.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires');
      return;
    }

    setLoading(true);

    try {
      if (email === 'admin@sportly.com' && password === 'admin123') {
        setUser({
          id: 'admin-001',
          email: 'admin@sportly.com',
          name: 'Super Admin',
          role: 'admin',
          plan: 'premium'
        });
        router.replace('/admin/dashboard');
      } else {
        Alert.alert('Erreur', 'Identifiants incorrects');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role === 'admin') {
    router.replace('/admin/dashboard');
    return null;
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000', '#1A1A1A', '#000']}
        style={StyleSheet.absoluteFill}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          
          <View style={styles.header}>
            <View style={styles.iconWrapper}>
              <ShieldCheck color="#D91CD2" size={48} />
            </View>
            <Text style={styles.title}>ADMINISTRATION</Text>
            <Text style={styles.subtitle}>Portail Super Admin</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Mail color="#666" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email administrateur"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Lock color="#666" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              style={styles.loginBtn}
              disabled={loading}
            >
              <LinearGradient
                colors={['#D91CD2', '#9F1C9C']}
                style={styles.loginBtnGradient}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.loginBtnText}>CONNEXION SÉCURISÉE</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.warning}>
              ⚠️ Accès réservé aux Super Admins uniquement
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Sportly Admin v2.0</Text>
            <Text style={styles.footerText}>SQLite Dev Mode</Text>
          </View>

        </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  iconWrapper: {
    backgroundColor: '#1A1A1A',
    padding: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#D91CD2',
    marginBottom: 20,
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 3,
    marginBottom: 8,
  },
  subtitle: {
    color: '#888',
    fontSize: 14,
    letterSpacing: 1,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    paddingVertical: 18,
  },
  loginBtn: {
    marginTop: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  loginBtnGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  loginBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  warning: {
    color: '#EF4444',
    textAlign: 'center',
    fontSize: 12,
    marginTop: 10,
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
    gap: 5,
  },
  footerText: {
    color: '#444',
    fontSize: 12,
  },
});
