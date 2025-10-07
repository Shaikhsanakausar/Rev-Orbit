import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const GiftOptions = ({ giftData, onGiftChange }) => {
  const [isGift, setIsGift] = useState(false);

  const giftPackagingOptions = [
    {
      id: 'standard',
      name: 'Standard Gift Box',
      description: 'Elegant black box with REV-orbit branding',
      price: 0,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400'
    },
    {
      id: 'premium',
      name: 'Premium Gift Box',
      description: 'Luxury wooden box with custom engraving',
      price: 499,
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400'
    },
    {
      id: 'deluxe',
      name: 'Deluxe Presentation',
      description: 'Handcrafted box with silk lining and ribbon',
      price: 999,
      image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400'
    }
  ];

  const formatPrice = (price) => {
    return price === 0 ? 'Free' : new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    })?.format(price);
  };

  const handleGiftToggle = (checked) => {
    setIsGift(checked);
    onGiftChange('isGift', checked);
    if (!checked) {
      onGiftChange('message', '');
      onGiftChange('packaging', 'standard');
      onGiftChange('scheduledDelivery', false);
      onGiftChange('deliveryDate', '');
    }
  };

  return (
    <div className="bg-card rounded-lg automotive-shadow p-6">
      <div className="flex items-center gap-3 mb-6">
        <Icon name="Gift" size={24} className="text-accent" />
        <h2 className="font-headline text-xl font-bold text-primary">Gift Options</h2>
      </div>
      <div className="mb-6">
        <Checkbox
          label="This is a gift"
          description="Add special packaging and gift message"
          checked={isGift}
          onChange={(e) => handleGiftToggle(e?.target?.checked)}
        />
      </div>
      {isGift && (
        <div className="space-y-6">
          {/* Gift Message */}
          <div>
            <label className="block font-body font-medium text-primary mb-2">
              Gift Message
            </label>
            <textarea
              className="w-full p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              rows={4}
              placeholder="Write a personal message for the recipient..."
              value={giftData?.message || ''}
              onChange={(e) => onGiftChange('message', e?.target?.value)}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {(giftData?.message || '')?.length}/500 characters
            </p>
          </div>

          {/* Gift Packaging */}
          <div>
            <h3 className="font-body font-semibold text-primary mb-4">Gift Packaging</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {giftPackagingOptions?.map((option) => (
                <div
                  key={option?.id}
                  className={`border rounded-lg p-4 cursor-pointer automotive-transition ${
                    giftData?.packaging === option?.id
                      ? 'border-accent bg-accent/5' :'border-border hover:border-accent/50'
                  }`}
                  onClick={() => onGiftChange('packaging', option?.id)}
                >
                  <div className="aspect-video rounded-lg overflow-hidden mb-3">
                    <img
                      src={option?.image}
                      alt={option?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      giftData?.packaging === option?.id
                        ? 'border-accent bg-accent' :'border-muted-foreground'
                    }`}>
                      {giftData?.packaging === option?.id && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                    <span className="font-body font-semibold text-accent">
                      {formatPrice(option?.price)}
                    </span>
                  </div>
                  <h4 className="font-body font-medium text-primary mb-1">{option?.name}</h4>
                  <p className="text-sm text-muted-foreground">{option?.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Scheduled Delivery */}
          <div className="border-t border-border pt-6">
            <div className="mb-4">
              <Checkbox
                label="Schedule delivery for specific date"
                description="Perfect for birthdays, anniversaries, or special occasions"
                checked={giftData?.scheduledDelivery || false}
                onChange={(e) => onGiftChange('scheduledDelivery', e?.target?.checked)}
              />
            </div>

            {giftData?.scheduledDelivery && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Delivery Date"
                  type="date"
                  value={giftData?.deliveryDate || ''}
                  onChange={(e) => onGiftChange('deliveryDate', e?.target?.value)}
                  min={new Date(Date.now() + 86400000)?.toISOString()?.split('T')?.[0]}
                />
                <Input
                  label="Preferred Time"
                  type="time"
                  value={giftData?.deliveryTime || ''}
                  onChange={(e) => onGiftChange('deliveryTime', e?.target?.value)}
                />
              </div>
            )}
          </div>

          {/* Gift Receipt */}
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icon name="Info" size={20} className="text-accent mt-0.5" />
              <div>
                <h4 className="font-body font-medium text-primary mb-1">Gift Receipt</h4>
                <p className="text-sm text-muted-foreground">
                  A gift receipt will be included without pricing information. 
                  The recipient can exchange or return the item if needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GiftOptions;