// This file displays the PCOD risk prediction results received from the ML model.
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AlertBanner from '../components/AlertBanner';

const RiskResult = () => {
  // useLocation is a React Router hook that returns the current location object.
  // We use location.state to access data passed from the previous page (LogCycle).
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <p style={{ color: '#666' }}>No result yet. Please log a cycle first.</p>
        <button 
          onClick={() => navigate('/')}
          style={{
            background: '#7F77DD',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Go to Log Cycle
        </button>
      </div>
    );
  }

  const { risk_level, confidence, alert, probabilities } = result;

  // Configuration for different risk levels
  const config = {
    Low: { bg: '#E1F5EE', text: '#085041', accent: '#1D9E75', msg: 'Your cycle looks healthy. Keep tracking!' },
    Medium: { bg: '#FAEEDA', text: '#633806', accent: '#BA7517', msg: 'Some irregularity detected. Monitor your symptoms.' },
    High: { bg: '#FAECE7', text: '#712B13', accent: '#D85A30', msg: 'High risk indicators found. Please consult a doctor.' }
  };

  const current = config[risk_level];

  return (
    <div style={{ padding: '20px' }}>
      {/* Risk Level Card */}
      <div style={{ 
        backgroundColor: current.bg, 
        color: current.text, 
        borderRadius: '12px', 
        padding: '30px', 
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        <div style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
          Predicted Risk Level
        </div>
        <div style={{ fontSize: '40px', fontWeight: '500', marginBottom: '15px' }}>
          {risk_level}
        </div>
        <p style={{ margin: 0, fontSize: '15px' }}>{current.msg}</p>
      </div>

      {/* Confidence Bar */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666', marginBottom: '8px' }}>
          <span>Confidence</span>
          <span>{confidence}%</span>
        </div>
        <div style={{ width: '100%', height: '8px', backgroundColor: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ 
            width: `${confidence}%`, 
            height: '100%', 
            backgroundColor: current.accent,
            transition: 'width 1s ease-out'
          }}></div>
        </div>
      </div>

      {/* Alert Banner */}
      {alert && <AlertBanner message={alert} />}

      {/* Probability Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '30px' }}>
        {Object.entries(probabilities).map(([key, val]) => (
          <div key={key} style={{ 
            backgroundColor: '#fff', 
            border: '0.5px solid #e8e8e8', 
            borderRadius: '12px', 
            padding: '15px', 
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>{key}</div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>{val}%</div>
          </div>
        ))}
      </div>

      <button 
        onClick={() => navigate('/dashboard')}
        style={{
          background: '#7F77DD',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '12px',
          fontSize: '15px',
          fontWeight: '600',
          width: '100%',
          cursor: 'pointer'
        }}
      >
        View dashboard →
      </button>
    </div>
  );
};

export default RiskResult;
