// This file renders the top navigation bar with links to different pages.
import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const linkStyle = {
    textDecoration: 'none',
    color: '#666',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
    transition: '0.2s'
  };

  const activeStyle = {
    backgroundColor: '#EEEDFE',
    color: '#7F77DD'
  };

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      height: '64px',
      backgroundColor: '#fff',
      borderBottom: '0.5px solid #e8e8e8',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ 
        fontSize: '20px', 
        fontWeight: 'bold', 
        color: '#7F77DD',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#7F77DD' }}></div>
        EliteHer
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <NavLink to="/" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>
          Dashboard
        </NavLink>
        <NavLink to="/log" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>
          Log cycle
        </NavLink>
        <NavLink to="/result" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>
          Risk check
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
