import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const HeroSection = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-midnight">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/hero_fixed.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-6">
          <div className="max-w-3xl">
            <div className="mb-6">
              <div className="inline-flex items-center space-x-2 bg-racing-red/20 backdrop-blur-sm border border-racing-red/30 rounded-full px-4 py-2 mb-6">
                <Icon name="Award" size={16} className="text-racing-red" />
                <span className="text-sm font-body text-white">Premium Automotive Frames</span>
              </div>
            </div>

            <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Transform Your Automotive Passion Into Art
            </h1>

            <p className="font-body text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Preserve your automotive memories with premium craftsmanship
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/customization-studio">
                <Button
                  variant="default"
                  size="lg"
                  iconName="Palette"
                  iconPosition="left"
                  className="bg-racing-red hover:bg-racing-red/90 text-white automotive-shadow-lg w-full sm:w-auto"
                >
                  Design Your Frame
                </Button>
              </Link>
              <Link to="/product-catalog">
                <Button
                  variant="outline"
                  size="lg"
                  iconName="Grid3X3"
                  iconPosition="left"
                  className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto"
                >
                  View Gallery
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-md">
              <div className="text-center">
                <div className="font-headline text-2xl md:text-3xl font-bold text-white">5000+</div>
                <div className="font-body text-sm text-gray-400">Frames Crafted</div>
              </div>
              <div className="text-center">
                <div className="font-headline text-2xl md:text-3xl font-bold text-white">98%</div>
                <div className="font-body text-sm text-gray-400">Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="font-headline text-2xl md:text-3xl font-bold text-white">24/7</div>
                <div className="font-body text-sm text-gray-400">Expert Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 z-20">
        <div className="flex flex-col items-center space-y-2 text-white/60">
          <span className="font-body text-sm rotate-90 origin-center">Scroll</span>
          <div className="w-px h-12 bg-white/30">
            <div className="w-px h-6 bg-racing-red animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
