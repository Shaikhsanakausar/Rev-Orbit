import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const SocialProofSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Vikram Singh",
      role: "Classic Car Collector",
      location: "Delhi",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
      content: `REV-orbit transformed my 1960 Jaguar E-Type photos into a stunning display that captures the essence of automotive artistry. The attention to detail is remarkable - every curve and chrome detail is perfectly preserved.`,
      carModel: "1960 Jaguar E-Type",
      frameType: "Premium Shadow Box"
    },
    {
      id: 2,
      name: "Anita Desai",
      role: "Automotive Journalist",
      location: "Pune",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5,
      content: `As someone who writes about cars professionally, I appreciate quality craftsmanship. REV-orbit's work exceeded my expectations - the frame quality rivals museum displays I've seen worldwide.`,
      carModel: "2018 BMW M3",
      frameType: "Custom Display"
    },
    {
      id: 3,
      name: "Rohit Mehta",
      role: "Racing Enthusiast",
      location: "Chennai",
      avatar: "https://randomuser.me/api/portraits/men/56.jpg",
      rating: 5,
      content: `My racing memorabilia needed a special home, and REV-orbit delivered beyond imagination. The LED lighting and custom compartments showcase each piece perfectly. Absolutely worth every rupee.`,
      carModel: "Formula Racing Memorabilia",
      frameType: "Heritage Classic Frame"
    }
  ];

  // ✅ अब images आपके public/uploads से आएँगी
  const mediaFeatures = [
    {
      id: 1,
      publication: "AutoCar India",
      logo: "/uploads/pexels-enginakyurt-15483615.jpg",
      quote: "REV-orbit is revolutionizing how automotive enthusiasts preserve their passion",
      date: "March 2024"
    },
    {
      id: 2,
      publication: "Car",
      logo: "/uploads/Vintage Automotive Logo Design.png",
      quote: "Premium craftsmanship meets automotive culture in perfect harmony",
      date: "February 2024"
    },
    {
      id: 3,
      publication: "Motor Sport Magazine",
      logo: "/uploads/pexels-mdsnmdsnmdsn-3697718.jpg",
      quote: "The gold standard for automotive memorabilia display solutions",
      date: "January 2024"
    }
  ];

  const communityStats = [
    {
      icon: "Users",
      value: "15,000+",
      label: "Community Members",
      color: "text-accent"
    },
    {
      icon: "Star",
      value: "4.9/5",
      label: "Average Rating",
      color: "text-yellow-500"
    },
    {
      icon: "MapPin",
      value: "50+",
      label: "Cities Served",
      color: "text-success"
    },
    {
      icon: "Award",
      value: "98%",
      label: "Satisfaction Rate",
      color: "text-accent"
    }
  ];

  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-accent/10 rounded-full px-4 py-2 mb-6">
            <Icon name="MessageCircle" size={16} className="text-accent" />
            <span className="font-body text-sm font-medium text-accent">Trusted by Enthusiasts</span>
          </div>
          <h2 className="font-headline text-3xl md:text-5xl font-bold text-primary mb-6">
            What Our Community Says
          </h2>
          <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of satisfied customers who have transformed their automotive passion into beautiful displays with REV-orbit.
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {communityStats?.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-card rounded-xl automotive-shadow">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 ${stat?.color} bg-current/10`}>
                <Icon name={stat?.icon} size={24} className={stat?.color} />
              </div>
              <div className="font-headline text-2xl md:text-3xl font-bold text-primary mb-1">
                {stat?.value}
              </div>
              <div className="font-body text-sm text-muted-foreground">
                {stat?.label}
              </div>
            </div>
          ))}
        </div>

        {/* Customer Testimonials */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {testimonials?.map((testimonial) => (
            <div key={testimonial?.id} className="bg-card rounded-xl p-6 automotive-shadow hover:automotive-shadow-lg automotive-transition">
              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial?.rating)]?.map((_, i) => (
                  <Icon key={i} name="Star" size={16} className="text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Testimonial Content */}
              <blockquote className="font-body text-muted-foreground mb-6 leading-relaxed">
                "{testimonial?.content}"
              </blockquote>

              {/* Car & Frame Info */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center space-x-2 text-sm">
                  <Icon name="Car" size={14} className="text-accent" />
                  <span className="font-body text-muted-foreground">{testimonial?.carModel}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Icon name="Frame" size={14} className="text-accent" />
                  <span className="font-body text-muted-foreground">{testimonial?.frameType}</span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="flex items-center space-x-3 pt-4 border-t border-border">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={testimonial?.avatar}
                    alt={testimonial?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-body font-semibold text-primary text-sm">
                    {testimonial?.name}
                  </div>
                  <div className="font-body text-xs text-muted-foreground">
                    {testimonial?.role} • {testimonial?.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Media Features */}
        <div className="bg-card rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h3 className="font-headline text-2xl md:text-3xl font-bold text-primary mb-4">
              Featured In Leading Publications
            </h3>
            <p className="font-body text-muted-foreground">
              Recognized by India's top automotive media for excellence in craftsmanship
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {mediaFeatures?.map((feature) => (
              <div key={feature?.id} className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-lg overflow-hidden automotive-shadow">
                  <Image
                    src={feature?.logo}
                    alt={feature?.publication}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-headline text-lg font-bold text-primary mb-2">
                  {feature?.publication}
                </h4>
                <blockquote className="font-body text-muted-foreground italic mb-2">
                  "{feature?.quote}"
                </blockquote>
                <div className="font-body text-xs text-muted-foreground">
                  {feature?.date}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid md:grid-cols-4 gap-6 mt-16">
          <div className="text-center">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Icon name="Shield" size={24} className="text-success" />
            </div>
            <div className="font-body font-semibold text-primary text-sm">Secure Payments</div>
            <div className="font-body text-xs text-muted-foreground">256-bit SSL encryption</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Icon name="Truck" size={24} className="text-accent" />
            </div>
            <div className="font-body font-semibold text-primary text-sm">Free Shipping</div>
            <div className="font-body text-xs text-muted-foreground">On orders above ₹5,000</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Icon name="RotateCcw" size={24} className="text-warning" />
            </div>
            <div className="font-body font-semibold text-primary text-sm">Easy Returns</div>
            <div className="font-body text-xs text-muted-foreground">7-day return policy</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Icon name="Headphones" size={24} className="text-accent" />
            </div>
            <div className="font-body font-semibold text-primary text-sm">24/7 Support</div>
            <div className="font-body text-xs text-muted-foreground">Expert assistance</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
