import React, { useEffect, useState } from "react";
import API from "../api";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedItems, setSelectedItems] = useState(null);

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
      // 🟢 Optimistic update - update UI immediately
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id ? { ...order, orderStatus: status } : order
        )
      );

      // 🟢 Send update to server
      await API.put(`/orders/${id}`, { orderStatus: status });
    } catch (err) {
      console.error("❌ Update failed", err);
      // 🔴 Optional: rollback if API fails (reload from DB)
      loadOrders();
    }
  };

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.orderStatus === filter);

  const formatOrderId = (id, index) => {
    return `ORD-${index + 1}`;
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
  };

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
              <th className="border px-4 py-3">Date</th>
              <th className="border px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr
                key={order._id}
                className="text-center hover:bg-gray-50 transition"
              >
                {/* ✅ Friendly ID clickable */}
                <td
                  className="border px-4 py-3 text-sm text-blue-600 underline cursor-pointer"
                  onClick={() => setSelectedOrderId(order._id)}
                  title="Click to view full Order ID"
                >
                  {formatOrderId(order._id, index)}
                </td>

                <td className="border px-4 py-3 font-medium">
                  {order.userId?.name || "Unknown"}
                </td>

                {/* ✅ Items show count, click to see details */}
                <td
                  className="border px-4 py-3 text-blue-600 underline cursor-pointer"
                  onClick={() => setSelectedItems(order.items)}
                  title="Click to view items"
                >
                  {order.items.length} items
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

                {/* Date */}
                <td className="border px-4 py-3 text-sm text-gray-600">
                  {order.createdAt ? formatDate(order.createdAt) : "-"}
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
                <td colSpan="8" className="p-6 text-gray-500 text-center">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Modal for showing real Order ID */}
      {selectedOrderId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
            <h2 className="text-lg font-bold mb-4">Full Order ID</h2>
            <p className="text-gray-700 break-all">{selectedOrderId}</p>
            <button
              onClick={() => setSelectedOrderId(null)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ✅ Modal for showing Items */}
      {selectedItems && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Order Items</h2>
            <div className="text-left space-y-2">
              {selectedItems.map((item, idx) => (
                <div key={idx} className="border-b pb-2">
                  <span className="font-medium">
                    {item.productId?.name || "Product"}
                  </span>{" "}
                  × {item.qty}
                </div>
              ))}
            </div>
            <button
              onClick={() => setSelectedItems(null)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
