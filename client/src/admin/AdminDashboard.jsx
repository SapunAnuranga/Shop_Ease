import React, { useEffect, useState } from "react";
import API from "../api";

const AdminDashboard = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token"); // your auth token
    const config = { headers: { Authorization: `Bearer ${token}` } };

    // Fetch Users
    const fetchUsers = async () => {
      try {
        const res = await API.get("/users", config);
        const usersArray = Array.isArray(res.data) ? res.data : res.data.users || [];
        setUsersCount(usersArray.length);
      } catch (err) {
        console.error("❌ Failed to load users:", err);
      }
    };

    // Fetch Products
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products", config);
        const productsArray = Array.isArray(res.data)
          ? res.data
          : res.data.products || [];
        setProductsCount(productsArray.length);
      } catch (err) {
        console.error("❌ Failed to load products:", err);
      }
    };

    // Fetch Orders
    const fetchOrders = async () => {
      try {
        const res = await API.get("/orders", config);
        const ordersArray = Array.isArray(res.data)
          ? res.data
          : res.data.orders || [];
        setOrdersCount(ordersArray.length);
      } catch (err) {
        console.error("❌ Failed to load orders:", err);
      }
    };

    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchProducts(), fetchOrders()]);
      setLoading(false);
    };

    fetchAll();
  }, []);

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading dashboard...</p>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-10 text-center">📊 Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Users", value: usersCount, color: "text-blue-600", emoji: "👤" },
          { label: "Products", value: productsCount, color: "text-green-600", emoji: "📦" },
          { label: "Orders", value: ordersCount, color: "text-purple-600", emoji: "🛒" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <h2 className="text-lg font-medium text-gray-600 mb-2">
              {stat.emoji} {stat.label}
            </h2>
            <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
