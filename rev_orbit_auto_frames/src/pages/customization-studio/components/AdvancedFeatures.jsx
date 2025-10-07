import React, { useEffect, useRef, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';

const AdvancedFeatures = ({ features, onFeaturesChange, frameStyle }) => {
  const lightingOptions = [
    { value: 'none', label: 'No Lighting' },
    { value: 'warm-led', label: 'Warm LED Strip', price: 1500 },
    { value: 'cool-led', label: 'Cool LED Strip', price: 1500 },
    { value: 'rgb-led', label: 'RGB Color Changing', price: 2500 },
    { value: 'spotlight', label: 'Focused Spotlight', price: 2000 }
  ];

  const mountingOptions = [
    { value: 'wall-standard', label: 'Standard Wall Mount', price: 0 },
    { value: 'wall-floating', label: 'Floating Wall Mount', price: 800 },
    { value: 'easel-desktop', label: 'Desktop Easel', price: 1200 },
    { value: 'easel-floor', label: 'Floor Standing Easel', price: 2500 },
    { value: 'magnetic', label: 'Magnetic Mount', price: 1500 }
  ];

  const protectionOptions = [
    { id: 'uv-protection', label: 'UV Protection Glass', description: 'Prevents photo fading from sunlight', price: 1000 },
    { id: 'anti-glare', label: 'Anti-Glare Coating', description: 'Reduces reflections for better viewing', price: 800 },
    { id: 'moisture-seal', label: 'Moisture Seal', description: 'Protects against humidity damage', price: 600 },
    { id: 'scratch-resistant', label: 'Scratch Resistant Surface', description: 'Durable coating for high-traffic areas', price: 1200 }
  ];

  // Local state for live preview
  const [localPreview, setLocalPreview] = useState(null);

  const handleFeatureChange = (key, value) => {
    onFeaturesChange({
      ...features,
      [key]: value
    });
    if (key === 'backgroundPreview') {
      setLocalPreview(value);
    }
    if (key === 'background' && value !== 'upload') {
      setLocalPreview(null);
    }
  };

  const handleProtectionToggle = (protectionId, checked) => {
    const currentProtections = features?.protections || [];
    const updatedProtections = checked
      ? [...currentProtections, protectionId]
      : currentProtections?.filter(id => id !== protectionId);
    
    handleFeatureChange('protections', updatedProtections);
  };

  const isProtectionSelected = (protectionId) => {
    return features?.protections?.includes(protectionId) || false;
  };

  const isShadowBoxStyle = frameStyle?.id === 'shadowbox';

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-headline text-2xl font-bold text-primary mb-2">Advanced Features</h2>
        <p className="text-muted-foreground">Enhance your frame with premium features and customizations</p>
      </div>

      {/* Lighting Options (Shadow Box Only) */}
      {isShadowBoxStyle && (
        <div className="space-y-4">
          <h3 className="font-headline text-lg font-semibold text-primary flex items-center space-x-2">
            <Icon name="Lightbulb" size={20} className="text-accent" />
            <span>LED Lighting System</span>
          </h3>
          
          <Select
            label="Lighting Type"
            description="Add dramatic lighting to showcase your car photo"
            options={lightingOptions}
            value={features?.lighting || 'none'}
            onChange={(value) => handleFeatureChange('lighting', value)}
            placeholder="Choose lighting option"
          />

          {features?.lighting && features?.lighting !== 'none' && (
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Icon name="Zap" size={16} className="text-accent" />
                <div>
                  <p className="text-sm font-medium text-primary">Lighting Features</p>
                  <p className="text-xs text-muted-foreground">
                    {features?.lighting === 'rgb-led'
                      ? 'Remote control included with 16 million color options'
                      : 'Energy-efficient LED with 50,000+ hour lifespan'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Background Options */}
      <div className="space-y-4">
        <h3 className="font-headline text-lg font-semibold text-primary flex items-center space-x-2">
          <Icon name="Palette" size={20} className="text-accent" />
          <span>Background</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Upload Custom Background */}
          <div
            className={`p-4 rounded-lg border-2 cursor-pointer automotive-transition ${
              features?.background === 'upload'
                ? 'border-accent bg-accent/5'
                : 'border-border hover:border-accent/50'
            }`}
          >
            <label className="flex flex-col items-center space-y-2 cursor-pointer">
              <Icon name="Upload" size={20} className="text-accent" />
              <span className="text-sm font-medium text-primary">Upload Your Background</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    if (features?.backgroundPreview) {
                      URL.revokeObjectURL(features.backgroundPreview);
                    }
                    const previewUrl = URL.createObjectURL(file);
                    handleFeatureChange('background', 'upload');
                    handleFeatureChange('backgroundFile', file);
                    handleFeatureChange('backgroundPreview', previewUrl);
                    setLocalPreview(previewUrl);
                  }
                }}
              />
            </label>

            {/* Preview + Remove button */}
            {(features?.background === 'upload' && (localPreview || features?.backgroundPreview)) && (
              <div className="mt-3">
                <img
                  src={localPreview || features.backgroundPreview}
                  alt="Background Preview"
                  className="w-full h-32 object-cover rounded-lg border"
                  key={localPreview || features.backgroundPreview}
                  onError={e => { e.target.src = '/assets/images/no_image.png'; }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    handleFeatureChange('background', null);
                    handleFeatureChange('backgroundFile', null);
                    handleFeatureChange('backgroundPreview', null);
                    setLocalPreview(null);
                  }}
                >
                  Remove
                </Button>
              </div>
            )}
          </div>

          {/* Choose from Library */}
          <div
            className={`p-4 rounded-lg border-2 cursor-pointer automotive-transition ${
              features?.background === 'library'
                ? 'border-accent bg-accent/5'
                : 'border-border hover:border-accent/50'
            }`}
            onClick={() => handleFeatureChange('background', 'library')}
          >
            <div className="flex flex-col items-center space-y-2">
              <Icon name="Image" size={20} className="text-accent" />
              <span className="text-sm font-medium text-primary">Choose from Library</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mounting Hardware */}
      <div className="space-y-4">
        <h3 className="font-headline text-lg font-semibold text-primary flex items-center space-x-2">
          <Icon name="Wrench" size={20} className="text-accent" />
          <span>Mounting Hardware</span>
        </h3>
        
        <Select
          label="Mounting Type"
          description="Choose how you want to display your frame"
          options={mountingOptions}
          value={features?.mounting || 'wall-standard'}
          onChange={(value) => handleFeatureChange('mounting', value)}
          placeholder="Choose mounting option"
        />
      </div>

      {/* Protection Features */}
      <div className="space-y-4">
        <h3 className="font-headline text-lg font-semibold text-primary flex items-center space-x-2">
          <Icon name="Shield" size={20} className="text-accent" />
          <span>Protection Features</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {protectionOptions?.map((protection) => (
            <div
              key={protection?.id}
              className="bg-card rounded-lg border border-border p-4"
            >
              <div className="flex items-start space-x-3">
                <Checkbox
                  checked={isProtectionSelected(protection?.id)}
                  onChange={(e) => handleProtectionToggle(protection?.id, e?.target?.checked)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-headline text-sm font-semibold text-primary">{protection?.label}</h4>
                    <span className="text-sm font-medium text-accent">+₹{protection?.price?.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{protection?.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Summary */}
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Settings" size={20} className="text-accent mt-0.5" />
          <div>
            <h4 className="font-headline text-sm font-semibold text-primary mb-1">Selected Features</h4>
            <div className="space-y-1">
              {features?.lighting && features?.lighting !== 'none' && (
                <p className="text-xs text-muted-foreground">
                  • {lightingOptions?.find(l => l?.value === features?.lighting)?.label}
                </p>
              )}
              {features?.background === 'upload' && (
                <p className="text-xs text-muted-foreground">• Custom Uploaded Background</p>
              )}
              {features?.background === 'library' && (
                <p className="text-xs text-muted-foreground">• Background from Library</p>
              )}
              {features?.mounting && features?.mounting !== 'wall-standard' && (
                <p className="text-xs text-muted-foreground">
                  • {mountingOptions?.find(m => m?.value === features?.mounting)?.label}
                </p>
              )}
              {features?.protections?.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  • {features?.protections?.length} Protection Feature{features?.protections?.length > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFeatures;
