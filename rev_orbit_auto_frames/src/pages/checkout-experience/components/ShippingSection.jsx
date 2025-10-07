import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const ShippingSection = ({ shippingData, onShippingChange, onShippingMethodChange }) => {
  const [selectedMethod, setSelectedMethod] = useState('standard');

  const stateOptions = [
    { value: 'maharashtra', label: 'Maharashtra' },
    { value: 'delhi', label: 'Delhi' },
    { value: 'karnataka', label: 'Karnataka' },
    { value: 'tamil-nadu', label: 'Tamil Nadu' },
    { value: 'gujarat', label: 'Gujarat' },
    { value: 'rajasthan', label: 'Rajasthan' },
    { value: 'west-bengal', label: 'West Bengal' },
    { value: 'uttar-pradesh', label: 'Uttar Pradesh' }
  ];

  const shippingMethods = [
    {
      id: 'standard',
      name: 'Standard Delivery',
      description: '5-7 business days',
      price: 0,
      icon: 'Truck'
    },
    {
      id: 'express',
      name: 'Express Delivery',
      description: '2-3 business days',
      price: 299,
      icon: 'Zap'
    },
    {
      id: 'premium',
      name: 'Premium White Glove',
      description: 'Next day + Installation',
      price: 999,
      icon: 'Crown'
    }
  ];

  const formatPrice = (price) => {
    return price === 0 ? 'Free' : new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    })?.format(price);
  };

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
    const method = shippingMethods?.find(m => m?.id === methodId);
    onShippingMethodChange(method);
  };

  return (
    <div className="bg-card rounded-lg automotive-shadow p-6">
      <h2 className="font-headline text-xl font-bold text-primary mb-6">Shipping Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Input
          label="Full Name"
          type="text"
          placeholder="Enter full name"
          value={shippingData?.fullName}
          onChange={(e) => onShippingChange('fullName', e?.target?.value)}
          required
        />
        <Input
          label="Phone Number"
          type="tel"
          placeholder="+91 98765 43210"
          value={shippingData?.phone}
          onChange={(e) => onShippingChange('phone', e?.target?.value)}
          required
        />
      </div>
      <div className="mb-4">
        <Input
          label="Address Line 1"
          type="text"
          placeholder="House/Flat number, Building name"
          value={shippingData?.address1}
          onChange={(e) => onShippingChange('address1', e?.target?.value)}
          required
        />
      </div>
      <div className="mb-4">
        <Input
          label="Address Line 2"
          type="text"
          placeholder="Street, Area, Landmark (Optional)"
          value={shippingData?.address2}
          onChange={(e) => onShippingChange('address2', e?.target?.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Input
          label="City"
          type="text"
          placeholder="Enter city"
          value={shippingData?.city}
          onChange={(e) => onShippingChange('city', e?.target?.value)}
          required
        />
        <Select
          label="State"
          options={stateOptions}
          value={shippingData?.state}
          onChange={(value) => onShippingChange('state', value)}
          placeholder="Select state"
          required
        />
        <Input
          label="PIN Code"
          type="text"
          placeholder="400001"
          value={shippingData?.pincode}
          onChange={(e) => onShippingChange('pincode', e?.target?.value)}
          required
        />
      </div>
      <div className="border-t border-border pt-6">
        <h3 className="font-body font-semibold text-primary mb-4">Delivery Options</h3>
        <div className="space-y-3">
          {shippingMethods?.map((method) => (
            <div
              key={method?.id}
              className={`border rounded-lg p-4 cursor-pointer automotive-transition ${
                selectedMethod === method?.id
                  ? 'border-accent bg-accent/5' :'border-border hover:border-accent/50'
              }`}
              onClick={() => handleMethodSelect(method?.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedMethod === method?.id
                      ? 'border-accent bg-accent' :'border-muted-foreground'
                  }`}>
                    {selectedMethod === method?.id && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <Icon name={method?.icon} size={20} className="text-accent" />
                  <div>
                    <p className="font-body font-medium text-primary">{method?.name}</p>
                    <p className="text-sm text-muted-foreground">{method?.description}</p>
                  </div>
                </div>
                <span className="font-body font-semibold text-primary">{formatPrice(method?.price)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShippingSection;