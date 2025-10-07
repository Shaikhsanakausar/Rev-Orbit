import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import BannerTextMarquee from '../../components/ui/BannerTextMarquee.jsx';
import HeroSection from './components/HeroSection';
import ProductShowcase from './components/ProductShowcase';
import CustomerTransformations from './components/CustomerTransformations';
import CraftsmanshipPromise from './components/CraftsmanshipPromise';
import SocialProofSection from './components/SocialProofSection';
import CallToActionSection from './components/CallToActionSection';

// ✅ Logo import from src/assets (rename file to vintage-logo.png for safety)
import logo from '../../assets/vintage-logo.png';

// Debug console log
console.log("✅ Logo import test:", logo);

const Homepage = () => {
  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);

    fetch('/api/test')
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <>
      <Helmet>
        <title>REV-orbit Auto Frames - Transform Your Automotive Passion Into Art</title>
        <meta 
          name="description" 
          content="Premium automotive memorabilia frames and shadow boxes. Transform your car passion into stunning displays with custom craftsmanship. Free shipping across India." 
        />
        <meta name="keywords" content="automotive frames, car memorabilia, custom frames, shadow boxes, automotive art, car displays, premium frames India" />
        <meta property="og:title" content="REV-orbit Auto Frames - Transform Your Automotive Passion Into Art" />
        <meta property="og:description" content="Premium automotive memorabilia frames and shadow boxes. Transform your car passion into stunning displays with custom craftsmanship." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rev-orbit.com/homepage" />
        <link rel="canonical" href="https://rev-orbit.com/homepage" />
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="pt-16">
          <BannerTextMarquee />
          <HeroSection />
          <ProductShowcase />
          <CustomerTransformations />
          <CraftsmanshipPromise />
          <SocialProofSection />
          <CallToActionSection />

          {/* ✅ Temporary debug test */}
          <div className="p-6">
            <h2 className="text-white text-xl mb-4">Logo Test:</h2>
            <img src={logo} alt="Test Logo" width={150} />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-midnight text-white py-12">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="grid md:grid-cols-4 gap-8">
              {/* Company Info */}
              <div className="md:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  {/* ✅ Using imported logo */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden">
                    <img 
                      src={logo} 
                      alt="REV-orbit Auto Frames Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-xl">REV-orbit</h3>
                    <p className="font-body text-sm text-gray-400">Auto Frames</p>
                  </div>
                </div>
                <p className="font-body text-gray-300 mb-6 max-w-md">
                  Transforming automotive passion into art through premium craftsmanship. 
                  Where automotive memories become masterpieces.
                </p>
                <div className="flex space-x-4">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 automotive-transition cursor-pointer">
                    <span className="text-sm font-bold">f</span>
                  </div>
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 automotive-transition cursor-pointer">
                    <span className="text-sm font-bold">ig</span>
                  </div>
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 automotive-transition cursor-pointer">
                    <span className="text-sm font-bold">tw</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-headline font-semibold text-lg mb-4">Quick Links</h4>
                <ul className="space-y-2 font-body text-gray-300">
                  <li><a href="/product-catalog" className="hover:text-racing-red automotive-transition">Product Catalog</a></li>
                  <li><a href="/customization-studio" className="hover:text-racing-red automotive-transition">Customization Studio</a></li>
                  <li><a href="/account-dashboard" className="hover:text-racing-red automotive-transition">My Account</a></li>
                  <li><a href="/checkout-experience" className="hover:text-racing-red automotive-transition">Checkout</a></li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="font-headline font-semibold text-lg mb-4">Contact Us</h4>
                <div className="space-y-3 font-body text-gray-300">
                  <div className="flex items-center space-x-2">
                    <span className="text-racing-red">📞</span>
                    <span>+91 98765 43210</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-racing-red">✉️</span>
                    <span>hello@rev-orbit.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-racing-red">📍</span>
                    <span>Mumbai, India</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="font-body text-gray-400 text-sm">
                © {new Date()?.getFullYear()} REV-orbit Auto Frames. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="font-body text-gray-400 text-sm hover:text-racing-red automotive-transition">Privacy Policy</a>
                <a href="#" className="font-body text-gray-400 text-sm hover:text-racing-red automotive-transition">Terms of Service</a>
                <a href="#" className="font-body text-gray-400 text-sm hover:text-racing-red automotive-transition">Shipping Policy</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Homepage;
