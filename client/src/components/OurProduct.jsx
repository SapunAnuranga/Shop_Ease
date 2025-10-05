import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { AiFillStar } from "react-icons/ai";

const OurProduct = () => {
  const [products, setProducts] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/products")
      .then((res) => setProducts(res.data.products || []))
      .catch((err) => console.error("Failed to fetch products", err));
  }, []);

  const handleBuyNow = (product) => {
    if (!isLoggedIn) return navigate("/account");
    addToCart(product);
    navigate("/cart");
  };

  const handleAddToCart = (product) => {
    if (!isLoggedIn) return navigate("/account");
    addToCart(product);
  };

  const displayedProducts = showAll ? products : products.slice(0, 5);

  return (
    <div className="my-12 px-4 sm:px-8 lg:px-16">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Popular Products</h2>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedProducts.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition flex flex-col relative"
          >
            <div className="relative">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-40 object-contain mb-3"
                onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
              />
            </div>

            <h3 className="font-semibold text-sm sm:text-base mb-1">
              {product.name}
            </h3>
            <p className="text-xs text-gray-500 mb-2 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center text-sm mb-1">
              <AiFillStar className="text-yellow-500 mr-1" />
              <span>{product.rating || "0"}</span>
            </div>

            <div className="flex items-center gap-2">
              <p className="text-md font-semibold text-gray-900">
                Rs. {Number(product.basePrice || 0).toLocaleString("en-LK")}
              </p>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={() => handleAddToCart(product)}
                className="flex-1 px-3 py-1.5 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition"
              >
                Add to Cart
              </button>
              <button
                type="button"
                onClick={() => handleBuyNow(product)}
                className="flex-1 px-3 py-1.5 bg-black text-white text-sm rounded hover:bg-gray-800 transition"
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="text-sm font-medium text-gray-700 px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-100"
        >
          {showAll ? "Show less" : "See more"}
        </button>
      </div>
    </div>
  );
};

export default OurProduct;
