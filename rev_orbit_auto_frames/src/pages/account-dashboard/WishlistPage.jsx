// src/pages/account-dashboard/WishlistPage.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import WishlistCard from "./components/WishlistCard";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      setError(null);
      try {
        // ✅ Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setWishlist([]);
          setLoading(false);
          return;
        }

        // ✅ Fetch wishlist with product details
        const { data, error } = await supabase
          .from("wishlist")
          .select("*, product:products(*)")
          .eq("user_id", user.id);

        if (error) throw error;

        // ✅ Normalize data for cards
        const formatted = (data || []).map((item) => ({
          product_id: item.product_id,
          name: item.product?.name,
          price: item.product?.price,
          image_url: item.product?.image_url,
          rating: item.product?.rating || 0,
        }));

        setWishlist(formatted);
      } catch (err) {
        console.error(err);
        setError("Failed to load wishlist.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  // ✅ Remove wishlist item
  const handleRemove = async (productId) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);

      setWishlist((prev) => prev.filter((item) => item.product_id !== productId));
    } catch (err) {
      console.error(err);
      setError("Failed to remove item from wishlist.");
    }
  };

  // ✅ Loading & Error states
  if (loading)
    return <div className="p-8 text-center text-gray-600">Loading wishlist...</div>;
  if (error)
    return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
        My Wishlist
      </h2>

      {wishlist.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          Your wishlist is empty.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {wishlist.map((item) => (
            <WishlistCard
              key={item.product_id}
              item={item}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
