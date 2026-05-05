import { describe, it, expect } from 'vitest';
import { applyCoupon } from '../utils/pricing';

describe('Coupon: SAVE10', () => {
  it('returns $10 discount when subtotal is above $30', () => {
    const result = applyCoupon('SAVE10', 50);
    expect(result.discount).toBe(10);
    expect(result.error).toBeUndefined();
  });

  it('returns error when subtotal is exactly $30', () => {
    const result = applyCoupon('SAVE10', 30);
    expect(result.discount).toBe(0);
    expect(result.error).toBe('This coupon requires a minimum order of $30.');
  });

  it('returns error when subtotal is below $30', () => {
    const result = applyCoupon('SAVE10', 20);
    expect(result.discount).toBe(0);
    expect(result.error).toBe('This coupon requires a minimum order of $30.');
  });
});

describe('Coupon: FIRST50', () => {
  it('gives 50% discount on small subtotals', () => {
    const result = applyCoupon('FIRST50', 40);
    expect(result.discount).toBe(20);
  });

  it('caps discount at $25 for large subtotals', () => {
    const result = applyCoupon('FIRST50', 100);
    expect(result.discount).toBe(25);
  });

  it('caps at $25 when 50% would exceed it (subtotal = $60)', () => {
    const result = applyCoupon('FIRST50', 60);
    expect(result.discount).toBe(25); // 60 * 0.5 = 30, capped at 25
  });
});

describe('Invalid coupon codes', () => {
  it('returns error for unknown coupon code', () => {
    const result = applyCoupon('BOGUS', 100);
    expect(result.discount).toBe(0);
    expect(result.error).toBe('Invalid coupon code');
  });

  it('is case-insensitive', () => {
    const result = applyCoupon('save10', 50);
    expect(result.discount).toBe(10);
  });
});
