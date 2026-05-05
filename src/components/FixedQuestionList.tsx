import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Question, QuestionFilters } from '../types';

interface Props {
  questions: Question[];
  filters: QuestionFilters;
}

// Difficulty badge colors
const DIFFICULTY_COLORS: Record<string, string> = {
  junior: 'bg-green-100 text-green-700',
  mid: 'bg-blue-100 text-blue-700',
  senior: 'bg-yellow-100 text-yellow-700',
  lead: 'bg-red-100 text-red-700',
};

// ─── Memoised row – only re-renders if its own data changes ──────────────────
const QuestionRow = React.memo(function QuestionRow({
  question,
  isSelected,
  onClick,
}: {
  question: Question & { formattedDate: string; displayTags: string };
  isSelected: boolean;
  onClick: (q: Question) => void;
}) {
  const diffColor = DIFFICULTY_COLORS[question.difficulty?.toLowerCase()] ?? 'bg-gray-100 text-gray-600';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(question)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(question)}
      className={`p-4 rounded-xl border-2 mb-2 cursor-pointer transition-all select-none
        ${isSelected
          ? 'border-indigo-400 bg-indigo-50 shadow-sm'
          : 'border-gray-100 hover:border-indigo-200 hover:bg-gray-50'}
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-800 leading-snug flex-1">
          {question.title}
        </h3>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize shrink-0 ${diffColor}`}>
          {question.difficulty}
        </span>
      </div>

      <div className="flex items-center gap-3 mt-2 flex-wrap">
        <span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded-full">
          {question.topic}
        </span>
        <span className="text-xs text-gray-400">Score: <strong className="text-gray-600">{question.score}</strong></span>
        <span className="text-xs text-gray-400">{question.formattedDate}</span>
      </div>

      {question.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {question.tags.map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
});

// ─── Main Component ───────────────────────────────────────────────────────────
export default function FixedQuestionList({ questions, filters }: Props) {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Fix 1: dependency array – only re-run when questions.length changes
  useEffect(() => {
    document.title = `${questions.length} Questions`;
  }, [questions.length]);

  // Fix 2: useMemo – filtering/sorting only recomputes when inputs change
  const filteredQuestions = useMemo(() => {
    const lower = search.toLowerCase();
    return questions
      .filter((q) => q.title.toLowerCase().includes(lower))
      .filter((q) => (filters.difficulty ? q.difficulty === filters.difficulty : true))
      .filter((q) => (filters.topic ? q.topic === filters.topic : true))
      .sort((a, b) => b.score - a.score)
      .map((q) => ({
        ...q,
        formattedDate: new Date(q.date).toLocaleDateString(),
        displayTags: q.tags.join(', '),
      }));
  }, [questions, search, filters.difficulty, filters.topic]);

  // Fix 3: useCallback – stable handler reference so memoised rows don't re-render
  const handleClick = useCallback((question: Question) => {
    setSelectedId(question.id);
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: question.id }),
    }).catch(() => {
      // non-critical analytics – swallow errors silently
    });
  }, []);

  return (
    <div>
      {/* Search input */}
      <div className="mb-4 relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions by title…"
          aria-label="Search questions"
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-sm
            focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-400 mb-3">
        Showing <strong className="text-gray-600">{filteredQuestions.length}</strong> of {questions.length} questions
        {search && ` matching "${search}"`}
      </p>

      {/* Scrollable list – Fix 4: stable key=q.id (was Math.random()) */}
      <div style={{ height: '520px', overflowY: 'auto' }} className="pr-1">
        {filteredQuestions.map((q) => (
          <QuestionRow
            key={q.id}
            question={q}
            isSelected={selectedId === q.id}
            onClick={handleClick}
          />
        ))}

        {/* Empty state – Fix 5: uses already-computed result, not a second call */}
        {filteredQuestions.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-500 font-medium">No questions found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
