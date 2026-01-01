export type UserRole = 'user' | 'partner' | 'admin';

export type Sport = 'Fitness' | 'Yoga' | 'Tennis' | 'Natation' | 'Running' | 'Escalade' | 'Boxe' | 'Danse';

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
  age: number;
  city: string;
  bio: string;
  sports: Sport[];
  favoriteSport: Sport;
  photo: string;
  gender: 'male' | 'female' | 'other';
  lookingFor: 'male' | 'female' | 'all';
  isPremium: boolean;
  isOnline: boolean;
  lastSeen?: Date;
  hasPaid: boolean;
  swipedRight: string[];
  swipedLeft: string[];
  matches: string[];
  badges: string[];
  stats: UserStats;
  blockedUsers: string[];
  hideDistance?: boolean;
  hideAge?: boolean;
}

export interface UserStats {
  totalMatches: number;
  totalBookings: number;
  totalSwipes: number;
  joinedEvents: number;
  dailySwipes: number;
  lastSwipeResetDate: string;
}

export interface Partner {
  id: string;
  email: string;
  password: string;
  role: 'partner';
  name: string;
  type: string;
  description: string;
  photo: string;
  city: string;
  rating: number;
  pricePerSession: number;
  availableSlots: TimeSlot[];
  bookedSlots: string[];
  revenue: number;
  reviews: Review[];
}

export interface TimeSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: Date;
  read: boolean;
  type?: 'text' | 'booking' | 'system' | 'image';
  bookingData?: BookingData;
  imageUrl?: string;
}

export interface BookingData {
  partnerId: string;
  partnerName: string;
  date: string;
  time: string;
  price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  qrCode?: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
}

export interface Booking {
  id: string;
  userId: string;
  partnerId: string;
  slotId: string;
  date: string;
  time: string;
  price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  conversationId: string;
}

export interface Notification {
  id: string;
  type: 'match' | 'booking' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  userId: string;
  relatedUserId?: string;
}

export interface SearchFilters {
  ageRange: [number, number];
  distanceRange: [number, number];
  gender: 'male' | 'female' | 'all';
  sport?: Sport;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requirement?: string;
}

export interface CommunityEvent {
  id: string;
  creatorId: string;
  title: string;
  sport: Sport;
  location: string;
  date: string;
  time: string;
  description: string;
  participants: string[];
  maxParticipants: number;
  createdAt: Date;
}

export interface Report {
  id: string;
  reporterId: string;
  reportedUserId: string;
  reason: 'fake' | 'inappropriate' | 'spam' | 'other';
  description: string;
  timestamp: Date;
  status: 'pending' | 'reviewed' | 'resolved';
}

export interface Review {
  id: string;
  userId: string;
  partnerId: string;
  bookingId: string;
  rating: number;
  comment: string;
  timestamp: Date;
}

export interface UserSettings {
  allowGeolocation: boolean;
  marketingNotifications: boolean;
  hideDistance: boolean;
  hideAge: boolean;
}

export interface Transaction {
  id: string;
  bookingId: string;
  userId: string;
  partnerId: string;
  amount: number;
  adminCommission: number;
  partnerRevenue: number;
  timestamp: Date;
  status: 'pending' | 'completed';
}
