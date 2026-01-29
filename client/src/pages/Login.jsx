import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/auth/login', { email, password });

      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userAuth', 'true');

      alert(`Welcome back, ${user.name}!`);
         
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.msg || "Login fail ho gaya!");
    }
  };

  return (
    <div style={styles.authContainer}>
      <div style={styles.authCard}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Sign in to manage your expenses.</p>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input 
              type="email" 
              placeholder="example@mail.com" 
              style={styles.input} 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              style={styles.input} 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          <button type="submit" style={styles.btn}>Login</button>
        </form>

        <p style={styles.switchText}>
          Don't have an account? <Link to="/signup" style={styles.link}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  authContainer: { 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    width: '100vw', 
    height: '100vh', 
    backgroundColor: '#ffffff',
    margin: 0,
    padding: 0
  },
  authCard: { 
    background: '#ffffff', 
    padding: '40px', 
    borderRadius: '15px', 
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)', 
    width: '90%', 
    maxWidth: '400px', 
    textAlign: 'center',
    border: '1px solid #ddd'
  },
  title: { margin: '0 0 10px 0', color: '#000', fontSize: '28px', fontWeight: 'bold' },
  subtitle: { color: '#666', marginBottom: '30px', fontSize: '14px' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '12px', fontWeight: 'bold', color: '#333', textTransform: 'uppercase' },
  input: { 
    padding: '12px', 
    borderRadius: '8px', 
    border: '1px solid #ccc', 
    outline: 'none', 
    fontSize: '16px',
    backgroundColor: '#fff',
    color: '#000'
  },
  btn: { 
    padding: '14px', 
    background: '#000', 
    color: '#fff', 
    border: 'none', 
    borderRadius: '8px', 
    cursor: 'pointer', 
    fontWeight: 'bold', 

    
    fontSize: '16px',
    marginTop: '10px',
    transition: '0.3s'
  },
  switchText: { marginTop: '20px', fontSize: '14px', color: '#666' },
  link: { color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold' }
};

export default Login;