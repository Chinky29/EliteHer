import { useState } from 'react';
import { Brain, AlertTriangle, CheckCircle, AlertCircle, Loader2, ChevronDown } from 'lucide-react';

interface FormData {
  cycle_length: string;
  gap_variation: string;
  flow_intensity: string;
  acne_score: string;
  stress_level: string;
  weight_gain: string;
  mood_swings: string;
  hair_loss: string;
  age: string;
}

interface PredictionResult {
  risk_level: 'Low' | 'Medium' | 'High';
  confidence: number;
  alert?: string;
  probabilities?: {
    Low?: number;
    Medium?: number;
    High?: number;
  };
}

const initialForm: FormData = {
  cycle_length: '',
  gap_variation: '',
  flow_intensity: '',
  acne_score: '',
  stress_level: '',
  weight_gain: '0',
  mood_swings: '0',
  hair_loss: '0',
  age: '',
};

const riskConfig = {
  Low: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    badge: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700',
    bar: 'bg-green-400',
    icon: CheckCircle,
    iconColor: 'text-green-500',
    label: 'Low Risk',
    desc: 'Your indicators suggest a healthy cycle pattern.',
  },
  Medium: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800',
    badge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700',
    bar: 'bg-amber-400',
    icon: AlertTriangle,
    iconColor: 'text-amber-500',
    label: 'Medium Risk',
    desc: 'Some indicators warrant attention. Consider consulting a doctor.',
  },
  High: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    badge: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700',
    bar: 'bg-red-400',
    icon: AlertCircle,
    iconColor: 'text-red-500',
    label: 'High Risk',
    desc: 'Multiple risk indicators detected. Please consult a healthcare professional.',
  },
};

