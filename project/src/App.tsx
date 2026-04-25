import { useState, useEffect } from 'react';
import Header from './components/Header';
import CyclePrediction from './components/CyclePrediction';
import PCODRiskPrediction from './components/PCODRiskPrediction';

export const ThemeContext = {
  toggle: () => {},
  isDark: false,
};

function App() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggle = () => setIsDark((d) => !d);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <Header isDark={isDark} toggle={toggle} />
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1">
            <CyclePrediction />
          </div>
          <div className="lg:col-span-2">
            <PCODRiskPrediction />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
