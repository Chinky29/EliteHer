// This file renders a form for users to log their period cycle and symptom data.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { logCycle, predictRisk, getCycles } from '../api/api';
import { theme } from '../styles/theme';

const LogCycle = ({ form, setForm, setRiskResult, setCycleHistory, setInsights }) => {
  const navigate = useNavigate();
  
  // useState is only used for the local loading status
  const [loading, setLoading] = useState(false);

  // The form handler updates the shared state from App.jsx
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // The submit function handles the "Save & check risk" button click.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Log the cycle data
      await logCycle(form);

      // 2. Prepare data for ML prediction
      let cycleLength = 28;
      if (form.prev_start && form.start_date) {
        const d1 = new Date(form.prev_start);
        const d2 = new Date(form.start_date);
        cycleLength = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
      }
      
      const gapVariation = Math.abs(cycleLength - 28);

      const predData = {
        cycle_length: cycleLength,
        gap_variation: gapVariation,
        flow_intensity: parseInt(form.flow_intensity),
        acne_score: parseInt(form.acne_score),
        stress_level: parseInt(form.stress_level),
        weight_gain: parseFloat(form.weight_gain),
        mood_swings: parseInt(form.mood_swings),
        hair_loss: parseInt(form.hair_loss),
        age: parseInt(form.age)
      };

      // 3. Get prediction from ML model
      const res = await predictRisk(predData);
      
      // Save result to global state
      setRiskResult(res.data);

      // Refresh cycle history for Dashboard
      const historyRes = await getCycles();
      setCycleHistory(historyRes.data.cycles || []);

      // Clear cached insights to force refresh on next visit
      setInsights(null);
      
      toast.success('Cycle logged!');
      
      // Navigate to results page
      navigate('/result');
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.error || 'Something went wrong — check your database connection.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const sectionLabelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '13px',
    fontWeight: '500',
    color: theme.purple,
    margin: '0 0 20px 0',
  };

  const labelStyle = { 
    display: 'block', 
    fontSize: '11px', 
    marginBottom: '8px', 
    color: theme.textSecondary, 
    fontWeight: '600', 
    textTransform: 'uppercase', 
    letterSpacing: '0.05em' 
  };

  const inputStyle = { 
    width: '100%', 
    padding: '10px 14px', 
    border: `1px solid ${theme.border}`, 
    borderRadius: '8px', 
    fontSize: '15px', 
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'all 0.2s',
  };

  const helperStyle = {
    display: 'block',
    fontSize: '11px',
    color: '#999',
    marginTop: '4px'
  };

  return (
    <div className="animate-fade-up">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '600', color: theme.textPrimary, margin: '0 0 8px 0' }}>Log New Cycle</h1>
        <p style={{ fontSize: '14px', color: theme.textSecondary, margin: 0 }}>Keep track of your symptoms for more accurate PCOD risk predictions.</p>
      </div>

      <div style={{ 
        backgroundColor: theme.card, 
        borderRadius: '16px', 
        padding: '28px', 
        boxShadow: theme.shadow,
        border: `1px solid ${theme.border}`
      }}>
        <form onSubmit={handleSubmit}>
          {/* Section 1: Cycle Dates */}
          <div style={sectionLabelStyle}>
            <span>CYCLE DATES</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: theme.border }}></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Start Date</label>
              <input 
                type="date" 
                name="start_date" 
                required 
                value={form.start_date}
                style={inputStyle} 
                onChange={handleChange}
                className="custom-input"
              />
            </div>
            <div>
              <label style={labelStyle}>End Date</label>
              <input 
                type="date" 
                name="end_date" 
                required 
                value={form.end_date}
                style={inputStyle} 
                onChange={handleChange}
                className="custom-input"
              />
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={labelStyle}>Previous Period Start</label>
            <input 
              type="date" 
              name="prev_start" 
              value={form.prev_start}
              style={inputStyle} 
              onChange={handleChange}
              className="custom-input"
            />
            <span style={helperStyle}>Required to calculate your cycle length and gap variation</span>
          </div>

          {/* Section 2: Symptom Tracking */}
          <div style={sectionLabelStyle}>
            <span>SYMPTOM TRACKING</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: theme.border }}></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Flow Intensity</label>
              <input 
                type="number" 
                name="flow_intensity" 
                min="1" 
                max="4" 
                style={inputStyle} 
                onChange={handleChange} 
                value={form.flow_intensity}
                className="custom-input"
              />
              <span style={helperStyle}>1=light, 4=very heavy</span>
            </div>
            <div>
              <label style={labelStyle}>Your Age</label>
              <input 
                type="number" 
                name="age" 
                required 
                value={form.age}
                style={inputStyle} 
                onChange={handleChange}
                className="custom-input"
              />
              <span style={helperStyle}>Your current age</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Acne Score</label>
              <input 
                type="number" 
                name="acne_score" 
                min="0" 
                max="10" 
                style={inputStyle} 
                onChange={handleChange} 
                value={form.acne_score}
                className="custom-input"
              />
              <span style={helperStyle}>0=none, 10=severe</span>
            </div>
            <div>
              <label style={labelStyle}>Stress Level</label>
              <input 
                type="number" 
                name="stress_level" 
                min="0" 
                max="10" 
                style={inputStyle} 
                onChange={handleChange} 
                value={form.stress_level}
                className="custom-input"
              />
              <span style={helperStyle}>0=none, 10=extreme</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Mood Swings</label>
              <input 
                type="number" 
                name="mood_swings" 
                min="0" 
                max="10" 
                style={inputStyle} 
                onChange={handleChange} 
                value={form.mood_swings}
                className="custom-input"
              />
              <span style={helperStyle}>0=none, 10=severe</span>
            </div>
            <div>
              <label style={labelStyle}>Hair Loss</label>
              <input 
                type="number" 
                name="hair_loss" 
                min="0" 
                max="5" 
                style={inputStyle} 
                onChange={handleChange} 
                value={form.hair_loss}
                className="custom-input"
              />
              <span style={helperStyle}>0=none, 5=severe</span>
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={labelStyle}>Weight Gain (kg)</label>
            <input 
              type="number" 
              name="weight_gain" 
              min="0" 
              max="15" 
              step="0.1" 
              style={inputStyle} 
              onChange={handleChange} 
              value={form.weight_gain}
              className="custom-input"
            />
            <span style={helperStyle}>Total weight gain in the last 6 months</span>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="submit-button"
            style={{
              width: '100%',
              height: '52px',
              background: `linear-gradient(135deg, ${theme.purple} 0%, ${theme.purpleDark} 100%)`,
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(127, 119, 221, 0.3)',
            }}
          >
            {loading && (
              <div className="spinner"></div>
            )}
            {loading ? 'Analyzing...' : 'Save & Check PCOD Risk →'}
          </button>
        </form>
      </div>

      <style>{`
        .custom-input:focus {
          border-color: ${theme.purple} !important;
          box-shadow: 0 0 0 3px rgba(127, 119, 221, 0.15) !important;
        }
        .submit-button:hover:not(:disabled) {
          transform: translateY(-1px) scale(1.01);
          filter: brightness(1.1);
        }
        .submit-button:active:not(:disabled) {
          transform: translateY(0) scale(1);
        }
        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LogCycle;
