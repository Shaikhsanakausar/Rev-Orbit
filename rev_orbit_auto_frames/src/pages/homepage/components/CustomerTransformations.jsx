// src/pages/homepage/components/CustomerTransformations.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const CustomerTransformations = () => {
  const [currentTransformation, setCurrentTransformation] = useState(0);

  const transformations = [
    {
      id: 1,
      customerName: "Rajesh Kumar",
      location: "Mumbai, Maharashtra",
      carModel: "Porsche 718",
      story: `My first car holds countless memories of family road trips and learning to drive. REV-orbit helped me preserve those precious moments in a beautiful shadow box that now sits proudly in my living room.`,
      beforeImage: "/uploads/whatsapp1.jpg",
      afterImage: "/uploads/whatsapp2.jpg",
      frameType: "Premium Shadow Box",
      rating: 5,
      testimonial: "Exceptional craftsmanship and attention to detail. The team understood my emotional connection to the car perfectly."
    },
    {
      id: 2,
      customerName: "Priya Sharma",
      location: "Bangalore, Karnataka",
      carModel: "Ferrari/Rally Editio 911",
      story: `Exhilarating performance and breathtaking design as major highlights, though they also point out significant drawbacks like the high price, costly maintenance, and lack of luxury compared to other supercars I love❤️ this Frame`,
      beforeImage: "/uploads/whatsapp3.jpg",
      afterImage: "/uploads/whatsapp4.jpg",
      frameType: "Custom Display",
      rating: 5,
      testimonial: "They captured the essence of my journey beautifully. Every detail tells my story of passion and perseverance."
    },
    {
      id: 3,
      customerName: "Arjun Patel",
      location: "Ahmedabad, Gujarat",
      carModel: "Bugatti/Lamborghini",
      story: `This Ambassador belonged to my grandfather and has been in our family for three generations. REV-orbit created a heritage display that honors our family's automotive legacy.`,
      beforeImage: "/uploads/whatsapp5.jpg",
      afterImage: "/uploads/whatsapp6.jpg",
      frameType: "Heritage Classic Frame",
      rating: 5,
      testimonial: "A masterpiece that preserves three generations of memories. The quality exceeded all expectations."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTransformation((prev) => (prev + 1) % transformations?.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [transformations?.length]);

  const nextTransformation = () => {
    setCurrentTransformation((prev) => (prev + 1) % transformations?.length);
  };

  const prevTransformation = () => {
    setCurrentTransformation((prev) => (prev - 1 + transformations?.length) % transformations?.length);
  };

  return (
    <section className="py-20 bg-midnight text-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-racing-red/20 backdrop-blur-sm border border-racing-red/30 rounded-full px-4 py-2 mb-6">
            <Icon name="Heart" size={16} className="text-racing-red" />
            <span className="font-body text-sm font-medium text-racing-red">Customer Stories</span>
          </div>
          <h2 className="font-headline text-3xl md:text-5xl font-bold mb-6">
            Transformations That Tell Stories
          </h2>
          <p className="font-body text-xl text-gray-300 max-w-3xl mx-auto">
            Discover how fellow automotive enthusiasts across India have transformed their cherished vehicle memories into stunning displays.
          </p>
        </div>

        {/* Main Transformation Display */}
        <div className="relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Before/After Images */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {/* Before Image */}
                <div className="relative">
                  <div className="aspect-square rounded-xl overflow-hidden automotive-shadow-lg">
                    <Image
                      src={transformations?.[currentTransformation]?.beforeImage}
                      alt="Before transformation"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-4 left-4 bg-gray-900/80 backdrop-blur-sm rounded-lg px-3 py-1">
                   
                  </div>
                </div>

                {/* After Image */}
                <div className="relative">
                  <div className="aspect-square rounded-xl overflow-hidden automotive-shadow-lg">
                    <Image
                      src={transformations?.[currentTransformation]?.afterImage}
                      alt="After transformation"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-4 left-4 bg-racing-red/80 backdrop-blur-sm rounded-lg px-3 py-1">
                    
                  </div>
                </div>
              </div>

              {/* Frame Type Badge */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-card text-primary rounded-lg px-4 py-2 automotive-shadow">
                <span className="font-body text-sm font-medium">
                  {transformations?.[currentTransformation]?.frameType}
                </span>
              </div>
            </div>

            {/* Story Content */}
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-racing-red to-accent rounded-full flex items-center justify-center">
                  <Icon name="User" size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-headline text-xl font-bold">
                    {transformations?.[currentTransformation]?.customerName}
                  </h3>
                  <p className="font-body text-gray-400">
                    {transformations?.[currentTransformation]?.location}
                  </p>
                </div>
              </div>

              {/* Car Model */}
              <div className="flex items-center space-x-3 bg-charcoal/50 rounded-lg px-4 py-3">
                <Icon name="Car" size={20} className="text-racing-red" />
                <span className="font-body font-medium">
                  {transformations?.[currentTransformation]?.carModel}
                </span>
              </div>

              {/* Story */}
              <blockquote className="font-body text-lg leading-relaxed text-gray-300 italic">
                "{transformations?.[currentTransformation]?.story}"
              </blockquote>

              {/* Rating */}
              <div className="flex items-center space-x-2">
                {[...Array(transformations?.[currentTransformation]?.rating)]?.map((_, i) => (
                  <Icon key={i} name="Star" size={20} className="text-yellow-400 fill-current" />
                ))}
                <span className="font-body text-sm text-gray-400 ml-2">
                  {transformations?.[currentTransformation]?.rating}/5 stars
                </span>
              </div>

              {/* Testimonial */}
              <p className="font-body text-gray-300 bg-charcoal/30 rounded-lg p-4 border-l-4 border-racing-red">
                {transformations?.[currentTransformation]?.testimonial}
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/customization-studio">
                  <Button
                    variant="default"
                    size="lg"
                    iconName="Palette"
                    iconPosition="left"
                    className="bg-racing-red hover:bg-racing-red/90 w-full sm:w-auto"
                  >
                    Start Your Story
                  </Button>
                </Link>
                <Link to="/product-catalog">
                  <Button
                    variant="outline"
                    size="lg"
                    iconName="Gallery"
                    iconPosition="left"
                    className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto"
                  >
                    View More Stories
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center space-x-4 mt-12">
            <button
              onClick={prevTransformation}
              className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 automotive-transition"
            >
              <Icon name="ChevronLeft" size={20} />
            </button>

            <div className="flex space-x-2">
              {transformations?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTransformation(index)}
                  className={`w-3 h-3 rounded-full automotive-transition ${
                    index === currentTransformation ? 'bg-racing-red' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextTransformation}
              className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 automotive-transition"
            >
              <Icon name="ChevronRight" size={20} />
            </button>
          </div>
        </div>

        {/* Social Proof Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-16 border-t border-white/10">
          <div className="text-center">
            <div className="font-headline text-3xl font-bold text-racing-red mb-2">2500+</div>
            <div className="font-body text-sm text-gray-400">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="font-headline text-3xl font-bold text-racing-red mb-2">4.9/5</div>
            <div className="font-body text-sm text-gray-400">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="font-headline text-3xl font-bold text-racing-red mb-2">50+</div>
            <div className="font-body text-sm text-gray-400">Cities Served</div>
          </div>
          <div className="text-center">
            <div className="font-headline text-3xl font-bold text-racing-red mb-2">100%</div>
            <div className="font-body text-sm text-gray-400">Quality Guarantee</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerTransformations;
