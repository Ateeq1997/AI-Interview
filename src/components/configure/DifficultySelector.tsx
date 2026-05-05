import { Difficulty, DIFFICULTIES } from '../../types';

interface Props {
  selected: Difficulty | null;
  onChange: (d: Difficulty) => void;
}

const COLORS: Record<Difficulty, string> = {
  Junior: 'bg-green-50 border-green-400 text-green-700',
  Mid: 'bg-blue-50 border-blue-400 text-blue-700',
  Senior: 'bg-yellow-50 border-yellow-400 text-yellow-700',
  Lead: 'bg-red-50 border-red-400 text-red-700',
};

export function DifficultySelector({ selected, onChange }: Props) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-700 mb-2">Difficulty</h2>
      <div className="flex flex-wrap gap-2">
        {DIFFICULTIES.map((d) => (
          <button
            key={d}
            type="button"
            aria-pressed={selected === d}
            onClick={() => onChange(d)}
            className={`px-5 py-2 rounded-full border-2 text-sm font-semibold transition-all
              ${selected === d ? COLORS[d] : 'border-gray-200 text-gray-600 hover:border-gray-300'}
            `}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}
