import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const ShippingInfo = ({ shippingOptions }) => {
  const [selectedPincode, setSelectedPincode] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkDelivery = async () => {
    if (!selectedPincode || selectedPincode?.length !== 6) return;
    
    setIsChecking(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockDeliveryInfo = {
        available: true,
        estimatedDays: Math.floor(Math.random() * 5) + 3,
        shippingCost: selectedPincode?.startsWith('1') ? 0 : 150,
        expressAvailable: true,
        expressDays: 2,
        expressCost: 299
      };
      
      setDeliveryInfo(mockDeliveryInfo);
      setIsChecking(false);
    }, 1000);
  };

  return (
    <div className="bg-card p-6 rounded-xl automotive-shadow">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Truck" className="text-accent" />
        <h2 className="font-headline text-2xl font-bold">Shipping & Delivery</h2>
      </div>
      {/* Pincode Checker */}
      <div className="bg-surface p-4 rounded-lg mb-6">
        <h3 className="font-headline font-semibold mb-3">Check Delivery Options</h3>
        <div className="flex space-x-3">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Enter your pincode"
              value={selectedPincode}
              onChange={(e) => setSelectedPincode(e?.target?.value?.replace(/\D/g, '')?.slice(0, 6))}
              maxLength={6}
            />
          </div>
          <Button
            variant="default"
            onClick={checkDelivery}
            loading={isChecking}
            disabled={selectedPincode?.length !== 6}
            className="bg-accent hover:bg-accent/90"
          >
            Check
          </Button>
        </div>

        {deliveryInfo && (
          <div className="mt-4 space-y-3">
            {deliveryInfo?.available ? (
              <>
                <div className="flex items-center space-x-2 text-success">
                  <Icon name="CheckCircle" size={16} />
                  <span className="font-medium">Delivery available to {selectedPincode}</span>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="bg-card p-3 rounded border border-border">
                    <div className="flex items-center space-x-2 mb-1">
                      <Icon name="Truck" size={16} className="text-accent" />
                      <span className="font-medium">Standard Delivery</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {deliveryInfo?.estimatedDays} business days
                    </div>
                    <div className="text-sm font-medium text-success">
                      {deliveryInfo?.shippingCost === 0 ? 'FREE' : `₹${deliveryInfo?.shippingCost}`}
                    </div>
                  </div>
                  
                  {deliveryInfo?.expressAvailable && (
                    <div className="bg-card p-3 rounded border border-accent">
                      <div className="flex items-center space-x-2 mb-1">
                        <Icon name="Zap" size={16} className="text-accent" />
                        <span className="font-medium">Express Delivery</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {deliveryInfo?.expressDays} business days
                      </div>
                      <div className="text-sm font-medium text-accent">
                        ₹{deliveryInfo?.expressCost}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2 text-destructive">
                <Icon name="XCircle" size={16} />
                <span>Delivery not available to this pincode</span>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Shipping Options */}
      <div className="space-y-4 mb-6">
        <h3 className="font-headline font-semibold">Shipping Options</h3>
        
        {shippingOptions?.map((option) => (
          <div key={option?.id} className="flex items-start space-x-3 p-4 bg-surface rounded-lg">
            <Icon name={option?.icon} size={20} className="text-accent mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium">{option?.name}</h4>
                <span className="text-sm font-medium text-accent">
                  {option?.cost === 0 ? 'FREE' : `₹${option?.cost}`}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{option?.description}</p>
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <span>⏱️ {option?.estimatedDays}</span>
                <span>📦 {option?.packaging}</span>
                {option?.tracking && <span>🔍 Real-time tracking</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Delivery Information */}
      <div className="grid sm:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-headline font-semibold mb-3">Delivery Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start space-x-2">
              <Icon name="Clock" size={16} className="text-accent mt-0.5" />
              <div>
                <div className="font-medium">Processing Time</div>
                <div className="text-muted-foreground">1-2 business days for custom orders</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Icon name="Package" size={16} className="text-accent mt-0.5" />
              <div>
                <div className="font-medium">Packaging</div>
                <div className="text-muted-foreground">Premium protective packaging included</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Icon name="Shield" size={16} className="text-accent mt-0.5" />
              <div>
                <div className="font-medium">Insurance</div>
                <div className="text-muted-foreground">Full value insurance on all shipments</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-headline font-semibold mb-3">Order Tracking</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start space-x-2">
              <Icon name="Bell" size={16} className="text-accent mt-0.5" />
              <div>
                <div className="font-medium">SMS & Email Updates</div>
                <div className="text-muted-foreground">Real-time notifications at every step</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Icon name="Smartphone" size={16} className="text-accent mt-0.5" />
              <div>
                <div className="font-medium">Live Tracking</div>
                <div className="text-muted-foreground">Track your order 24/7 online</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Icon name="Phone" size={16} className="text-accent mt-0.5" />
              <div>
                <div className="font-medium">Delivery Support</div>
                <div className="text-muted-foreground">Dedicated helpline for delivery queries</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Return Policy */}
      <div className="bg-success/10 border border-success/20 p-4 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="RotateCcw" size={16} className="text-success mt-0.5" />
          <div>
            <h4 className="font-medium text-success mb-1">30-Day Return Policy</h4>
            <p className="text-sm text-muted-foreground">
              Not satisfied? Return your frame within 30 days for a full refund. 
              We'll even cover the return shipping costs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;