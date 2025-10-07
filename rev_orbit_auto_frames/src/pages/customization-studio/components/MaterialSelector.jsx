import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const MaterialSelector = ({ selectedMaterial, onMaterialChange, frameStyle }) => {
  const materials = {
    classic: [
      {
        id: 'carbon',
        name: 'Carbon Fiber',
        description: 'Automotive-grade carbon fiber with racing appeal',
        price: 1500,
        image: '/uploads/Screenshot (213).png',  // ✅ आपका पहला image
        texture: 'Woven carbon pattern',
        durability: 'Racing Grade'
      },
      {
        id: 'aluminum',
        name: 'Brushed Aluminum',
        description: 'Aircraft-grade aluminum with brushed finish',
        price: 1200,
        image: '/uploads/Screenshot (214).png',  // ✅ आपका दूसरा image
        texture: 'Brushed metal',
        durability: 'Industrial'
      },
      {
        id: 'titanium',
        name: 'Titanium Elite',
        description: 'Lightweight titanium with premium coating',
        price: 2500,
        image: '/uploads/Screenshot (216).png',  // ✅ आपका तीसरा image
        texture: 'Smooth metallic',
        durability: 'Aerospace'
      }
    ],
    shadowbox: [
      {
        id: 'carbon',
        name: 'Carbon Fiber',
        description: 'Automotive-grade carbon fiber with racing appeal',
        price: 1500,
        image: '/uploads/Screenshot (213).png',  
        texture: 'Woven carbon pattern',
        durability: 'Racing Grade'
      },
      {
        id: 'aluminum',
        name: 'Brushed Aluminum',
        description: 'Aircraft-grade aluminum with brushed finish',
        price: 1200,
        image: '/uploads/Screenshot (214).png',  
        texture: 'Brushed metal',
        durability: 'Industrial'
      },
      {
        id: 'titanium',
        name: 'Titanium Elite',
        description: 'Lightweight titanium with premium coating',
        price: 2500,
        image: '/uploads//Screenshot (216).png',  
        texture: 'Smooth metallic',
        durability: 'Aerospace'
      }
    ],
    custom: [
      {
        id: 'carbon',
        name: 'Carbon Fiber',
        description: 'Automotive-grade carbon fiber with racing appeal',
        price: 1500,
        image: '/uploads/Screenshot (213).png',  
        texture: 'Woven carbon pattern',
        durability: 'Racing Grade'
      },
      {
        id: 'chrome',
        name: 'Chrome Accent',
        description: 'High-polish chrome with automotive styling',
        price: 1800,
        image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=200&h=150&fit=crop',
        texture: 'Mirror finish',
        durability: 'Show Quality'
      },
      {
        id: 'leather',
        name: 'Premium Leather',
        description: 'Genuine leather with automotive stitching',
        price: 2200,
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=150&fit=crop',
        texture: 'Leather grain',
        durability: 'Luxury Grade'
      }
    ]
  };

  const currentMaterials = materials?.[frameStyle?.id] || materials?.classic;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-headline text-2xl font-bold text-primary mb-2">Select Material</h2>
        <p className="text-muted-foreground">
          Choose the perfect material to complement your {frameStyle?.name || 'frame'}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {currentMaterials?.map((material) => (
          <div
            key={material?.id}
            onClick={() => onMaterialChange(material)}
            className={`bg-card rounded-lg border-2 cursor-pointer automotive-transition hover:automotive-shadow ${
              selectedMaterial?.id === material?.id
                ? 'border-accent automotive-shadow'
                : 'border-border hover:border-accent/50'
            }`}
          >
            {/* Material Preview */}
            <div className="relative h-32 overflow-hidden rounded-t-lg">
              <Image
                src={material?.image}
                alt={material?.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              {selectedMaterial?.id === material?.id && (
                <div className="absolute top-2 right-2 bg-accent text-white rounded-full p-1">
                  <Icon name="Check" size={16} />
                </div>
              )}
            </div>

            {/* Material Info */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-headline text-base font-semibold text-primary">{material?.name}</h3>
                {material?.price > 0 && (
                  <span className="text-sm font-medium text-accent">
                    +₹{material?.price?.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              <p className="text-muted-foreground text-xs mb-3">{material?.description}</p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Texture:</span>
                  <span className="text-primary font-medium">{material?.texture}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Durability:</span>
                  <span className="text-primary font-medium">{material?.durability}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Material Care Info */}
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} className="text-accent mt-0.5" />
          <div>
            <h4 className="font-headline text-sm font-semibold text-primary mb-1">Material Care</h4>
            <p className="text-xs text-muted-foreground">
              All materials come with detailed care instructions and get the craftsmanship warranty.
              Premium materials include complimentary maintenance kit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialSelector;
