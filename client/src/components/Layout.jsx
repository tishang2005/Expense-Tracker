import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div style={{ 
      display: 'flex', 
      width: '100vw', 
      height: '100vh', 
      overflow: 'hidden',
      backgroundColor: '#ffffff'
    }}>
      <Sidebar />

      <div style={{ 
        marginLeft: '70px',
        flex: 1, 
        padding: '30px', 
        backgroundColor: '#ffffff',
        height: '100vh', 
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 'calc(100vw - 70px)',
        overflowX: 'hidden',
        overflowY: 'auto',
        color: '#000000'
      }}>
        <Outlet /> 
      </div>
    </div>
  );
};

export default Layout;