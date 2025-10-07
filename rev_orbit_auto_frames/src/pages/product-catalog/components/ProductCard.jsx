
import React, { useState, useEffect } from "react";
import { supabase } from "../../../utils/supabaseClient";
import { useAuth } from "../../../contexts/AuthContext";
import { Link } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import { useCart } from "../../../contexts/CartContext";

// Debug: Log product id and link
// This must come after imports


const ProductCard = ({
  product,
  onQuickPreview,
  onAddToCompare,
  isComparing,
  onWishlistChange,
}) => {
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(
    product?.isWishlisted || false
  );
  const { addToCart } = useCart();

  // ✅ Customer Reviews state
  const [reviewsData, setReviewsData] = useState({ avgRating: 0, count: 0 });

  // 🔧 Helper: Image URL Fix
  const getImageUrl = (path) => {
    if (!path) return "/assets/images/no_image.png";

    // अगर पहले से full URL है
    if (path.startsWith("http")) return path;

    // Supabase bucket से public URL बनाओ
    const { data } = supabase.storage.from("products").getPublicUrl(path);
    return data?.publicUrl || "/assets/images/no_image.png";
  };

  // ✅ Load Reviews
  useEffect(() => {
    const loadReviews = async () => {
      if (!product?.id) return;

      const { data, error } = await supabase
        .from("reviews")
        .select("rating")
        .eq("product_id", product.id);

      if (error) {
        console.error("Error fetching reviews:", error);
        return;
      }

      if (data && data.length > 0) {
        const total = data.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = (total / data.length).toFixed(1);
        setReviewsData({ avgRating, count: data.length });
      } else {
        setReviewsData({ avgRating: 0, count: 0 });
      }
    };

    loadReviews();

    // ✅ Realtime updates
    const channel = supabase
      .channel(`reviews-product-${product.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reviews",
          filter: `product_id=eq.${product.id}`,
        },
        () => {
          loadReviews();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [product?.id]);

  // ✅ Wishlist Toggle
  const handleWishlistToggle = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (!user?.id) {
      alert("Please login to use wishlist");
      return;
    }
    if (!isWishlisted) {
      setIsWishlisted(true);
      const { error } = await supabase
        .from("wishlist")
        .insert({ user_id: user.id, product_id: product.id });
      if (error) {
        setIsWishlisted(false);
        alert("Failed to add product to wishlist");
        console.error("Supabase wishlist insert error:", error);
      } else {
        if (onWishlistChange) onWishlistChange("add", product.id);
      }
    } else {
      setIsWishlisted(false);
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", product.id);
      if (error) {
        setIsWishlisted(true);
        alert("Failed to remove product from wishlist");
        console.error("Supabase wishlist delete error:", error);
      } else {
        if (onWishlistChange) onWishlistChange("remove", product.id);
      }
    }
  };

  // ✅ Quick Preview
  const handleQuickPreview = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    onQuickPreview(product);
  };

  // ✅ Compare
  const handleAddToCompare = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    onAddToCompare(product);
  };

  // ✅ Add to Cart
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let validProductId = product.id;
    if (
      typeof validProductId === "object" &&
      validProductId !== null &&
      validProductId.hasOwnProperty("id")
    ) {
      validProductId = validProductId.id;
    }
    console.log("Add to cart product id:", validProductId);
    addToCart(validProductId, 1);
  };

  return (
    <div
      className="group bg-card rounded-xl border border-border overflow-hidden shadow-lg hover:shadow-2xl transition-all flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <img
          src={getImageUrl(product?.image_url || product?.image)}
          alt={product?.name || "Product Image"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/assets/images/no_image.png";
          }}
          loading="lazy"
        />
        {/* Overlay Actions */}
        <div
          className={`
          absolute inset-0 bg-black/40 flex items-center justify-center gap-3
          transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}
        `}
        >
          <Button
            variant="secondary"
            size="sm"
            iconName="Eye"
            onClick={handleQuickPreview}
            className="bg-white/90 text-primary hover:bg-white"
          >
            Quick View
          </Button>
          <Link to={`/customization-studio?productId=${product.id}`}>
            <Button
              variant="default"
              size="sm"
              iconName="Palette"
              className="bg-racing-red hover:bg-racing-red/90 text-white"
            >
              Customize
            </Button>
          </Link>
        </div>
        {/* Top Actions */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <div className="flex flex-col gap-2">
            {product?.tags?.includes("new") && (
              <span className="px-2 py-1 bg-racing-red text-white text-xs font-medium rounded-full">
                New
              </span>
            )}
            {product?.tags?.includes("bestseller") && (
              <span className="px-2 py-1 bg-automotive-orange text-white text-xs font-medium rounded-full">
                Bestseller
              </span>
            )}
            {product?.discount > 0 && (
              <span className="px-2 py-1 bg-heritage-green text-white text-xs font-medium rounded-full">
                {product?.discount}% OFF
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={handleWishlistToggle}
              className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition"
            >
              <Icon
                name={isWishlisted ? "Heart" : "Heart"}
                size={16}
                className={
                  isWishlisted
                    ? "text-racing-red fill-current"
                    : "text-muted-foreground"
                }
              />
            </button>
            <button
              onClick={handleAddToCompare}
              className={`w-8 h-8 rounded-full flex items-center justify-center shadow transition ${
                isComparing
                  ? "bg-accent text-white"
                  : "bg-white/90 text-muted-foreground hover:bg-white"
              }`}
            >
              <Icon name="GitCompare" size={16} />
            </button>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Category & Rating */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">
            {product?.category}
          </span>
          <div className="flex items-center gap-1">
            <Icon
              name="Star"
              size={14}
              className="text-automotive-orange fill-current"
            />
            <span className="text-sm font-medium text-primary">
              {reviewsData.avgRating}
            </span>
            <span className="text-xs text-muted-foreground">
              ({reviewsData.count})
            </span>
          </div>
        </div>
        {/* Title */}
  {/* Debug: Show product id in UI for troubleshooting */}
  <div style={{ fontSize: '10px', color: '#888' }}>ID: {product?.id || 'N/A'}</div>
  <Link to={`/products/${product.id}`} className="flex-grow">
          <h3 className="font-headline font-semibold text-base text-primary mb-2 line-clamp-2 hover:text-accent transition-colors duration-200">
            {product?.name}
          </h3>
        </Link>
        {/* Description */}
        <div className="mb-3 text-sm">
          {product.description && (
            <p className="text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          )}
        </div>
        {/* Price & Action */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">
              ₹{product?.price?.toLocaleString("en-IN")}
            </span>
            {product?.original_price && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{product?.original_price?.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              iconName="ShoppingCart"
              onClick={handleAddToCart}
              className="bg-accent hover:bg-accent/90"
            >
              Add
            </Button>
            <Link to={`/products/${product.id}`}>
              <Button
                variant="outline"
                size="sm"
                iconName="ArrowRight"
                iconPosition="right"
                className="hover:bg-accent hover:text-white hover:border-accent"
              >
                View
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
