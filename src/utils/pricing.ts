import {
  InterviewConfig,
  DURATION_OPTIONS,
  DIFFICULTY_MULTIPLIERS,
  ADD_ON_OPTIONS,
} from '../types';

export interface PriceBreakdown {
  basePrice: number;
  multiplier: number;
  adjustedBase: number;
  addOnsTotal: number;
  subtotal: number;
  couponDiscount: number;
  total: number;
  addOnDetails: { label: string; price: number }[];
}

export function calculatePrice(config: InterviewConfig, couponDiscount = 0): PriceBreakdown {
  const durationOpt = DURATION_OPTIONS.find((d) => d.minutes === config.duration);
  const basePrice = durationOpt?.basePrice ?? 10;

  const multiplier = config.difficulty ? DIFFICULTY_MULTIPLIERS[config.difficulty] : 1.0;
  const adjustedBase = parseFloat((basePrice * multiplier).toFixed(2));

  const addOnDetails = config.addOns.map((id) => {
    const opt = ADD_ON_OPTIONS.find((a) => a.id === id);
    return { label: opt?.label ?? id, price: opt?.price ?? 0 };
  });

  const addOnsTotal = addOnDetails.reduce((sum, a) => sum + a.price, 0);
  const subtotal = parseFloat((adjustedBase + addOnsTotal).toFixed(2));
  const total = parseFloat(Math.max(0, subtotal - couponDiscount).toFixed(2));

  return {
    basePrice,
    multiplier,
    adjustedBase,
    addOnsTotal,
    subtotal,
    couponDiscount,
    total,
    addOnDetails,
  };
}

export function applyCoupon(code: string, subtotal: number): { discount: number; error?: string } {
  const upper = code.trim().toUpperCase();
  if (upper === 'FIRST50') {
    const raw = subtotal * 0.5;
    return { discount: parseFloat(Math.min(raw, 25).toFixed(2)) };
  }
  if (upper === 'SAVE10') {
    if (subtotal <= 30) {
      return { discount: 0, error: 'This coupon requires a minimum order of $30.' };
    }
    return { discount: 10 };
  }
  return { discount: 0, error: 'Invalid coupon code' };
}
