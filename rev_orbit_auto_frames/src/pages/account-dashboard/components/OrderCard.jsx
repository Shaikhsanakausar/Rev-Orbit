import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

// ✅ Import Logo
import bgLogo from '../../../assets/vintage-logo.png';

const OrderCard = ({ order }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'text-success bg-success/10';
      case 'in production':
        return 'text-warning bg-warning/10';
      case 'shipped':
        return 'text-blue-600 bg-blue-50';
      case 'processing':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getProgressPercentage = (status) => {
    switch (status?.toLowerCase()) {
      case 'processing':
        return 25;
      case 'in production':
        return 50;
      case 'shipped':
        return 75;
      case 'delivered':
        return 100;
      default:
        return 0;
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(price);

  return (
    <div className="relative bg-card border border-border rounded-lg p-6 automotive-shadow hover:automotive-shadow-lg automotive-transition overflow-hidden">
      {/* ✅ Background Logo */}
      <img
        src={bgLogo}
        alt="Logo Background"
        className="absolute inset-0 w-full h-full object-contain opacity-10 pointer-events-none"
        style={{ objectPosition: 'center' }}
      />

      {/* ✅ Content Above Logo */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-headline font-semibold text-lg text-primary">
              Order #{order?.orderNumber}
            </h3>
            <p className="text-sm text-muted-foreground">
              Placed on {new Date(order?.orderDate).toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
            </p>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order?.status)}`}
          >
            {order?.status}
          </div>
        </div>

        {/* Items in Order */}
        <div className="space-y-4 mb-4">
          {order?.items?.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 border border-border rounded-lg bg-muted/50">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-white">
                <Image
                  src={item?.image || item?.products?.image_url || '/assets/images/no_image.png'}
                  alt={item?.name || item?.products?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-body font-medium text-primary">{item?.name || item?.products?.name}</h4>
                {item?.customization && (
                  <p className="text-sm text-muted-foreground">Customization: {item.customization}</p>
                )}
                <p className="text-sm text-muted-foreground">Quantity: {item?.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-body font-bold text-primary">{formatPrice((item?.price || item?.products?.price) * item?.quantity)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{getProgressPercentage(order?.status)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-accent h-2 rounded-full automotive-transition"
              style={{ width: `${getProgressPercentage(order?.status)}%` }}
            />
          </div>
        </div>

        {/* Production Photos */}
        {order?.productionPhotos && order?.productionPhotos.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-primary mb-2">Production Updates</p>
            <div className="flex space-x-2">
              {order.productionPhotos.map((photo, index) => (
                <div key={index} className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={photo}
                    alt={`Production step ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {order?.trackingNumber && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Truck" size={16} />
                <span>Tracking: {order.trackingNumber}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" iconName="Eye" iconPosition="left">
              View Details
            </Button>
            {order?.status?.toLowerCase() === 'delivered' && (
              <Button variant="default" size="sm" iconName="RotateCcw" iconPosition="left">
                Reorder
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
