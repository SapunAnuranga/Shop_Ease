import React from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // ensure product has an _id for addToCart (normalize common id fields)
  const normalizeProductForCart = (p) => {
    return {
      ...p,
      _id: p._id || p.id || p.productId || null,
    };
  };

  // Add to Cart → always add, no login check
  const handleAddToCart = () => {
    const prod = normalizeProductForCart(product);
    if (!prod._id) {
      console.error("Cannot add product to cart — missing id:", product);
      return;
    }
    addToCart(prod);
  };

  // Buy Now → if not logged in -> go to /account
  // if logged in -> add to cart and go to /cart
  const handleBuyNow = () => {
    if (!isLoggedIn) {
      navigate("/account");
      return;
    }

    const prod = normalizeProductForCart(product);
    if (!prod._id) {
      console.error("Cannot add product to cart (Buy Now) — missing id:", product);
      // still navigate to cart since user wanted to checkout? here we choose to keep user on safe side:
      navigate("/cart");
      return;
    }

    addToCart(prod);
    navigate("/cart");
  };

  // Final price calculation for display only
  const finalPrice = (() => {
    const base = product.original ?? product.price ?? product.basePrice ?? 0;
    if (product.discountPercent && base) {
      return base - (base * product.discountPercent) / 100;
    }
    return base;
  })();

  return (
    <div className="flex flex-col justify-between border rounded-xl shadow-sm p-4 hover:shadow-md transition-all duration-200 h-full relative">
      {/* Thumbnail */}
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-contain mb-3"
          onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
        />
        {product.discountPercent && product.discountPercent > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            {product.discountPercent}% OFF
          </span>
        )}
      </div>

      {/* Meta */}
      <div className="flex-grow">
        <h2 className="text-base font-semibold mb-1">{product.name}</h2>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2 mt-1">
          <p className="text-md font-bold text-gray-800">
            Rs. {Number(finalPrice).toLocaleString("en-LK")}
          </p>
          {product.discountPercent > 0 && product.original && (
            <p className="text-sm text-gray-500 line-through">
              Rs. {Number(product.original).toLocaleString("en-LK")}
            </p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-4">
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-1/2 px-3 py-2 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition"
        >
          Add to Cart
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          className="w-1/2 px-3 py-2 bg-black text-white text-sm rounded hover:bg-gray-800 transition"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
