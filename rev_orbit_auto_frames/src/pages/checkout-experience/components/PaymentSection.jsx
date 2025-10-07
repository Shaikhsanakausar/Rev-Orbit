import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const PaymentSection = ({ paymentData, onPaymentChange, orderTotal, onPaymentSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const paymentMethods = [
    { id: 'razorpay', name: 'Razorpay', description: 'Pay securely via Razorpay', icon: 'CreditCard', popular: true },
    { id: 'upi', name: 'UPI Payment', description: 'Pay using Google Pay, PhonePe, Paytm', icon: 'Smartphone', popular: false },
    { id: 'card', name: 'Credit/Debit Card', description: 'Visa, Mastercard, RuPay accepted', icon: 'CreditCard', popular: false },
    { id: 'netbanking', name: 'Net Banking', description: 'All major banks supported', icon: 'Building2', popular: false },
    { id: 'emi', name: 'EMI Options', description: 'No cost EMI available', icon: 'Calendar', popular: false, available: orderTotal >= 10000 },
    { id: 'wallet', name: 'Digital Wallets', description: 'Paytm, Amazon Pay, Mobikwik', icon: 'Wallet', popular: false }
  ];

  const bankOptions = [
    { value: 'sbi', label: 'State Bank of India' },
    { value: 'hdfc', label: 'HDFC Bank' },
    { value: 'icici', label: 'ICICI Bank' },
    { value: 'axis', label: 'Axis Bank' },
    { value: 'kotak', label: 'Kotak Mahindra Bank' },
    { value: 'pnb', label: 'Punjab National Bank' }
  ];

  const emiOptions = [
    { value: '3', label: '3 months - ₹0 interest' },
    { value: '6', label: '6 months - ₹0 interest' },
    { value: '9', label: '9 months - 12% interest' },
    { value: '12', label: '12 months - 15% interest' }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })?.format(price);
  };

  const RAZORPAY_KEY = 'rzp_test_DERPySnzT1pLOT';

  // Razorpay payment
  const handleRazorpayPay = () => {
    const options = {
      key: RAZORPAY_KEY,
      amount: orderTotal * 100,
      currency: 'INR',
      name: 'Rev Orbit',
      description: 'Order Payment',
      handler: function (response) {
        setPaymentCompleted(true); // mark payment as done
        if (onPaymentSuccess) onPaymentSuccess(response.razorpay_payment_id);
      },
      prefill: {},
      theme: { color: '#3399cc' }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case 'razorpay':
        return (
          <div className="space-y-4">
            <button
              type="button"
              className="px-4 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-medium hover:bg-accent/90"
              onClick={handleRazorpayPay}
            >
              Pay with Razorpay
            </button>
          </div>
        );
      case 'upi':
        return (
          <div className="space-y-4">
            <Input
              label="UPI ID"
              type="text"
              placeholder="yourname@paytm"
              value={paymentData?.upiId}
              onChange={(e) => onPaymentChange('upiId', e?.target?.value)}
            />
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Icon name="Smartphone" size={16} className="text-green-600" />
                <span className="text-sm text-muted-foreground">Google Pay</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Smartphone" size={16} className="text-blue-600" />
                <span className="text-sm text-muted-foreground">PhonePe</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Smartphone" size={16} className="text-blue-500" />
                <span className="text-sm text-muted-foreground">Paytm</span>
              </div>
            </div>
          </div>
        );
      case 'card':
        return (
          <div className="space-y-4">
            <Input label="Card Number" type="text" placeholder="1234 5678 9012 3456" value={paymentData?.cardNumber} onChange={(e) => onPaymentChange('cardNumber', e?.target?.value)} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Expiry Date" type="text" placeholder="MM/YY" value={paymentData?.expiryDate} onChange={(e) => onPaymentChange('expiryDate', e?.target?.value)} />
              <Input label="CVV" type="text" placeholder="123" value={paymentData?.cvv} onChange={(e) => onPaymentChange('cvv', e?.target?.value)} />
            </div>
            <Input label="Cardholder Name" type="text" placeholder="Name as on card" value={paymentData?.cardholderName} onChange={(e) => onPaymentChange('cardholderName', e?.target?.value)} />
          </div>
        );
      case 'netbanking':
        return <Select label="Select Bank" options={bankOptions} value={paymentData?.selectedBank} onChange={(value) => onPaymentChange('selectedBank', value)} placeholder="Choose your bank" />;
      case 'emi':
        return <Select label="EMI Duration" options={emiOptions} value={paymentData?.emiDuration} onChange={(value) => onPaymentChange('emiDuration', value)} placeholder="Select EMI plan" />;
      case 'wallet':
        return (
          <div className="grid grid-cols-3 gap-3">
            {['Paytm', 'Amazon Pay', 'Mobikwik'].map((wallet) => (
              <div key={wallet} className="border border-border rounded-lg p-3 text-center cursor-pointer hover:border-accent automotive-transition">
                <Icon name="Wallet" size={24} className="mx-auto mb-2 text-accent" />
                <span className="text-sm font-medium">{wallet}</span>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-lg automotive-shadow p-6">
      <h2 className="font-headline text-xl font-bold text-primary mb-6">Payment Method</h2>
      <div className="space-y-3 mb-6">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`border rounded-lg p-4 cursor-pointer automotive-transition ${
              !method?.available && method?.id === 'emi' ? 'opacity-50 cursor-not-allowed' : ''
            } ${selectedMethod === method.id ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'}`}
            onClick={() => { if (method?.available !== false) setSelectedMethod(method.id); }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full border-2 ${selectedMethod === method.id ? 'border-accent bg-accent' : 'border-muted-foreground'}`}>
                  {selectedMethod === method.id && <div className="w-full h-full rounded-full bg-white scale-50"></div>}
                </div>
                <Icon name={method.icon} size={20} className="text-accent" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-body font-medium text-primary">{method.name}</p>
                    {method.popular && <span className="bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full">Popular</span>}
                  </div>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                </div>
              </div>
              {method.id === 'emi' && method.available === false && <span className="text-xs text-muted-foreground">Min ₹10,000</span>}
            </div>
          </div>
        ))}
      </div>
      {renderPaymentForm()}
    </div>
  );
};

export default PaymentSection;
