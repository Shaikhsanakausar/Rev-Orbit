import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const FrameStyleSelector = ({ selectedStyle, onStyleChange }) => {
  const frameStyles = [
    {
      id: 'classic',
      name: 'Classic Frame',
      description: 'Traditional elegance with premium wood finishes',
      price: 2499,
      image: '/uploads/pexels-tirachard-kumtanom-112571-587441.jpg', // ✅ Your 1st image
      features: ['Premium wood', 'Glass protection', 'Multiple sizes'],
      popular: true
    },
    {
      id: 'shadowbox',
      name: 'Shadow Box',
      description: 'Three-dimensional display with depth and lighting',
      price: 4999,
      image: '/uploads/category_13640.jpg', // ✅ Your 2nd image
      features: ['3D depth', 'LED lighting', 'Premium materials'],
      premium: true
    },
    {
      id: 'custom',
      name: 'Custom Display',
      description: 'Fully personalized with automotive accents',
      price: 7499,
      image: '/uploads/7183CSc8v7L.jpg', // ✅ Your 3rd image
      features: ['Carbon fiber accents', 'Chrome details', 'Custom engraving'],
      exclusive: true
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-headline text-2xl font-bold text-primary mb-2">Choose Your Frame Style</h2>
        <p className="text-muted-foreground">Select the perfect frame style to showcase your automotive passion</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {frameStyles?.map((style) => (
          <div
            key={style?.id}
            onClick={() => onStyleChange(style)}
            className={`relative bg-card rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
              selectedStyle?.id === style?.id
                ? 'border-accent shadow-xl'
                : 'border-border hover:border-accent/50'
            }`}
          >
            {/* Badge */}
            {style?.popular && (
              <div className="absolute -top-2 left-4 bg-racing-red text-white px-3 py-1 rounded-full text-xs font-medium z-10">
                Most Popular
              </div>
            )}
            {style?.premium && (
              <div className="absolute -top-2 left-4 bg-heritage-green text-white px-3 py-1 rounded-full text-xs font-medium z-10">
                Premium
              </div>
            )}
            {style?.exclusive && (
              <div className="absolute -top-2 left-4 bg-midnight text-white px-3 py-1 rounded-full text-xs font-medium z-10">
                Exclusive
              </div>
            )}

            {/* Image */}
            <div className="relative h-52 overflow-hidden rounded-t-xl">
              <Image
                src={style?.image}
                alt={style?.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-headline text-lg font-semibold text-primary">{style?.name}</h3>
                {selectedStyle?.id === style?.id && (
                  <Icon name="CheckCircle" size={20} className="text-accent" />
                )}
              </div>
              
              <p className="text-muted-foreground text-sm mb-4">{style?.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-body text-lg font-semibold text-primary">
                    ₹{style?.price?.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-muted-foreground">Starting from</span>
                </div>
                
                <div className="space-y-2">
                  {style?.features?.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Icon name="Check" size={14} className="text-heritage-green" />
                      <span className="text-xs text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FrameStyleSelector;
