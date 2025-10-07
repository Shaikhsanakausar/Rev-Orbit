import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ currentStep, onStepClick }) => {
  const steps = [
    { id: 1, name: 'Frame Style', icon: 'Frame', description: 'Choose your frame type' },
    { id: 2, name: 'Material', icon: 'Palette', description: 'Select material & finish' },
    { id: 3, name: 'Photo', icon: 'Image', description: 'Add your car photo' },
    { id: 4, name: 'Personalize', icon: 'Type', description: 'Add custom text' },
    { id: 5, name: 'Features', icon: 'Settings', description: 'Advanced options' },
    { id: 6, name: 'Review', icon: 'Eye', description: 'Final preview' }
  ];

  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

  const getStepClasses = (status) => {
    const baseClasses = 'flex items-center justify-center w-10 h-10 rounded-full border-2 automotive-transition cursor-pointer';
    
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-heritage-green border-heritage-green text-white`;
      case 'current':
        return `${baseClasses} bg-accent border-accent text-white`;
      case 'upcoming':
        return `${baseClasses} bg-muted border-border text-muted-foreground hover:border-accent/50`;
      default:
        return baseClasses;
    }
  };

  const getConnectorClasses = (stepId) => {
    const isCompleted = stepId < currentStep;
    return `flex-1 h-0.5 mx-2 ${isCompleted ? 'bg-heritage-green' : 'bg-border'}`;
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 mb-8">
      {/* Desktop Progress */}
      <div className="hidden lg:block">
        <div className="flex items-center justify-between">
          {steps?.map((step, index) => (
            <React.Fragment key={step?.id}>
              <div 
                className="flex flex-col items-center space-y-2 cursor-pointer"
                onClick={() => onStepClick(step?.id)}
              >
                <div className={getStepClasses(getStepStatus(step?.id))}>
                  {getStepStatus(step?.id) === 'completed' ? (
                    <Icon name="Check" size={20} />
                  ) : (
                    <Icon name={step?.icon} size={20} />
                  )}
                </div>
                <div className="text-center">
                  <p className={`font-headline text-sm font-semibold ${
                    getStepStatus(step?.id) === 'current' ? 'text-accent' : 
                    getStepStatus(step?.id) === 'completed'? 'text-heritage-green' : 'text-muted-foreground'
                  }`}>
                    {step?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{step?.description}</p>
                </div>
              </div>
              
              {index < steps?.length - 1 && (
                <div className={getConnectorClasses(step?.id)} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      {/* Mobile Progress */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-headline text-lg font-semibold text-primary">
            Step {currentStep} of {steps?.length}
          </h3>
          <span className="text-sm text-muted-foreground">
            {Math.round((currentStep / steps?.length) * 100)}% Complete
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2 mb-4">
          <div 
            className="bg-accent h-2 rounded-full automotive-transition"
            style={{ width: `${(currentStep / steps?.length) * 100}%` }}
          />
        </div>
        
        {/* Current Step Info */}
        <div className="flex items-center space-x-3">
          <div className={getStepClasses('current')}>
            <Icon name={steps?.[currentStep - 1]?.icon} size={20} />
          </div>
          <div>
            <p className="font-headline text-base font-semibold text-accent">
              {steps?.[currentStep - 1]?.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {steps?.[currentStep - 1]?.description}
            </p>
          </div>
        </div>
        
        {/* Step Navigation */}
        <div className="flex justify-center mt-4 space-x-1">
          {steps?.map((step) => (
            <button
              key={step?.id}
              onClick={() => onStepClick(step?.id)}
              className={`w-2 h-2 rounded-full automotive-transition ${
                getStepStatus(step?.id) === 'completed' ? 'bg-heritage-green' :
                getStepStatus(step?.id) === 'current'? 'bg-accent' : 'bg-border hover:bg-accent/50'
              }`}
            />
          ))}
        </div>
      </div>
      {/* Help Text */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-center space-x-2 text-center">
          <Icon name="HelpCircle" size={16} className="text-accent" />
          <p className="text-xs text-muted-foreground">
            Click on any step to jump directly to that section. Your progress is automatically saved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;