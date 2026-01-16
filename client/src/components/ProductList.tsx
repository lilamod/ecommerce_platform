"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import ProductForm from "./ProductForm";

interface ProductListProps {
  products: any[];
  onUpdate: () => void;
}

export default function ProductList({ products, onUpdate }: ProductListProps) {
  const [editing, setEditing] = useState<any>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const response = await fetch(`http://localhost:3001/product/${id}`, { method: "DELETE" });
      if (response.ok) {
        onUpdate();
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      alert("Error deleting product");
    }
  };

  return (
    <div>
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
            <ProductForm
              product={editing}
              onSuccess={() => {
                setEditing(null);
                onUpdate();
              }}
              onCancel={() => setEditing(null)}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <ProductCard
            key={p._id || p.id}
            product={p}
            onEdit={() => setEditing(p)}
            onDelete={() => handleDelete(p._id || p.id)}
          />
        ))}
      </div>
    </div>
  );
}