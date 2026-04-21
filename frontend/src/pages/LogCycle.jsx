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

  const inputGroupStyle = { marginBottom: '15px' };
  const labelStyle = { display: 'block', fontSize: '14px', marginBottom: '5px', color: '#555', fontWeight: '500' };
  const inputStyle = { width: '100%', padding: '10px 12px', border: '0.5px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '0.5px solid #e8e8e8', padding: '24px' }}>
        <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>Log Your Cycle</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Period start date</label>
            <input type="date" name="start_date" required style={inputStyle} onChange={handleChange} />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Period end date</label>
            <input type="date" name="end_date" required style={inputStyle} onChange={handleChange} />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Previous start date — <span style={{ fontWeight: 'normal', color: '#888' }}>helps predict your next cycle</span></label>
            <input type="date" name="prev_start" style={inputStyle} onChange={handleChange} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Flow (1=light, 4=heavy)</label>
              <input type="number" name="flow_intensity" min="1" max="4" style={inputStyle} onChange={handleChange} value={formData.flow_intensity} />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Age</label>
              <input type="number" name="age" required style={inputStyle} onChange={handleChange} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Acne score (0-10)</label>
              <input type="number" name="acne_score" min="0" max="10" style={inputStyle} onChange={handleChange} value={formData.acne_score} />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Stress level (0-10)</label>
              <input type="number" name="stress_level" min="0" max="10" style={inputStyle} onChange={handleChange} value={formData.stress_level} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Mood swings (0-10)</label>
              <input type="number" name="mood_swings" min="0" max="10" style={inputStyle} onChange={handleChange} value={formData.mood_swings} />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Hair loss (0-5)</label>
              <input type="number" name="hair_loss" min="0" max="5" style={inputStyle} onChange={handleChange} value={formData.hair_loss} />
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Weight gain in kg (last 6 months)</label>
            <input type="number" name="weight_gain" min="0" max="15" step="0.1" style={inputStyle} onChange={handleChange} value={formData.weight_gain} />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              background: '#7F77DD',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '15px',
              fontWeight: '600',
              width: '100%',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '10px',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Processing...' : 'Save & check risk →'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogCycle;
