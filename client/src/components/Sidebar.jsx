import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const userName = localStorage.getItem('userName') || 'wvsv';
  
  const userDP = "data:image/png;base64,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"
  const sidebarWidth = isExpanded ? '250px' : '75px';

  return (
    <div 
      style={{ ...styles.sidebar, width: sidebarWidth }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div style={styles.profileSection} onClick={() => navigate('/edit-profile')}>
        <div style={styles.avatarWrapper}>
          <img 
            src={userDP} 
            alt="Profile" 
            style={{
              ...styles.dpImage,
              width: isExpanded ? '65px' : '45px',
              height: isExpanded ? '65px' : '45px'
            }} 
          />
        </div>
        {isExpanded && (
          <div style={styles.userInfo}>
            <h3 style={styles.userNameText}>{userName}</h3>
          </div>
        )}
      </div>

      <hr style={styles.divider} />

      <nav style={styles.nav}>
        {[
          { name: 'Dashboard', path: '/dashboard', icon: '📊' },
          { name: 'Budget', path: '/budget', icon: '💰' },
          { name: 'Transactions', path: '/transactions', icon: '📜' },
        ].map((item) => (
          <button 
            key={item.name}
            onClick={() => navigate(item.path)} 
            style={{
              ...styles.navBtn,
              backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent'
            }}
          >
            <span style={styles.icon}>{item.icon}</span> 
            {isExpanded && <span style={styles.linkText}>{item.name}</span>}
          </button>
        ))}
      </nav>

      <button 
        onClick={() => { localStorage.clear(); navigate('/'); }} 
        style={styles.logoutBtn}
      >
        <span style={styles.icon}>⭕</span> 
        {isExpanded && <span style={styles.linkText}>Logout</span>}
      </button>
    </div>
  );
};

const styles = {
  sidebar: { 
    height: '100vh', 
    backgroundColor: '#1a252f', 
    color: '#fff', 
    display: 'flex', 
    flexDirection: 'column', 
    position: 'fixed', 
    left: 0, 
    top: 0, 
    transition: 'width 0.3s ease', 
    overflow: 'hidden', 
    zIndex: 1000 
  },
  profileSection: { 
    padding: '25px 0', 
    textAlign: 'center', 
    cursor: 'pointer', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  avatarWrapper: {
    padding: '2px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dpImage: { 
    borderRadius: '50%', 
    objectFit: 'cover', 
    transition: 'all 0.3s' 
  },
  userInfo: { marginTop: '10px' },
  userNameText: { fontSize: '16px', fontWeight: 'bold', margin: '0', whiteSpace: 'nowrap', color: '#fff' },
  divider: { border: 'none', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', width: '100%', margin: 0 },
  nav: { flexGrow: 1, marginTop: '20px' },
  navBtn: { 
    width: '100%', 
    padding: '15px 20px', 
    backgroundColor: 'transparent', 
    color: '#ecf0f1', 
    border: 'none', 
    textAlign: 'left', 
    cursor: 'pointer', 
    display: 'flex', 
    alignItems: 'center',
    gap: '15px'
  },
  icon: { fontSize: '20px', minWidth: '30px', textAlign: 'center' },
  linkText: { fontSize: '16px', whiteSpace: 'nowrap' },
  logoutBtn: { 
    padding: '20px', 
    backgroundColor: '#c0392b', 
    color: '#fff', 
    border: 'none', 
    cursor: 'pointer', 
    display: 'flex', 
    alignItems: 'center',
    gap: '15px'
  }
};

export default Sidebar;