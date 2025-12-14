import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import OrderScreen from './screens/OrderScreen';
import AdminDashboard from './screens/AdminDashboard';
import ProductEditScreen from './screens/ProductEditScreen';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/product/:id" element={<ProductScreen />} />
        <Route path="/cart" element={<CartScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/checkout" element={<CheckoutScreen />} />
        <Route path="/order/:id" element={<OrderScreen />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/product/:id/edit" element={<ProductEditScreen />} />
        <Route path="/admin/product/new" element={<ProductEditScreen />} />
      </Routes>
    </Router>
  );
}

export default App;

