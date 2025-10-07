import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

// ✅ Import your background logo
import bgLogo from '../../../assets/vintage-logo.png';

const AccountSettings = ({ userProfile, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: userProfile?.firstName || '',
    lastName: userProfile?.lastName || '',
    email: userProfile?.email || '',
    phone: userProfile?.phone || '',
    defaultAddress: userProfile?.defaultAddress || '',
    communicationPrefs: userProfile?.communicationPrefs || {
      email: true,
      sms: false,
      push: true,
    },
    deliveryPrefs: userProfile?.deliveryPrefs || 'standard',
  });

  const [isEditing, setIsEditing] = useState(false);

  const deliveryOptions = [
    { value: 'standard', label: 'Standard Delivery (5-7 days)' },
    { value: 'express', label: 'Express Delivery (2-3 days)' },
    { value: 'premium', label: 'Premium White Glove (Next day + Installation)' },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCommunicationChange = (type, checked) => {
    setFormData((prev) => ({
      ...prev,
      communicationPrefs: {
        ...prev?.communicationPrefs,
        [type]: checked,
      },
    }));
  };

  const handleSave = () => {
    if (!formData.email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    onSave(formData);
    setIsEditing(false);
    alert('✅ Profile updated successfully!');
  };

  return (
    <div className="relative bg-card border border-border rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* ✅ Background Logo */}
      <img
        src={bgLogo}
        alt="Background Logo"
        className="absolute inset-0 w-full h-full object-contain opacity-5 scale-110 pointer-events-none transition-transform duration-700"
      />

      {/* Content Layer */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-headline font-bold text-2xl text-primary relative inline-block">
            Account Settings
            <span className="absolute left-0 -bottom-1 w-12 h-[3px] bg-gradient-to-r from-automotive-orange to-red-600 rounded-full"></span>
          </h3>
          <div className="flex gap-3">
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                iconName="X"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            )}
            <Button
              variant={isEditing ? 'default' : 'outline'}
              size="sm"
              iconName={isEditing ? 'Save' : 'Edit'}
              iconPosition="left"
              className={isEditing ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' : ''}
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Personal Information */}
          <section>
            <h4 className="font-headline font-semibold text-lg text-primary mb-4">
              Personal Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="First Name"
                type="text"
                value={formData?.firstName}
                onChange={(e) => handleInputChange('firstName', e?.target?.value)}
                disabled={!isEditing}
                required
                className="focus:ring-2 focus:ring-automotive-orange"
              />
              <Input
                label="Last Name"
                type="text"
                value={formData?.lastName}
                onChange={(e) => handleInputChange('lastName', e?.target?.value)}
                disabled={!isEditing}
                required
              />
              <Input
                label="Email Address"
                type="email"
                value={formData?.email}
                onChange={(e) => handleInputChange('email', e?.target?.value)}
                disabled={!isEditing}
                required
              />
              <Input
                label="Phone Number"
                type="tel"
                value={formData?.phone}
                onChange={(e) => handleInputChange('phone', e?.target?.value)}
                disabled={!isEditing}
                required
              />
            </div>
          </section>

          {/* Address Information */}
          <section>
            <h4 className="font-headline font-semibold text-lg text-primary mb-4">
              Default Address
            </h4>
            <Input
              label="Address"
              type="text"
              value={formData?.defaultAddress}
              onChange={(e) => handleInputChange('defaultAddress', e?.target?.value)}
              disabled={!isEditing}
              placeholder="Enter your default delivery address"
            />
          </section>

          {/* Delivery Preferences */}
          <section>
            <h4 className="font-headline font-semibold text-lg text-primary mb-4">
              Delivery Preferences
            </h4>
            <Select
              label="Preferred Delivery Method"
              options={deliveryOptions}
              value={formData?.deliveryPrefs}
              onChange={(value) => handleInputChange('deliveryPrefs', value)}
              disabled={!isEditing}
            />
          </section>

          {/* Communication Preferences */}
          <section>
            <h4 className="font-headline font-semibold text-lg text-primary mb-4">
              Communication Preferences
            </h4>
            <div className="space-y-3">
              <Checkbox
                label="Email notifications for orders and updates"
                checked={formData?.communicationPrefs?.email}
                onChange={(e) =>
                  handleCommunicationChange('email', e?.target?.checked)
                }
                disabled={!isEditing}
              />
              <Checkbox
                label="SMS notifications for delivery updates"
                checked={formData?.communicationPrefs?.sms}
                onChange={(e) =>
                  handleCommunicationChange('sms', e?.target?.checked)
                }
                disabled={!isEditing}
              />
              <Checkbox
                label="Push notifications for new collections"
                checked={formData?.communicationPrefs?.push}
                onChange={(e) =>
                  handleCommunicationChange('push', e?.target?.checked)
                }
                disabled={!isEditing}
              />
            </div>
          </section>

          {/* Account Actions */}
          <section className="border-t border-border pt-6">
            <h4 className="font-headline font-semibold text-lg text-primary mb-4">
              Account Actions
            </h4>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90 shadow-md" size="sm" iconName="Key" iconPosition="left">
                Change Password
              </Button>
              <Button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90 shadow-md" size="sm" iconName="Download" iconPosition="left">
                Download Data
              </Button>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:opacity-90 shadow-md" size="sm" iconName="Shield" iconPosition="left">
                Privacy Settings
              </Button>
              <Button className="bg-gradient-to-r from-red-500 to-pink-600 text-white hover:opacity-90 shadow-md" size="sm" iconName="Trash2" iconPosition="left">
                Delete Account
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
