import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../api";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [promo, setPromo] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Restore from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cartItems");
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch {
      console.warn("Failed to load cart");
      setItems([]);
    }
    setLoading(false);
  }, []);

  // ✅ Persist to localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("cartItems", JSON.stringify(items));
    }
  }, [items, loading]);

  // ✅ Get final price with discount check
const getFinalPrice = (product) => {
  if (product.discountPercent && (product.original || product.price || product.basePrice)) {
    const basePrice = product.original || product.price || product.basePrice;
    return basePrice - (basePrice * product.discountPercent) / 100;
  }
  return product.price || product.original || product.basePrice || 0;
};

  // ✅ Add to cart (prevent duplicates)
  const addToCart = (product, qty = 1) => {
    if (!product || !product._id) return;

    console.log("🛒 Adding to cart:", product.name, "qty:", qty);

    setItems((prev) => {
      const idx = prev.findIndex((i) => i.productId === product._id);

      if (idx >= 0) {
        // already in cart → increase qty
        const updated = [...prev];
        updated[idx].qty += qty;
        console.log("➡️ Updated qty:", updated);
        return updated;
      }

      // new product → add
      const newCart = [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          price: getFinalPrice(product),
          imageUrl: product.imageUrl || "https://via.placeholder.com/150",
          qty,
        },
      ];
      console.log("✅ New item added:", newCart);
      return newCart;
    });
  };


  const removeFromCart = (productId) => {
  setItems((prev) => {
    const idx = prev.findIndex((i) => i.productId === productId);
    if (idx >= 0) {
      const updated = [...prev];
      if (updated[idx].qty > 1) {
        updated[idx].qty -= 1; // reduce by 1
        return updated;
      } else {
        // if qty == 1 → remove completely
        return prev.filter((i) => i.productId !== productId);
      }
    }
    return prev;
  });
};


  const clearCart = () => {
    setItems([]);
    setPromo(null);
    localStorage.removeItem("cartItems");
  };

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const applyPromo = async (code, userId = null, isFirstOrder = false) => {
    try {
      const res = await API.post("/promo/apply", {
        code,
        cartTotal: subtotal,
        userId,
        isFirstOrder,
      });
      if (res.data.success) {
        setPromo(res.data.promo);
        return {
          success: true,
          discountAmount: res.data.discountAmount,
          newTotal: res.data.newTotal,
        };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message,
      };
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        addToCart,
        removeFromCart,
        clearCart,
        subtotal,
        promo,
        applyPromo,
      }}
    >
      {!loading && children}
    </CartContext.Provider>
  );
};
