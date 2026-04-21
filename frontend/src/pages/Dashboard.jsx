// This file displays a dashboard with health insights, trends, and historical cycle data.
import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getCycles, getInsights } from '../api/api';
import AlertBanner from '../components/AlertBanner';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ cycles: [], insights: null });

  // useEffect is a hook that runs code after the component renders.
  // Promise.all allows us to run multiple asynchronous requests in parallel.
  // We use them together to fetch all necessary data when the dashboard loads.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cyclesRes, insightsRes] = await Promise.all([
          getCycles(),
          getInsights()
        ]);
        setData({
          cycles: cyclesRes.data.cycles,
          insights: insightsRes.data
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center', color: '#888' }}>
        Loading health dashboard...
      </div>
    );
  }

  const { cycles, insights } = data;
  
  // Prepare chart data
  const lineData = insights?.cycle_lengths.map((len, idx) => ({
    date: insights.start_dates[idx],
    length: len
  })) || [];

  const barData = insights ? [
    { name: 'Acne', score: insights.avg_acne },
    { name: 'Stress', score: insights.avg_stress },
    { name: 'Mood', score: insights.avg_mood }
  ] : [];

  const cardStyle = {
    backgroundColor: '#fff',
    border: '0.5px solid #e8e8e8',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px'
  };

  const statCardStyle = {
    ...cardStyle,
    flex: 1,
    textAlign: 'center',
    marginBottom: 0
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Notifications */}
      {insights?.notification && <AlertBanner message={insights.notification} />}

      {/* Stats Overview */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <div style={statCardStyle}>
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>Total Cycles</div>
          <div style={{ fontSize: '20px', fontWeight: '600' }}>{cycles.length}</div>
        </div>
        <div style={statCardStyle}>
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>Avg Length</div>
          <div style={{ fontSize: '20px', fontWeight: '600' }}>{insights?.avg_cycle_length || 0}d</div>
        </div>
        <div style={statCardStyle}>
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>Variation</div>
          <div style={{ fontSize: '20px', fontWeight: '600' }}>{insights?.variation || 0}d</div>
        </div>
      </div>

      {/* Line Chart */}
      <div style={cardStyle}>
        <h3 style={{ marginTop: 0, fontSize: '16px', color: '#333', marginBottom: '15px' }}>Cycle length trend</h3>
        <div style={{ width: '100%', height: '220px' }}>
          <ResponsiveContainer>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="date" fontSize={10} tick={{ fill: '#888' }} />
              <YAxis fontSize={10} tick={{ fill: '#888' }} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="length" 
                stroke="#7F77DD" 
                strokeWidth={2} 
                dot={{ fill: '#7F77DD', r: 4 }} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart */}
      <div style={cardStyle}>
        <h3 style={{ marginTop: 0, fontSize: '16px', color: '#333', marginBottom: '15px' }}>Average symptom scores</h3>
        <div style={{ width: '100%', height: '200px' }}>
          <ResponsiveContainer>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" fontSize={12} tick={{ fill: '#888' }} />
              <YAxis fontSize={10} tick={{ fill: '#888' }} domain={[0, 10]} />
              <Tooltip />
              <Bar dataKey="score" fill="#5DCAA5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cycle History */}
      <div style={cardStyle}>
        <h3 style={{ marginTop: 0, fontSize: '16px', color: '#333', marginBottom: '15px' }}>Cycle history</h3>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {cycles.map((c, i) => (
            <div key={i} style={{ 
              display: 'grid', 
              gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr', 
              padding: '12px 0', 
              borderBottom: i === cycles.length - 1 ? 'none' : '0.5px solid #f0f0f0',
              fontSize: '13px'
            }}>
              <div style={{ fontWeight: '600' }}>{c.start_date}</div>
              <div>{c.cycle_length} days</div>
              <div style={{ color: '#888' }}>F: {c.flow_intensity}</div>
              <div style={{ color: '#888' }}>A: {c.acne_score}</div>
              <div style={{ color: '#888' }}>S: {c.stress_level}</div>
            </div>
          ))}
          {cycles.length === 0 && <div style={{ textAlign: 'center', color: '#888', padding: '20px' }}>No cycles logged yet.</div>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
