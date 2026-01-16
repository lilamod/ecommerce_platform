"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductList from "@/components/ProductList";
import ProductForm from "@/components/ProductForm";

export default function ProductsPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3001/product");
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      } else {
        console.error("Failed to fetch products");
      }
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/auth/signin");
      return;
    }
    setAuthChecked(true);
    fetchProducts();
  }, [router]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">Checking authentication...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Product Management</h1>

        {/* Form to add new product */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
          <ProductForm onSuccess={fetchProducts} />
        </div>

        {/* List of products */}
        <ProductList products={products} onUpdate={fetchProducts} />
      </div>
    </div>
  );
}