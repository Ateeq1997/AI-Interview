import { useNavigate } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';
import { calculatePrice } from '../utils/pricing';
import { InterviewTypeSelector } from '../components/configure/InterviewTypeSelector';
import { DifficultySelector } from '../components/configure/DifficultySelector';
import { TopicsInput } from '../components/configure/TopicsInput';
import { DurationSelector } from '../components/configure/DurationSelector';
import { AddOnsSelector } from '../components/configure/AddOnsSelector';
import { PriceDisplay } from '../components/ui/PriceDisplay';
import { Difficulty, Duration, InterviewType, AddOn } from '../types';

export function ConfigurePage() {
  const navigate = useNavigate();
  const {
    config,
    expired,
    setType,
    setDifficulty,
    setDuration,
    addTopic,
    removeTopic,
    toggleAddOn,
    dismissExpired,
  } = useConfig();

  const breakdown = calculatePrice(config);

  const canProceed =
    config.interviewType !== null &&
    config.difficulty !== null &&
    config.topics.length >= 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Configure Your Interview</h1>
          <p className="text-gray-500 mt-1">Customize your AI-powered interview session</p>
        </div>

        {/* Expired session banner */}
        {expired && (
          <div className="mb-4 p-4 bg-amber-50 border border-amber-300 rounded-lg flex items-start justify-between">
            <p className="text-amber-800 text-sm">
              ⏰ Your previous session expired. Please reconfigure.
            </p>
            <button
              onClick={dismissExpired}
              className="text-amber-600 hover:text-amber-800 ml-4 text-lg leading-none"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
              <InterviewTypeSelector
                selected={config.interviewType}
                difficulty={config.difficulty}
                onChange={(t: InterviewType) => setType(t)}
              />

              <DifficultySelector
                selected={config.difficulty}
                onChange={(d: Difficulty) => setDifficulty(d)}
              />

              <TopicsInput
                topics={config.topics}
                onAdd={addTopic}
                onRemove={removeTopic}
              />

              <DurationSelector
                selected={config.duration}
                onChange={(d: Duration) => setDuration(d)}
              />

              <AddOnsSelector
                selected={config.addOns}
                duration={config.duration}
                difficulty={config.difficulty}
                onToggle={(a: AddOn) => toggleAddOn(a)}
              />
            </div>
          </div>

          {/* Price Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <h2 className="text-base font-semibold text-gray-700 mb-4">Price Summary</h2>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex justify-between">
                  <span>Base price</span>
                  <span>${breakdown.basePrice.toFixed(2)}</span>
                </div>
                {config.difficulty && (
                  <div className="flex justify-between">
                    <span>× {config.difficulty} ({breakdown.multiplier}x)</span>
                    <span>${breakdown.adjustedBase.toFixed(2)}</span>
                  </div>
                )}
                {breakdown.addOnDetails.map((a) => (
                  <div key={a.label} className="flex justify-between text-indigo-600">
                    <span>{a.label}</span>
                    <span>+${a.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 flex items-center justify-between">
                <span className="text-gray-500 text-sm">Total</span>
                <PriceDisplay total={breakdown.total} />
              </div>

              <button
                disabled={!canProceed}
                onClick={() => navigate('/checkout')}
                className={`mt-4 w-full py-3 rounded-xl font-semibold text-white transition-all
                  ${canProceed
                    ? 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-200'
                    : 'bg-gray-300 cursor-not-allowed'}
                `}
              >
                Proceed to Checkout →
              </button>

              {!canProceed && (
                <p className="text-xs text-gray-400 text-center mt-2">
                  Select type, difficulty, and at least one topic
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
