import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const MyGarageCard = ({ vehicle, onEdit, onCreateFrame }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-4 automotive-shadow hover:automotive-shadow-lg automotive-transition">
      <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-muted">
        <Image
          src={vehicle?.image}
          alt={`${vehicle?.make} ${vehicle?.model}`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="space-y-3">
        <div>
          <h3 className="font-headline font-semibold text-primary">
            {vehicle?.year} {vehicle?.make} {vehicle?.model}
          </h3>
          <p className="text-sm text-muted-foreground">
            Added on {vehicle?.addedDate}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Color:</span>
            <div className="flex items-center space-x-2 mt-1">
              <div
                className="w-4 h-4 rounded-full border border-border"
                style={{ backgroundColor: vehicle?.colorHex }}
              />
              <span className="text-primary font-medium">{vehicle?.color}</span>
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Type:</span>
            <p className="text-primary font-medium mt-1">{vehicle?.type}</p>
          </div>
        </div>

        {vehicle?.specialNotes && (
          <div>
            <span className="text-muted-foreground text-sm">Notes:</span>
            <p className="text-primary text-sm mt-1">{vehicle?.specialNotes}</p>
          </div>
        )}

        {/* Anniversary reminder */}
        {vehicle?.purchaseDate && (
          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-center space-x-2 text-sm">
              <Icon name="Calendar" size={16} className="text-accent" />
              <span className="text-muted-foreground">Purchase Anniversary:</span>
              <span className="text-primary font-medium">{vehicle?.purchaseDate}</span>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Edit"
            iconPosition="left"
            onClick={() => onEdit(vehicle?.id)}
            className="flex-1"
          >
            Edit Details
          </Button>
          <Button
            variant="default"
            size="sm"
            iconName="Frame"
            iconPosition="left"
            onClick={() => onCreateFrame(vehicle)}
            className="flex-1"
          >
            Create Frame
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MyGarageCard;