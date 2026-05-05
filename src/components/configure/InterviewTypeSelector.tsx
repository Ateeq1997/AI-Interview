import React from 'react';
import { InterviewType, INTERVIEW_TYPES, Difficulty } from '../../types';
import { Tooltip } from '../ui/Tooltip';

interface Props {
  selected: InterviewType | null;
  difficulty: Difficulty | null;
  onChange: (t: InterviewType) => void;
}

export function InterviewTypeSelector({ selected, difficulty, onChange }: Props) {
  const isSystemDesignDisabled =
    difficulty === null || difficulty === 'Junior' || difficulty === 'Mid';

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-700 mb-2">Interview Type</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {INTERVIEW_TYPES.map((type) => {
          const disabled = type === 'System Design' && isSystemDesignDisabled;
          const isActive = selected === type;

          const btn = (
            <button
              key={type}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && onChange(type)}
              aria-pressed={isActive}
              className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all
                ${isActive
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'}
                ${disabled
                  ? 'opacity-40 cursor-not-allowed bg-gray-100'
                  : 'cursor-pointer'}
              `}
            >
              {type}
            </button>
          );

          return disabled ? (
            <Tooltip key={type} text="Available for Senior and Lead only.">
              <span className="block">{btn}</span>
            </Tooltip>
          ) : (
            <React.Fragment key={type}>{btn}</React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
