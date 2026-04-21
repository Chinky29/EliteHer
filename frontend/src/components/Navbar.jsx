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
      justifyContent: 'center',
      gap: '10px',
      height: '52px',
      backgroundColor: '#fff',
      borderBottom: '0.5px solid #e8e8e8',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <NavLink to="/" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>
        Log cycle
      </NavLink>
      <NavLink to="/result" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>
        Risk check
      </NavLink>
      <NavLink to="/dashboard" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>
        Dashboard
      </NavLink>
    </nav>
  );
};

export default Navbar;
