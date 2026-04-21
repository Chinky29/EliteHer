import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { theme } from './styles/theme';

// Import Pages
import LogCycle from './pages/LogCycle';
import RiskResult from './pages/RiskResult';
import Dashboard from './pages/Dashboard';

// Import Components
import Navbar from './components/Navbar';

const App = () => {
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
              <Route path="/" element={<Dashboard />} />
              <Route path="/log" element={<LogCycle />} />
              <Route path="/result" element={<RiskResult />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
