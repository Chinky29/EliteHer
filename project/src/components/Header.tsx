import { Activity, Heart, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  isDark: boolean;
  toggle: () => void;
}

export default function Header({ isDark, toggle }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-rose-100 dark:border-gray-700 shadow-sm transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-5 flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 shadow-md">
          <Heart className="w-6 h-6 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
            Smart Period Tracker &amp; PCOD Risk Analyzer
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-rose-400" />
            AI-powered menstrual health insights
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={toggle}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 bg-rose-50 dark:bg-gray-700 border border-rose-100 dark:border-gray-600 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Model Active
          </div>
        </div>
      </div>
    </header>
  );
}
