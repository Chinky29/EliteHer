// This file renders the top navigation bar with links to different pages.
import React from 'react';
import { NavLink } from 'react-router-dom';
import { theme } from '../styles/theme';

const Navbar = () => {
  const linkStyle = {
    textDecoration: 'none',
    color: theme.textSecondary,
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
    transition: '0.2s',
  };

  const activeStyle = {
    backgroundColor: theme.purple,
    color: '#FFFFFF',
  };

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      height: '56px',
      backgroundColor: '#FFFFFF',
      boxShadow: '0 1px 0 #E8E6FF',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}>
      {/* Left side: Logo */}
      <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <div style={{ 
          width: '32px', 
          height: '32px', 
          borderRadius: '50%', 
          backgroundColor: theme.purple,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          fontWeight: 'bold',
          fontSize: '18px'
        }}>
          E
        </div>
        <span style={{ 
          fontSize: '18px', 
          fontWeight: '700', 
          color: theme.purple 
        }}>
          EliteHer
        </span>
      </NavLink>

      {/* Right side: Nav links */}
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