function ScoreInput({
  label, name, value, onChange, hint,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
        {label}
      </label>
      {hint && <p className="text-xs text-gray-400 dark:text-gray-500">{hint}</p>}
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className="flex-1 cursor-pointer">
            <input
              type="radio"
              name={name}
              value={String(n)}
              checked={value === String(n)}
              onChange={onChange}
              className="sr-only"
            />
            <div
              className={`h-9 flex items-center justify-center rounded-lg text-sm font-semibold border transition-all duration-150 ${
                value === String(n)
                  ? 'bg-rose-500 border-rose-500 text-white shadow-sm'
                  : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:border-rose-300 dark:hover:border-rose-500 hover:text-rose-400 dark:hover:text-rose-400'
              }`}
            >
              {n}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

function NumberInput({
  label, name, value, onChange, placeholder, min, max,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  min?: number;
  max?: number;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
        {label}
      </label>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-300 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-500 focus:border-rose-300 dark:focus:border-rose-500 transition-all [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        style={{ WebkitAppearance: 'textfield' }}
      />
    </div>
  );
}

function SelectInput({
  label, name, value, onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
        {label}
      </label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full appearance-none px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-500 focus:border-rose-300 dark:focus:border-rose-500 transition-all cursor-pointer pr-9"
        >
          <option value="0">No (0)</option>
          <option value="1">Yes (1)</option>
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
      </div>
    </div>
  );
}

function ProbabilityBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="font-medium text-gray-600 dark:text-gray-300">{label}</span>
        <span className="text-gray-500 dark:text-gray-400">{(value * 100).toFixed(1)}%</span>
      </div>
      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${value * 100}%` }}
        />
      </div>
    </div>
  );
}

export default function PCODRiskPrediction() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const payload = {
      cycle_length: Number(form.cycle_length),
      gap_variation: Number(form.gap_variation),
      flow_intensity: Number(form.flow_intensity),
      acne_score: Number(form.acne_score),
      stress_level: Number(form.stress_level),
      weight_gain: Number(form.weight_gain),
      mood_swings: Number(form.mood_swings),
      hair_loss: Number(form.hair_loss),
      age: Number(form.age),
    };

    try {
      const res = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      const data: PredictionResult = await res.json();
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to reach the prediction service. Please ensure the API is running on http://localhost:5000.'
      );
    } finally {
      setLoading(false);
    }
  };

  const cfg = result ? riskConfig[result.risk_level] : null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-rose-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
      <div className="px-6 py-5 border-b border-gray-50 dark:border-gray-700 flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-900/30">
          <Brain className="w-5 h-5 text-rose-500" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-800 dark:text-white">PCOD Risk Prediction</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500">Enter your health indicators for AI-powered risk analysis</p>
        </div>
        <span className="ml-auto text-xs font-medium bg-rose-50 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400 border border-rose-100 dark:border-rose-800 px-2.5 py-1 rounded-full">
          Main Feature
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="px-6 py-5 space-y-6">
          {/* Row 1: Cycle metrics */}
          <div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Cycle Metrics</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <NumberInput
                label="Cycle Length"
                name="cycle_length"
                value={form.cycle_length}
                onChange={handleInput}
                placeholder="e.g. 28"
                min={15}
                max={60}
              />
              <NumberInput
                label="Gap Variation"
                name="gap_variation"
                value={form.gap_variation}
                onChange={handleInput}
                placeholder="e.g. 3"
                min={0}
              />
              <NumberInput
                label="Age"
                name="age"
                value={form.age}
                onChange={handleInput}
                placeholder="e.g. 25"
                min={10}
                max={60}
              />
            </div>
          </div>

          {/* Row 2: Symptom scores */}
          <div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Symptom Scores (1 = Mild, 5 = Severe)</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <ScoreInput
                label="Flow Intensity"
                name="flow_intensity"
                value={form.flow_intensity}
                onChange={handleInput}
                hint="Rate your flow"
              />
              <ScoreInput
                label="Acne Score"
                name="acne_score"
                value={form.acne_score}
                onChange={handleInput}
                hint="Skin breakouts"
              />
              <ScoreInput
                label="Stress Level"
                name="stress_level"
                value={form.stress_level}
                onChange={handleInput}
                hint="General stress"
              />
            </div>
          </div>

          {/* Row 3: Binary symptoms */}
          <div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Additional Symptoms</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <SelectInput
                label="Weight Gain"
                name="weight_gain"
                value={form.weight_gain}
                onChange={handleInput}
              />
              <SelectInput
                label="Mood Swings"
                name="mood_swings"
                value={form.mood_swings}
                onChange={handleInput}
              />
              <SelectInput
                label="Hair Loss"
                name="hair_loss"
                value={form.hair_loss}
                onChange={handleInput}
              />
            </div>
          </div>
        </div>

        <div className="px-6 pb-5">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:from-rose-600 hover:to-pink-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4" />
                Analyze Risk
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error state */}
      {error && (
        <div className="mx-6 mb-6 flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3.5">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">Connection Failed</p>
            <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Result state */}
      {result && cfg && (
        <div className={`mx-6 mb-6 rounded-2xl border ${cfg.border} ${cfg.bg} overflow-hidden`}>
          <div className="px-5 py-4 flex items-center gap-4">
            <div className={`flex items-center justify-center w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 shadow-sm ${cfg.iconColor}`}>
              <cfg.icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold uppercase tracking-wide border rounded-full px-2.5 py-0.5 ${cfg.badge}`}>
                  {cfg.label}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {result.confidence != null ? `${(result.confidence * 100).toFixed(1)}% confidence` : ''}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{cfg.desc}</p>
            </div>
          </div>

          {result.alert && (
            <div className="mx-4 mb-3 flex items-start gap-2 bg-white dark:bg-gray-800 bg-opacity-60 rounded-xl px-3.5 py-3 border border-white dark:border-gray-700">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-700 dark:text-gray-300">{result.alert}</p>
            </div>
          )}

          {result.probabilities && (
            <div className="px-5 pb-5 space-y-3">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Class Probabilities</p>
              {result.probabilities.Low != null && (
                <ProbabilityBar label="Low Risk" value={result.probabilities.Low} color="bg-green-400" />
              )}
              {result.probabilities.Medium != null && (
                <ProbabilityBar label="Medium Risk" value={result.probabilities.Medium} color="bg-amber-400" />
              )}
              {result.probabilities.High != null && (
                <ProbabilityBar label="High Risk" value={result.probabilities.High} color="bg-red-400" />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
