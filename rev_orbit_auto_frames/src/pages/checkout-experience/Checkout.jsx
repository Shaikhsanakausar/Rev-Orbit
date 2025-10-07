// src/pages/checkout-experience/Checkout.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/ui/Header";
import Button from "../../components/ui/Button";
import CartReview from "./components/CartReview";
import ShippingSection from "./components/ShippingSection";
import PaymentSection from "./components/PaymentSection";
import ProgressIndicator from "./components/ProgressIndicator";
import OrderSummary from "./components/OrderSummary";
import OrderConfirmation from "./components/OrderConfirmation";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { supabase } from "../../utils/supabaseClient";

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, setCart, updateQuantity, removeFromCart } = useCart();

  const [currentStep, setCurrentStep] = useState("review");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // ✅ Inline Modal
  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full text-center">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">{title}</h2>
          <p className="text-gray-600 mb-4">{children}</p>
          <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">
            OK
          </Button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setProductsLoading(false);
      }
    };
    getProducts();
  }, []);

  const cartDetails =
    Array.isArray(cartItems) && cartItems.length > 0
      ? cartItems.map((item) => {
          const product = item.products || {};
          return {
            ...product,
            ...item,
            image: product.image_url,
          };
        })
      : [];

  const [shippingData, setShippingData] = useState({
    fullName: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentData, setPaymentData] = useState({
    upiId: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    selectedBank: "",
    emiDuration: "",
  });

  const [shippingMethod, setShippingMethod] = useState({
    id: "standard",
    name: "Standard Delivery",
    price: 0,
  });

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderData, setOrderData] = useState(null);

  const steps = [
    { id: "review", title: "Review", description: "Cart items" },
    { id: "shipping", title: "Shipping", description: "Delivery details" },
    { id: "payment", title: "Payment", description: "Payment method" },
    { id: "confirmation", title: "Confirmation", description: "Order complete" },
  ];

  const subtotal = cartDetails.reduce(
    (total, item) => total + item?.price * item?.quantity,
    0
  );
  const shippingCost = shippingMethod.price;
  const taxes = Math.round(subtotal * 0.18);
  const total = subtotal + shippingCost + taxes - discount;

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
    const { error } = await updateQuantity(itemId, newQuantity);
    if (error) console.error(error);
  };

  const handleRemoveItem = async (cartRowId) => {
    await removeFromCart(cartRowId);
  };

  const handleEditCustomization = (itemId) => {
    navigate("/customization-studio");
  };

  const handleShippingChange = (field, value) => {
    setShippingData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (field, value) => {
    setPaymentData((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyPromo = () => {
    const validPromoCodes = { FIRST10: 0.1, SAVE500: 500, WELCOME15: 0.15 };
    if (validPromoCodes?.[promoCode?.toUpperCase()]) {
      const discountValue = validPromoCodes?.[promoCode?.toUpperCase()];
      const calculatedDiscount =
        discountValue < 1 ? subtotal * discountValue : discountValue;
      setDiscount(calculatedDiscount);
      setPromoApplied(true);
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case "shipping":
        return (
          shippingData?.fullName &&
          shippingData?.phone &&
          shippingData?.address1 &&
          shippingData?.city &&
          shippingData?.state &&
          shippingData?.pincode
        );
      case "payment":
        return true;
      default:
        return true;
    }
  };

  // Razorpay Payment Integration
  const handleRazorpayPayment = async () => {
    try {
      const { data: orderData } = await axios.post("/api/create-razorpay-order", {
        amount: total * 100,
      });

      const options = {
        key: "rzp_test_1234567890", // replace with your real Razorpay key
        amount: orderData.amount,
        currency: "INR",
        name: "REV Orbit Auto Frames",
        description: "Order Payment",
        order_id: orderData.id,
        handler: async (response) => {
          setPaymentCompleted(true);
          await supabase.from("payments").insert([
            {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              status: "success",
              amount: total,
            },
          ]);
        },
        prefill: {
          name: user?.email || "User",
          contact: shippingData?.phone,
        },
        theme: { color: "#e11d48" },
      };
      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error("Razorpay error:", err);
    }
  };

  const handleNextStep = async () => {
    if (!validateStep(currentStep)) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    const stepOrder = ["review", "shipping", "payment", "confirmation"];
    const currentIndex = stepOrder.indexOf(currentStep);

    if (currentStep === "payment") {
      if (!paymentCompleted) {
        setShowPaymentModal(true);
        setLoading(false);
        return;
      }

      // Detect if cart contains custom products
      const hasCustom = cartDetails.some((item) => item.is_custom);

      const tableName = hasCustom ? "custom_orders" : "orders";
      const { data: order, error } = await supabase
        .from(tableName)
        .insert([
          {
            user_id: user?.id,
            items: cartDetails,
            shipping_address: shippingData,
            payment_method: paymentData.upiId ? "UPI" : "Card",
            total_amount: total,
            status: "confirmed",
            order_number: `ORD-${Date.now()}`,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Order failed:", error.message);
        setLoading(false);
        return;
      }

      // ✅ Set frontend orderData with timeline & details
      setOrderData({
        orderNumber: order.order_number,
        paymentMethod: order.payment_method,
        orderDate: new Date(order.created_at || Date.now()).toLocaleString(),
        totalAmount: order.total_amount,
        shipping: {
          ...shippingData,
          method: shippingMethod.name,
          cost: shippingMethod.price,
        },
        items: cartDetails.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
          is_custom: item.is_custom || false,
        })),
        expectedDelivery: new Date(
          Date.now() + 10 * 24 * 60 * 60 * 1000
        ).toLocaleDateString(),
        timeline: [
          { title: "Order Confirmed", description: "Your order has been received", completed: true },
          { title: "Design Review", description: "Our artisans review your customization", completed: hasCustom },
          { title: "Crafting Begins", description: "Production started", completed: false },
          { title: "Quality Check", description: "Inspection and packaging", completed: false },
          { title: "Shipped", description: "Your order is on the way", completed: false },
        ],
      });

      setOrderConfirmed(true);
    } else {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }

    setLoading(false);
  };

  const handlePreviousStep = () => {
    const stepOrder = ["review", "shipping", "payment", "confirmation"];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) setCurrentStep(stepOrder[currentIndex - 1]);
  };

  const handleContinueShopping = () => {
    navigate("/product-catalog");
  };

  const handleTrackOrder = () => {
    navigate("/account-dashboard");
  };

  if (productsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-12 text-center">
          <p className="text-lg text-gray-500">Loading Cart...</p>
        </main>
      </div>
    );
  }

  if (orderConfirmed && orderData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4">
            <OrderConfirmation
              orderData={orderData}
              onContinueShopping={handleContinueShopping}
              onTrackOrder={handleTrackOrder}
            />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-8">
            <h1 className="font-headline text-3xl font-bold text-primary mb-2">
              Checkout
            </h1>
            <p className="text-muted-foreground">
              Complete your order for premium automotive frames
            </p>
          </div>

          <ProgressIndicator currentStep={currentStep} steps={steps} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {currentStep === "review" && (
                <CartReview
                  cartItems={cartItems}
                  setCartItems={setCart}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                  onEditCustomization={handleEditCustomization}
                />
              )}

              {currentStep === "shipping" && (
                <ShippingSection
                  shippingData={shippingData}
                  onShippingChange={handleShippingChange}
                  onShippingMethodChange={setShippingMethod}
                />
              )}

              {currentStep === "payment" && (
                <PaymentSection
                  paymentData={paymentData}
                  onPaymentChange={handlePaymentChange}
                  orderTotal={total}
                  onPaymentSuccess={() => setPaymentCompleted(true)}
                  onPayWithRazorpay={handleRazorpayPayment}
                />
              )}

              <div className="flex justify-between items-center pt-6">
                <Button
                  variant="outline"
                  iconName="ArrowLeft"
                  iconPosition="left"
                  onClick={handlePreviousStep}
                  disabled={currentStep === "review"}
                >
                  Previous
                </Button>

                <Button
                  variant="default"
                  iconName={currentStep === "payment" ? "CreditCard" : "ArrowRight"}
                  iconPosition="right"
                  onClick={handleNextStep}
                  loading={loading}
                  className="bg-racing-red hover:bg-racing-red/90"
                >
                  {currentStep === "payment" ? "Place Order" : "Continue"}
                </Button>
              </div>
            </div>

            <div>
              <OrderSummary
                subtotal={subtotal}
                shippingCost={shippingCost}
                taxes={taxes}
                discount={discount}
                total={total}
                promoCode={promoCode}
                onPromoCodeChange={setPromoCode}
                onApplyPromo={handleApplyPromo}
                promoApplied={promoApplied}
              />
            </div>
          </div>
        </div>

        {/* Modal */}
        <Modal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          title="Payment Required"
        >
          Please complete the payment before placing the order.
        </Modal>
      </main>
    </div>
  );
};

export default Checkout;
