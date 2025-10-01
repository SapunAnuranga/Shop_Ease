import React from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { items: cartItems, removeFromCart, clearCart, subtotal } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  if (!isLoggedIn) {
    return (
      <div className="p-6 text-center text-xl font-semibold text-red-600">
        Please log in to view your cart.
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
        <button
          onClick={() => navigate("/products")}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <h2 className="text-3xl font-bold mb-6">Your Cart</h2>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.productId}
            className="flex items-center justify-between p-4 border rounded shadow-sm"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-16 h-16 object-contain"
              />
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">
                  Rs. {(item.price || 0).toFixed(2)} × {item.qty || 1}
                </p>
              </div>
            </div>
            <button
              onClick={() => removeFromCart(item.productId)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="text-right mt-6">
        <p className="text-xl font-semibold">Subtotal: Rs. {subtotal.toFixed(2)}</p>
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={clearCart}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Clear Cart
          </button>
          <button
            onClick={() => navigate("/checkout")}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
