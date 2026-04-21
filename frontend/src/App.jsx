// This is the main component that sets up the layout and routing for the entire application.
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

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
        backgroundColor: '#f9f9f9',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <Toaster position="top-center" />
        
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          backgroundColor: '#fff',
          minHeight: '100vh',
          boxShadow: '0 0 20px rgba(0,0,0,0.05)'
        }}>
          <Navbar />
          
          <main>
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
