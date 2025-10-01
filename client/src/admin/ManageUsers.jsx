import React, { useEffect, useState } from "react";
import API from "../api";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Load users failed", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/users/${id}`);
      loadUsers();
    } catch (err) {
      console.error("Delete user failed", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">👥 Manage Users</h1>
      <div className="overflow-x-auto bg-white shadow-md rounded-xl">
        <table className="w-full border-collapse text-sm md:text-base">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border px-4 py-3">Name</th>
              <th className="border px-4 py-3">Email</th>
              <th className="border px-4 py-3">Role</th>
              <th className="border px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? users.map(u => (
              <tr key={u._id} className="text-center hover:bg-gray-50">
                <td className="border px-4 py-3">{u.name}</td>
                <td className="border px-4 py-3">{u.email}</td>
                <td className="border px-4 py-3">{u.role}</td>
                <td className="border px-4 py-3">
                  <button
                    onClick={() => handleDelete(u._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                  >Delete</button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="p-6 text-gray-500 text-center">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
