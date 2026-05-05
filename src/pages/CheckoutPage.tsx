import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';
import { calculatePrice } from '../utils/pricing';
import { OrderSummary } from '../components/checkout/OrderSummary';
import { PaymentForm } from '../components/checkout/PaymentForm';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { config } = useConfig();
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);

  // Guard: redirect to configure if accessed directly without a valid config
  if (!config.interviewType || !config.difficulty || config.topics.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <p className="text-5xl mb-4">🔒</p>
          <p className="text-gray-700 font-medium mb-2">No configuration found</p>
          <p className="text-gray-500 text-sm mb-6">
            Please configure your interview session before checking out.
          </p>
          <button
            onClick={() => navigate('/configure')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
          >
            Go to Configuration
          </button>
        </div>
      </div>
    );
  }

  const breakdown = calculatePrice(config, couponDiscount);

  function handleCouponApply(code: string, discount: number) {
    setCouponCode(code);
    setCouponDiscount(discount);
  }

  function handleCouponRemove() {
    setCouponCode('');
    setCouponDiscount(0);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-500 mt-1">Review your order and complete payment</p>
        </div>

        {/* Side-by-side on md+, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <OrderSummary
            config={config}
            breakdown={breakdown}
            couponCode={couponCode}
          />
          <PaymentForm
            breakdown={breakdown}
            onCouponApply={handleCouponApply}
            onCouponRemove={handleCouponRemove}
            couponCode={couponCode}
          />
        </div>
      </div>
    </div>
  );
}
