import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ProductShowcase = () => {
  const [activeCategory, setActiveCategory] = useState(0);

  const productCategories = [
    {
      id: 1,
      name: "Classic Frames",
      description: "Timeless elegance for vintage automotive memories",
      priceRange: "₹2,999 - ₹8,999",
      image: "/uploads/aston-vulcan-frame.jpg",   // ✅ fixed extension
      features: ["Premium Wood Finish", "UV Protection Glass", "Custom Matting"],
      popularModels: ["Ambassador", "Fiat Premier", "", "Contessa"],
      icon: "Frame"
    },
    {
      id: 2,
      name: "Premium Shadow Boxes",
      description: "3D displays that bring automotive artifacts to life",
      priceRange: "₹5,999 - ₹15,999",
      image: "/uploads/porsche-718-frame.jpg",   // ✅ fixed extension
      features: ["Deep Frame Design", "LED Lighting", "Multiple Compartments"],
      popularModels: ["McLaren", "Porsche", "AMG", ""],
      icon: "Box"
    },
    {
      id: 3,
      name: "Custom Displays",
      description: "Bespoke solutions for unique automotive collections",
      priceRange: "₹8,999 - ₹25,999",
      image: "/uploads/mclaren-frame.jpg",   // ✅ fixed extension
      features: ["Personalized Design", "Premium Materials", "Expert Consultation"],
      popularModels: ["Lamborghini", "Ferrari", "BMW", "Mercedes"],
      icon: "Palette"
    }
  ];

  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-accent/10 rounded-full px-4 py-2 mb-6">
            <Icon name="Star" size={16} className="text-accent" />
            <span className="font-body text-sm font-medium text-accent">Our Collections</span>
          </div>
          <h2 className="font-headline text-3xl md:text-5xl font-bold text-primary mb-6">
            Transform Your Passion Into Art
          </h2>
          <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose from our expertly crafted collections designed to showcase your automotive memories with premium quality and attention to detail.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {productCategories?.map((category, index) => (
            <button
              key={category?.id}
              onClick={() => setActiveCategory(index)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-body font-medium automotive-transition ${
                activeCategory === index
                  ? 'bg-accent text-accent-foreground automotive-shadow'
                  : 'bg-card text-muted-foreground hover:text-primary hover:bg-muted'
              }`}
            >
              <Icon name={category?.icon} size={18} />
              <span>{category?.name}</span>
            </button>
          ))}
        </div>

        {/* Active Category Display */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden automotive-shadow-lg">
              <Image
                src={productCategories?.[activeCategory]?.image}
                alt={productCategories?.[activeCategory]?.name}
                className="w-full h-full object-cover hover:scale-105 automotive-transition-slow"
              />
            </div>
            
            {/* Floating Price Badge */}
            <div className="absolute top-6 right-6 bg-card/95 backdrop-blur-sm rounded-lg px-4 py-2 automotive-shadow">
              <div className="font-body text-sm text-muted-foreground">Starting from</div>
              <div className="font-headline text-lg font-bold text-accent">
                {productCategories?.[activeCategory]?.priceRange?.split(' - ')?.[0]}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            <div>
              <h3 className="font-headline text-3xl font-bold text-primary mb-4">
                {productCategories?.[activeCategory]?.name}
              </h3>
              <p className="font-body text-lg text-muted-foreground mb-6">
                {productCategories?.[activeCategory]?.description}
              </p>
              <div className="flex items-center space-x-4 text-accent font-body font-semibold">
                <Icon name="IndianRupee" size={20} />
                <span>{productCategories?.[activeCategory]?.priceRange}</span>
              </div>
            </div>

            {/* Features */}
            <div>
              <h4 className="font-headline text-xl font-semibold text-primary mb-4">Key Features</h4>
              <div className="grid grid-cols-1 gap-3">
                {productCategories?.[activeCategory]?.features?.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    <span className="font-body text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Models */}
            <div>
              <h4 className="font-headline text-xl font-semibold text-primary mb-4">Popular Car Models</h4>
              <div className="flex flex-wrap gap-2">
                {productCategories?.[activeCategory]?.popularModels?.map((model, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-muted text-muted-foreground rounded-full font-body text-sm"
                  >
                    {model}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/customization-studio" className="flex-1">
                <Button
                  variant="default"
                  size="lg"
                  iconName="Palette"
                  iconPosition="left"
                  className="bg-accent hover:bg-accent/90 w-full"
                >
                  Customize Now
                </Button>
              </Link>
              <Link to="/product-catalog" className="flex-1">
                <Button
                  variant="outline"
                  size="lg"
                  iconName="Eye"
                  iconPosition="left"
                  className="w-full"
                >
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-16 border-t border-border">
          <div className="text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Icon name="Award" size={24} className="text-accent" />
            </div>
            <div className="font-headline text-2xl font-bold text-primary">Premium</div>
            <div className="font-body text-sm text-muted-foreground">Quality Materials</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Icon name="Truck" size={24} className="text-accent" />
            </div>
            <div className="font-headline text-2xl font-bold text-primary">Free</div>
            <div className="font-body text-sm text-muted-foreground">Shipping</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Icon name="Shield" size={24} className="text-accent" />
            </div>
            <div className="font-headline text-2xl font-bold text-primary">GetThe</div>
            <div className="font-body text-sm text-muted-foreground">Warranty</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Icon name="Headphones" size={24} className="text-accent" />
            </div>
            <div className="font-headline text-2xl font-bold text-primary">24/7</div>
            <div className="font-body text-sm text-muted-foreground">Support</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
