import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

const TRANSACTIONS = [
  { id: 1, label: "Paiement Thomas P.", date: "Auj. 10:05", amount: "+50.00€", type: 'in' },
  { id: 2, label: "Virement sortant", date: "Hier", amount: "-1200.00€", type: 'out' },
  { id: 3, label: "Paiement Sophie K.", date: "Hier", amount: "+50.00€", type: 'in' },
];

export default function WalletScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={styles.title}>Mes Finances</Text>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Solde disponible</Text>
        <Text style={styles.balanceAmount}>2 500.00 €</Text>
      </View>
      <Text style={styles.historyTitle}>Historique</Text>
      <FlatList
        data={TRANSACTIONS}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.transactionRow}>
            <View>
              <Text style={styles.transactionLabel}>{item.label}</Text>
              <Text style={styles.transactionDate}>{item.date}</Text>
            </View>
            <Text style={[
              styles.transactionAmount,
              item.type === 'out' && styles.transactionAmountOut
            ]}>
              {item.amount}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000', 
    padding: 20 
  },
  title: { 
    color: 'white', 
    fontSize: 28, 
    fontWeight: '800' as const, 
    marginBottom: 20 
  },
  balanceCard: { 
    backgroundColor: '#1A1A1A', 
    padding: 20, 
    borderRadius: 15, 
    marginBottom: 30, 
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D91CD2'
  },
  balanceLabel: { 
    color: '#888', 
    fontSize: 14,
    marginBottom: 8
  },
  balanceAmount: { 
    color: '#D91CD2', 
    fontSize: 42, 
    fontWeight: '800' as const
  },
  historyTitle: { 
    color: 'white', 
    fontSize: 20, 
    fontWeight: '700' as const, 
    marginBottom: 15 
  },
  transactionRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#333' 
  },
  transactionLabel: { 
    color: 'white', 
    fontSize: 16, 
    fontWeight: '700' as const
  },
  transactionDate: { 
    color: '#666', 
    fontSize: 12, 
    marginTop: 4 
  },
  transactionAmount: { 
    color: '#4ADE80', 
    fontSize: 16, 
    fontWeight: '700' as const
  },
  transactionAmountOut: {
    color: 'white'
  }
});
