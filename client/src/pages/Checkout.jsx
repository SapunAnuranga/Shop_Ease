import React, { useState } from "react";
import API from "../api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Checkout = () => {
  const { items: cartItems, subtotal, clearCart } = useCart(); // Added clearCart
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [customerInfo, setCustomerInfo] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  const total = subtotal - discount;

  // Apply promo
  const applyPromo = async () => {
    if (!promoCode) {
      alert("Please enter promo code");
      return;
    }
    try {
      const res = await API.post("/promo/apply", {
        code: promoCode,
        cartTotal: subtotal,
        userId: user?._id,
      });
      if (res.data.success) {
        setDiscount(res.data.discountAmount);
        alert("Promo applied successfully!");
      } else {
        alert(res.data.message || "Invalid promo code or conditions not met.");
      }
    } catch (err) {
      console.error("❌ Error applying promo:", err.response?.data || err);
      alert(
        err.response?.data?.message ||
          "Failed to apply promo. Please try again."
      );
    }
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (
      !customerInfo.first_name ||
      !customerInfo.email ||
      !customerInfo.phone ||
      !customerInfo.address
    ) {
      alert(
        "Please fill all required customer information fields (First Name, Email, Phone, Address)."
      );
      return;
    }
    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add items before checking out.");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/orders/create", {
        userId: user?._id,
        items: cartItems,
        subtotal,
        discount,
        // total,   ❌ removed (backend calculates this)
        customerInfo,
      });

      if (res.data.success) {
        const payment = res.data.payment;
        // 🚨 IMPORTANT: PayHere SDK is loaded asynchronously. Ensure it's available.
        if (window.payhere && typeof window.payhere.startPayment === "function") {
          window.payhere.startPayment(payment);
          // Optionally clear cart here, or after successful payment notification
          // clearCart(); // Consider clearing cart only after successful payment confirmation
        } else {
          console.error(
            "PayHere SDK not loaded or 'startPayment' function not found."
          );
          alert("Payment gateway not ready. Please try again in a moment.");
          setLoading(false); // Stop loading if SDK not ready
        }
      } else {
        alert(
          res.data.message || "Failed to initiate payment. Please try again."
        );
      }
    } catch (err) {
      console.error(
        "❌ Checkout initiation failed:",
        err.response?.data || err.message || err
      );
      alert(
        err.response?.data?.message ||
          "Checkout failed due to an unexpected error. Please try again."
      );
    } finally {
      // Only set loading to false if PayHere SDK is not taking over
      if (!window.payhere || typeof window.payhere.startPayment !== "function") {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT - Customer Information Form */}
        <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Customer Information
          </h2>

          <div className="space-y-4">
            {/* First + Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerInfo.first_name}
                  onChange={(e) =>
                    setCustomerInfo({
                      ...customerInfo,
                      first_name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  placeholder="First name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={customerInfo.last_name}
                  onChange={(e) =>
                    setCustomerInfo({
                      ...customerInfo,
                      last_name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                  placeholder="Last name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={customerInfo.email}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, email: e.target.value })
                }
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={customerInfo.phone}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, phone: e.target.value })
                }
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                placeholder="Phone number"
                required
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customerInfo.address}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, address: e.target.value })
                }
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                placeholder="Street address"
                required
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">City</label>
              <input
                type="text"
                value={customerInfo.city}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, city: e.target.value })
                }
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                placeholder="City"
              />
            </div>
          </div>
        </div>

        {/* RIGHT - Order Summary & Payment */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
              Order Summary
            </h2>
            <div className="space-y-1 text-sm text-gray-700">
              <p className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toFixed(2)}</span>
              </p>
              {discount > 0 && (
                <p className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>- Rs. {discount.toFixed(2)}</span>
                </p>
              )}
              <p className="flex justify-between font-semibold border-t pt-2">
                <span>Total</span>
                <span>Rs. {total.toFixed(2)}</span>
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
            <h2 className="text-md font-semibold mb-2">Promo Code</h2>
            <div className="flex">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter promo"
                className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              />
              <button
                onClick={applyPromo}
                className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading || cartItems.length === 0}
            className="w-full bg-green-600 text-white py-3 rounded-md font-medium text-sm hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading
              ? "Processing..."
              : `Pay Rs. ${total.toFixed(2)} with PayHere`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
