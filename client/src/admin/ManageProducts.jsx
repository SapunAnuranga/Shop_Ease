import React, { useEffect, useState } from "react";
import API from "../api";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    brand: "",
    category: "",
    tags: "",
    basePrice: "",
    rating: "",
    isDeal: false,
    dealEnd: "",
  });

  const [image, setImage] = useState(null);
  const [variants, setVariants] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("❌ Error loading products:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "tags") {
          // convert comma separated to array
          v.split(",").map((tag) => fd.append("tags", tag.trim()));
        } else {
          fd.append(k, v);
        }
      });

      if (image) fd.append("image", image);

      // variants (convert JSON → string before send)
      if (variants.length > 0) {
        fd.append("variants", JSON.stringify(variants));
      }

      await API.post("/products", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Reset form
      setForm({
        name: "",
        slug: "",
        description: "",
        brand: "",
        category: "",
        tags: "",
        basePrice: "",
        rating: "",
        isDeal: false,
        dealEnd: "",
      });
      setImage(null);
      setVariants([]);

      await loadProducts();
    } catch (err) {
      console.error("❌ Error adding product:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      await loadProducts();
    } catch (err) {
      console.error("❌ Error deleting product:", err);
    }
  };

  // Add new variant example
  const addVariant = () => {
    setVariants([
      ...variants,
      {
        color: "",
        colorCode: "",
        images: [],
        model3d: "",
        arOverlay: "",
        price: "",
        originalPrice: "",
        sizes: [],
      },
    ]);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">🛠️ Manage Products</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 space-y-4 mb-10"
      >
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full border px-4 py-3 rounded-md"
          required
        />
        <input
          type="text"
          name="slug"
          value={form.slug}
          onChange={handleChange}
          placeholder="Slug (unique)"
          className="w-full border px-4 py-3 rounded-md"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border px-4 py-3 rounded-md"
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="brand"
            value={form.brand}
            onChange={handleChange}
            placeholder="Brand"
            className="border px-4 py-3 rounded-md"
          />
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="border px-4 py-3 rounded-md"
          />
        </div>
        <input
          type="text"
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="Tags (comma separated)"
          className="w-full border px-4 py-3 rounded-md"
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="basePrice"
            value={form.basePrice}
            onChange={handleChange}
            placeholder="Base Price"
            className="border px-4 py-3 rounded-md"
          />
          <input
            type="number"
            step="0.1"
            name="rating"
            value={form.rating}
            onChange={handleChange}
            placeholder="Rating (0 - 5)"
            className="border px-4 py-3 rounded-md"
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isDeal"
              checked={form.isDeal}
              onChange={handleChange}
            />
            Deal?
          </label>
          {form.isDeal && (
            <input
              type="date"
              name="dealEnd"
              value={form.dealEnd}
              onChange={handleChange}
              className="border px-4 py-2 rounded-md"
            />
          )}
        </div>

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full"
        />

        {/* Variants Section */}
        <div className="border p-4 rounded-md space-y-3">
          <h3 className="font-semibold">Variants</h3>
          {variants.map((v, i) => (
            <div key={i} className="border p-3 rounded-md space-y-2">
              <input
                type="text"
                placeholder="Color"
                value={v.color}
                onChange={(e) => {
                  const copy = [...variants];
                  copy[i].color = e.target.value;
                  setVariants(copy);
                }}
                className="w-full border px-3 py-2 rounded-md"
              />
              <input
                type="text"
                placeholder="Color Code (#000000)"
                value={v.colorCode}
                onChange={(e) => {
                  const copy = [...variants];
                  copy[i].colorCode = e.target.value;
                  setVariants(copy);
                }}
                className="w-full border px-3 py-2 rounded-md"
              />
              <input
                type="text"
                placeholder="3D Model URL"
                value={v.model3d}
                onChange={(e) => {
                  const copy = [...variants];
                  copy[i].model3d = e.target.value;
                  setVariants(copy);
                }}
                className="w-full border px-3 py-2 rounded-md"
              />
              <input
                type="text"
                placeholder="AR Overlay URL"
                value={v.arOverlay}
                onChange={(e) => {
                  const copy = [...variants];
                  copy[i].arOverlay = e.target.value;
                  setVariants(copy);
                }}
                className="w-full border px-3 py-2 rounded-md"
              />
              <input
                type="number"
                placeholder="Price"
                value={v.price}
                onChange={(e) => {
                  const copy = [...variants];
                  copy[i].price = e.target.value;
                  setVariants(copy);
                }}
                className="w-full border px-3 py-2 rounded-md"
              />
              <input
                type="number"
                placeholder="Original Price"
                value={v.originalPrice}
                onChange={(e) => {
                  const copy = [...variants];
                  copy[i].originalPrice = e.target.value;
                  setVariants(copy);
                }}
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addVariant}
            className="bg-gray-200 px-3 py-2 rounded-md"
          >
            ➕ Add Variant
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
        >
          ➕ Add Product
        </button>
      </form>

      {/* Product List */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">📋 Products List</h2>
        {products.length > 0 ? (
          <div className="space-y-4">
            {products.map((p) => (
              <div
                key={p._id}
                className="flex items-center justify-between border-b pb-3"
              >
                <div className="flex items-center gap-4">
                  {p.imageUrl && (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-14 h-14 object-cover rounded-md"
                    />
                  )}
                  <div>
                    <p className="font-medium text-lg">{p.name}</p>
                    <p className="text-sm text-gray-500">
                      {p.brand} | {p.category} | Rs.{p.basePrice} | ⭐ {p.rating}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default ManageProducts;
