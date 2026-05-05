import React, { useState } from 'react';
import FixedQuestionList from '../components/FixedQuestionList';
import questionsData from '../data/question-bank-data.json';
import { Question, QuestionFilters } from '../types';

// Cast imported JSON to Question[]
// To use YOUR data file: replace src/data/question-bank-data.json with the file provided
const questions = questionsData as Question[];

const DIFFICULTIES = Array.from(new Set(questions.map((q) => q.difficulty))).sort();
const TOPICS = Array.from(new Set(questions.map((q) => q.topic))).sort();

export function QuestionBankPage() {
  const [filters, setFilters] = useState<QuestionFilters>({ difficulty: '', topic: '' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Question Bank</h1>
          <p className="text-gray-500 mt-1">
            {questions.length} questions · Search and filter to find what you need
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4 flex flex-wrap gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Difficulty
            </label>
            <select
              value={filters.difficulty}
              onChange={(e) => setFilters((p) => ({ ...p, difficulty: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 min-w-[140px]"
            >
              <option value="">All Difficulties</option>
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d} className="capitalize">{d}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Topic
            </label>
            <select
              value={filters.topic}
              onChange={(e) => setFilters((p) => ({ ...p, topic: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 min-w-[160px]"
            >
              <option value="">All Topics</option>
              {TOPICS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {(filters.difficulty || filters.topic) && (
            <div className="flex flex-col justify-end">
              <button
                onClick={() => setFilters({ difficulty: '', topic: '' })}
                className="px-3 py-2 text-sm text-gray-500 hover:text-red-500 border border-gray-300 rounded-lg hover:border-red-300 transition-colors"
              >
                Clear filters ×
              </button>
            </div>
          )}
        </div>

        {/* Question List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <FixedQuestionList questions={questions} filters={filters} />
        </div>

      </div>
    </div>
  );
}
