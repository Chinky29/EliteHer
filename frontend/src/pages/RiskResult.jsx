// This file displays the PCOD risk prediction results received from the ML model.
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { theme } from '../styles/theme';

const RiskResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;
  const [animatedConfidence, setAnimatedConfidence] = useState(0);

  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => {
        setAnimatedConfidence(result.confidence);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [result]);

  if (!result) {
    return (
      <div className="animate-fade-up" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ 
          width: '120px', 
          height: '120px', 
          borderRadius: '50%', 
          backgroundColor: theme.purpleLight, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          margin: '0 auto 24px auto' 
        }}>
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke={theme.purple} strokeWidth="1.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: '500', color: theme.textPrimary, marginBottom: '8px' }}>No result yet</h2>
        <p style={{ color: theme.textSecondary, marginBottom: '32px', maxWidth: '300px', margin: '0 auto 32px auto' }}>
          Fill in your cycle details to get your personalized PCOD risk assessment
        </p>
        <button 
          onClick={() => navigate('/log')}
          style={{
            background: theme.purple,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: theme.shadow
          }}
        >
          Go to Log Cycle →
        </button>
      </div>
    );
  }

  const { risk_level, confidence, alert, probabilities } = result;

  // Configuration for different risk levels
  const config = {
    Low: { bg: theme.tealLight, text: theme.teal, msg: 'Your cycle looks healthy. Keep tracking!' },
    Medium: { bg: theme.amberLight, text: theme.amber, msg: 'Some irregularity detected. Monitor your symptoms.' },
    High: { bg: theme.coralLight, text: theme.coral, msg: 'High risk indicators found. Please consult a doctor.' }
  };

  const current = config[risk_level];

  // SVG Donut Logic
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedConfidence / 100) * circumference;

  return (
    <div className="animate-fade-up" style={{ animationDuration: '0.5s' }}>
      {/* Top Result Card */}
      <div style={{ 
        backgroundColor: current.bg, 
        borderRadius: '16px', 
        padding: '32px', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        boxShadow: theme.shadow
      }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: current.text, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
            PCOD Risk Level
          </div>
          <div style={{ fontSize: '52px', fontWeight: '700', color: current.text, lineHeight: 1, marginBottom: '12px' }}>
            {risk_level.toUpperCase()}
          </div>
          <p style={{ margin: 0, fontSize: '15px', color: current.text, opacity: 0.9 }}>{current.msg}</p>
        </div>

        {/* Donut Indicator */}
        <div style={{ position: 'relative', width: '100px', height: '100px' }}>
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={radius} fill="transparent" stroke={theme.border} strokeWidth="8" />
            <circle 
              cx="50" cy="50" r={radius} 
              fill="transparent" 
              stroke={current.text} 
              strokeWidth="8" 
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
          </svg>
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            fontSize: '20px',
            fontWeight: '700',
            color: current.text
          }}>
            {Math.round(animatedConfidence)}%
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      {alert && (
        <div style={{ 
          backgroundColor: theme.coralLight, 
          borderLeft: `4px solid ${theme.coral}`,
          borderRadius: '8px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          color: theme.coral
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <span style={{ fontSize: '14px', fontWeight: '500' }}>{alert}</span>
          </div>
          <button 
            onClick={() => window.open('https://www.google.com/search?q=gynaecologist+near+me', '_blank')}
            style={{ 
              background: 'none',
              border: 'none',
              color: theme.coral, 
              fontSize: '13px', 
              fontWeight: '600', 
              textDecoration: 'underline',
              cursor: 'pointer',
              padding: 0
            }}
          >
            Book a consultation
          </button>
        </div>
      )}

      {/* Confidence Score Bar */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', color: theme.textSecondary, marginBottom: '10px' }}>
          <span>CONFIDENCE SCORE</span>
          <span>{confidence}%</span>
        </div>
        <div style={{ width: '100%', height: '10px', backgroundColor: theme.border, borderRadius: '5px', overflow: 'hidden' }}>
          <div style={{ 
            width: `${animatedConfidence}%`, 
            height: '100%', 
            backgroundColor: current.text,
            transition: 'width 0.8s ease'
          }}></div>
        </div>
      </div>

      {/* Probability Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' }}>
        {Object.entries(probabilities).map(([key, val]) => (
          <div key={key} style={{ 
            backgroundColor: theme.card, 
            border: `1px solid ${key === risk_level ? current.text : theme.border}`, 
            borderRadius: '12px', 
            padding: '20px', 
            textAlign: 'center',
            boxShadow: key === risk_level ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: key === risk_level ? current.text : theme.textPrimary }}>{val}%</div>
            <div style={{ fontSize: '12px', color: theme.textSecondary, marginTop: '4px' }}>{key}</div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div style={{ 
        backgroundColor: theme.bg, 
        borderRadius: '12px', 
        padding: '20px', 
        textAlign: 'center',
        border: `1px dashed ${theme.border}`
      }}>
        <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: theme.textSecondary }}>
          This result has been saved to your history. View your dashboard to track changes over time.
        </p>
        <button 
          onClick={() => navigate('/')}
          style={{
            background: 'transparent',
            color: theme.purple,
            border: `1.5px solid ${theme.purple}`,
            borderRadius: '12px',
            padding: '12px 24px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: '0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = theme.purpleLight}
          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          View Dashboard →
        </button>
      </div>
    </div>
  );
};

export default RiskResult;
