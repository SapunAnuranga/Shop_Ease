import React from 'react'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import About from './pages/About'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import './i18n'

// Admin pages
import AdminLayout from "./admin/components/AdminLayout"
import AdminDashboard from "./admin/AdminDashboard"
import ManageUsers from "./admin/ManageUsers"
import ManageProducts from "./admin/ManageProducts"
import ManagePromos from "./admin/ManagePromos"
import ManageOrders from "./admin/ManageOrders"

// Payment pages
import PaymentSuccess from "./pages/PaymentSuccess"
import PaymentCancel from "./pages/PaymentCancel"

const AppContent = () => {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith("/admin")

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow">
        <Routes>
          {/* Client Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/account" element={<Login />} />
          
          {/* Protected Routes */}
          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />

          {/* Payment Routes */}
          <Route path="/pay/success" element={<PaymentSuccess />} />
          <Route path="/pay/cancel" element={<PaymentCancel />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="products" element={<ManageProducts />} />
            <Route path="promos" element={<ManagePromos />} />
            <Route path="orders" element={<ManageOrders />} />
          </Route>
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  )
}

const App = () => (
  <Router>
    <AppContent />
  </Router>
)

export default App