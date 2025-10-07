import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { supabase } from '../../utils/supabaseClient';

// Import all components
import ProgressIndicator from './components/ProgressIndicator';
import FrameStyleSelector from './components/FrameStyleSelector';
import MaterialSelector from './components/MaterialSelector';
import PhotoUploader from './components/PhotoUploader';
import PersonalizationPanel from './components/PersonalizationPanel';
import AdvancedFeatures from './components/AdvancedFeatures';
import DesignPreview from './components/DesignPreview';
import PricingCalculator from './components/PricingCalculator';

// ✅ Import your logo
import bgLogo from '../../assets/Vintage Automotive Logo Design.png';

const CustomizationStudio = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);
  
  // Design state
  const [designState, setDesignState] = useState({
    frameStyle: null,
    material: null,
    selectedPhoto: null,
    personalization: {
      text: '',
      font: 'classic',
      size: 'medium',
      position: 'bottom-center',
      color: 'black',
      style: 'laser'
    },
    features: {
      lighting: 'none',
      background: 'transparent',
      mounting: 'wall-standard',
      protections: []
    }
  });

  // Load saved design
  useEffect(() => {
    const savedDesign = localStorage.getItem('rev-orbit-design');
    if (savedDesign) {
      try {
        const parsed = JSON.parse(savedDesign);
        setDesignState(parsed);
      } catch (error) {
        console.error('Error loading saved design:', error);
      }
    }
  }, []);

  // Save design
  useEffect(() => {
    localStorage.setItem('rev-orbit-design', JSON.stringify(designState));
  }, [designState]);

  const handleStepClick = (stepId) => setCurrentStep(stepId);
  const handleNextStep = () => currentStep < 6 && setCurrentStep(currentStep + 1);
  const handlePrevStep = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  const handleFrameStyleChange = (style) => setDesignState(prev => ({ ...prev, frameStyle: style }));
  const handleMaterialChange = (material) => setDesignState(prev => ({ ...prev, material }));
  const handlePhotoChange = (photo) => setDesignState(prev => ({ ...prev, selectedPhoto: photo }));
  const handlePersonalizationChange = (personalization) => setDesignState(prev => ({ ...prev, personalization }));
  const handleFeaturesChange = (features) => setDesignState(prev => ({ ...prev, features }));

  const handleSaveDesign = () => {
    const designId = Date.now()?.toString(36);
    try {
      // Limit to 10 saved designs
      const keys = Object.keys(localStorage).filter(k => k.startsWith('rev-orbit-saved-'));
      if (keys.length >= 10) {
        // Remove oldest
        const oldestKey = keys.sort((a, b) => {
          // Extract timestamp from key
          const getTs = k => parseInt(k.replace('rev-orbit-saved-', ''), 36) || 0;
          return getTs(a) - getTs(b);
        })[0];
        localStorage.removeItem(oldestKey);
      }
      localStorage.setItem(`rev-orbit-saved-${designId}`, JSON.stringify(designState));
      alert('Design saved successfully! You can access it from your account dashboard.');
    } catch (e) {
      if (e?.name === 'QuotaExceededError' || e?.code === 22) {
        alert('Storage full! Please remove some saved designs from your account dashboard.');
      } else {
        alert('Failed to save design: ' + (e?.message || 'Unknown error'));
      }
    }
  };

  const handleShareDesign = () => {
    const shareData = {
      title: 'Check out my custom car frame design!',
      text: `I just designed a custom ${designState?.frameStyle?.name || 'car frame'} on REV-orbit. What do you think?`,
      url: window.location?.href
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard?.writeText(shareData?.url);
      alert('Design link copied to clipboard!');
    }
  };

  const handleProceedToCheckout = async () => {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        alert('You must be logged in to proceed to checkout.');
        return;
      }
      // Save design to Supabase
      const { data, error } = await supabase
        .from('custom_orders')
        .insert([
          {
            user_id: user.id,
            price: designState?.frameStyle?.price || 0,
            quantity: 1,
            status: 'draft',
            design_url: designState?.selectedPhoto?.url || null,
            design_data: designState,
            product_id: null
          },
        ])
        .select('id')
        .single();
      if (error) {
        alert('Failed to save your design. Please try again.');
        return;
      }
      // Pass design id to checkout page (via sessionStorage)
      sessionStorage.setItem('rev-orbit-checkout-design-id', data.id);
      navigate('/checkout-experience');
    } catch (e) {
      alert('Unable to proceed: ' + (e.message || 'Unknown error'));
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1: return designState?.frameStyle !== null;
      case 2: return designState?.material !== null;
      case 3: return designState?.selectedPhoto !== null;
      default: return true;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return <FrameStyleSelector selectedStyle={designState?.frameStyle} onStyleChange={handleFrameStyleChange} />;
      case 2: return <MaterialSelector selectedMaterial={designState?.material} onMaterialChange={handleMaterialChange} frameStyle={designState?.frameStyle} />;
      case 3: return <PhotoUploader selectedPhoto={designState?.selectedPhoto} onPhotoChange={handlePhotoChange} />;
      case 4: return <PersonalizationPanel personalization={designState?.personalization} onPersonalizationChange={handlePersonalizationChange} />;
      case 5: return <AdvancedFeatures features={designState?.features} onFeaturesChange={handleFeaturesChange} frameStyle={designState?.frameStyle} />;
      case 6: return <DesignPreview frameStyle={designState?.frameStyle} material={designState?.material} selectedPhoto={designState?.selectedPhoto} personalization={designState?.personalization} features={designState?.features} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* ✅ Background Logo */}
     <img
  src={bgLogo}
  alt="Background Logo"
  className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none"
/>

      <Header />
      <div className="pt-16 relative z-10">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-midnight via-charcoal to-midnight text-white py-12">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="text-center">
              <h1 className="font-headline text-4xl lg:text-5xl font-bold mb-4">
                Customization Studio
              </h1>
              <p className="text-xl text-gray-300 mb-6 max-w-3xl mx-auto">
                Design your perfect automotive frame with our interactive studio. 
                See your creation come to life with real-time previews and professional customization options.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
          {/* Progress Indicator */}
          <ProgressIndicator currentStep={currentStep} onStepClick={handleStepClick} />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="xl:col-span-2">
              <div className="bg-card rounded-xl border border-border p-6 lg:p-8">
                {renderCurrentStep()}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                  <Button variant="outline" iconName="ChevronLeft" iconPosition="left" onClick={handlePrevStep} disabled={currentStep === 1}>
                    Previous
                  </Button>

                  <div className="flex items-center space-x-3">
                    {currentStep < 6 ? (
                      <Button variant="default" iconName="ChevronRight" iconPosition="right" onClick={handleNextStep} disabled={!canProceedToNext()} className="bg-accent hover:bg-accent/90">
                        Next Step
                      </Button>
                    ) : (
                      <Button variant="default" iconName="ShoppingCart" iconPosition="left" onClick={handleProceedToCheckout} className="bg-racing-red hover:bg-racing-red/90 text-white">
                        Proceed to Checkout
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="xl:col-span-1">
              <div className="space-y-6">
                {/* Preview */}
                <div className={`${isMobilePreviewOpen ? 'block' : 'hidden xl:block'}`}>
                  <div className="bg-card rounded-xl border border-border p-6 mb-6">
                    <DesignPreview {...designState} />
                  </div>
                </div>

                {/* Pricing Calculator */}
                <PricingCalculator {...designState} onSaveDesign={handleSaveDesign} onShareDesign={handleShareDesign} onProceedToCheckout={handleProceedToCheckout} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizationStudio;
