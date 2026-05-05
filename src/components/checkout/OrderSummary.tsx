import { Link } from 'react-router-dom';
import { InterviewConfig } from '../../types';
import { PriceBreakdown } from '../../utils/pricing';

interface Props {
  config: InterviewConfig;
  breakdown: PriceBreakdown;
  couponCode: string;
}

export function OrderSummary({ config, breakdown, couponCode }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Order Summary</h2>
        <Link to="/configure" className="text-sm text-indigo-600 hover:underline">
          Edit
        </Link>
      </div>

      {/* Config details */}
      <div className="space-y-1 text-sm text-gray-600 mb-4">
        <p><span className="font-medium text-gray-700">Type:</span> {config.interviewType}</p>
        <p><span className="font-medium text-gray-700">Difficulty:</span> {config.difficulty}</p>
        <p><span className="font-medium text-gray-700">Duration:</span> {config.duration} minutes</p>
        <p>
          <span className="font-medium text-gray-700">Topics:</span>{' '}
          {config.topics.join(', ')}
        </p>
      </div>

      {/* Price breakdown */}
      <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Base price ({config.duration} min)</span>
          <span>${breakdown.basePrice.toFixed(2)}</span>
        </div>
        {config.difficulty && (
          <div className="flex justify-between">
            <span>After {config.difficulty} multiplier ({breakdown.multiplier}x)</span>
            <span>${breakdown.adjustedBase.toFixed(2)}</span>
          </div>
        )}
        {breakdown.addOnDetails.map((a) => (
          <div key={a.label} className="flex justify-between text-indigo-600">
            <span>{a.label}</span>
            <span>+${a.price.toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between font-medium text-gray-700 border-t pt-2">
          <span>Subtotal</span>
          <span>${breakdown.subtotal.toFixed(2)}</span>
        </div>
        {breakdown.couponDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Coupon {couponCode}</span>
            <span>−${breakdown.couponDiscount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-gray-900 text-base border-t pt-2">
          <span>Total</span>
          <span>${breakdown.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
