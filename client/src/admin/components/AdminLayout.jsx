import React from "react";
import Sidebar from "./Sidebar";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminLayout = () => {
  const { logout, user, loading, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  if (loading) return <div className="p-6">Loading...</div>;

  if (!isLoggedIn) {
    return <Navigate to="/account" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate("/account");
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold"></h1>
          <button
            onClick={handleLogout}
            className="bg-gray-800 text-white px-5 py-2 rounded-lg shadow hover:bg-gray-700 transition duration-200"
          >
            Logout
          </button>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
