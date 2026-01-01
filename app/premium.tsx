import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, Zap, Calendar, Eye, Check, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/colors';

const PREMIUM_FEATURES = [
  {
    icon: Sparkles,
    title: 'Likes illimités',
    description: 'Swipez sans limites',
  },
  {
    icon: Zap,
    title: '5 Boosts par mois',
    description: 'Soyez vu en priorité',
  },
  {
    icon: Calendar,
    title: 'Annulations gratuites',
    description: 'Modifiez vos réservations',
  },
  {
    icon: Eye,
    title: 'Mode Invisible',
    description: 'Naviguez en toute discrétion',
  },
];

const SUBSCRIPTION_PLANS = [
  {
    id: '1month',
    duration: '1 Mois',
    price: 19.99,
    pricePerMonth: 19.99,
    popular: false,
  },
  {
    id: '6months',
    duration: '6 Mois',
    price: 77.94,
    pricePerMonth: 12.99,
    popular: true,
    savings: '35% d\'économie',
  },
  {
    id: '12months',
    duration: '12 Mois',
    price: 119.88,
    pricePerMonth: 9.99,
    popular: false,
    savings: 'Meilleure offre',
  },
];

export default function PremiumScreen() {
  const [selectedPlan, setSelectedPlan] = useState(SUBSCRIPTION_PLANS[1].id);
  const [isProcessing, setIsProcessing] = useState(false);
  const { currentUser, upgradeToPremium } = useApp();

  const handleSubscribe = async () => {
    if (!currentUser || currentUser.role !== 'user' || !upgradeToPremium) return;

    setIsProcessing(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const success = await upgradeToPremium();
    
    setIsProcessing(false);
    
    if (success) {
      router.back();
    }
  };

  const selectedPlanData = SUBSCRIPTION_PLANS.find(p => p.id === selectedPlan);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={['#0A0A0A', '#1A1A1A']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <X size={28} color={Colors.dark.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.titleContainer}>
            <LinearGradient
              colors={['#FFD700', '#FF2D95']}
              style={styles.titleGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.goldIcon}>👑</Text>
            </LinearGradient>
            <Text style={styles.title}>Devenez SPORTLY GOLD</Text>
            <Text style={styles.subtitle}>Débloquez toutes les fonctionnalités premium</Text>
          </View>

          <View style={styles.featuresContainer}>
            {PREMIUM_FEATURES.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={styles.featureIconContainer}>
                  <feature.icon size={24} color="#FFD700" strokeWidth={2} />
                </View>
                <View style={styles.featureTextContainer}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.plansContainer}>
            <Text style={styles.plansTitle}>Choisissez votre plan</Text>
            
            {SUBSCRIPTION_PLANS.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                onPress={() => setSelectedPlan(plan.id)}
                activeOpacity={0.8}
              >
                <View style={[
                  styles.planCard,
                  selectedPlan === plan.id && styles.planCardSelected,
                  plan.popular && styles.planCardPopular,
                ]}>
                  {plan.popular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularBadgeText}>PLUS POPULAIRE</Text>
                    </View>
                  )}
                  
                  <View style={styles.planHeader}>
                    <View>
                      <Text style={styles.planDuration}>{plan.duration}</Text>
                      {plan.savings && (
                        <Text style={styles.planSavings}>{plan.savings}</Text>
                      )}
                    </View>
                    
                    <View style={styles.planPriceContainer}>
                      <Text style={styles.planPrice}>{plan.pricePerMonth.toFixed(2)} CHF</Text>
                      <Text style={styles.planPriceSubtext}>/ mois</Text>
                    </View>
                  </View>

                  <View style={styles.planCheckContainer}>
                    <View style={[
                      styles.planCheck,
                      selectedPlan === plan.id && styles.planCheckSelected,
                    ]}>
                      {selectedPlan === plan.id && (
                        <Check size={18} color="#FFFFFF" strokeWidth={3} />
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total à payer</Text>
            <Text style={styles.totalAmount}>
              {selectedPlanData?.price.toFixed(2)} CHF
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleSubscribe}
            disabled={isProcessing}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FFD700', '#FF2D95']}
              style={styles.subscribeButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.subscribeButtonText}>
                {isProcessing ? 'Traitement...' : 'S\'abonner maintenant'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <Text style={styles.disclaimer}>
            Annulation possible à tout moment
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.dark.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  titleGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  goldIcon: {
    fontSize: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  plansContainer: {
    marginBottom: 30,
  },
  plansTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 20,
  },
  planCard: {
    backgroundColor: Colors.dark.cardBg,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  planCardSelected: {
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
  },
  planCardPopular: {
    borderColor: '#FF2D95',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    left: 20,
    backgroundColor: '#FF2D95',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planDuration: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  planSavings: {
    fontSize: 13,
    color: '#FFD700',
    fontWeight: '600',
  },
  planPriceContainer: {
    alignItems: 'flex-end',
  },
  planPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  planPriceSubtext: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  planCheckContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  planCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.dark.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planCheckSelected: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.dark.cardBg,
    padding: 20,
    borderRadius: 12,
    marginBottom: 100,
  },
  totalLabel: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    backgroundColor: Colors.dark.background,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  subscribeButton: {
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  subscribeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  disclaimer: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
});
