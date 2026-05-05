import { AddOn, ADD_ON_OPTIONS, Duration, Difficulty } from '../../types';
import { Tooltip } from '../ui/Tooltip';

interface Props {
  selected: AddOn[];
  duration: Duration;
  difficulty: Difficulty | null;
  onToggle: (a: AddOn) => void;
}

export function AddOnsSelector({ selected, duration, difficulty, onToggle }: Props) {
  function getDisabledReason(id: AddOn): string | null {
    if (id !== 'Expert Review') return null;
    if (duration === 15) return 'Requires at least 30 minutes.';
    if (difficulty === 'Junior') return 'Available for Mid level and above.';
    return null;
  }

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-700 mb-2">Add-ons</h2>
      <div className="space-y-2">
        {ADD_ON_OPTIONS.map((opt) => {
          const disabledReason = getDisabledReason(opt.id);
          const isDisabled = disabledReason !== null;
          const isChecked = selected.includes(opt.id);

          const inner = (
            <label
              key={opt.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer
                ${isChecked && !isDisabled ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200'}
                ${isDisabled ? 'opacity-40 cursor-not-allowed bg-gray-50' : 'hover:border-gray-300'}
              `}
            >
              <input
                type="checkbox"
                checked={isChecked}
                disabled={isDisabled}
                onChange={() => !isDisabled && onToggle(opt.id)}
                className="w-4 h-4 accent-indigo-600"
              />
              <span className="flex-1 text-sm text-gray-700">{opt.label}</span>
              <span className="text-sm font-semibold text-indigo-600">+${opt.price}</span>
            </label>
          );

          return isDisabled ? (
            <Tooltip key={opt.id} text={disabledReason!}>
              <div>{inner}</div>
            </Tooltip>
          ) : (
            inner
          );
        })}
      </div>
    </div>
  );
}
