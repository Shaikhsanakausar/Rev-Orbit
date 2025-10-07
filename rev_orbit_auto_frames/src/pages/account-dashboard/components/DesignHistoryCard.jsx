import React from 'react';

import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const DesignHistoryCard = ({ design }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-4 automotive-shadow hover:automotive-shadow-lg automotive-transition">
      <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-muted">
        <Image
          src={design?.previewImage}
          alt={design?.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="space-y-3">
        <div>
          <h3 className="font-headline font-semibold text-primary">
            {design?.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            Created on {design?.createdDate}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Frame Type:</span>
            <span className="text-primary font-medium">{design?.frameType}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Size:</span>
            <span className="text-primary font-medium">{design?.size}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Price:</span>
            <span className="text-primary font-semibold">₹{design?.price?.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Edit"
            iconPosition="left"
            className="flex-1"
          >
            Modify
          </Button>
          <Button
            variant="default"
            size="sm"
            iconName="ShoppingCart"
            iconPosition="left"
            className="flex-1"
          >
            Reorder
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DesignHistoryCard;