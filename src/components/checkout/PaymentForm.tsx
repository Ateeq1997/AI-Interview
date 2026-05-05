import React, { useState } from 'react';
import { Spinner } from '../ui/Spinner';
import { CouponSection } from './CouponSection';
import { PriceBreakdown } from '../../utils/pricing';

const mockPayment = async (
  email: string,
  amount: number
): Promise<{ success: boolean; error?: string }> => {
  void email;
  void amount;
  return new Promise((resolve) => {
    setTimeout(() => {
      if (Math.random() > 0.2) {
        resolve({ success: true });
      } else {
        resolve({ success: false, error: 'Payment declined. Please try again.' });
      }
    }, 2000);
  });
};

interface Props {
  breakdown: PriceBreakdown;
  onCouponApply: (code: string, discount: number) => void;
  onCouponRemove: () => void;
  couponCode: string;
}

type PayState = 'idle' | 'processing' | 'success' | 'failed';

interface FormErrors {
  name?: string;
  email?: string;
}

export function PaymentForm({ breakdown, onCouponApply, onCouponRemove, couponCode }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [payState, setPayState] = useState<PayState>('idle');
  const [payError, setPayError] = useState('');

  function validate(): boolean {
    const errs: FormErrors = {};
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (!name.trim()) {
      errs.name = 'Name is required.';
    } else if (words.length < 2) {
      errs.name = 'Please enter your first and last name.';
    }
    if (!email.trim()) {
      errs.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please enter a valid email.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // Separated payment execution from validation reset
  async function executePay() {
    setPayState('processing');
    setPayError('');
    try {
      const result = await mockPayment(email, breakdown.total);
      if (result.success) {
        setPayState('success');
      } else {
        setPayState('failed');
        setPayError(result.error ?? 'Payment failed.');
      }
    } catch {
      setPayState('failed');
      setPayError('An unexpected error occurred. Please try again.');
    }
  }

  function handlePay() {
    if (!validate()) return;
    executePay();
  }

  // Fix: handleRetry does NOT call handlePay (which re-validates)
  // it directly re-executes payment since form was already valid
  function handleRetry() {
    executePay();
  }

  if (payState === 'success') {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
        <p className="text-gray-500 text-sm">
          Thank you, {name.split(' ')[0]}! Your interview session has been booked.
          A confirmation will be sent to <strong>{email}</strong>.
        </p>
        <p className="text-2xl font-bold text-indigo-600 mt-4">${breakdown.total.toFixed(2)} paid</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
      <h2 className="text-lg font-semibold text-gray-800">Payment Details</h2>

      {/* Name */}
      <div>
        <label htmlFor="pay-name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          id="pay-name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors((p) => ({ ...p, name: undefined }));
          }}
          placeholder="John Doe"
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400
            ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
        />
        {errors.name && (
          <p role="alert" className="text-red-600 text-xs mt-1">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="pay-email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="pay-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((p) => ({ ...p, email: undefined }));
          }}
          placeholder="john@example.com"
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400
            ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
        />
        {errors.email && (
          <p role="alert" className="text-red-600 text-xs mt-1">{errors.email}</p>
        )}
      </div>

      {/* Coupon */}
      <CouponSection
        subtotal={breakdown.subtotal}
        appliedCode={couponCode}
        onApply={onCouponApply}
        onRemove={onCouponRemove}
      />

      {/* Pay error */}
      {payState === 'failed' && (
        <div
          role="alert"
          className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
        >
          {payError}
        </div>
      )}

      {/* Pay / Try Again button */}
      <button
        type="button"
        disabled={payState === 'processing'}
        onClick={payState === 'failed' ? handleRetry : handlePay}
        className={`w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all
          ${payState === 'processing'
            ? 'bg-indigo-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-200'}`}
      >
        {payState === 'processing' && <Spinner size={4} />}
        {payState === 'processing'
          ? 'Processing…'
          : payState === 'failed'
          ? 'Try Again'
          : `Pay $${breakdown.total.toFixed(2)}`}
      </button>
    </div>
  );
}
