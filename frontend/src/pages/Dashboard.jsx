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
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', margin: '0 0 8px 0' }}>Your Health Dashboard</h1>
        <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>Overview of your menstrual cycles and symptoms over time.</p>
      </div>

      {/* Notifications */}
      {insights?.notification && (
        <div style={{ marginBottom: '24px' }}>
          <AlertBanner message={insights.notification} />
        </div>
      )}

      {/* Stats Overview */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <div style={{ ...statCardStyle, backgroundColor: '#EEEDFE' }}>
          <div style={{ fontSize: '12px', color: '#7F77DD', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase' }}>Total Cycles</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#333' }}>{cycles.length}</div>
        </div>
        <div style={{ ...statCardStyle, backgroundColor: '#E1F5EE' }}>
          <div style={{ fontSize: '12px', color: '#1D9E75', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase' }}>Avg Length</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#333' }}>{insights?.avg_cycle_length || 0}d</div>
        </div>
        <div style={{ ...statCardStyle, backgroundColor: '#FAEEDA' }}>
          <div style={{ fontSize: '12px', color: '#BA7517', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase' }}>Variation</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#333' }}>{insights?.variation || 0}d</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        {/* Line Chart */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#333' }}>Cycle Length Trend</h3>
            <span style={{ fontSize: '12px', color: '#888' }}>Last 12 cycles</span>
          </div>
          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" fontSize={11} tick={{ fill: '#888' }} axisLine={false} tickLine={false} />
                <YAxis fontSize={11} tick={{ fill: '#888' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: '600' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="length" 
                  stroke="#7F77DD" 
                  strokeWidth={3} 
                  dot={{ fill: '#7F77DD', strokeWidth: 2, stroke: '#fff', r: 5 }} 
                  activeDot={{ r: 7, strokeWidth: 0 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '16px', fontWeight: '600', color: '#333' }}>Symptom Severity Analysis</h3>
          <div style={{ width: '100%', height: '220px' }}>
            <ResponsiveContainer>
              <BarChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" fontSize={12} tick={{ fill: '#888' }} axisLine={false} tickLine={false} />
                <YAxis fontSize={11} tick={{ fill: '#888' }} domain={[0, 10]} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f8f8f8' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="score" fill="#5DCAA5" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Cycle History Table */}
      <div style={{ ...cardStyle, marginTop: '24px' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600', color: '#333' }}>Recent History</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                <th style={{ textAlign: 'left', padding: '12px 8px', color: '#888', fontWeight: '500' }}>Start Date</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', color: '#888', fontWeight: '500' }}>Length</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', color: '#888', fontWeight: '500' }}>Flow</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', color: '#888', fontWeight: '500' }}>Acne</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', color: '#888', fontWeight: '500' }}>Stress</th>
              </tr>
            </thead>
            <tbody>
              {cycles.map((c, i) => (
                <tr key={i} style={{ borderBottom: i === cycles.length - 1 ? 'none' : '1px solid #f9f9f9' }}>
                  <td style={{ padding: '14px 8px', fontWeight: '600', color: '#333' }}>{c.start_date}</td>
                  <td style={{ padding: '14px 8px', color: '#555' }}>{c.cycle_length} days</td>
                  <td style={{ padding: '14px 8px' }}>
                    <span style={{ 
                      backgroundColor: '#f5f5f5', 
                      padding: '2px 8px', 
                      borderRadius: '12px', 
                      fontSize: '11px', 
                      color: '#666' 
                    }}>Level {c.flow_intensity}</span>
                  </td>
                  <td style={{ padding: '14px 8px', color: '#555' }}>{c.acne_score}/10</td>
                  <td style={{ padding: '14px 8px', color: '#555' }}>{c.stress_level}/10</td>
                </tr>
              ))}
            </tbody>
          </table>
          {cycles.length === 0 && (
            <div style={{ textAlign: 'center', color: '#999', padding: '40px 20px' }}>
              No cycles logged yet. Start by tracking your first period.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
