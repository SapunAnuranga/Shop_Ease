// src/pages/PaymentSuccess.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../api";
import { useCart } from "../context/CartContext"; // Import useCart

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const { clearCart } = useCart(); // Get clearCart from context

  const orderId = searchParams.get("order_id");
  const paymentId = searchParams.get("payment_id"); // PayHere payment ID

  useEffect(() => {
    if (orderId) {
      // Fetch order details from your backend
      API.get(`/orders/${orderId}`) // This assumes you have a GET /api/orders/:id endpoint
        .then(res => {
          if (res.data.success) {
            setOrder(res.data.order);
            clearCart(); // Clear the cart upon successful order confirmation
          } else {
            console.error("Failed to fetch order details:", res.data.message);
            // Optionally navigate to an error page or show a message
          }
        })
        .catch(err => {
          console.error("❌ Error fetching order details on success page:", err);
          // Handle error, e.g., show a generic success message but note details couldn't be loaded
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // If no order_id, it might be an invalid access or direct navigation
      console.warn("PaymentSuccess page accessed without order_id.");
      setLoading(false);
      // Optionally redirect to home or a generic error page
    }
  }, [orderId, clearCart]); // Add clearCart to dependency array

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
        
        {order ? (
          <div className="mb-6 text-left bg-gray-50 p-4 rounded">
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Amount:</strong> Rs. {order.total?.toFixed(2)}</p>
            <p><strong>Status:</strong> <span className="text-green-600 capitalize">{order.paymentStatus}</span></p>
            {paymentId && <p><strong>PayHere Payment ID:</strong> {paymentId}</p>}
            {order.customerInfo && (
              <p><strong>Customer:</strong> {order.customerInfo.first_name} {order.customerInfo.last_name}</p>
            )}
          </div>
        ) : (
          <div className="mb-6 text-left bg-yellow-50 p-4 rounded">
            <p className="text-yellow-800">Payment was successful, but we couldn't load your order details.</p>
            {orderId && <p><strong>Order ID:</strong> {orderId}</p>}
            {paymentId && <p><strong>PayHere Payment ID:</strong> {paymentId}</p>}
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
            onClick={() => navigate("/orders")} // Assuming a user orders history page
            className="w-full border border-green-600 text-green-600 py-3 rounded-lg hover:bg-green-50 transition duration-200"
          >
            View My Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
