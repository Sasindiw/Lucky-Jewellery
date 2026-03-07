import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Gemstones from './pages/Gemstones';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import SalesOrders from './pages/SalesOrders';
import ClientRegistry from './pages/ClientRegistry';
import GemstoneRegistry from './pages/GemstoneRegistry';
import UserDashboard from './pages/UserDashboard';
import GemstoneDetail from './pages/GemstoneDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen bg-light font-sans">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gemstones" element={<Gemstones />} />
        <Route path="/gemstones/:id" element={<GemstoneDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute isAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/orders" 
          element={
            <ProtectedRoute isAdmin={true}>
              <SalesOrders />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute isAdmin={true}>
              <ClientRegistry />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/gemstones" 
          element={
            <ProtectedRoute isAdmin={true}>
              <GemstoneRegistry />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/cart" element={<Cart />} />
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } 
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
