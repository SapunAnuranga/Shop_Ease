import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const links = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/orders", label: "Orders" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/products", label: "Products" },
    { to: "/admin/promos", label: "Promos" },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <h2 className="text-lg font-bold mb-6">Admin Panel</h2>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-400 font-semibold"
                  : "hover:text-yellow-300"
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
