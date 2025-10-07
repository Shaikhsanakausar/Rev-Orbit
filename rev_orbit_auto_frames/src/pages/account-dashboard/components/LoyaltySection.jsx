import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LoyaltySection = ({ loyaltyData }) => {
  const progressPercentage = (loyaltyData?.currentPoints / loyaltyData?.nextTierPoints) * 100;

  return (
    <div className="bg-gradient-to-br from-accent to-racing-red rounded-lg p-6 text-white automotive-shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-headline font-bold text-xl">REV-orbit Elite</h3>
          <p className="text-white/80">Current Tier: {loyaltyData?.currentTier}</p>
        </div>
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
          <Icon name="Crown" size={32} color="white" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold mb-1">
            {loyaltyData?.currentPoints?.toLocaleString('en-IN')}
          </div>
          <div className="text-white/80 text-sm">Current Points</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold mb-1">
            {loyaltyData?.lifetimeSpent?.toLocaleString('en-IN')}
          </div>
          <div className="text-white/80 text-sm">Lifetime Spent (₹)</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold mb-1">
            {loyaltyData?.referrals}
          </div>
          <div className="text-white/80 text-sm">Successful Referrals</div>
        </div>
      </div>
      {/* Progress to next tier */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span>Progress to {loyaltyData?.nextTier}</span>
          <span>{loyaltyData?.pointsToNextTier?.toLocaleString('en-IN')} points to go</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3">
          <div
            className="bg-white h-3 rounded-full automotive-transition"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
      </div>
      {/* Available Rewards */}
      <div className="space-y-3 mb-6">
        <h4 className="font-headline font-semibold">Available Rewards</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {loyaltyData?.availableRewards?.map((reward, index) => (
            <div key={index} className="bg-white/10 rounded-lg p-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">{reward?.name}</div>
                <div className="text-white/80 text-xs">{reward?.points?.toLocaleString('en-IN')} points</div>
              </div>
              <Button
                variant="secondary"
                size="xs"
                disabled={loyaltyData?.currentPoints < reward?.points}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                Redeem
              </Button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Button
          variant="secondary"
          size="sm"
          iconName="Share"
          iconPosition="left"
          className="bg-white/20 hover:bg-white/30 text-white border-white/30"
        >
          Refer Friends
        </Button>
        <Button
          variant="secondary"
          size="sm"
          iconName="Gift"
          iconPosition="left"
          className="bg-white/20 hover:bg-white/30 text-white border-white/30"
        >
          View All Rewards
        </Button>
      </div>
    </div>
  );
};

export default LoyaltySection;