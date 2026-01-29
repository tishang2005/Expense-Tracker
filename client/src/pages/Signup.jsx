import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', 
    email: '', 
    phone: '', 
    dob: '', 
    gender: 'Male', 
    password: '', 
    confirmPassword: ''
  });

  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const onlyNums = value.replace(/[^0-9]/g, '');
      if (onlyNums.length <= 10) {
        setFormData({ ...formData, [name]: onlyNums });
      }
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();

    if (formData.phone.length !== 10) {
      return alert("Bhai, phone number pure 10 digit ka hona chahiye!");
    }

    if (formData.password.length < 6) {
      return alert("Bhai, password kam se kam 6 characters ka rakho!");
    }

    if (formData.password !== formData.confirmPassword) {
      return alert("Bhai, dono password same hone chahiye!");
    }

    try {
      const response = await API.post('/auth/signup', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob,
        gender: formData.gender,
        password: formData.password
      });

      alert(response.data.msg); 
      navigate('/');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Bhai, server se connect nahi ho pa raha!");
    }
  };

  return (
    <div style={styles.authContainer}>
      <div style={styles.authCard}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Fill in your details to get started.</p>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input type="text" name="name" placeholder="John Doe" style={styles.input} required 
              onChange={handleChange} />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input type="email" name="email" placeholder="example@mail.com" style={styles.input} required 
              onChange={handleChange} />
          </div>

          <div style={styles.gridRow}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Phone Number</label>
              <input type="text" name="phone" value={formData.phone} placeholder="9876543210" style={styles.input} required 
                onChange={handleChange} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Date of Birth</label>
              <input 
                type="date" 
                name="dob"
                style={styles.input} 
                required 
                max={today}
                min="1900-01-01"
                onChange={handleChange} 
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Gender</label>
            <div style={styles.radioGroup}>
              <label style={styles.radioLabel}>
                <input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} 
                  onChange={handleChange} /> Male
              </label>
              <label style={styles.radioLabel}>
                <input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} 
                  onChange={handleChange} /> Female
              </label>
            </div>
          </div>

          <div style={styles.gridRow}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input type="password" name="password" placeholder="••••••••" style={styles.input} required 
                onChange={handleChange} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password</label>
              <input type="password" name="confirmPassword" placeholder="••••••••" style={styles.input} required 
                onChange={handleChange} />
            </div>
          </div>

          <button type="submit" style={styles.btn}>Sign Up</button>
        </form>

        <p style={styles.switchText}>
          Already have an account? <Link to="/" style={styles.link}>Login</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  authContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100vw', minHeight: '100vh', backgroundColor: '#ffffff', padding: '40px 0' },
  authCard: { background: '#ffffff', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', width: '90%', maxWidth: '500px', textAlign: 'center', border: '1px solid #ddd' },
  title: { margin: '0 0 10px 0', color: '#000', fontSize: '28px', fontWeight: 'bold' },
  subtitle: { color: '#666', marginBottom: '30px', fontSize: '14px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  gridRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  inputGroup: { textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '12px', fontWeight: 'bold', color: '#333', textTransform: 'uppercase' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none', fontSize: '14px', backgroundColor: '#fff', color: '#000' },
  radioGroup: { display: 'flex', gap: '20px', padding: '5px 0' },
  radioLabel: { fontSize: '14px', color: '#333', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' },
  btn: { padding: '14px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' },
  switchText: { marginTop: '20px', fontSize: '14px', color: '#666' },
  link: { color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold' }
};

export default Signup;