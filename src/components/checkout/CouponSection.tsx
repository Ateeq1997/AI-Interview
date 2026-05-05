import React, { useEffect, useState } from 'react';
import { applyCoupon } from '../../utils/pricing';
import { Spinner } from '../ui/Spinner';

interface Props {
  subtotal: number;
  appliedCode: string;
  onApply: (code: string, discount: number) => void;
  onRemove: () => void;
}

export function CouponSection({ subtotal, appliedCode, onApply, onRemove }: Props) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [lastDiscount, setLastDiscount] = useState(0);

  // Fix: reset local UI state when the coupon is removed externally (appliedCode becomes '')
  useEffect(() => {
    if (!appliedCode) {
      setInput('');
      setError('');
      setLastDiscount(0);
    }
  }, [appliedCode]);

  async function handleApply() {
    setError('');
    setLoading(true);

    await new Promise((r) => setTimeout(r, 1500)); // simulate 1.5s API delay

    const result = applyCoupon(input, subtotal);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } else {
      setLastDiscount(result.discount);
      onApply(input.trim().toUpperCase(), result.discount);
    }
  }

  // Applied state — show success banner
  if (appliedCode) {
    return (
      <div className="flex items-center justify-between text-sm bg-green-50 border border-green-200 rounded-lg px-3 py-2">
        <span className="text-green-700 font-medium">
          ✓ Coupon <strong>{appliedCode}</strong> applied — you save{' '}
          <strong>${lastDiscount.toFixed(2)}</strong>
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 ml-3 text-xs underline shrink-0"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-sm text-indigo-600 hover:underline"
        >
          Have a coupon?
        </button>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && !loading && input.trim() && handleApply()}
              placeholder="Enter coupon code"
              aria-label="Coupon code"
              className={`flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400
                ${error ? 'border-red-400' : 'border-gray-300'}
                ${shake ? 'animate-shake' : ''}`}
            />
            <button
              type="button"
              disabled={loading || !input.trim()}
              onClick={handleApply}
              className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700
                disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[80px] justify-center"
            >
              {loading ? <Spinner size={4} /> : 'Apply'}
            </button>
          </div>
          {error && (
            <p role="alert" className="text-red-600 text-xs">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}
