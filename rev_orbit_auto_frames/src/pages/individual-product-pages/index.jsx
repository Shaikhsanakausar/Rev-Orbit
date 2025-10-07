import Header from "../../components/ui/Header";
import ProductInfo from "./components/ProductInfo";
import ProductImageGallery from "./components/ProductImageGallery";
import TechnicalSpecs from "./components/TechnicalSpecs";
import ShippingInfo from "./components/ShippingInfo";
import RelatedProducts from "./components/RelatedProducts";
import CustomerReviews from "./components/CustomerReviews";
import SeenInHomes from "./components/SeenInHomes";
import CompatibilitySection from "./components/CompatibilitySection";
import BuyBox from "./components/BuyBox";
// src/pages/individual-product-pages/index.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../utils/supabaseClient";


const IndividualProductPage = () => {
  const { id } = useParams(); // URL से product id
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      // Only select columns that are guaranteed to exist
      const { data, error } = await supabase
        .from("products")
        .select("id, name, description, price, image_url")
        .eq("id", id)
        .single();

      if (!error && data) {
        setProduct(data);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <p className="text-center py-10">Loading product...</p>;
  }

  if (!product) {
    return <p className="text-center py-10 text-red-500">Product not found!</p>;
  }

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
        {/* Product Gallery & Buy Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <ProductImageGallery product={product} />
          </div>
          <div>
            <BuyBox product={product} />
          </div>
        </div>

        {/* Product Info & Specs */}
        <ProductInfo product={product} />
        <TechnicalSpecs specifications={product?.specifications} />
        <CompatibilitySection />
        <ShippingInfo shippingOptions={product?.shippingOptions} />
        <SeenInHomes />
        <RelatedProducts products={product?.relatedProducts || []} />
        <CustomerReviews productId={product?.id} />
      </div>
    </>
  );
};

export default IndividualProductPage;
