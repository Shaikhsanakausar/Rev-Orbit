import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import CartReview from './components/CartReview';
import ShippingSection from './components/ShippingSection';
import PaymentSection from './components/PaymentSection';
import ProgressIndicator from './components/ProgressIndicator';
import OrderSummary from './components/OrderSummary';
import OrderConfirmation from './components/OrderConfirmation';
import DesignPreview from '../customization-studio/components/DesignPreview';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabaseClient';
import axios from 'axios';

const CheckoutExperience = () => {
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const { cartItems, setCart, addToCart, updateQuantity, removeFromCart } = useCart();

  // ⬇️ moved to top (fixes ReferenceError)
  const [customDesign, setCustomDesign] = useState(null);

  // Steps state
  const [currentStep, setCurrentStep] = useState('review');
  useEffect(() => {
    if (customDesign) setCurrentStep('shipping');
  }, [customDesign]);

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // Fetch custom design if coming from customization studio
  useEffect(() => {
    const fetchCustomDesign = async () => {
      const designId = sessionStorage.getItem('rev-orbit-checkout-design-id');
      if (designId) {
        const { data, error } = await supabase
          .from('custom_orders')
          .select('design_data')
          .eq('id', designId)
          .single();
        if (!error && data?.design_data) {
          setCustomDesign(data.design_data);
        }
      }
    };
    fetchCustomDesign();
  }, []);

  // Fetch products
  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setProductsLoading(false);
      }
    };
    getProducts();
  }, []);

  // Cart details
  const cartDetails = Array.isArray(cartItems) && cartItems.length > 0
    ? cartItems.map(item => {
        const product = item.products || {};
        return {
          ...product,
          ...item,
          image: product.image_url,
        };
      })
    : [];

  // Form states
  const [shippingData, setShippingData] = useState({
    fullName: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [paymentData, setPaymentData] = useState({
    upiId: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    selectedBank: '',
    emiDuration: ''
  });


  const [shippingMethod, setShippingMethod] = useState({
    id: 'standard',
    name: 'Standard Delivery',
    price: 0
  });

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderData, setOrderData] = useState(null);

  const steps = [
    { id: 'review', title: 'Review', description: 'Cart items' },
    { id: 'shipping', title: 'Shipping', description: 'Delivery details' },
    { id: 'payment', title: 'Payment', description: 'Payment method' },
    { id: 'confirmation', title: 'Confirmation', description: 'Order complete' }
  ];

  // Calculations
  const customPrice = customDesign?.frameStyle?.price || 0;
  const subtotal = customDesign
    ? customPrice
    : cartDetails.reduce((total, item) => total + (item?.price * item?.quantity), 0);
  const shippingCost = shippingMethod?.price;
  const taxes = Math.round(subtotal * 0.18);
  const total = subtotal + shippingCost + taxes - discount;

  // Handlers
  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
    const { error } = await updateQuantity(itemId, newQuantity);
    if (error) {
      setCart(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, quantity: prev.find(i => i.id === itemId)?.quantity ?? 1 } : item
        )
      );
    }
  };

  const handleRemoveItem = async (cartRowId) => {
    await removeFromCart(cartRowId);
  };

  const handleEditCustomization = () => {
    navigate('/customization-studio');
  };

  const handleShippingChange = (field, value) => {
    setShippingData(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (field, value) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };


  const handleApplyPromo = () => {
    const validPromoCodes = {
      'FIRST10': 0.1,
      'SAVE500': 500,
      'WELCOME15': 0.15
    };
    if (validPromoCodes?.[promoCode?.toUpperCase()]) {
      const discountValue = validPromoCodes?.[promoCode?.toUpperCase()];
      const calculatedDiscount = discountValue < 1 ? subtotal * discountValue : discountValue;
      setDiscount(calculatedDiscount);
      setPromoApplied(true);
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 'shipping':
        return shippingData?.fullName && shippingData?.phone && shippingData?.address1 &&
               shippingData?.city && shippingData?.state && shippingData?.pincode;
      case 'payment':
        return true;
      default:
        return true;
    }
  };

  const handleNextStep = async () => {
    if (!validateStep(currentStep)) {
      alert('Please fill in all required fields');
      return;
    }
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const stepOrder = customDesign
      ? ['shipping', 'payment', 'confirmation']
      : ['review', 'shipping', 'payment', 'confirmation'];

    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    } else {
      if (customDesign) {
        try {
          const { data: userData } = await supabase.auth.getUser();
          const { data, error } = await supabase
            .from('custom_orders')
            .insert([{
              user_id: userData?.user?.id,
              product_id: null,
              price: customPrice,
              quantity: 1,
              shipping_data: shippingData,
              payment_data: paymentData,
              design_json: customDesign,
              design_image_url: customDesign.selectedPhoto?.url || null,
              status: 'confirmed',
            }])
            .select('*')
            .single();
          if (error) throw error;
          setOrderData(data);
          setOrderConfirmed(true);
        } catch (e) {
          alert('Order failed: ' + (e.message || 'Unknown error'));
        }
      } else {
        const mockOrderData = {
          orderNumber: 'REV' + Date.now().toString().slice(-8),
          orderDate: new Date(),
          paymentMethod: 'UPI Payment',
          total: total,
          items: cartDetails,
          shipping: shippingData,
          expectedDelivery: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        };
        setOrderData(mockOrderData);
        setOrderConfirmed(true);
      }
    }
    setLoading(false);
  };

  const handlePreviousStep = () => {
    const stepOrder = ['review', 'shipping', 'payment', 'confirmation'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const handleContinueShopping = () => {
    navigate('/product-catalog');
  };

  const handleTrackOrder = () => {
    navigate('/account-dashboard');
  };

  // UI Rendering
  if (productsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-lg text-muted-foreground">Loading Cart...</p>
          </div>
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
              customDesign={customDesign}
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
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="font-headline text-3xl font-bold text-primary mb-2">Checkout</h1>
              <p className="text-muted-foreground">Complete your order for premium automotive frames</p>
            </div>

            <ProgressIndicator currentStep={currentStep} steps={steps} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {currentStep === 'review' && (
                  <CartReview
                    cartItems={cartItems}
                    setCartItems={setCart}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                    onEditCustomization={handleEditCustomization}
                  />
                )}
                {currentStep === 'shipping' && (
                  <ShippingSection
                    shippingData={shippingData}
                    onShippingChange={handleShippingChange}
                    onShippingMethodChange={setShippingMethod}
                  />
                )}
                {currentStep === 'payment' && (
                  <PaymentSection
                    paymentData={paymentData}
                    onPaymentChange={handlePaymentChange}
                    orderTotal={total}
                  />
                )}

                {/* Navigation */}
                <div className="flex justify-between items-center pt-6">
                  <Button
                    variant="outline"
                    iconName="ArrowLeft"
                    iconPosition="left"
                    onClick={handlePreviousStep}
                    disabled={currentStep === 'review'}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="default"
                    iconName={currentStep === 'payment' ? 'CreditCard' : 'ArrowRight'}
                    iconPosition="right"
                    onClick={handleNextStep}
                    loading={loading}
                    className="bg-racing-red hover:bg-racing-red/90"
                  >
                    {currentStep === 'payment' ? 'Place Order' : 'Continue'}
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
        </div>
      </main>
    </div>
  );
};

export default CheckoutExperience;
