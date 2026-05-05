import { Duration, DURATION_OPTIONS } from '../../types';

interface Props {
  selected: Duration;
  onChange: (d: Duration) => void;
}

export function DurationSelector({ selected, onChange }: Props) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-700 mb-2">Duration</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {DURATION_OPTIONS.map((opt) => (
          <button
            key={opt.minutes}
            type="button"
            aria-pressed={selected === opt.minutes}
            onClick={() => onChange(opt.minutes)}
            className={`flex flex-col items-center px-3 py-3 rounded-lg border-2 text-sm transition-all
              ${selected === opt.minutes
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'}
            `}
          >
            <span className="font-semibold">{opt.label}</span>
            <span className="text-xs text-gray-400">${opt.basePrice} base</span>
          </button>
        ))}
      </div>
    </div>
  );
}
