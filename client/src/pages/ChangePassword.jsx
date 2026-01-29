import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const ChangePassword = () => {
  const [passwords, setPasswords] = useState({ 
    oldPassword: '', 
    newPassword: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      return alert("Bhai, naya password aur confirm password match nahi ho rahe!");
    }

    if (passwords.newPassword.length < 6) {
      return alert("Bhai, naya password kam se kam 6 characters ka hona chahiye!");
    }

    try {
      await API.put('/auth/change-password', {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword
      });
      
      alert("Bhai, password badal gaya! Naye password se login karo.");
      localStorage.removeItem('token');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.msg || "Password update fail ho gaya!");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}>Change Password</h2>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>Old Password</label>
          <input 
            type="password" 
            placeholder="Enter old password" 
            style={styles.input}
            onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})} 
            required 
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>New Password</label>
          <input 
            type="password" 
            placeholder="Enter new password" 
            style={styles.input}
            onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} 
            required 
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Confirm New Password</label>
          <input 
            type="password" 
            placeholder="Confirm new password" 
            style={styles.input}
            onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})} 
            required 
          />
        </div>

        <button type="submit" style={styles.button}>Update Password</button>
        <button type="button" onClick={() => navigate('/edit-profile')} style={styles.cancelBtn}>Cancel</button>
      </form>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f4f7f6' },
  card: { background: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '15px', width: '360px' },
  title: { textAlign: 'center', color: '#2c3e50', marginBottom: '10px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '13px', fontWeight: 'bold', color: '#34495e', textAlign: 'left' },
  input: { 
    padding: '12px', 
    borderRadius: '8px', 
    border: '1px solid #dcdde1', 
    fontSize: '15px',
    backgroundColor: '#ffffff',
    color: '#000000',
    outline: 'none',
    WebkitBoxShadow: '0 0 0px 1000px white inset',
    boxShadow: '0 0 0px 1000px white inset'
  },

  button: { padding: '12px', background: '#3498db', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' },
  cancelBtn: { padding: '10px', background: 'transparent', color: '#7f8c8d', border: 'none', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline' }
};

export default ChangePassword;