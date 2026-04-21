// This file renders a form for users to log their period cycle and symptom data.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { logCycle, predictRisk } from '../api/api';

const LogCycle = () => {
  const navigate = useNavigate();
  
  // useState is a React Hook that lets you add state to functional components.
  // Here we use it to store the form data and a loading status.
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    prev_start: '',
    flow_intensity: 2,
    acne_score: 0,
    stress_level: 0,
    mood_swings: 0,
    weight_gain: 0,
    hair_loss: 0,
    age: ''
  });

  // The form handler updates the formData state whenever a user types in an input field.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // The submit function handles the "Save & check risk" button click.
  // It sends data to the backend and navigates to the results page.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Log the cycle data
      await logCycle(formData);

      // 2. Prepare data for ML prediction
      // Calculate cycle_length and gap_variation for the ML model
      let cycleLength = 28;
      if (formData.prev_start && formData.start_date) {
        const d1 = new Date(formData.prev_start);
        const d2 = new Date(formData.start_date);
        cycleLength = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
      }
      
      const gapVariation = Math.abs(cycleLength - 28);

      const predData = {
        cycle_length: cycleLength,
        gap_variation: gapVariation,
        flow_intensity: parseInt(formData.flow_intensity),
        acne_score: parseInt(formData.acne_score),
        stress_level: parseInt(formData.stress_level),
        weight_gain: parseFloat(formData.weight_gain),
        mood_swings: parseInt(formData.mood_swings),
        hair_loss: parseInt(formData.hair_loss),
        age: parseInt(formData.age)
      };

      // 3. Get prediction from ML model
      const res = await predictRisk(predData);
      
      toast.success('Cycle logged!');
      
      // Navigate to results page passing the prediction data
      navigate('/result', { state: { result: res.data } });
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong — is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const inputGroupStyle = { marginBottom: '20px' };
  const labelStyle = { display: 'block', fontSize: '13px', marginBottom: '8px', color: '#666', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' };
  const inputStyle = { width: '100%', padding: '12px 14px', border: '1px solid #eee', borderRadius: '10px', fontSize: '15px', boxSizing: 'border-box', backgroundColor: '#fcfcfc', transition: '0.2s' };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', margin: '0 0 8px 0' }}>Log New Cycle</h1>
        <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>Keep track of your symptoms to get more accurate risk predictions.</p>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '0.5px solid #e8e8e8', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div style={{ marginBottom: 0 }}>
              <label style={labelStyle}>Start Date</label>
              <input type="date" name="start_date" required style={inputStyle} onChange={handleChange} />
            </div>
            <div style={{ marginBottom: 0 }}>
              <label style={labelStyle}>End Date</label>
              <input type="date" name="end_date" required style={inputStyle} onChange={handleChange} />
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Previous Period Start — <span style={{ fontWeight: 'normal', color: '#999', textTransform: 'none' }}>Required for gap calculation</span></label>
            <input type="date" name="prev_start" style={inputStyle} onChange={handleChange} />
          </div>

          <div style={{ height: '1px', backgroundColor: '#f0f0f0', margin: '32px 0' }}></div>
          <h4 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '16px' }}>Symptom Tracking</h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Flow Intensity (1-4)</label>
              <input type="number" name="flow_intensity" min="1" max="4" style={inputStyle} onChange={handleChange} value={formData.flow_intensity} />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Your Age</label>
              <input type="number" name="age" required style={inputStyle} onChange={handleChange} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Acne Score (0-10)</label>
              <input type="number" name="acne_score" min="0" max="10" style={inputStyle} onChange={handleChange} value={formData.acne_score} />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Stress Level (0-10)</label>
              <input type="number" name="stress_level" min="0" max="10" style={inputStyle} onChange={handleChange} value={formData.stress_level} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Mood Swings (0-10)</label>
              <input type="number" name="mood_swings" min="0" max="10" style={inputStyle} onChange={handleChange} value={formData.mood_swings} />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Hair Loss (0-5)</label>
              <input type="number" name="hair_loss" min="0" max="5" style={inputStyle} onChange={handleChange} value={formData.hair_loss} />
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Weight Gain (Last 6 months in kg)</label>
            <input type="number" name="weight_gain" min="0" max="15" step="0.1" style={inputStyle} onChange={handleChange} value={formData.weight_gain} />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              background: '#7F77DD',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '16px',
              fontWeight: 'bold',
              width: '100%',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '16px',
              boxShadow: '0 4px 12px rgba(127, 119, 221, 0.3)',
              transition: '0.2s'
            }}
          >
            {loading ? 'Analyzing data...' : 'Save & Check PCOD Risk →'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogCycle;
