import React, { useState } from 'react';

interface Props {
  topics: string[];
  onAdd: (t: string) => void;
  onRemove: (t: string) => void;
}

export function TopicsInput({ topics, onAdd, onRemove }: Props) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = input.trim();
      if (val && topics.length < 5 && !topics.includes(val)) {
        onAdd(val);
        setInput('');
      }
    }
  };

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-700 mb-2">
        Topics <span className="text-gray-400 font-normal">({topics.length}/5)</span>
      </h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={topics.length >= 5 ? 'Max 5 topics reached' : 'Type a topic and press Enter…'}
        disabled={topics.length >= 5}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
          focus:outline-none focus:ring-2 focus:ring-indigo-400
          disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
      {topics.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {topics.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onRemove(t)}
              className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700
                text-xs px-3 py-1 rounded-full hover:bg-indigo-200 transition-colors group"
            >
              {t}
              <span className="group-hover:text-red-500 text-indigo-400 font-bold">×</span>
            </button>
          ))}
        </div>
      )}
      {topics.length === 0 && (
        <p className="text-xs text-gray-400 mt-1">Add at least 1 topic to proceed.</p>
      )}
    </div>
  );
}
