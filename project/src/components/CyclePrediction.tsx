import { CalendarDays, ChevronRight, Droplets, Clock } from 'lucide-react';

const phases = [
  { name: 'Menstrual', days: 'Day 1–5', color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300', dot: 'bg-rose-400' },
  { name: 'Follicular', days: 'Day 6–13', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300', dot: 'bg-amber-400' },
  { name: 'Ovulation', days: 'Day 14', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300', dot: 'bg-green-400' },
  { name: 'Luteal', days: 'Day 15–28', color: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300', dot: 'bg-sky-400' },
];

export default function CyclePrediction() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-rose-100 dark:border-gray-700 overflow-hidden h-full flex flex-col transition-colors duration-300">
      <div className="px-6 py-5 border-b border-gray-50 dark:border-gray-700 flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-900/30">
          <CalendarDays className="w-5 h-5 text-rose-500" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-800 dark:text-white">Cycle Prediction</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500">Track your monthly cycle</p>
        </div>
      </div>

      <div className="px-6 py-5 flex-1 space-y-5">
        {/* Cycle ring */}
        <div className="flex flex-col items-center py-4">
          <div className="relative w-36 h-36">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="12" className="text-rose-100 dark:text-gray-700" />
              <circle
                cx="60" cy="60" r="50" fill="none"
                stroke="url(#cycleGrad)" strokeWidth="12"
                strokeDasharray="314" strokeDashoffset="100"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="cycleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fb7185" />
                  <stop offset="100%" stopColor="#f472b6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-800 dark:text-white">14</span>
              <span className="text-xs text-gray-400 dark:text-gray-500">Day</span>
            </div>
          </div>
          <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-300">Current Cycle Day</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Avg cycle: 28 days</p>
        </div>

        {/* Next period */}
        <div className="flex items-center gap-3 bg-rose-50 dark:bg-rose-900/20 rounded-xl px-4 py-3">
          <Droplets className="w-5 h-5 text-rose-400 flex-shrink-0" />
          <div>
            <p className="text-xs text-rose-500 dark:text-rose-400 font-medium uppercase tracking-wide">Next Period</p>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-0.5">In ~14 days</p>
          </div>
          <ChevronRight className="w-4 h-4 text-rose-300 dark:text-rose-500 ml-auto" />
        </div>

        {/* Ovulation window */}
        <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 rounded-xl px-4 py-3">
          <Clock className="w-5 h-5 text-green-500 flex-shrink-0" />
          <div>
            <p className="text-xs text-green-600 dark:text-green-400 font-medium uppercase tracking-wide">Ovulation Window</p>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-0.5">Today — Day 16</p>
          </div>
          <ChevronRight className="w-4 h-4 text-green-300 dark:text-green-500 ml-auto" />
        </div>

        {/* Phases */}
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Cycle Phases</p>
          <div className="space-y-2">
            {phases.map((phase) => (
              <div key={phase.name} className={`flex items-center justify-between rounded-lg px-3 py-2 ${phase.color}`}>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${phase.dot}`}></span>
                  <span className="text-xs font-medium">{phase.name}</span>
                </div>
                <span className="text-xs opacity-70">{phase.days}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 pb-5">
        <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-400 to-pink-400 text-white text-sm font-semibold shadow-sm hover:shadow-md hover:from-rose-500 hover:to-pink-500 transition-all duration-200">
          Log Period
        </button>
      </div>
    </div>
  );
}
