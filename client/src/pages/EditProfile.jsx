import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', dob: '', gender: 'Male'
  });

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get('/auth/profile');
        if (res.data.dob) res.data.dob = res.data.dob.split('T')[0];
        setFormData(res.data);
      } catch (err) {
        console.error("Profile load fail:", err);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const onlyNums = value.replace(/[^0-9]/g, '');
      if (onlyNums.length <= 10) setFormData({ ...formData, [name]: onlyNums });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.phone.length !== 10) return alert("Phone number 10 digit ka hona chaiye!");
    
    try {
      await API.put('/auth/profile', formData);
      alert("Profile updated!");
      navigate('/dashboard');
    } catch (err) {
      alert("Update fail ho gaya!");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Edit Profile</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} style={styles.input} required />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone Number</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={styles.input} required />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Date of Birth</label>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} style={styles.input} max={today} min="1900-01-01" required />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} style={styles.input}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <Link to="/change-password" style={styles.passLink}>🔐 Change Password?</Link>

          <div style={styles.btnGroup}>
            <button type="button" onClick={() => navigate('/dashboard')} style={styles.cancelBtn}>Cancel</button>
            <button type="submit" style={styles.saveBtn}>Update Profile</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f4f7f6' },
  card: { backgroundColor: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '400px' },
  title: { textAlign: 'center', marginBottom: '20px', color: '#2c3e50' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '14px', fontWeight: 'bold', color: '#34495e', textAlign: 'left' },
  
  input: { 
    padding: '10px', 
    borderRadius: '8px', 
    border: '1px solid #dcdde1', 
    fontSize: '16px',
    backgroundColor: '#ffffff',
    color: '#000000',
    outline: 'none',
    WebkitBoxShadow: '0 0 0px 1000px white inset',
    boxShadow: '0 0 0px 1000px white inset',
    WebkitTextFillColor: '#000000'
  },

  passLink: { fontSize: '14px', color: '#3498db', textDecoration: 'none', textAlign: 'right', fontWeight: 'bold' },
  btnGroup: { display: 'flex', gap: '10px', marginTop: '10px' },
  cancelBtn: { flex: 1, padding: '10px', background: '#eee', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#333' },
  saveBtn: { flex: 2, padding: '10px', background: '#3498db', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
};

export default EditProfile;