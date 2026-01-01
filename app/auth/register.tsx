import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { Sport } from '@/constants/types';

const SPORTS: Sport[] = ['Fitness', 'Yoga', 'Tennis', 'Natation', 'Running', 'Escalade', 'Boxe', 'Danse'];

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('other');
  const [lookingFor, setLookingFor] = useState<'male' | 'female' | 'all'>('all');
  const [selectedSport, setSelectedSport] = useState<Sport>('Fitness');
  const { register } = useApp();

  const handleRegister = async () => {
    if (!name || !email || !password || !age || !city) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    const success = await register({
      name,
      email,
      password,
      age: parseInt(age),
      city,
      bio,
      gender,
      lookingFor,
      favoriteSport: selectedSport,
      sports: [selectedSport],
    });

    if (success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Erreur', 'Une erreur est survenue lors de l&apos;inscription');
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
          style={styles.flex}
        >
          <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <ChevronLeft size={24} color={Colors.dark.text} />
              </TouchableOpacity>
              <Text style={styles.title}>Créer un compte</Text>
              <Text style={styles.subtitle}>Rejoins la communauté sportive</Text>
            </View>

            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Nom complet *"
                placeholderTextColor={Colors.dark.textSecondary}
                value={name}
                onChangeText={setName}
              />

              <TextInput
                style={styles.input}
                placeholder="Email *"
                placeholderTextColor={Colors.dark.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextInput
                style={styles.input}
                placeholder="Mot de passe *"
                placeholderTextColor={Colors.dark.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Âge *"
                  placeholderTextColor={Colors.dark.textSecondary}
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                />

                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Ville *"
                  placeholderTextColor={Colors.dark.textSecondary}
                  value={city}
                  onChangeText={setCity}
                />
              </View>

              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Bio (optionnel)"
                placeholderTextColor={Colors.dark.textSecondary}
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={3}
              />

              <Text style={styles.label}>Je suis :</Text>
              <View style={styles.optionsRow}>
                {(['male', 'female', 'other'] as const).map((g) => (
                  <TouchableOpacity
                    key={g}
                    onPress={() => setGender(g)}
                    style={[styles.option, gender === g && styles.optionSelected]}
                  >
                    <Text style={[styles.optionText, gender === g && styles.optionTextSelected]}>
                      {g === 'male' ? 'Homme' : g === 'female' ? 'Femme' : 'Autre'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Je recherche :</Text>
              <View style={styles.optionsRow}>
                {(['male', 'female', 'all'] as const).map((l) => (
                  <TouchableOpacity
                    key={l}
                    onPress={() => setLookingFor(l)}
                    style={[styles.option, lookingFor === l && styles.optionSelected]}
                  >
                    <Text style={[styles.optionText, lookingFor === l && styles.optionTextSelected]}>
                      {l === 'male' ? 'Hommes' : l === 'female' ? 'Femmes' : 'Tous'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Sport préféré :</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sportsScroll}>
                <View style={styles.sportsRow}>
                  {SPORTS.map((sport) => (
                    <TouchableOpacity
                      key={sport}
                      onPress={() => setSelectedSport(sport)}
                      style={[styles.sportChip, selectedSport === sport && styles.sportChipSelected]}
                    >
                      <Text style={[styles.sportChipText, selectedSport === sport && styles.sportChipTextSelected]}>
                        {sport}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              <TouchableOpacity 
                style={styles.registerButton}
                onPress={handleRegister}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[Colors.dark.primary, Colors.dark.purple]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.registerButtonText}>S&apos;inscrire</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: Colors.dark.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: Colors.dark.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    padding: 16,
    fontSize: 16,
    color: Colors.dark.text,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.text,
    marginTop: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  option: {
    flex: 1,
    backgroundColor: Colors.dark.cardBg,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    alignItems: 'center',
  },
  optionSelected: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  optionText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  optionTextSelected: {
    color: Colors.dark.text,
    fontWeight: '700' as const,
  },
  sportsScroll: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  sportsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sportChip: {
    backgroundColor: Colors.dark.cardBg,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  sportChipSelected: {
    backgroundColor: Colors.dark.purple,
    borderColor: Colors.dark.purple,
  },
  sportChipText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  sportChipTextSelected: {
    color: Colors.dark.text,
    fontWeight: '600' as const,
  },
  registerButton: {
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
  registerButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
});
