// This file displays a dashboard with health insights, trends, and historical cycle data.
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getCycles, getInsights } from '../api/api';
import AlertBanner from '../components/AlertBanner';
import { theme } from '../styles/theme';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ cycles: [], insights: null });

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
      <div style={{ padding: '100px 20px', textAlign: 'center', color: theme.textSecondary }}>
        Loading health dashboard...
      </div>
    );
  }

  const { cycles, insights } = data;
  
  // Prepare chart data
  const lineData = insights?.cycle_lengths.map((len, idx) => ({
    date: insights.start_dates[idx].split('-').slice(1).join('/'), // Month/Day
    length: len
  })) || [];

  const barData = insights ? [
    { name: 'Acne', score: insights.avg_acne, fill: theme.purple },
    { name: 'Stress', score: insights.avg_stress, fill: theme.teal },
    { name: 'Mood Swings', score: insights.avg_mood, fill: theme.amber }
  ] : [];

  const cardStyle = {
    backgroundColor: theme.card,
    borderRadius: '12px',
    padding: '20px',
    boxShadow: theme.shadow,
    marginBottom: '24px',
    border: `1px solid ${theme.border}`,
  };

  const statCardStyle = (color, delay) => ({
    ...cardStyle,
    flex: 1,
    padding: '20px',
    borderLeft: `4px solid ${color}`,
    marginBottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    animation: `fadeUp 0.35s ease ${delay}s forwards`,
    opacity: 0,
  });

  const labelStyle = {
    fontSize: '11px',
    fontWeight: '600',
    color: theme.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '8px',
  };

  const valueStyle = (color) => ({
    fontSize: '32px',
    fontWeight: '600',
    color: color,
    margin: 0,
  });

  return (
    <div className="animate-fade-up">
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '600', color: theme.textPrimary, margin: '0 0 8px 0' }}>Your Health Dashboard</h1>
          <p style={{ fontSize: '14px', color: theme.textSecondary, margin: 0 }}>Overview of your menstrual cycles and symptoms over time.</p>
        </div>
        <div style={{ 
          backgroundColor: theme.purpleLight, 
          color: theme.purple, 
          padding: '4px 12px', 
          borderRadius: '20px', 
          fontSize: '12px', 
          fontWeight: '600' 
        }}>
          Last updated: today
        </div>
      </div>

      {/* Notifications */}
      {insights?.notification && <AlertBanner message={insights.notification} />}

      {/* Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={statCardStyle(theme.purple, 0)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth="2" style={{ marginBottom: '12px' }}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <div style={labelStyle}>Total Cycles</div>
          <div style={valueStyle(theme.purple)}>{cycles.length}</div>
        </div>
        <div style={statCardStyle(theme.teal, 0.08)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth="2" style={{ marginBottom: '12px' }}>
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <div style={labelStyle}>Avg Length</div>
          <div style={valueStyle(theme.teal)}>{insights?.avg_cycle_length || 0}d</div>
        </div>
        <div style={statCardStyle(theme.amber, 0.16)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.textSecondary} strokeWidth="2" style={{ marginBottom: '12px' }}>
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
          <div style={labelStyle}>Variation</div>
          <div style={valueStyle(theme.amber)}>{insights?.variation || 0}d</div>
        </div>
      </div>

      {/* Cycle Length Trend Chart */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: theme.textPrimary }}>Cycle Length Trend</h3>
          <span style={{ fontSize: '12px', color: theme.textSecondary }}>Last 12 cycles</span>
        </div>
        <div style={{ width: '100%', height: '240px' }}>
          {lineData.length > 0 ? (
            <ResponsiveContainer>
              <AreaChart data={lineData}>
                <defs>
                  <linearGradient id="colorLen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.purple} stopOpacity={0.1}/>
                    <stop offset="95%" stopColor={theme.purple} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" fontSize={11} tick={{ fill: theme.textSecondary }} axisLine={false} tickLine={false} />
                <YAxis domain={[20, 60]} fontSize={11} tick={{ fill: theme.textSecondary }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: `1px solid ${theme.purple}`, 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    fontSize: '12px'
                  }}
                  itemStyle={{ fontWeight: '600', color: theme.purple }}
                />
                <Area 
                  type="monotone" 
                  dataKey="length" 
                  stroke={theme.purple} 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#colorLen)" 
                  dot={{ fill: '#FFFFFF', stroke: theme.purple, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: theme.purpleLight, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={theme.purple} strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                </svg>
              </div>
              <p style={{ color: theme.textSecondary, fontSize: '14px' }}>Log your first cycle to see trends</p>
            </div>
          )}
        </div>
      </div>

      {/* Symptom Overview Chart */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 24px 0', fontSize: '16px', fontWeight: '600', color: theme.textPrimary }}>Symptom Overview</h3>
        <div style={{ width: '100%', height: '220px' }}>
          <ResponsiveContainer>
            <BarChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" fontSize={12} tick={{ fill: theme.textSecondary }} axisLine={false} tickLine={false} />
              <YAxis fontSize={11} tick={{ fill: theme.textSecondary }} domain={[0, 10]} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{ fill: '#f8f8f8' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="score" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent History Table */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600', color: theme.textPrimary }}>Recent History</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: theme.bg }}>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: theme.textSecondary, fontWeight: '500', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Start Date</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: theme.textSecondary, fontWeight: '500', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Length</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: theme.textSecondary, fontWeight: '500', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Flow</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: theme.textSecondary, fontWeight: '500', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Acne</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: theme.textSecondary, fontWeight: '500', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Stress</th>
              </tr>
            </thead>
            <tbody>
              {cycles.map((c, i) => (
                <tr key={i} className="table-row-hover" style={{ 
                  borderBottom: i === cycles.length - 1 ? 'none' : '1px solid #f9f9f9',
                  transition: '0.15s'
                }}>
                  <td style={{ padding: '14px 16px', fontWeight: '600', color: theme.textPrimary }}>{c.start_date}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ 
                      backgroundColor: theme.purpleLight, 
                      color: theme.purple, 
                      padding: '2px 8px', 
                      borderRadius: '12px', 
                      fontSize: '11px', 
                      fontWeight: '600'
                    }}>{c.cycle_length}d</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '3px' }}>
                      {[1, 2, 3, 4].map(dot => (
                        <div key={dot} style={{ 
                          width: '6px', 
                          height: '6px', 
                          borderRadius: '50%', 
                          backgroundColor: dot <= c.flow_intensity ? theme.purple : theme.border 
                        }}></div>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: theme.textSecondary }}>{c.acne_score}/10</td>
                  <td style={{ padding: '14px 16px', color: theme.textSecondary }}>{c.stress_level}/10</td>
                </tr>
              ))}
            </tbody>
          </table>
          {cycles.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ color: theme.textSecondary, marginBottom: '20px' }}>No cycles logged yet.</p>
              <button 
                onClick={() => navigate('/log')}
                style={{
                  background: theme.purple,
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(127, 119, 221, 0.2)'
                }}
              >
                Track your first period →
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .table-row-hover:hover {
          background-color: ${theme.bg};
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
