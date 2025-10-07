// @ts-nocheck
import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "../../../supabaseClient";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";

const CustomerReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [showAll, setShowAll] = useState(false); // ⭐ See more toggle

  // ⭐ fetch reviews
  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (!error) setReviews(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  // ⭐ submit review
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productId) {
      alert("❌ Product ID missing! Review cannot be submitted.");
      return;
    }

    let photo_url = null;

    if (imageFile) {
      const fileName = `${Date.now()}-${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("reviews")
        .upload(fileName, imageFile);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        alert("❌ Failed to upload image");
      } else {
        const { data: urlData } = supabase.storage
          .from("reviews")
          .getPublicUrl(fileName);
        photo_url = urlData.publicUrl;
      }
    }

    const { error } = await supabase.from("reviews").insert([
      {
        product_id: productId,
        name,
        rating,
        description,
        photo_url,
      },
    ]);

    if (error) {
      console.error("Insert error:", error);
      alert("❌ Failed to submit review");
    } else {
      alert("✅ Review submitted successfully!");
      setName("");
      setRating(0);
      setDescription("");
      setImageFile(null);
      fetchReviews();
    }
  };

  // ⭐ rating stats like Amazon
  const ratingStats = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    reviews.forEach((r) => counts[r.rating - 1]++);
    const total = reviews.length;
    return {
      counts,
      total,
      avg: total
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)
        : 0,
    };
  }, [reviews]);

  return (
    <div className="space-y-10">
      {/* Overall Summary */}
      <div className="border-b pb-6">
        <h2 className="text-2xl font-bold mb-3">Customer Reviews</h2>

        <div className="flex items-center gap-6">
          {/* Average rating */}
          <div className="text-center">
            <div className="text-4xl font-extrabold text-yellow-500">
              {ratingStats.avg}
            </div>
            <div className="flex justify-center">
              {[...Array(5)].map((_, i) => (
                <Icon
                  key={i}
                  name="Star"
                  size={22}
                  className={
                    i < Math.round(ratingStats.avg)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
            <p className="text-sm text-gray-600">{ratingStats.total} ratings</p>
          </div>

          {/* Rating breakdown */}
          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingStats.counts[star - 1] || 0;
              const percent = ratingStats.total
                ? Math.round((count / ratingStats.total) * 100)
                : 0;
              return (
                <div key={star} className="flex items-center text-sm gap-2">
                  <span className="w-10">{star} star</span>
                  <div className="flex-1 h-3 bg-gray-200 rounded overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                  <span className="w-12 text-gray-600">{percent}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Review List */}
      {loading ? (
        <p>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="italic text-gray-500">No reviews yet. Be the first one!</p>
      ) : (
        <div className="space-y-6">
          {(showAll ? reviews : reviews.slice(0, 3)).map((rev) => (
            <div
              key={rev.id}
              className="border-b pb-4 last:border-b-0 last:pb-0"
            >
              {/* ✅ Name */}
              <span className="block text-base font-semibold mb-1">
                {rev.name}
              </span>

              {/* ✅ Rating */}
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Icon
                    key={i}
                    name="Star"
                    size={18}
                    className={
                      i < rev.rating ? "text-yellow-400" : "text-gray-300"
                    }
                  />
                ))}
              </div>

              {/* ✅ Photo */}
              {rev.photo_url && (
                <img
                  src={rev.photo_url}
                  alt="review"
                  className="w-24 h-24 object-cover rounded mb-2"
                />
              )}

              {/* ✅ Description */}
              <p className="text-gray-700">{rev.description}</p>

              {/* ✅ Date */}
              <p className="text-xs text-gray-500 mt-1">
                {new Date(rev.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}

          {/* ⭐ See more / See less button */}
          {reviews.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm text-blue-600 hover:underline mt-2"
            >
              {showAll ? "See less reviews" : "See more reviews"}
            </button>
          )}
        </div>
      )}

      {/* Review Form */}
      <div className="pt-6">
        <h3 className="text-lg font-semibold mb-3">Write a Review</h3>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-4 border rounded-lg bg-gray-50"
        >
          {/* Name */}
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* Star Rating */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Your rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <Icon
                key={star}
                name="Star"
                size={24}
                className={`cursor-pointer ${
                  rating >= star ? "text-yellow-400" : "text-gray-300"
                }`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>

          {/* Image Upload */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full"
          />

          {/* Description */}
          <textarea
            placeholder="Write your review..."
            className="w-full p-2 border rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          {/* Submit */}
          <Button
            type="submit"
            variant="default"
            className="bg-yellow-500 text-white hover:bg-yellow-600"
          >
            Submit Review
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CustomerReviews;
