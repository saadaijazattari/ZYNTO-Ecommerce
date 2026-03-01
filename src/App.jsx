// App.js - Complete with all routes

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';  // Import CartProvider
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import RoleBasedRoute from './components/RoleBasedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import VendorDashboard from './pages/VendorDashboard';
import Unauthorized from './pages/Unauthorized';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import AddProduct from './pages/AddProduct';
import MyProducts from './pages/MyProducts';  // Import MyProducts
import Cart from './pages/Cart';  // Import Cart
import SellerOrders from './pages/SellerOrders';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>  {/* Wrap with CartProvider */}
          <div className="App min-h-screen bg-slate-50">
            <Navbar />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 2800,
                style: {
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  color: '#0f172a'
                }
              }}
            />
            <main className="pt-20">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />  {/* Cart route */}

                {/* Protected Routes - Any Authenticated User */}
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/vendor/orders"
                  element={
                    <RoleBasedRoute allowedRoles={['vendor', 'admin']}>
                      <SellerOrders />
                    </RoleBasedRoute>
                  }
                />

                {/* Admin Only Routes */}
                <Route
                  path="/admin/*"
                  element={
                    <RoleBasedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </RoleBasedRoute>
                  }
                />

                {/* Vendor Routes */}
                <Route
                  path="/vendor/dashboard"
                  element={
                    <RoleBasedRoute allowedRoles={['vendor', 'admin']}>
                      <VendorDashboard />
                    </RoleBasedRoute>
                  }
                />

                <Route
                  path="/vendor/add-product"
                  element={
                    <RoleBasedRoute allowedRoles={['vendor', 'admin']}>
                      <AddProduct />
                    </RoleBasedRoute>
                  }
                />

                <Route
                  path="/vendor/my-products"
                  element={
                    <RoleBasedRoute allowedRoles={['vendor', 'admin']}>
                      <MyProducts />
                    </RoleBasedRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
