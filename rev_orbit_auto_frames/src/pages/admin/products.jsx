import React, { useEffect, useState } from "react";
import { useAdminProducts } from "../../hooks/useAdminApi";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { supabase } from "../../utils/supabaseClient"; // adjust path if needed

const initialForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock_quantity: "",
  image_url: "",
};

export default function ProductsAdmin() {
  const {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useAdminProducts();

  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [imgPreview, setImgPreview] = useState("");
  const [imgFile, setImgFile] = useState(null);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image_url" && files && files[0]) {
      setImgFile(files[0]);
      setImgPreview(URL.createObjectURL(files[0]));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    let imageUrl = form.image_url;

    if (imgFile) {
      const fileExt = imgFile.name.split(".").pop();
      const fileName = `${form.name.replace(/\s+/g, "_")}_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, imgFile);

      if (uploadError) {
        setFormError("Image upload failed.");
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      imageUrl = publicUrlData.publicUrl;
    }

    const payload = {
      ...form,
      price: Number(form.price),
      stock_quantity: Number(form.stock_quantity),
      image_url: imageUrl,
    };

    if (!payload.name || !payload.price) {
      setFormError("Name and price are required.");
      return;
    }

    if (editId) {
      await updateProduct(editId, payload);
      setEditId(null);
    } else {
      await addProduct(payload);
    }
    setForm(initialForm);
    setImgFile(null);
    setImgPreview("");
  };

  const handleEdit = (p) => {
    setForm({ ...p });
    setEditId(p.id);
    setImgPreview(p.image_url || "");
    setImgFile(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) await deleteProduct(id);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-gray-100 to-white min-h-screen p-10">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center 
        bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 text-transparent bg-clip-text drop-shadow">
          🛒 Product Management
        </h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-200 mb-12 transition hover:shadow-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
            <Input label="Category" name="category" value={form.category} onChange={handleChange} />
            <Input label="Price" name="price" type="number" value={form.price} onChange={handleChange} required />
            <Input
              label="Stock Qty"
              name="stock_quantity"
              type="number"
              value={form.stock_quantity}
              onChange={handleChange}
            />
            <Input
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
            <div>
              <label className="block text-sm font-medium mb-2">Product Image</label>
              <input
                type="file"
                name="image_url"
                accept="image/*"
                onChange={handleChange}
                className="block w-full text-sm border rounded-lg px-2 py-1"
              />
              {imgPreview && (
                <img
                  src={imgPreview}
                  alt="Preview"
                  className="mt-3 h-20 w-20 rounded-lg object-cover shadow-md border"
                />
              )}
            </div>
          </div>
          {formError && <div className="text-red-500 text-sm mt-3">{formError}</div>}
          <div className="mt-6 flex gap-3">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 
                         text-white font-semibold rounded-lg px-5"
            >
              {editId ? "Update Product" : "Add Product"}
            </Button>
            {editId && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditId(null);
                  setForm(initialForm);
                  setImgPreview("");
                  setImgFile(null);
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>

        {/* Products Table */}
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">📦 All Products</h2>

          {loading && <div>Loading...</div>}
          {error && <div className="text-red-500">{error}</div>}

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm rounded-xl overflow-hidden border">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 text-white">
                  <th className="p-4 text-left">Image</th>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-left">Price</th>
                  <th className="p-4 text-left">Stock</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr
                    key={p.id}
                    className={`transition hover:bg-blue-50 ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="p-4">
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="h-12 w-12 object-cover rounded-lg border shadow-sm"
                      />
                    </td>
                    <td className="p-4 font-semibold text-gray-800">{p.name}</td>
                    <td className="p-4">{p.category}</td>
                    <td className="p-4">₹{p.price}</td>
                    <td className="p-4">{p.stock_quantity}</td>
                    <td className="p-4 flex gap-2">
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => handleEdit(p)}
                        className="hover:bg-indigo-100"
                      >
                        Edit
                      </Button>
                      <Button
                        size="xs"
                        variant="danger"
                        onClick={() => handleDelete(p.id)}
                        className="hover:bg-red-100"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
