// This file renders a dismissible warning banner for important health notifications.
import React, { useState } from 'react';

const AlertBanner = ({ message }) => {
  const [visible, setVisible] = useState(true);

  if (!visible || !message) return null;

  return (
    <div style={{
      backgroundColor: '#FAECE7',
      border: '1px solid #D85A30',
      borderRadius: '12px',
      padding: '12px 16px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      color: '#712B13'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Simple CSS Warning Triangle */}
        <div style={{
          width: 0,
          height: 0,
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderBottom: '14px solid #D85A30'
        }}></div>
        <span style={{ fontSize: '14px', fontWeight: '500' }}>{message}</span>
      </div>
      <button 
        onClick={() => setVisible(false)}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '18px',
          color: '#712B13',
          cursor: 'pointer',
          padding: '0 5px'
        }}
      >
        &times;
      </button>
    </div>
  );
};

export default AlertBanner;
