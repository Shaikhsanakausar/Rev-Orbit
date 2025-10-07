// src/pages/checkout-experience/components/OrderConfirmation.jsx

import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OrderConfirmation = ({ orderData, onContinueShopping, onTrackOrder }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    })?.format(price);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date)?.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 automotive-shadow-lg">
          <Icon name="CheckCircle" size={40} className="text-accent-foreground" />
        </div>
        <h1 className="font-headline text-3xl font-bold text-primary mb-2">Order Confirmed!</h1>
        <p className="text-lg text-muted-foreground">
          Thank you for your order. We'll send you updates as your custom frame is crafted.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Details */}
          <div className="bg-card rounded-lg automotive-shadow p-6">
            <h2 className="font-headline text-xl font-bold text-primary mb-4">Order Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Order Number</p>
                <p className="font-body font-semibold text-primary">{orderData?.orderNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Order Date</p>
                <p className="font-body font-semibold text-primary">{formatDate(orderData?.orderDate)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Payment Method</p>
                <p className="font-body font-semibold text-primary">{orderData?.paymentMethod}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Amount</p>
                <p className="font-body font-semibold text-primary">{formatPrice(orderData?.totalAmount)}</p>
              </div>
            </div>
          </div>

          {/* Items Ordered */}
          <div className="bg-card rounded-lg automotive-shadow p-6">
            <h2 className="font-headline text-xl font-bold text-primary mb-4">Items Ordered</h2>
            <div className="space-y-4">
              {orderData?.items?.map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 border border-border rounded-lg">
                  <div className="w-16 h-16 rounded-lg overflow-hidden automotive-shadow">
                    <Image
                      src={item?.image}
                      alt={item?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-body font-semibold text-primary mb-1">{item?.name}</h3>
                    {item?.customization && (
                      <div className="bg-muted rounded-md p-2 mb-2">
                        <p className="text-xs font-medium text-primary mb-1">Customization:</p>
                        <p className="text-xs text-muted-foreground">{item?.customization}</p>
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">Quantity: {item?.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-body font-bold text-primary">
                      {formatPrice(item?.price * item?.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Production Timeline */}
          <div className="bg-card rounded-lg automotive-shadow p-6">
            <h2 className="font-headline text-xl font-bold text-primary mb-4">Production Timeline</h2>
            <div className="space-y-4">
              {orderData?.timeline?.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step?.completed ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {step?.completed ? <Icon name="Check" size={16} /> : <span className="text-sm font-bold">{index + 1}</span>}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-body font-medium text-primary">{step?.title}</h3>
                    <p className="text-sm text-muted-foreground">{step?.description}</p>
                    {step?.estimatedDate && (
                      <p className="text-sm text-accent font-medium">{formatDate(step?.estimatedDate)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Shipping Info */}
          <div className="bg-card rounded-lg automotive-shadow p-6">
            <h3 className="font-headline text-lg font-bold text-primary mb-4">Shipping Address</h3>
            <div className="text-sm space-y-1">
              <p className="font-medium text-primary">{orderData?.shipping?.fullName}</p>
              <p className="text-muted-foreground">{orderData?.shipping?.address1}</p>
              {orderData?.shipping?.address2 && (
                <p className="text-muted-foreground">{orderData?.shipping?.address2}</p>
              )}
              <p className="text-muted-foreground">
                {orderData?.shipping?.city}, {orderData?.shipping?.state} {orderData?.shipping?.pincode}
              </p>
              <p className="text-muted-foreground">{orderData?.shipping?.phone}</p>
              <p className="text-sm text-primary font-medium mt-1">Shipping Method: {orderData?.shipping?.method} ({formatPrice(orderData?.shipping?.cost)})</p>
            </div>
          </div>

          {/* Expected Delivery */}
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <Icon name="Truck" size={24} className="text-accent" />
              <h3 className="font-headline text-lg font-bold text-primary">Expected Delivery</h3>
            </div>
            <p className="text-lg font-semibold text-accent mb-2">{formatDate(orderData?.expectedDelivery)}</p>
            <p className="text-sm text-muted-foreground">
              Your custom frame will be carefully crafted and shipped within 7-10 business days.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              variant="default"
              fullWidth
              iconName="Package"
              iconPosition="left"
              onClick={onTrackOrder}
            >
              Track Your Order
            </Button>
            <Button
              variant="outline"
              fullWidth
              iconName="ShoppingBag"
              iconPosition="left"
              onClick={onContinueShopping}
            >
              Continue Shopping
            </Button>
          </div>

          {/* Support */}
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icon name="MessageCircle" size={20} className="text-accent mt-0.5" />
              <div>
                <h4 className="font-body font-medium text-primary mb-1">Need Help?</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Our customer support team is here to assist you.
                </p>
                <p className="text-sm text-accent font-medium">support@rev-orbit.com</p>
                <p className="text-sm text-accent font-medium">+91 98765 43210</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
