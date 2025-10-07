import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const CallToActionSection = () => {
  const quickActions = [
    {
      id: 1,
      title: "Design Your Frame",
      description: "Use our interactive studio to create the perfect display for your automotive memories",
      icon: "Palette",
      link: "/customization-studio",
      color: "bg-accent",
      textColor: "text-white"
    },
    {
      id: 2,
      title: "Browse Catalog",
      description: "Explore our premium collection of frames and shadow boxes for every car enthusiast",
      icon: "Grid3X3",
      link: "/product-catalog",
      color: "bg-card",
      textColor: "text-primary"
    },
    {
      id: 3,
      title: "View Gallery",
      description: "Get inspired by customer transformations and see your possibilities",
      icon: "Image",
      link: "/product-catalog",
      color: "bg-surface",
      textColor: "text-primary"
    }
  ];

  const specialOffers = [
    {
      id: 1,
      title: "First-Time Customer",
      discount: "15% OFF",
      description: "On your first custom frame order",
      code: "WELCOME15",
      validUntil: "Valid until Dec 31, 2024"
    },
    {
      id: 2,
      title: "Premium Bundle",
      discount: "₹2,000 OFF",
      description: "When you order 3 or more frames",
      code: "BUNDLE2K",
      validUntil: "Limited time offer"
    }
  ];

  return (
    <section className="py-20 bg-midnight text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      <div className="max-w-7xl mx-auto px-4 lg:px-6 relative z-10">
        {/* Main CTA Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-racing-red/20 backdrop-blur-sm border border-racing-red/30 rounded-full px-4 py-2 mb-6">
            <Icon name="Sparkles" size={16} className="text-racing-red" />
            <span className="font-body text-sm font-medium text-racing-red">Ready to Start?</span>
          </div>
          <h2 className="font-headline text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
            Transform Your Automotive
            <br />
            <span className="text-racing-red">Passion Today</span>
          </h2>
          <p className="font-body text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Join thousands of satisfied customers who have preserved their automotive memories with REV-orbit's premium craftsmanship. Your story deserves the perfect frame.
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/customization-studio">
              <Button
                variant="default"
                size="xl"
                iconName="Palette"
                iconPosition="left"
                className="bg-racing-red hover:bg-racing-red/90 text-white automotive-shadow-lg w-full sm:w-auto"
              >
                Start Designing Now
              </Button>
            </Link>
            
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Icon name="Shield" size={16} className="text-racing-red" />
              <span>Get the Warranty</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Truck" size={16} className="text-racing-red" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="RotateCcw" size={16} className="text-racing-red" />
              <span>7-Day Returns</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {quickActions?.map((action) => (
            <Link key={action?.id} to={action?.link} className="group">
              <div className={`${action?.color} rounded-xl p-6 automotive-shadow hover:automotive-shadow-lg automotive-transition group-hover:scale-105`}>
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-12 h-12 ${action?.color === 'bg-accent' ? 'bg-white/20' : 'bg-accent/10'} rounded-lg flex items-center justify-center`}>
                    <Icon 
                      name={action?.icon} 
                      size={24} 
                      className={action?.color === 'bg-accent' ? 'text-white' : 'text-accent'} 
                    />
                  </div>
                  <h3 className={`font-headline text-xl font-bold ${action?.textColor}`}>
                    {action?.title}
                  </h3>
                </div>
                <p className={`font-body ${action?.color === 'bg-accent' ? 'text-white/80' : 'text-muted-foreground'} mb-4`}>
                  {action?.description}
                </p>
                <div className="flex items-center space-x-2 text-sm font-medium">
                  <span className={action?.color === 'bg-accent' ? 'text-white' : 'text-accent'}>
                    Get Started
                  </span>
                  <Icon 
                    name="ArrowRight" 
                    size={16} 
                    className={`${action?.color === 'bg-accent' ? 'text-white' : 'text-accent'} group-hover:translate-x-1 automotive-transition`} 
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Special Offers */}
        <div className="bg-charcoal/50 backdrop-blur-sm rounded-2xl p-8 lg:p-12 border border-white/10">
          <div className="text-center mb-8">
            <h3 className="font-headline text-2xl md:text-3xl font-bold mb-4">
              Limited Time Offers
            </h3>
            <p className="font-body text-gray-300">
              Save on your first order and start your automotive display journey today
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {specialOffers?.map((offer) => (
              <div key={offer?.id} className="bg-card/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-headline text-lg font-bold text-white mb-1">
                      {offer?.title}
                    </h4>
                    <p className="font-body text-gray-400 text-sm">
                      {offer?.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-headline text-2xl font-bold text-racing-red">
                      {offer?.discount}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    <div className="font-body text-sm text-gray-300">
                      Code: <span className="font-mono font-bold text-racing-red">{offer?.code}</span>
                    </div>
                    <div className="font-body text-xs text-gray-500">
                      {offer?.validUntil}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Copy"
                    iconPosition="left"
                    className="border-racing-red/30 text-racing-red hover:bg-racing-red/10"
                  >
                    Copy Code
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="text-center mt-16 pt-16 border-t border-white/10">
          <h3 className="font-headline text-xl font-bold mb-4">
            Need Help Choosing?
          </h3>
          <p className="font-body text-gray-300 mb-6">
            Our automotive frame experts are here to help you create the perfect display
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center space-x-2 text-gray-300">
              <Icon name="Phone" size={16} className="text-racing-red" />
              <span className="font-body">+91 98765 43210</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/20" />
            <div className="flex items-center space-x-2 text-gray-300">
              <Icon name="Mail" size={16} className="text-racing-red" />
              <span className="font-body">hello@rev-orbit.com</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/20" />
            <div className="flex items-center space-x-2 text-gray-300">
              
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;