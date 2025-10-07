import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const TechnicalSpecs = ({ specifications }) => {
  const [activeTab, setActiveTab] = useState('dimensions');

  const tabs = [
    { id: 'dimensions', label: 'Dimensions', icon: 'Ruler' },
    { id: 'materials', label: 'Materials', icon: 'Package' },
    { id: 'mounting', label: 'Mounting', icon: 'Wrench' },
    { id: 'care', label: 'Care Instructions', icon: 'Shield' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dimensions':
        return (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {specifications?.dimensions?.map((spec, index) => (
                <div key={index} className="bg-surface p-4 rounded-lg">
                  <div className="font-medium mb-1">{spec?.label}</div>
                  <div className="text-2xl font-bold text-accent">{spec?.value}</div>
                  {spec?.note && (
                    <div className="text-sm text-muted-foreground mt-1">{spec?.note}</div>
                  )}
                </div>
              ))}
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <Icon name="Info" size={16} className="text-accent mt-0.5" />
                <div className="text-sm">
                  <strong>Note:</strong> All measurements are external dimensions. Internal viewing area may vary based on matting and frame depth.
                </div>
              </div>
            </div>
          </div>
        );

      case 'materials':
        return (
          <div className="space-y-4">
            {specifications?.materials?.map((material, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Package" size={16} className="text-accent" />
                  <h4 className="font-medium">{material?.component}</h4>
                </div>
                <div className="text-sm text-muted-foreground mb-2">{material?.description}</div>
                <div className="flex flex-wrap gap-2">
                  {material?.features?.map((feature, idx) => (
                    <span key={idx} className="bg-accent/10 text-accent px-2 py-1 rounded text-xs">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 'mounting':
        return (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {specifications?.mounting?.options?.map((option, index) => (
                <div key={index} className="bg-surface p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Wrench" size={16} className="text-accent" />
                    <h4 className="font-medium">{option?.type}</h4>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">{option?.description}</div>
                  <div className="text-sm">
                    <strong>Hardware:</strong> {option?.hardware}
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-warning/10 border border-warning/20 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
                <div className="text-sm">
                  <strong>Installation Note:</strong> {specifications?.mounting?.installationNote}
                </div>
              </div>
            </div>
          </div>
        );

      case 'care':
        return (
          <div className="space-y-4">
            <div className="grid gap-4">
              {specifications?.care?.instructions?.map((instruction, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-surface rounded-lg">
                  <Icon name={instruction?.icon} size={20} className="text-accent mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">{instruction?.title}</h4>
                    <p className="text-sm text-muted-foreground">{instruction?.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-success/10 border border-success/20 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <Icon name="Shield" size={16} className="text-success mt-0.5" />
                <div className="text-sm">
                  <strong>Warranty:</strong> {specifications?.care?.warranty}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-card p-6 rounded-xl automotive-shadow">
      <h2 className="font-headline text-2xl font-bold mb-6">Technical Specifications</h2>
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-border">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg automotive-transition ${
              activeTab === tab?.id
                ? 'bg-accent text-accent-foreground border-b-2 border-accent'
                : 'text-muted-foreground hover:text-primary hover:bg-muted'
            }`}
          >
            <Icon name={tab?.icon} size={16} />
            <span className="font-medium">{tab?.label}</span>
          </button>
        ))}
      </div>
      {/* Tab Content */}
      <div className="min-h-[300px]">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default TechnicalSpecs;