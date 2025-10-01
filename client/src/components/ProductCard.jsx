import React from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      navigate("/account");
      return;
    }
    addToCart(product);
    navigate("/cart");
  };

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      navigate("/account");
      return;
    }
    addToCart(product);
  };

  // ProductCard.jsx (only changed bits shown)
const finalPrice = (() => {
  if (product.discountPercent && product.original) {
    return product.original - (product.original * product.discountPercent) / 100;
  }
  if (product.price) return product.price;
  return product.original || 0;
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
            {typeof finalPrice === "number"
              ? `Rs. ${finalPrice.toLocaleString("en-LK")}`
              : "Rs. N/A"}
          </p>
          {product.discountPercent > 0 && product.original && (
            <p className="text-sm text-gray-500 line-through">
              Rs. {product.original.toLocaleString("en-LK")}
            </p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={handleAddToCart}
          className="w-1/2 px-3 py-2 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition"
        >
          Add to Cart
        </button>
        <button
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
