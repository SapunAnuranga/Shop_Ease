import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ShopEaseLogo from "../components/ShopEaseLogo";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { isLoggedIn, user, logout } = useAuth();
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  // ✅ Count total items in cart
  const cartCount = (items || []).reduce(
    (sum, item) => sum + (item.qty || 1),
    0
  );

  const navLinks = [
    { to: "/", label: t("home") },
    { to: "/products", label: t("products") },
    { to: "/about", label: t("aboutUs") },
    { to: "/contact", label: t("contactUs") },
  ];

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "si" : "en";
    i18n.changeLanguage(newLang);
  };

  const getInitial = (email) => email?.charAt(0).toUpperCase() || "";

  return (
    <nav className="bg-gray-800 shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Logo */}
        <div className="text-white text-lg font-bold cursor-pointer" onClick={() => navigate("/")}>
          <ShopEaseLogo />
        </div>

        {/* Navigation Links */}
        <ul className="flex flex-wrap justify-center gap-4 sm:gap-6 items-center">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-yellow-400"
                      : "text-white hover:text-yellow-300"
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}

          {/* Language Toggle */}
          <li>
            <button
              onClick={toggleLanguage}
              className="text-sm text-white border border-white px-2 py-1 rounded hover:bg-white hover:text-gray-800 transition"
            >
              {i18n.language === "en" ? "සිංහල" : "English"}
            </button>
          </li>
        </ul>

        {/* Right Side - Cart & Account */}
        <div className="flex items-center gap-4 relative">
          {/* 🛒 Cart (only visible when logged in) */}
          {isLoggedIn && (
            <NavLink
              to="/cart"
              className="relative text-white hover:text-yellow-300 transition text-2xl"
              aria-label="Cart"
            >
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
                  {cartCount}
                </span>
              )}
            </NavLink>
          )}

          {/* 👤 User */}
          {isLoggedIn ? (
            <div className="relative">
              {/* User Initial Avatar */}
              <div
                onClick={() => setShowDropdown((prev) => !prev)}
                className="rounded-full bg-orange-500 w-10 h-10 flex items-center justify-center font-bold cursor-pointer select-none text-white"
              >
                {getInitial(user?.email)}
              </div>

              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 text-gray-800 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="font-medium">{user?.name || "User"}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>

                  {/* Admin link */}
                  {user?.role === "admin" && (
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        navigate("/admin/dashboard");
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                    >
                      🧑‍💻 Admin Dashboard
                    </button>
                  )}

                  {/* Logout */}
                  <button
                    onClick={() => {
                      logout();       // clear auth
                      clearCart();    // ✅ clear cart manually
                      setShowDropdown(false);
                      navigate("/");  // go home
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-600 hover:text-white transition"
                  >
                    {t("logout") || "Logout"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink
              to="/account"
              className="flex items-center gap-1 text-sm font-medium text-white hover:text-yellow-300 transition"
            >
              <span className="text-lg">👤</span>
              <span>{t("account") || "Account"}</span>
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
