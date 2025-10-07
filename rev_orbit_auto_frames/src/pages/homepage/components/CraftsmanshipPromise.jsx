import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const CraftsmanshipPromise = () => {
  const craftsmanshipFeatures = [
    {
      id: 1,
      icon: "Wrench",
      title: "Precision Tools",
      description: "State-of-the-art equipment ensures every cut, joint, and finish meets automotive-grade standards.",
      image: "/uploads/pexels-tima-miroshnichenko-6790938.jpg" // ✅ 1st image
    },
    {
      id: 2,
      icon: "Gem",
      title: "Premium Materials",
      description: "Hand-selected woods, museum-quality glass, and archival matting materials that last generations.",
      image: "/uploads/pexels-tirachard-kumtanom-112571-587441.jpg" // ✅ 2nd image
    },
    {
      id: 3,
      icon: "Users",
      title: "Expert Artisans",
      description: "Master craftsmen with decades of experience in both automotive culture and fine woodworking.",
      image: "/uploads/pexels-ono-kosuki-5973834.jpg" // ✅ 3rd image
    },
    {
      id: 4,
      icon: "Shield",
      title: "Quality Assurance",
      description: "Every frame undergoes rigorous quality checks before leaving our workshop to ensure perfection.",
      image: "/uploads/pexels-rdne-7563654.jpg" // aap chaho toh yaha bhi replace kar sakte ho
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Consultation",
      description: "Understanding your vision and automotive story"
    },
    {
      step: "02",
      title: "Design",
      description: "Creating custom layouts and material selection"
    },
    {
      step: "03",
      title: "Crafting",
      description: "Precision manufacturing with attention to detail"
    },
    {
      step: "04",
      title: "Quality Check",
      description: "Rigorous inspection before delivery"
    },
    {
      step: "05",
      title: "Delivery",
      description: "Safe packaging and professional installation"
    }
  ];

  return (
    <section className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-accent/10 rounded-full px-4 py-2 mb-6">
            <Icon name="Award" size={16} className="text-accent" />
            <span className="font-body text-sm font-medium text-accent">Our Promise</span>
          </div>
          <h2 className="font-headline text-3xl md:text-5xl font-bold text-primary mb-6">
            Craftsmanship That Honors Your Passion
          </h2>
          <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
            Every REV-orbit frame is a testament to automotive excellence, combining traditional craftsmanship with modern precision to create displays worthy of your cherished memories.
          </p>
        </div>

        {/* Craftsmanship Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {craftsmanshipFeatures?.map((feature) => (
            <div key={feature?.id} className="group">
              <div className="relative mb-6">
                <div className="aspect-square rounded-xl overflow-hidden automotive-shadow">
                  <Image
                    src={feature?.image}
                    alt={feature?.title}
                    className="w-full h-full object-cover group-hover:scale-105 automotive-transition-slow"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-transparent to-transparent rounded-xl" />
                <div className="absolute bottom-4 left-4 w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                  <Icon name={feature?.icon} size={24} className="text-white" />
                </div>
              </div>
              <h3 className="font-headline text-xl font-bold text-primary mb-3">
                {feature?.title}
              </h3>
              <p className="font-body text-muted-foreground leading-relaxed">
                {feature?.description}
              </p>
            </div>
          ))}
        </div>

        {/* Process Timeline */}
        <div className="bg-surface rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h3 className="font-headline text-2xl md:text-3xl font-bold text-primary mb-4">
              Our Crafting Process
            </h3>
            <p className="font-body text-muted-foreground">
              From concept to completion, every step is designed to exceed your expectations
            </p>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-border transform -translate-y-1/2" />
            
            <div className="grid lg:grid-cols-5 gap-8">
              {processSteps?.map((step, index) => (
                <div key={index} className="relative text-center">
                  <div className="relative z-10 w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center font-headline font-bold text-lg mx-auto mb-4 automotive-shadow">
                    {step?.step}
                  </div>
                  <h4 className="font-headline text-lg font-bold text-primary mb-2">
                    {step?.title}
                  </h4>
                  <p className="font-body text-sm text-muted-foreground">
                    {step?.description}
                  </p>
                  {index < processSteps?.length - 1 && (
                    <div className="hidden lg:block absolute top-8 -right-4 text-border">
                      <Icon name="ChevronRight" size={20} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CraftsmanshipPromise;
