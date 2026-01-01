import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppProvider, useApp } from "@/contexts/AppContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import OfflineBanner from "@/components/OfflineBanner";
import ErrorBoundary from "@/components/ErrorBoundary";
import GlobalLoader from "@/components/GlobalLoader";
import Colors from "@/constants/colors";
import { trpc, trpcClient } from "@/lib/trpc";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  console.log('🎯 RootLayoutNav rendering...');
  const { currentUser, isLoading } = useApp();
  console.log('🎯 RootLayoutNav state:', { currentUser: currentUser?.name, isLoading });
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    try {
      const onboardingCompleted = await AsyncStorage.getItem('sportly_onboarding_completed');
      setHasSeenOnboarding(onboardingCompleted === 'true');
      console.log('✅ Onboarding check:', onboardingCompleted === 'true' ? 'Completed' : 'Not completed');
    } catch (error) {
      console.error('Error checking onboarding:', error);
      setHasSeenOnboarding(false);
    }
  };

  if (isLoading || hasSeenOnboarding === null) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.dark.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={Colors.dark.primary} />
      </View>
    );
  }

  console.log('🔄 Navigation state:', { hasSeenOnboarding, currentUser: currentUser?.role || 'none', currentUserId: currentUser?.id });
  console.log('🔄 Full currentUser:', JSON.stringify(currentUser, null, 2));

  return (
    <>
      <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
        {!hasSeenOnboarding ? (
          <Stack.Screen name="onboarding" />
        ) : !currentUser ? (
          <>
            <Stack.Screen name="auth/login" />
            <Stack.Screen name="auth/register" />
          </>
        ) : currentUser.role === 'admin' ? (
          <Stack.Screen 
            name="admin/dashboard" 
            options={{ 
              headerShown: false
            }} 
          />
        ) : currentUser.role === 'partner' ? (
          <>
            <Stack.Screen 
              name="partner/dashboard" 
              options={{ 
                headerShown: false
              }} 
            />
            <Stack.Screen 
              name="chat/[id]" 
              options={{ 
                headerShown: false
              }} 
            />
            <Stack.Screen 
              name="settings" 
              options={{ 
                headerShown: false
              }} 
            />
          </>
        ) : (
          <>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="chat/[id]" />
            <Stack.Screen name="premium" options={{ presentation: "modal" }} />
            <Stack.Screen name="map" />
            <Stack.Screen name="community" />
            <Stack.Screen name="settings" />
          </>
        )}
      </Stack>
      <GlobalLoader />
    </>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ErrorBoundary>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <LanguageProvider>
            <AppProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <RootLayoutNav />
                <OfflineBanner />
              </GestureHandlerRootView>
            </AppProvider>
          </LanguageProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </ErrorBoundary>
  );
}
