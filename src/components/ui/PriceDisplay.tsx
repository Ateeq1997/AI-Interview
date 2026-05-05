import { useEffect, useRef, useState } from 'react';

interface PriceDisplayProps {
  total: number;
}

export function PriceDisplay({ total }: PriceDisplayProps) {
  const [animate, setAnimate] = useState(false);
  const prevTotal = useRef(total);

  useEffect(() => {
    if (prevTotal.current !== total) {
      setAnimate(true);
      prevTotal.current = total;
      const t = setTimeout(() => setAnimate(false), 400);
      return () => clearTimeout(t);
    }
  }, [total]);

  return (
    <span
      key={total}
      className={`font-bold text-3xl text-indigo-600 inline-block transition-all
        ${animate ? 'animate-priceFlash' : ''}`}
    >
      ${total.toFixed(2)}
    </span>
  );
}
