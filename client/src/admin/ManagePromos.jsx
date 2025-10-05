import React, { useEffect, useState } from "react";
import API from "../api";

const ManagePromos = () => {
  const [promos, setPromos] = useState([]);
  const [form, setForm] = useState({
    code: "",
    discountValue: "",
    discountType: "percent",
  });

  // ✅ Single correct loadPromos
  const loadPromos = async () => {
    try {
      const res = await API.get("/promo");
      setPromos(res.data.promos || []); // fixed
    } catch (err) {
      console.error("❌ Load promos failed", err);
    }
  };

  useEffect(() => {
    loadPromos();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await API.post("/promo/create", form);
      setForm({ code: "", discountValue: "", discountType: "percent" });
      loadPromos();
    } catch (err) {
      console.error("❌ Add promo failed", err.response?.data || err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/promo/${id}`);
      loadPromos();
    } catch (err) {
      console.error("❌ Delete promo failed", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">🎟 Manage Promos</h1>

      {/* Add form */}
      <form
        onSubmit={handleAdd}
        className="bg-white shadow-md rounded-lg p-6 mb-8 grid grid-cols-1 md:grid-cols-4 gap-3"
      >
        <input
          type="text"
          placeholder="Code"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          className="border px-3 py-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Discount"
          value={form.discountValue}
          onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
          className="border px-3 py-2 rounded"
          required
        />
        <select
          value={form.discountType}
          onChange={(e) => setForm({ ...form, discountType: e.target.value })}
          className="border px-3 py-2 rounded"
        >
          <option value="percent">Percent</option>
          <option value="fixed">Fixed</option>
        </select>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          ➕ Add
        </button>
      </form>

      {/* Promo list */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">📋 Active Promos</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border text-left">Code</th>
              <th className="p-3 border">Discount</th>
              <th className="p-3 border">Type</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {promos.length > 0 ? (
              promos.map((p, i) => (
                <tr
                  key={p._id}
                  className={`${i % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}
                >
                  <td className="p-3 border">{p.code}</td>
                  <td className="p-3 border text-center">{p.discountValue}</td>
                  <td className="p-3 border text-center">{p.discountType}</td>
                  <td className="p-3 border text-center">
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No promos found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagePromos;
