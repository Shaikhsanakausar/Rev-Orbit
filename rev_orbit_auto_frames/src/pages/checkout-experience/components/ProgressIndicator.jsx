import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ currentStep, steps }) => {
  const getStepIcon = (stepId) => {
    const icons = {
      review: 'ShoppingCart',
      shipping: 'Truck',
      payment: 'CreditCard',
      confirmation: 'CheckCircle'
    };
    return icons?.[stepId] || 'Circle';
  };

  const getStepStatus = (stepIndex, currentStepIndex) => {
    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'current';
    return 'upcoming';
  };

  const currentStepIndex = steps?.findIndex(step => step?.id === currentStep);

  return (
    <div className="bg-card rounded-lg automotive-shadow p-6 mb-6">
      <div className="flex items-center justify-between">
        {steps?.map((step, index) => {
          const status = getStepStatus(index, currentStepIndex);
          
          return (
            <React.Fragment key={step?.id}>
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 automotive-transition ${
                  status === 'completed' 
                    ? 'bg-accent text-accent-foreground' 
                    : status === 'current' ?'bg-accent/20 text-accent border-2 border-accent' :'bg-muted text-muted-foreground'
                }`}>
                  {status === 'completed' ? (
                    <Icon name="Check" size={20} />
                  ) : (
                    <Icon name={getStepIcon(step?.id)} size={20} />
                  )}
                </div>
                <div className="text-center">
                  <p className={`font-body font-medium text-sm ${
                    status === 'current' ? 'text-accent' : 
                    status === 'completed' ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {step?.title}
                  </p>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    {step?.description}
                  </p>
                </div>
              </div>
              {index < steps?.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 automotive-transition ${
                  index < currentStepIndex ? 'bg-accent' : 'bg-border'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator;