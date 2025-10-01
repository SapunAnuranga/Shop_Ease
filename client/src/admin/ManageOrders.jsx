import React, { useEffect, useState } from "react";
import API from "../api";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("❌ Load failed", err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}`, { orderStatus: status });
      loadOrders();
    } catch (err) {
      console.error("❌ Update failed", err);
    }
  };

  // filter orders by status
  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.orderStatus === filter);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">📦 Manage Orders</h1>

      {/* Filter Buttons */}
      <div className="mb-6 flex flex-wrap justify-center gap-3">
        {["all", "created", "processing", "delivered", "cancelled"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg shadow-sm transition ${
              filter === f
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border px-4 py-3">Order ID</th>
              <th className="border px-4 py-3">Customer</th>
              <th className="border px-4 py-3">Items</th>
              <th className="border px-4 py-3">Total</th>
              <th className="border px-4 py-3">Payment</th>
              <th className="border px-4 py-3">Status</th>
              <th className="border px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr
                key={order._id}
                className="text-center hover:bg-gray-50 transition"
              >
                <td className="border px-4 py-3 text-sm text-gray-600">
                  {order._id}
                </td>
                <td className="border px-4 py-3 font-medium">
                  {order.userId?.name || "Unknown"}
                </td>
                <td className="border px-4 py-3 text-left text-sm text-gray-600">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="mb-1">
                      {item.productId?.name || "Product"} (
                      {item.variantColor}, {item.size}) × {item.qty}
                    </div>
                  ))}
                </td>
                <td className="border px-4 py-3 font-semibold">
                  Rs. {order.total}
                </td>
                <td
                  className={`border px-4 py-3 font-semibold ${
                    order.paymentStatus === "paid"
                      ? "text-green-600"
                      : order.paymentStatus === "pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {order.paymentStatus}
                </td>
                <td className="border px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium text-white ${
                      order.orderStatus === "created"
                        ? "bg-gray-500"
                        : order.orderStatus === "processing"
                        ? "bg-blue-500"
                        : order.orderStatus === "delivered"
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </td>
                <td className="border px-4 py-3">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="border rounded-md px-3 py-2 bg-white shadow-sm"
                  >
                    <option value="created">Created</option>
                    <option value="processing">Processing</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="7" className="p-6 text-gray-500 text-center">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
