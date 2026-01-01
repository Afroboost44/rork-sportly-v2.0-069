import { Stack, router } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Share, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Download, Trash2, Shield, Bell, MapPin, Eye, EyeOff } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { useState } from 'react';

export default function SettingsScreen() {
  const { currentUser, updateUserProfile, exportUserData, deleteAccount } = useApp();
  const [allowGeolocation, setAllowGeolocation] = useState(true);
  const [marketingNotifications, setMarketingNotifications] = useState(true);
  const isUser = currentUser?.role === 'user';
  const [hideDistance, setHideDistance] = useState(isUser && (currentUser as any).hideDistance ? true : false);
  const [hideAge, setHideAge] = useState(isUser && (currentUser as any).hideAge ? true : false);

  const handleExportData = async () => {
    if (!exportUserData) return;
    try {
      const data = await exportUserData();
      if (!data) {
        Alert.alert('Erreur', 'Impossible d\'exporter les données');
        return;
      }

      if (Platform.OS === 'web') {
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sportly-data-${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        Alert.alert('Succès', 'Vos données ont été exportées');
      } else {
        await Share.share({
          message: data,
          title: 'Mes données Sportly',
        });
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'export');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '⚠️ Supprimer mon compte',
      'Cette action est IRRÉVERSIBLE. Toutes vos données seront définitivement supprimées.\n\nÊtes-vous absolument certain de vouloir continuer ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer définitivement',
          style: 'destructive',
          onPress: async () => {
            if (deleteAccount) {
              await deleteAccount();
              router.replace('/auth/login');
            }
          },
        },
      ]
    );
  };

  const handleToggleGeolocation = () => {
    setAllowGeolocation(!allowGeolocation);
  };

  const handleToggleMarketing = () => {
    setMarketingNotifications(!marketingNotifications);
  };

  const handleToggleHideDistance = async () => {
    const newValue = !hideDistance;
    setHideDistance(newValue);
    if (updateUserProfile) {
      await updateUserProfile({ hideDistance: newValue });
    }
  };

  const handleToggleHideAge = async () => {
    const newValue = !hideAge;
    setHideAge(newValue);
    if (updateUserProfile) {
      await updateUserProfile({ hideAge: newValue });
    }
  };

  if (!currentUser || currentUser.role !== 'user') {
    router.back();
    return null;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: Colors.dark.background },
          headerTintColor: Colors.dark.text,
          headerTitle: 'Paramètres',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft size={24} color={Colors.dark.text} />
            </TouchableOpacity>
          ),
        }}
      />

      <LinearGradient
        colors={[Colors.dark.background, Colors.dark.cardBg]}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Shield size={20} color={Colors.dark.primary} />
              <Text style={styles.sectionTitle}>Confidentialité</Text>
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <MapPin size={20} color={Colors.dark.textSecondary} />
                <Text style={styles.settingLabel}>Autoriser la géolocalisation</Text>
              </View>
              <TouchableOpacity
                style={[styles.toggle, allowGeolocation && styles.toggleActive]}
                onPress={handleToggleGeolocation}
                accessibilityLabel="Autoriser la géolocalisation"
              >
                <View style={[styles.toggleThumb, allowGeolocation && styles.toggleThumbActive]} />
              </TouchableOpacity>
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Eye size={20} color={Colors.dark.textSecondary} />
                <Text style={styles.settingLabel}>Masquer ma distance</Text>
              </View>
              <TouchableOpacity
                style={[styles.toggle, hideDistance && styles.toggleActive]}
                onPress={handleToggleHideDistance}
                accessibilityLabel="Masquer ma distance"
              >
                <View style={[styles.toggleThumb, hideDistance && styles.toggleThumbActive]} />
              </TouchableOpacity>
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <EyeOff size={20} color={Colors.dark.textSecondary} />
                <Text style={styles.settingLabel}>Masquer mon âge</Text>
              </View>
              <TouchableOpacity
                style={[styles.toggle, hideAge && styles.toggleActive]}
                onPress={handleToggleHideAge}
                accessibilityLabel="Masquer mon âge"
              >
                <View style={[styles.toggleThumb, hideAge && styles.toggleThumbActive]} />
              </TouchableOpacity>
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Bell size={20} color={Colors.dark.textSecondary} />
                <Text style={styles.settingLabel}>Notifications marketing</Text>
              </View>
              <TouchableOpacity
                style={[styles.toggle, marketingNotifications && styles.toggleActive]}
                onPress={handleToggleMarketing}
                accessibilityLabel="Notifications marketing"
              >
                <View style={[styles.toggleThumb, marketingNotifications && styles.toggleThumbActive]} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Données personnelles (RGPD)</Text>
            <Text style={styles.sectionDescription}>
              Conformément au RGPD, vous avez le droit d&apos;accéder à vos données et de les supprimer.
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={handleExportData}
              accessibilityLabel="Exporter mes données"
            >
              <Download size={20} color={Colors.dark.primary} />
              <Text style={styles.buttonText}>Exporter mes données</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dangerSection}>
            <Text style={styles.dangerTitle}>Zone de danger</Text>
            <Text style={styles.dangerDescription}>
              Ces actions sont irréversibles. Soyez certain avant de continuer.
            </Text>

            <TouchableOpacity
              style={styles.dangerButton}
              onPress={handleDeleteAccount}
              accessibilityLabel="Supprimer mon compte"
            >
              <Trash2 size={20} color={Colors.dark.error} />
              <Text style={styles.dangerButtonText}>Supprimer mon compte</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    padding: 24,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.dark.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: Colors.dark.text,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.dark.border,
    justifyContent: 'center',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: Colors.dark.primary,
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.dark.text,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colors.dark.cardBg,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.dark.primary,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
  dangerSection: {
    backgroundColor: Colors.dark.error + '10',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: Colors.dark.error + '40',
  },
  dangerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.dark.error,
    marginBottom: 8,
  },
  dangerDescription: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colors.dark.error + '20',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.dark.error,
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.dark.error,
  },
});
