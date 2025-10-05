import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { AiFillStar } from "react-icons/ai";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    API.get("/products")
      .then((res) => {
        setProducts(res.data.products || []);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const filteredProducts = products.filter((product) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      (product.name || "").toLowerCase().includes(lowerSearch) ||
      (product.description || "").toLowerCase().includes(lowerSearch)
    );
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "priceLow") return (a.basePrice || 0) - (b.basePrice || 0);
    if (sortBy === "priceHigh") return (b.basePrice || 0) - (a.basePrice || 0);
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  const handleBuyNow = (product) => {
    if (!isLoggedIn) {
      navigate("/account");
    } else {
      addToCart(product);
      navigate("/cart");
    }
  };

  const handleAddToCart = (product) => {
    if (!isLoggedIn) {
      navigate("/account");
    } else {
      addToCart(product);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-16 my-12">
      {/* Search + Sort Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Our Products</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">Sort By</option>
            <option value="priceLow">Price: Low → High</option>
            <option value="priceHigh">Price: High → Low</option>
            <option value="rating">Rating: High → Low</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedProducts.length > 0 ? (
          sortedProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition flex flex-col relative"
            >
              {/* Thumbnail */}
              <div className="relative">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-40 object-contain mb-3"
                  onError={(e) =>
                    (e.target.src = "https://via.placeholder.com/150")
                  }
                />
              </div>

              {/* Meta */}
              <h3 className="font-semibold text-sm sm:text-base mb-1">
                {product.name}
              </h3>
              <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                {product.description}
              </p>

              {/* Rating */}
              <div className="flex items-center text-sm mb-1">
                <AiFillStar className="text-yellow-500 mr-1" />
                <span>{product.rating || "0"}</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2">
                <p className="text-md font-semibold text-gray-900">
                  Rs. {Number(product.basePrice || 0).toLocaleString("en-LK")}
                </p>
              </div>

              {/* Buttons */}
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
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Products;
