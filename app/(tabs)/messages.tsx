import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../../contexts/AppContext';
import { MessageCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function MessagesScreen() {
  const { conversations } = useAppContext();
  const router = useRouter();

  if (!conversations || conversations.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <MessageCircle size={64} color="#333" />
          <Text style={styles.emptyTitle}>Aucun message</Text>
          <Text style={styles.emptySubtitle}>Likez des profils pour démarrer !</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Messages</Text>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.item}
            onPress={() => router.push(`/chat/${item.id}`)}
          >
            <Image source={{ uri: item.photo }} style={styles.avatar} />
            <View style={styles.content}>
              <View style={styles.row}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.time}>{item.timestamp}</Text>
              </View>
              <Text style={styles.msg} numberOfLines={1}>{item.lastMessage}</Text>
            </View>
            {item.unread && <View style={styles.dot} />}
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A', padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: 'white', fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
  emptyTitle: { color: 'white', fontSize: 24, fontWeight: 'bold', marginTop: 20 },
  emptySubtitle: { color: '#666', marginTop: 10 },
  
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#222' },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  content: { flex: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  name: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  time: { color: '#666', fontSize: 12 },
  msg: { color: '#999', fontSize: 14 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF2D95', marginLeft: 10 }
});
