import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const PersonalizationPanel = ({ personalization, onPersonalizationChange }) => {
  const [previewText, setPreviewText] = useState(personalization?.text || '');

  const fontOptions = [
    { value: 'classic', label: 'Classic Serif', preview: 'Times New Roman' },
    { value: 'modern', label: 'Modern Sans', preview: 'Helvetica' },
    { value: 'script', label: 'Elegant Script', preview: 'Brush Script' },
    { value: 'automotive', label: 'Automotive Bold', preview: 'Impact' },
    { value: 'minimal', label: 'Minimal Clean', preview: 'Arial' }
  ];

  const positionOptions = [
    { value: 'bottom-center', label: 'Bottom Center' },
    { value: 'bottom-right', label: 'Bottom Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'top-center', label: 'Top Center' },
    { value: 'center', label: 'Center' }
  ];

  const sizeOptions = [
    { value: 'small', label: 'Small (12px)' },
    { value: 'medium', label: 'Medium (16px)' },
    { value: 'large', label: 'Large (20px)' },
    { value: 'xl', label: 'Extra Large (24px)' }
  ];

  const colorOptions = [
    { value: 'black', label: 'Classic Black', color: '#000000' },
    { value: 'white', label: 'Pure White', color: '#FFFFFF' },
    { value: 'gold', label: 'Elegant Gold', color: '#FFD700' },
    { value: 'silver', label: 'Metallic Silver', color: '#C0C0C0' },
    { value: 'racing-red', label: 'Racing Red', color: '#C41E3A' },
    { value: 'carbon', label: 'Carbon Gray', color: '#2D2D2D' }
  ];

  const engravingStyles = [
    { value: 'laser', label: 'Laser Engraving', description: 'Precise and permanent' },
    { value: 'embossed', label: 'Embossed Text', description: 'Raised lettering' },
    { value: 'etched', label: 'Etched Glass', description: 'Frosted glass effect' },
    { value: 'vinyl', label: 'Premium Vinyl', description: 'Removable option' }
  ];

  const handleTextChange = (e) => {
    const text = e?.target?.value;
    setPreviewText(text);
    onPersonalizationChange({
      ...personalization,
      text: text
    });
  };

  const handleOptionChange = (key, value) => {
    onPersonalizationChange({
      ...personalization,
      [key]: value
    });
  };

  const getCharacterCount = () => {
    return previewText?.length;
  };

  const getCharacterLimit = () => {
    return personalization?.style === 'laser' ? 50 : 30;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-headline text-2xl font-bold text-primary mb-2">Personalization</h2>
        <p className="text-muted-foreground">Add custom text to make your frame uniquely yours</p>
      </div>
      {/* Text Input */}
      <div className="space-y-4">
        <Input
          label="Custom Text"
          type="text"
          placeholder="Enter your custom text..."
          value={previewText}
          onChange={handleTextChange}
          description={`${getCharacterCount()}/${getCharacterLimit()} characters`}
          maxLength={getCharacterLimit()}
        />

        {/* Quick Text Suggestions */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-primary">Quick Suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {[
              'My First Car',
              'Dream Machine',
              'Road Warrior',
              'Classic Beauty',
              'Speed Demon',
              'Weekend Cruiser'
            ]?.map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="xs"
                onClick={() => {
                  setPreviewText(suggestion);
                  handleOptionChange('text', suggestion);
                }}
                className="text-xs"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </div>
      {/* Engraving Style */}
      <div className="space-y-4">
        <h3 className="font-headline text-lg font-semibold text-primary">Engraving Style</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {engravingStyles?.map((style) => (
            <div
              key={style?.value}
              onClick={() => handleOptionChange('style', style?.value)}
              className={`p-4 rounded-lg border-2 cursor-pointer automotive-transition ${
                personalization?.style === style?.value
                  ? 'border-accent bg-accent/5' :'border-border hover:border-accent/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-headline text-sm font-semibold text-primary">{style?.label}</h4>
                {personalization?.style === style?.value && (
                  <Icon name="Check" size={16} className="text-accent" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">{style?.description}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Typography Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Select
            label="Font Style"
            options={fontOptions}
            value={personalization?.font || 'classic'}
            onChange={(value) => handleOptionChange('font', value)}
            placeholder="Choose font style"
          />

          <Select
            label="Text Size"
            options={sizeOptions}
            value={personalization?.size || 'medium'}
            onChange={(value) => handleOptionChange('size', value)}
            placeholder="Choose text size"
          />
        </div>

        <div className="space-y-4">
          <Select
            label="Position"
            options={positionOptions}
            value={personalization?.position || 'bottom-center'}
            onChange={(value) => handleOptionChange('position', value)}
            placeholder="Choose position"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">Text Color</label>
            <div className="grid grid-cols-3 gap-2">
              {colorOptions?.map((color) => (
                <div
                  key={color?.value}
                  onClick={() => handleOptionChange('color', color?.value)}
                  className={`p-3 rounded-lg border-2 cursor-pointer automotive-transition flex items-center space-x-2 ${
                    personalization?.color === color?.value
                      ? 'border-accent' :'border-border hover:border-accent/50'
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full border border-border"
                    style={{ backgroundColor: color?.color }}
                  />
                  <span className="text-xs text-primary">{color?.label?.split(' ')?.[0]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Preview Section */}
      {previewText && (
        <div className="bg-muted rounded-lg p-6">
          <h3 className="font-headline text-lg font-semibold text-primary mb-4">Text Preview</h3>
          <div className="bg-card rounded-lg p-8 border border-border relative">
            <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center relative">
              <div className="text-center">
                <Icon name="Image" size={32} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Car Photo Preview</p>
              </div>
              
              {/* Text Overlay Preview */}
              <div
                className={`absolute text-primary font-medium ${
                  personalization?.position === 'bottom-center' ? 'bottom-2 left-1/2 transform -translate-x-1/2' :
                  personalization?.position === 'bottom-right' ? 'bottom-2 right-2' :
                  personalization?.position === 'bottom-left' ? 'bottom-2 left-2' :
                  personalization?.position === 'top-center' ? 'top-2 left-1/2 transform -translate-x-1/2' :
                  'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
                } ${
                  personalization?.size === 'small' ? 'text-xs' :
                  personalization?.size === 'large' ? 'text-lg' :
                  personalization?.size === 'xl'? 'text-xl' : 'text-sm'
                }`}
                style={{
                  color: colorOptions?.find(c => c?.value === personalization?.color)?.color || '#000000',
                  fontFamily: personalization?.font === 'script' ? 'cursive' :
                             personalization?.font === 'automotive' ? 'Impact, sans-serif' :
                             personalization?.font === 'minimal' ? 'Arial, sans-serif' :
                             personalization?.font === 'modern' ? 'Helvetica, sans-serif' :
                             'Times New Roman, serif'
                }}
              >
                {previewText}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Personalization Tips */}
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Lightbulb" size={20} className="text-accent mt-0.5" />
          <div>
            <h4 className="font-headline text-sm font-semibold text-primary mb-1">Personalization Tips</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Keep text short and meaningful for best visual impact</li>
              <li>• Consider contrast between text color and photo background</li>
              <li>• Laser engraving offers the most permanent and premium finish</li>
              <li>• Preview your design before finalizing the order</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizationPanel;