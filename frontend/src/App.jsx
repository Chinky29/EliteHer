import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { theme } from './styles/theme';

// Import Pages
import LogCycle from './pages/LogCycle';
import RiskResult from './pages/RiskResult';
import Dashboard from './pages/Dashboard';

// Import Components
import Navbar from './components/Navbar';

// Helper to safely read from localStorage
const load = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const App = () => {
  // Global state that persists across all page navigation
  const [cycleForm, setCycleForm] = useState(() => load('cycleForm', {
    start_date: '',
    end_date: '',
    prev_start: '',
    flow_intensity: 2,
    acne_score: 0,
    stress_level: 0,
    mood_swings: 0,
    weight_gain: 0,
    hair_loss: 0,
    age: '',
  }));

  const [riskResult, setRiskResult] = useState(() => load('riskResult', null));
  const [cycleHistory, setCycleHistory] = useState(() => load('cycleHistory', []));
  const [insights, setInsights] = useState(() => load('insights', null));

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('cycleForm', JSON.stringify(cycleForm));
  }, [cycleForm]);

  useEffect(() => {
    localStorage.setItem('riskResult', JSON.stringify(riskResult));
  }, [riskResult]);

  useEffect(() => {
    localStorage.setItem('cycleHistory', JSON.stringify(cycleHistory));
  }, [cycleHistory]);

  useEffect(() => {
    localStorage.setItem('insights', JSON.stringify(insights));
  }, [insights]);

  return (
    <Router>
      <div style={{
        minHeight: '100vh',
        backgroundColor: theme.bg,
        fontFamily: "'Inter', system-ui, sans-serif"
      }}>
        <Toaster position="top-center" />
        
        <div style={{
          maxWidth: '720px',
          margin: '0 auto',
          minHeight: '100vh',
          backgroundColor: 'transparent'
        }}>
          <Navbar />
          
          <main className="page-container">
            <Routes>
              <Route path="/" element={
                <Dashboard 
                  insights={insights} 
                  setInsights={setInsights} 
                  cycleHistory={cycleHistory} 
                  setCycleHistory={setCycleHistory} 
                />
              } />
              <Route path="/log" element={
                <LogCycle 
                  form={cycleForm} 
                  setForm={setCycleForm} 
                  setRiskResult={setRiskResult} 
                  setCycleHistory={setCycleHistory}
                  setInsights={setInsights}
                />
              } />
              <Route path="/result" element={
                <RiskResult result={riskResult} />
              } />
              <Route path="/dashboard" element={
                <Dashboard 
                  insights={insights} 
                  setInsights={setInsights} 
                  cycleHistory={cycleHistory} 
                  setCycleHistory={setCycleHistory} 
                />
              } />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
