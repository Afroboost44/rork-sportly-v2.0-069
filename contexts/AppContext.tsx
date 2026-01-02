import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

interface Profile {
  id: number | string;
  name: string;
  age: number;
  city: string;
  sport: string;
  photo: string;
  role: string;
  type?: string;
  pricePerSession?: number;
  availableSlots?: {
    id: string;
    date: string;
    time: string;
    available: boolean;
  }[];
  isOnline?: boolean;
}

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
  type: string;
  bookingData?: any;
}

interface Conversation {
  id: number | string;
  name: string;
  photo: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

interface Booking {
  id: string;
  partnerId: string;
  slotId: string;
  conversationId: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  date: string;
  time: string;
  price: number;
}

interface AppContextType {
  user: any;
  setUser: (user: any) => void;
  currentUser: any;
  isLoading: boolean;
  globalLoading?: boolean;
  profiles: Profile[];
  matches: Profile[];
  conversations: Conversation[];
  users: Profile[];
  bookings: Booking[];
  partners: Profile[];
  offers: any[];
  login: (role: string, email?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<boolean>;
  swipeRight: (profile: Profile) => void;
  swipeLeft: (profileId: number | string) => void;
  getMessages: (conversationId: string) => Message[];
  sendMessage: (conversationId: string, text: string, type?: string, bookingData?: any) => void;
  markAsRead: (conversationId: string) => void;
  getPartnerBookings: (userId?: string) => Booking[];
  createBooking: (partnerId: string, slotId: string, conversationId: string) => Promise<boolean>;
  addBooking: (partnerId: string, eventTitle: string, date: string) => Promise<boolean>;
  updateBookingStatus: (bookingId: string, status: 'confirmed' | 'cancelled') => Promise<boolean>;
  canReviewBooking: (bookingId: string) => boolean;
  addReview: (partnerId: string, bookingId: string, rating: number, comment: string) => Promise<boolean>;
  getNotifications: () => any[];
  markNotificationAsRead: (id: string) => void;
  resetData: () => void;
  switchRole: (role: string) => void;
  getUserBadges: () => any[];
  toggleUserBan: (userId: string) => boolean;
  toggleUserPremium: (userId: string) => boolean;
  getStats: () => any;
  getCommunityEvents: () => any[];
  joinCommunityEvent: (eventId: string) => boolean;
  leaveCommunityEvent: (eventId: string) => boolean;
  createCommunityEvent: (event: any) => boolean;
  upgradeToPremium: () => Promise<boolean>;
  updateUserProfile: (updates: any) => Promise<boolean>;
  exportUserData: () => Promise<any>;
  deleteAccount: () => Promise<boolean>;
  addOffer: (offer: any) => void;
  toggleOfferStatus: (id: number) => void;
  deleteOffer: (id: number) => void;
  boostOffer: (id: number) => boolean;
}

export const MOCK_PROFILES: Profile[] = [
  { id: 101, name: "Sophie", age: 24, city: "Paris", sport: "Yoga", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2", role: 'user', isOnline: true },
  { id: 102, name: "Marc", age: 29, city: "Lyon", sport: "Crossfit", photo: "https://images.unsplash.com/photo-1567013127542-490d757e51fc", role: 'user', isOnline: false },
  { id: 103, name: "Thomas", age: 32, city: "Marseille", sport: "Boxe", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d", role: 'user', isOnline: true },
  { 
    id: 104, 
    name: "Lucas", 
    age: 31, 
    city: "Paris", 
    sport: "Fitness", 
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d", 
    role: 'partner',
    type: 'Coach Fitness',
    pricePerSession: 50,
    isOnline: true,
    availableSlots: [
      { id: 's1', date: '15 Jan', time: '10:00', available: true },
      { id: 's2', date: '15 Jan', time: '14:00', available: true },
      { id: 's3', date: '16 Jan', time: '09:00', available: true },
    ]
  },
  { id: 201, name: "Julie M.", age: 27, city: "Paris", sport: "Running", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80", role: 'user', isOnline: true },
  { id: 202, name: "Thomas P.", age: 30, city: "Paris", sport: "Fitness", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e", role: 'user', isOnline: true },
  { id: 203, name: "Sarah L.", age: 25, city: "Paris", sport: "Yoga", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330", role: 'user', isOnline: false },
  { id: 204, name: "Marc D.", age: 28, city: "Paris", sport: "Crossfit", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d", role: 'user', isOnline: true },
];

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [profiles] = useState<Profile[]>(MOCK_PROFILES);
  const [matches, setMatches] = useState<Profile[]>([]); 
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [bookings, setBookings] = useState<Booking[]>([
    { 
      id: '101', 
      userId: '201', 
      partnerId: '1',
      slotId: 's1',
      conversationId: '201',
      status: 'confirmed', 
      createdAt: new Date().toISOString(),
      date: "Lun. 18:00",
      time: "18:00",
      price: 50 
    },
    { 
      id: '102', 
      userId: '202', 
      partnerId: '1',
      slotId: 's2',
      conversationId: '202',
      status: 'pending', 
      createdAt: new Date().toISOString(),
      date: "Mar. 10:00",
      time: "10:00",
      price: 50 
    },
    { 
      id: '103', 
      userId: '203', 
      partnerId: '1',
      slotId: 's3',
      conversationId: '203',
      status: 'pending', 
      createdAt: new Date().toISOString(),
      date: "Jeu. 19:30",
      time: "19:30",
      price: 50 
    }
  ]);
  
  const [offers, setOffers] = useState<any[]>([
    { 
      id: 1, 
      title: "Afro House Débutant", 
      desc: "Cours intense pour débutants", 
      price: "25", 
      date: "Lundi 18h", 
      active: true, 
      boosted: false, 
      image: "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9" 
    },
    { 
      id: 2, 
      title: "Cardio Afrobeat", 
      desc: "Session cardio dynamique sur rythmes africains", 
      price: "30", 
      date: "Mercredi 19h", 
      active: true, 
      boosted: true, 
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a" 
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(true);

  const partners = useMemo(() => MOCK_PROFILES.filter(p => p.role === 'partner'), []);

  useEffect(() => {
    setTimeout(() => {
      setUser({ 
        id: 1,
        name: "Bassi", 
        email: "bassi@afroboost.com", 
        role: "partner",
        photo: "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1974&auto=format&fit=crop",
        bio: "Coach Afroboost & Créateur du concept Silent. On bouge ensemble ?",
        stats: { matches: 42, events: 5 },
        type: "Coach Afroboost",
        pricePerSession: 50,
        revenue: 2500,
        rating: 4.9
      });
      setIsLoading(false);
    }, 500);
  }, []);

  const swipeRight = useCallback((profile: Profile) => {
    console.log("🔥 MATCH VALIDÉ:", profile.name);
    
    setMatches(prev => [...prev, profile]);

    const newConv = {
      id: profile.id,
      name: profile.name,
      photo: profile.photo,
      lastMessage: "Ça te dit une séance ?",
      timestamp: "À l'instant",
      unread: true
    };
    
    setConversations(prev => {
      if (prev.find(c => c.id === newConv.id)) return prev;
      return [newConv, ...prev];
    });
  }, []);

  const swipeLeft = useCallback((profileId: number | string) => console.log("❌ PASS:", profileId), []);
  
  const login = useCallback(async (role: string, email?: string): Promise<boolean> => {
    setUser({ name: "Test", email: email || "test@test.com", role });
    return true;
  }, []);
  
  const register = useCallback(async (userData: any): Promise<boolean> => {
    setUser({ name: userData.name || "Nouveau", email: userData.email, role: 'user' });
    return true;
  }, []);
  
  const logout = useCallback(async () => setUser(null), []);

  const getMessages = useCallback((conversationId: string): Message[] => {
    console.log('📨 getMessages appelé pour:', conversationId);
    console.log('📨 Messages disponibles:', messages);
    return messages[conversationId] || [];
  }, [messages]);

  const sendMessage = useCallback((conversationId: string, text: string, type: string = 'text', bookingData?: any): void => {
    const newMessage = {
      id: Date.now().toString(),
      text,
      senderId: user?.id || 'me',
      timestamp: new Date().toISOString(),
      type,
      bookingData
    };
    setMessages((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage]
    }));
  }, [user?.id]);

  const markAsRead = useCallback((conversationId: string): void => {
    setConversations(prev => prev.map(c => 
      c.id.toString() === conversationId ? { ...c, unread: false } : c
    ));
  }, []);

  const getPartnerBookings = useCallback((userId?: string): Booking[] => {
    if (userId) {
      return bookings.filter(b => b.userId === userId);
    }
    return bookings;
  }, [bookings]);
  
  const createBooking = useCallback(async (partnerId: string, slotId: string, conversationId: string): Promise<boolean> => {
    const partner = MOCK_PROFILES.find(p => p.id.toString() === partnerId);
    const slot = partner?.availableSlots?.find(s => s.id === slotId);
    
    const newBooking: Booking = {
      id: Date.now().toString(),
      partnerId,
      slotId,
      conversationId,
      userId: user?.id || 'me',
      status: 'confirmed' as const,
      createdAt: new Date().toISOString(),
      date: slot?.date || 'TBD',
      time: slot?.time || 'TBD',
      price: partner?.pricePerSession || 0
    };
    setBookings(prev => [...prev, newBooking]);
    return true;
  }, [user?.id]);

  const canReviewBooking = useCallback((bookingId: string): boolean => {
    return true;
  }, []);

  const addReview = useCallback(async (partnerId: string, bookingId: string, rating: number, comment: string): Promise<boolean> => {
    console.log('Review added:', { partnerId, bookingId, rating, comment });
    return true;
  }, []);

  const getNotifications = useCallback(() => [], []);
  const markNotificationAsRead = useCallback((id: string) => console.log('Mark as read:', id), []);
  const resetData = useCallback(() => {
    setMatches([]);
    setConversations([]);
    setMessages({});
    setBookings([]);
  }, []);
  const switchRole = useCallback((role: string) => setUser({ ...user, role }), [user]);
  const getUserBadges = useCallback(() => [], []);
  const toggleUserBan = useCallback((userId: string) => { console.log('Toggle ban:', userId); return true; }, []);
  const toggleUserPremium = useCallback((userId: string) => { console.log('Toggle premium:', userId); return true; }, []);
  const getStats = useCallback(() => ({ users: 0, bookings: 0, revenue: 0 }), []);
  const getCommunityEvents = useCallback(() => [], []);
  const joinCommunityEvent = useCallback((eventId: string) => { console.log('Join event:', eventId); return true; }, []);
  const leaveCommunityEvent = useCallback((eventId: string) => { console.log('Leave event:', eventId); return true; }, []);
  const createCommunityEvent = useCallback((event: any) => { console.log('Create event:', event); return true; }, []);
  const upgradeToPremium = useCallback(async () => { console.log('Upgrade to premium'); return true; }, []);
  const addBooking = useCallback(async (partnerId: string, eventTitle: string, date: string): Promise<boolean> => {
    const partner = MOCK_PROFILES.find(p => p.id.toString() === partnerId);
    
    const newBooking: Booking = {
      id: Date.now().toString(),
      partnerId,
      slotId: 'manual',
      conversationId: partnerId,
      userId: user?.id || 'me',
      status: 'pending',
      createdAt: new Date().toISOString(),
      date: date,
      time: '10:00',
      price: partner?.pricePerSession || 50
    };
    
    setBookings(prev => [...prev, newBooking]);
    console.log('✅ Booking added:', newBooking);
    return true;
  }, [user?.id]);

  const updateBookingStatus = useCallback(async (bookingId: string, status: 'confirmed' | 'cancelled'): Promise<boolean> => {
    setBookings(prev => prev.map(b => 
      b.id === bookingId ? { ...b, status } : b
    ));
    
    if (status === 'confirmed') {
      setUser((prevUser: any) => ({
        ...prevUser,
        revenue: (prevUser?.revenue || 0) + (bookings.find(b => b.id === bookingId)?.price || 0)
      }));
    }
    
    console.log(`✅ Booking ${bookingId} status updated to ${status}`);
    return true;
  }, [bookings]);

  const updateUserProfile = useCallback(async (updates: any): Promise<boolean> => {
    setUser((prevUser: any) => ({ ...prevUser, ...updates }));
    console.log('✅ Profile updated:', updates);
    return true;
  }, []);
  const exportUserData = useCallback(async () => { console.log('Export data'); return {}; }, []);
  const deleteAccount = useCallback(async () => { console.log('Delete account'); return true; }, []);

  const addOffer = useCallback((offer: any) => {
    setOffers(prev => [...prev, { ...offer, id: Date.now(), active: true, boosted: false }]);
  }, []);

  const toggleOfferStatus = useCallback((id: number) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, active: !o.active } : o));
  }, []);

  const deleteOffer = useCallback((id: number) => {
    setOffers(prev => prev.filter(o => o.id !== id));
  }, []);

  const boostOffer = useCallback((id: number) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, boosted: true } : o));
    return true;
  }, []);

  return (
    <AppContext.Provider value={{ 
      user,
      setUser, 
      currentUser: user,
      isLoading, 
      profiles, 
      matches, 
      conversations,
      users: MOCK_PROFILES,
      bookings,
      partners,
      offers,
      login, 
      logout,
      register,
      swipeRight, 
      swipeLeft, 
      getMessages,
      sendMessage,
      markAsRead,
      getPartnerBookings, 
      createBooking,
      addBooking,
      updateBookingStatus,
      canReviewBooking,
      addReview,
      getNotifications,
      markNotificationAsRead,
      resetData,
      switchRole,
      getUserBadges,
      toggleUserBan,
      toggleUserPremium,
      getStats,
      getCommunityEvents,
      joinCommunityEvent,
      leaveCommunityEvent,
      createCommunityEvent,
      upgradeToPremium,
      updateUserProfile,
      exportUserData,
      deleteAccount,
      addOffer,
      toggleOfferStatus,
      deleteOffer,
      boostOffer,
      globalLoading: isLoading
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const useApp = useAppContext;
