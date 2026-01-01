import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Zap } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useApp();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    console.log('🔐 Attempting login...');
    const success = await login(email, password);
    if (!success) {
      Alert.alert('Erreur', 'Email ou mot de passe incorrect');
    } else {
      console.log('✅ Login successful, navigating...');
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <LinearGradient
        colors={[Colors.dark.background, Colors.dark.cardBg]}
        style={styles.gradient}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={[Colors.dark.primary, Colors.dark.purple]}
                style={styles.logo}
              >
                <Heart size={40} color="#FFF" fill="#FFF" />
              </LinearGradient>
              <Zap size={24} color={Colors.dark.gold} style={styles.zapIcon} />
            </View>
            <Text style={styles.title}>SPORTLY</Text>
            <Text style={styles.subtitle}>Dating × Sport</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={Colors.dark.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                placeholderTextColor={Colors.dark.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity 
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.8}
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

            <TouchableOpacity 
              onPress={() => router.push('/auth/register')}
              style={styles.registerLink}
            >
              <Text style={styles.registerText}>
                Pas encore de compte ? <Text style={styles.registerTextBold}>S&apos;inscrire</Text>
              </Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Connexion rapide</Text>
              <View style={styles.dividerLine} />
            </View>

            <Text style={styles.infoText}>sophie.martin@gmail.com / password123</Text>
            <Text style={styles.infoText}>contact@pulsefitness.com / partner123</Text>
            <Text style={styles.infoText}>admin@sportly.com / admin123</Text>

            <View style={styles.testAccounts}>
              <TouchableOpacity 
                onPress={async () => {
                  console.log('🔄 Quick login as User...');
                  try {
                    const success = await login('sophie.martin@gmail.com', 'password123');
                    console.log('✅ Login result:', success);
                    if (success) {
                      console.log('✅ Logged in as User successfully');
                      router.replace('/(tabs)');
                    }
                  } catch (error) {
                    console.error('❌ Login error:', error);
                    Alert.alert('Erreur', 'Une erreur est survenue');
                  }
                }}
                style={styles.testButton}
                activeOpacity={0.7}
              >
                <Text style={styles.testButtonText}>👤 User</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={async () => {
                  console.log('🔄 Quick login as Partner...');
                  try {
                    const success = await login('contact@pulsefitness.com', 'partner123');
                    console.log('✅ Login result:', success);
                    if (success) {
                      console.log('✅ Logged in as Partner successfully');
                      router.replace('/partner/dashboard');
                    }
                  } catch (error) {
                    console.error('❌ Login error:', error);
                    Alert.alert('Erreur', 'Une erreur est survenue');
                  }
                }}
                style={styles.testButton}
                activeOpacity={0.7}
              >
                <Text style={styles.testButtonText}>🏢 Partner</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={async () => {
                  console.log('🔄 Quick login as Admin...');
                  try {
                    const success = await login('admin@sportly.com', 'admin123');
                    console.log('✅ Login result:', success);
                    if (success) {
                      console.log('✅ Logged in as Admin successfully');
                      router.replace('/admin/dashboard');
                    }
                  } catch (error) {
                    console.error('❌ Login error:', error);
                    Alert.alert('Erreur', 'Une erreur est survenue');
                  }
                }}
                style={styles.testButton}
                activeOpacity={0.7}
              >
                <Text style={styles.testButtonText}>🛡️ Admin</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    position: 'relative' as const,
    marginBottom: 16,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  zapIcon: {
    position: 'absolute' as const,
    right: -8,
    top: -8,
  },
  title: {
    fontSize: 36,
    fontWeight: '800' as const,
    color: Colors.dark.text,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    marginTop: 4,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    backgroundColor: Colors.dark.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  input: {
    padding: 16,
    fontSize: 16,
    color: Colors.dark.text,
  },
  loginButton: {
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
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
  registerLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  registerTextBold: {
    color: Colors.dark.primary,
    fontWeight: '700' as const,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.dark.border,
  },
  dividerText: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
  },
  testAccounts: {
    flexDirection: 'row',
    gap: 8,
  },
  testButton: {
    flex: 1,
    backgroundColor: Colors.dark.cardBg,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  testButtonText: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 10,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    fontFamily: 'monospace' as const,
  },
});
