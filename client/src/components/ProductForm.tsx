"use client";

import { useState, useEffect } from "react";

interface Product {
  _id: string;
  name: string;
  price: string;
  description: string;
  image: string;
}

interface ProductFormProps {
  product?: Product | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price || "");
  const [description, setDescription] = useState(product?.description || "");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(product?.name || "");
    setPrice(product?.price || "");
    setDescription(product?.description || "");
    setImage(null);
    setImagePreview(product?.image || null);
  }, [product]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(product?.image || null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price); // Already a string
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }

    const url = product
      ? `http://localhost:3001/product/update/${product._id}`
      : "http://localhost:3001/product/create";

    const method = product ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        onSuccess?.();
        // Reset form
        setName("");
        setPrice("");
        setDescription("");
        setImage(null);
        setImagePreview(null);
      } else {
        alert("Failed to save product: " + (data.errors?.[0]?.message || "Unknown error"));
      }
    } catch (error) {
      alert("Error saving product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., 10.50 or 10.50 points"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {imagePreview && (
          <img
            src={imagePreview.startsWith('data:') ? imagePreview : `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/product/${imagePreview}`}
            alt="Preview"
            className="mt-2 w-32 h-32 object-cover rounded-md"
          />
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-2 px-4 rounded-md transition duration-300"
        >
          {loading ? "Saving..." : (product ? "Update" : "Add")}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}