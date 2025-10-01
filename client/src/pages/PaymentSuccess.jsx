// src/pages/PaymentSuccess.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../api";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  const orderId = searchParams.get("order_id");
  const paymentId = searchParams.get("payment_id");

  useEffect(() => {
    if (orderId) {
      // Fetch order details
      API.get(`/orders/${orderId}`)
        .then(res => {
          if (res.data.success) {
            setOrder(res.data.order);
          }
        })
        .catch(err => {
          console.error("Failed to fetch order:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-green-600 text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment Successful!</h1>
        
        {order && (
          <div className="mb-6 text-left bg-gray-50 p-4 rounded">
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Amount:</strong> Rs. {order.total?.toFixed(2)}</p>
            <p><strong>Status:</strong> <span className="text-green-600 capitalize">{order.paymentStatus}</span></p>
            {paymentId && <p><strong>Payment ID:</strong> {paymentId}</p>}
          </div>
        )}

        <p className="text-gray-600 mb-6">
          Thank you for your purchase! Your order has been confirmed and will be processed shortly.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/")}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-200"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate("/orders")}
            className="w-full border border-green-600 text-green-600 py-3 rounded-lg hover:bg-green-50 transition duration-200"
          >
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;