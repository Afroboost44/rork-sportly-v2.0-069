import { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { X, Sliders } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { SearchFilters, Sport } from '@/constants/types';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onApply: (filters: SearchFilters) => void;
}

const SPORTS: Sport[] = ['Fitness', 'Yoga', 'Tennis', 'Natation', 'Running', 'Escalade', 'Boxe', 'Danse'];

export default function FilterModal({ visible, onClose, filters, onApply }: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    const defaultFilters: SearchFilters = {
      ageRange: [18, 50],
      distanceRange: [0, 50],
      gender: 'all',
    };
    setLocalFilters(defaultFilters);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Sliders size={24} color={Colors.dark.primary} />
              <Text style={styles.title}>Filtres</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.dark.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Âge</Text>
              <View style={styles.rangeDisplay}>
                <Text style={styles.rangeText}>{localFilters.ageRange[0]} ans</Text>
                <Text style={styles.rangeSeparator}>-</Text>
                <Text style={styles.rangeText}>{localFilters.ageRange[1]} ans</Text>
              </View>
              <View style={styles.ageButtons}>
                <View style={styles.ageButtonRow}>
                  <Text style={styles.ageLabel}>Min:</Text>
                  <TouchableOpacity
                    style={styles.ageButton}
                    onPress={() => setLocalFilters(prev => ({ 
                      ...prev, 
                      ageRange: [Math.max(18, prev.ageRange[0] - 1), prev.ageRange[1]] 
                    }))}
                  >
                    <Text style={styles.ageButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.ageValue}>{localFilters.ageRange[0]}</Text>
                  <TouchableOpacity
                    style={styles.ageButton}
                    onPress={() => setLocalFilters(prev => ({ 
                      ...prev, 
                      ageRange: [Math.min(70, prev.ageRange[0] + 1), prev.ageRange[1]] 
                    }))}
                  >
                    <Text style={styles.ageButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.ageButtonRow}>
                  <Text style={styles.ageLabel}>Max:</Text>
                  <TouchableOpacity
                    style={styles.ageButton}
                    onPress={() => setLocalFilters(prev => ({ 
                      ...prev, 
                      ageRange: [prev.ageRange[0], Math.max(18, prev.ageRange[1] - 1)] 
                    }))}
                  >
                    <Text style={styles.ageButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.ageValue}>{localFilters.ageRange[1]}</Text>
                  <TouchableOpacity
                    style={styles.ageButton}
                    onPress={() => setLocalFilters(prev => ({ 
                      ...prev, 
                      ageRange: [prev.ageRange[0], Math.min(70, prev.ageRange[1] + 1)] 
                    }))}
                  >
                    <Text style={styles.ageButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Distance</Text>
              <View style={styles.rangeDisplay}>
                <Text style={styles.rangeText}>{localFilters.distanceRange[1]} km</Text>
              </View>
              <View style={styles.distanceButtons}>
                {[10, 20, 30, 50, 100].map((distance) => (
                  <TouchableOpacity
                    key={distance}
                    style={[
                      styles.distanceButton,
                      localFilters.distanceRange[1] === distance && styles.distanceButtonActive
                    ]}
                    onPress={() => setLocalFilters(prev => ({ 
                      ...prev, 
                      distanceRange: [0, distance] 
                    }))}
                  >
                    <Text style={[
                      styles.distanceButtonText,
                      localFilters.distanceRange[1] === distance && styles.distanceButtonTextActive
                    ]}>
                      {distance}km
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Genre recherché</Text>
              <View style={styles.genderButtons}>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    localFilters.gender === 'all' && styles.genderButtonActive
                  ]}
                  onPress={() => setLocalFilters(prev => ({ ...prev, gender: 'all' }))}
                >
                  <Text style={[
                    styles.genderButtonText,
                    localFilters.gender === 'all' && styles.genderButtonTextActive
                  ]}>
                    Tous
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    localFilters.gender === 'male' && styles.genderButtonActive
                  ]}
                  onPress={() => setLocalFilters(prev => ({ ...prev, gender: 'male' }))}
                >
                  <Text style={[
                    styles.genderButtonText,
                    localFilters.gender === 'male' && styles.genderButtonTextActive
                  ]}>
                    Homme
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    localFilters.gender === 'female' && styles.genderButtonActive
                  ]}
                  onPress={() => setLocalFilters(prev => ({ ...prev, gender: 'female' }))}
                >
                  <Text style={[
                    styles.genderButtonText,
                    localFilters.gender === 'female' && styles.genderButtonTextActive
                  ]}>
                    Femme
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sport favori</Text>
              <View style={styles.sportsGrid}>
                <TouchableOpacity
                  style={[
                    styles.sportChip,
                    !localFilters.sport && styles.sportChipActive
                  ]}
                  onPress={() => setLocalFilters(prev => ({ ...prev, sport: undefined }))}
                >
                  <Text style={[
                    styles.sportChipText,
                    !localFilters.sport && styles.sportChipTextActive
                  ]}>
                    Tous
                  </Text>
                </TouchableOpacity>
                {SPORTS.map((sport) => (
                  <TouchableOpacity
                    key={sport}
                    style={[
                      styles.sportChip,
                      localFilters.sport === sport && styles.sportChipActive
                    ]}
                    onPress={() => setLocalFilters(prev => ({ ...prev, sport }))}
                  >
                    <Text style={[
                      styles.sportChipText,
                      localFilters.sport === sport && styles.sportChipTextActive
                    ]}>
                      {sport}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleReset}
            >
              <Text style={styles.resetButtonText}>Réinitialiser</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApply}
            >
              <LinearGradient
                colors={[Colors.dark.primary, Colors.dark.purple]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.applyButtonGradient}
              >
                <Text style={styles.applyButtonText}>Appliquer</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.dark.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    marginBottom: 16,
  },
  rangeDisplay: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  rangeText: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.dark.primary,
  },
  rangeSeparator: {
    fontSize: 20,
    color: Colors.dark.textSecondary,
  },
  ageButtons: {
    gap: 12,
  },
  ageButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ageLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.textSecondary,
    width: 50,
  },
  ageButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.dark.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  ageButtonText: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.dark.primary,
  },
  ageValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    minWidth: 40,
    textAlign: 'center',
  },
  distanceButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  distanceButton: {
    backgroundColor: Colors.dark.cardBg,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: Colors.dark.border,
  },
  distanceButtonActive: {
    borderColor: Colors.dark.primary,
    backgroundColor: Colors.dark.primary + '20',
  },
  distanceButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.textSecondary,
  },
  distanceButtonTextActive: {
    color: Colors.dark.primary,
    fontWeight: '700' as const,
  },
  genderButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    backgroundColor: Colors.dark.cardBg,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.dark.border,
  },
  genderButtonActive: {
    borderColor: Colors.dark.primary,
    backgroundColor: Colors.dark.primary + '20',
  },
  genderButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.textSecondary,
  },
  genderButtonTextActive: {
    color: Colors.dark.primary,
    fontWeight: '700' as const,
  },
  sportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sportChip: {
    backgroundColor: Colors.dark.cardBg,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: Colors.dark.border,
  },
  sportChipActive: {
    borderColor: Colors.dark.primary,
    backgroundColor: Colors.dark.primary + '20',
  },
  sportChipText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.dark.textSecondary,
  },
  sportChipTextActive: {
    color: Colors.dark.primary,
    fontWeight: '700' as const,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  resetButton: {
    flex: 1,
    backgroundColor: Colors.dark.cardBg,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.dark.textSecondary,
  },
  applyButton: {
    flex: 2,
    borderRadius: 16,
    overflow: 'hidden',
  },
  applyButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
});
