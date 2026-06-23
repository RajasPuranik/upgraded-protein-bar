"use client";

import { useEffect, useState } from "react";
import { readProductsFromFirestore, updateProduct, deleteProduct, createProduct } from "@/lib/firestore-products";
import type { Product } from "@/lib/products";
import { Plus, Edit2, Trash2, X } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    readProductsFromFirestore()
      .then(fetched => {
        setProducts(fetched || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete product.");
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const productData: any = {
      id: isEditing?.id || `prod_${Date.now()}`,
      flavorKey: formData.get("flavorKey") as string,
      flavorName: formData.get("flavorName") as string,
      sizeKey: formData.get("sizeKey") as string,
      sizeName: formData.get("sizeName") as string,
      price: Number(formData.get("price")),
      weightGrams: Number(formData.get("weightGrams")),
      proteinGrams: Number(formData.get("proteinGrams")),
      sortOrder: Number(formData.get("sortOrder")),
      active: formData.get("active") === "true",
      colorLight: formData.get("colorLight") as string,
      colorDark: formData.get("colorDark") as string,
      tagline: formData.get("tagline") as string,
    };

    try {
      if (isEditing) {
        await updateProduct(productData.id, productData);
        setProducts(products.map(p => p.id === productData.id ? productData as Product : p));
      } else {
        await createProduct(productData);
        setProducts([...products, productData as Product]);
      }
      setIsEditing(null);
      setIsAdding(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save product.");
    }
  };

  if (loading && products.length === 0) {
    return <div>Loading products...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ margin: 0 }}>Product Management</h1>
        <button 
          className="button button--primary button--small" 
          onClick={() => setIsAdding(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div style={{ background: 'var(--surface-color)', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '15px 20px', fontWeight: '500' }}>Product</th>
              <th style={{ padding: '15px 20px', fontWeight: '500' }}>Price</th>
              <th style={{ padding: '15px 20px', fontWeight: '500' }}>Details</th>
              <th style={{ padding: '15px 20px', fontWeight: '500' }}>Status</th>
              <th style={{ padding: '15px 20px', fontWeight: '500' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '15px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: product.colorLight }} />
                    <div>
                      <strong>{product.flavorName}</strong><br/>
                      <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>{product.sizeName}</span>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '15px 20px', fontWeight: 'bold' }}>Rs. {product.price}</td>
                <td style={{ padding: '15px 20px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                  {product.weightGrams}g | {product.proteinGrams}g protein
                </td>
                <td style={{ padding: '15px 20px' }}>
                  <span style={{ 
                    fontSize: '0.8rem', 
                    padding: '4px 8px', 
                    borderRadius: '4px',
                    background: product.active ? 'rgba(50,205,50,0.2)' : 'rgba(255,99,71,0.2)',
                    color: product.active ? '#32cd32' : 'var(--danger-color)'
                  }}>
                    {product.active ? "ACTIVE" : "HIDDEN"}
                  </span>
                </td>
                <td style={{ padding: '15px 20px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      className="icon-button" 
                      onClick={() => setIsEditing(product)}
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      className="icon-button icon-button--danger" 
                      onClick={() => handleDelete(product.id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit/Add Modal */}
      {(isEditing || isAdding) && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div style={{ background: 'var(--surface-color)', padding: '30px', borderRadius: '16px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>{isEditing ? "Edit Product" : "Add Product"}</h2>
              <button className="icon-button" onClick={() => { setIsEditing(null); setIsAdding(false); }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <label>
                  Flavor Name (e.g. Peanut Butter)
                  <input required name="flavorName" defaultValue={isEditing?.flavorName || ""} />
                </label>
                <label>
                  Flavor Key (e.g. peanut-butter)
                  <input required name="flavorKey" defaultValue={isEditing?.flavorKey || ""} />
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <label>
                  Size Name (e.g. The Mini Bar)
                  <input required name="sizeName" defaultValue={isEditing?.sizeName || ""} />
                </label>
                <label>
                  Size Key (e.g. mini)
                  <input required name="sizeKey" defaultValue={isEditing?.sizeKey || ""} />
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                <label>
                  Price (Rs)
                  <input required type="number" name="price" defaultValue={isEditing?.price || ""} />
                </label>
                <label>
                  Weight (g)
                  <input required type="number" name="weightGrams" defaultValue={isEditing?.weightGrams || ""} />
                </label>
                <label>
                  Protein (g)
                  <input required type="number" name="proteinGrams" defaultValue={isEditing?.proteinGrams || ""} />
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <label>
                  Brand Color (Light/Hex)
                  <input required name="colorLight" defaultValue={isEditing?.colorLight || "#E2FE53"} />
                </label>
                <label>
                  Brand Color (Dark/Hex)
                  <input required name="colorDark" defaultValue={isEditing?.colorDark || "#A3C400"} />
                </label>
              </div>

              <label>
                Tagline (e.g. The OG Classic)
                <input required name="tagline" defaultValue={isEditing?.tagline || ""} />
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <label>
                  Sort Order (0 = first)
                  <input required type="number" name="sortOrder" defaultValue={isEditing?.sortOrder || 0} />
                </label>
                <label>
                  Active Status
                  <select name="active" defaultValue={isEditing?.active === false ? "false" : "true"} style={{ background: 'rgba(0,0,0,0.5)', padding: '10px', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px' }}>
                    <option value="true">Active (Visible)</option>
                    <option value="false">Hidden</option>
                  </select>
                </label>
              </div>

              <button type="submit" className="button button--primary" style={{ marginTop: '20px', justifyContent: 'center' }}>
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
