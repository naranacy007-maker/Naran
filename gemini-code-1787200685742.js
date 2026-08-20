import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import db, { initDatabase } from './database';

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    initDatabase();
    loadDemoProducts();
  }, []);

  // မသေချာသေးမီ စမ်းသပ်ရန် Demo Data ထည့်ခြင်း
  const loadDemoProducts = () => {
    try {
      db.runSync(
        `INSERT OR IGNORE INTO products (code, name, category, cost_price, selling_price, stock_qty) 
         VALUES (?, ?, ?, ?, ?, ?);`,
        ['P001', 'အင်ဂျင်ဝိုင် (10W-40)', 'အင်ဂျင်ဝိုင်', 12000, 15000, 20]
      );
      db.runSync(
        `INSERT OR IGNORE INTO products (code, name, category, cost_price, selling_price, stock_qty) 
         VALUES (?, ?, ?, ?, ?, ?);`,
        ['P002', 'ရှေ့ဘရိတ်ပတ် (Click 125)', 'ဘရိတ်', 3000, 4500, 15]
      );

      const allProducts = db.getAllSync('SELECT * FROM products;');
      setProducts(allProducts);
    } catch (err) {
      console.log(err);
    }
  };

  // ခြင်းတောင်းထဲ ထည့်ခြင်း
  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.selling_price * item.qty), 0);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ဆိုင်ကယ်အပိုပစ္စည်း POS</Text>
      </View>

      <View style={styles.mainContent}>
        {/* လက်ဝဲဘက် - ပစ္စည်းစာရင်း (Product List) */}
        <View style={styles.productSection}>
          <TextInput
            style={styles.searchInput}
            placeholder="ပစ္စည်းအမည် / ဘားကုဒ် ရှာပါ..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          
          <FlatList
            data={products.filter(p => p.name.includes(searchQuery))}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.productCard} onPress={() => addToCart(item)}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productCategory}>{item.category} | လက်ကျန်: {item.stock_qty}</Text>
                <Text style={styles.productPrice}>{item.selling_price.toLocaleString()} MMK</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* လက်ညာဘက် - ခြင်းတောင်း / ဘောက်ချာ (Cart Side Panel) */}
        <View style={styles.cartSection}>
          <Text style={styles.cartTitle}>လက်ရှိ ဘောက်ချာ</Text>
          
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cartItemName}>{item.name}</Text>
                  <Text style={styles.cartItemSub}>{item.qty} x {item.selling_price.toLocaleString()}</Text>
                </View>
                <Text style={styles.cartItemTotal}>{(item.qty * item.selling_price).toLocaleString()}</Text>
              </View>
            )}
          />

          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>စုစုပေါင်း:</Text>
            <Text style={styles.totalAmount}>{calculateTotal().toLocaleString()} MMK</Text>
          </View>

          <TouchableOpacity style={styles.checkoutBtn} onPress={() => alert('ရောင်းချမှု အောင်မြင်ပါသည်။')}>
            <Text style={styles.checkoutBtnText}>ငွေချေမည် (Checkout)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8', paddingTop: 30 },
  header: { padding: 15, backgroundColor: '#1e293b', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  mainContent: { flex: 1, flexDirection: 'row', padding: 10 },
  productSection: { flex: 3, paddingRight: 10 },
  cartSection: { flex: 2, backgroundColor: '#fff', padding: 10, borderRadius: 8, elevation: 2 },
  searchInput: { backgroundColor: '#fff', padding: 10, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#ddd' },
  productCard: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  productName: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  productCategory: { fontSize: 12, color: '#64748b', marginVertical: 4 },
  productPrice: { fontSize: 14, fontWeight: 'bold', color: '#16a34a' },
  cartTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 5 },
  cartItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  cartItemName: { fontSize: 14, fontWeight: '500' },
  cartItemSub: { fontSize: 12, color: '#64748b' },
  cartItemTotal: { fontSize: 14, fontWeight: 'bold' },
  totalContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, paddingTop: 10, borderTopWidth: 2, borderTopColor: '#0f172a' },
  totalText: { fontSize: 16, fontWeight: 'bold' },
  totalAmount: { fontSize: 18, fontWeight: 'bold', color: '#2563eb' },
  checkoutBtn: { backgroundColor: '#16a34a', padding: 12, borderRadius: 6, marginTop: 15, alignItems: 'center' },
  checkoutBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});