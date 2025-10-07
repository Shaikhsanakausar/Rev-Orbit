// @ts-nocheck
import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Link } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../supabaseClient';

const ProductInfo = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || null);
  const [selectedFinish, setSelectedFinish] = useState(product?.finishes?.[0] || null);
  const { addToCart } = useCart();
  const { user } = useAuth ? useAuth() : { user: null };

  // ✅ Reviews
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!product?.id) return;

    const fetchReviews = async () => {
      setLoading(true);
      let { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", product.id)
        .order("created_at", { ascending: false });

      if (!error) setReviews(data || []);
      setLoading(false);
    };

    fetchReviews();
  }, [product?.id]);

  // Average Rating
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  const handleAddToCart = () => {
    if (product && product.id) {
      addToCart(product.id, 1);
    } else {
      alert("Product ID is missing. Cannot add to cart.");
    }
  };

  const formatPrice = (price) => {
    const num = Number(price);
    if (isNaN(num)) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    })?.format(num);
  };

  // ⭐ visible reviews (default 3)
  const visibleReviews = showAll ? reviews : reviews.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Product Header */}
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <span className="bg-success text-success-foreground px-2 py-1 rounded text-xs font-medium">
            In Stock
          </span>
          <span className="bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-medium">
            Premium Quality
          </span>
        </div>
        
        <h1 className="font-headline text-3xl font-bold text-primary mb-2">
          {product?.name}
        </h1>
        
        <p className="text-muted-foreground text-lg mb-4">
          {product?.description}
        </p>
      </div>

      {/* Pricing */}
      <div className="bg-surface p-4 rounded-lg">
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-primary">
            {formatPrice(selectedSize?.price ?? product?.price)}
          </span>
          {selectedSize?.originalPrice && (
            <span className="text-lg text-muted-foreground line-through">
              {formatPrice(selectedSize?.originalPrice)}
            </span>
          )}
          {selectedSize?.originalPrice && (
            <span className="bg-success text-success-foreground px-2 py-1 rounded text-sm font-medium">
              Save {Math.round(((selectedSize?.originalPrice - selectedSize?.price) / selectedSize?.originalPrice) * 100)}%
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Free shipping across India • 30-day returns
        </p>
      </div>

      {/* Size Selection */}
      <div>
        <h3 className="font-headline font-semibold text-lg mb-3">Size Options</h3>
        {product?.sizes?.length ? (
          <div className="grid grid-cols-2 gap-3">
            {product?.sizes?.map((size) => (
              <button
                key={size?.id}
                onClick={() => setSelectedSize(size)}
                className={`p-4 rounded-lg border-2 text-left transition ${
                  selectedSize?.id === size?.id
                    ? 'border-accent bg-accent/5' :'border-border hover:border-muted-foreground'
                }`}
              >
                <div className="font-medium">{size?.name}</div>
                <div className="text-sm text-muted-foreground">{size?.dimensions}</div>
                <div className="text-sm font-medium text-accent mt-1">
                  {formatPrice(size?.price)}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground text-sm">No sizes available</div>
        )}
      </div>

      {/* Finish Selection */}
      <div>
        <h3 className="font-headline font-semibold text-lg mb-3">Finish Options</h3>
        <div className="flex flex-wrap gap-3">
          {product?.finishes?.map((finish) => (
            <button
              key={finish?.id}
              onClick={() => setSelectedFinish(finish)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition ${
                selectedFinish?.id === finish?.id
                  ? 'border-accent bg-accent/5' :'border-border hover:border-muted-foreground'
              }`}
            >
              <div
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: finish?.color }}
              />
              <span className="font-medium">{finish?.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Link to="/customization-studio" className="block">
          <Button
            variant="default"
            size="lg"
            fullWidth
            iconName="Palette"
            iconPosition="left"
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            Customize This Frame
          </Button>
        </Link>
        
        <div className="grid grid-cols-1">
          <Button
            variant="outline"
            size="lg"
            iconName="ShoppingCart"
            iconPosition="left"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Key Features */}
      <div className="bg-surface p-4 rounded-lg">
        <h3 className="font-headline font-semibold mb-3">Key Features</h3>
        <div className="space-y-2">
          {product?.keyFeatures?.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Icon name="Check" size={16} className="text-success" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Customer Reviews - Amazon Style */}
      <div className="mt-8">
        <h3 className="font-headline text-xl font-semibold mb-4">Customer Reviews</h3>

        {/* ⭐ Summary */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          {/* Average rating */}
          <div className="text-center md:w-1/3">
            <div className="text-4xl font-extrabold text-yellow-500">{avgRating}</div>
            <div className="flex justify-center mb-1">
              {[...Array(5)].map((_, i) => (
                <Icon
                  key={i}
                  name="Star"
                  size={22}
                  className={i < Math.round(avgRating) ? "text-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">{reviews.length} ratings</p>
          </div>

          {/* Rating breakdown */}
          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => r.rating === star).length;
              const percent = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
              return (
                <div key={star} className="flex items-center text-sm gap-2">
                  <span className="w-10">{star} star</span>
                  <div className="flex-1 h-3 bg-gray-200 rounded overflow-hidden">
                    <div className="h-full bg-yellow-400" style={{ width: `${percent}%` }}></div>
                  </div>
                  <span className="w-12 text-gray-600">{percent}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ⭐ Reviews list */}
        {loading ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-4">
            {visibleReviews.map((r) => (
              <div key={r.id} className="p-4 bg-surface rounded-lg border">
                <div className="flex items-center gap-2 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Icon
                      key={i}
                      name="Star"
                      size={16}
                      className={i < r.rating ? "text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                  <span className="font-medium">{r.name}</span>
                </div>
                {/* customer uploaded image */}
                {r.image_url && (
                  <img
                    src={r.image_url}
                    alt="review"
                    className="w-24 h-24 object-cover rounded mb-2"
                  />
                )}
                <p className="text-sm text-muted-foreground">{r.description}</p>
                <span className="text-xs text-muted-foreground block mt-1">
                  {new Date(r.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}

            {/* ⭐ See more button */}
            {reviews.length > 3 && (
              <div className="text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? "See Less" : "See More"}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
