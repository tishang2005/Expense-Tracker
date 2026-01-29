import React, { useState, useEffect } from 'react';
import API from '../api';

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [showModify, setShowModify] = useState(false);
  const [editData, setEditData] = useState({ category: 'Food', newLimit: '' });

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const fetchData = async () => {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const res = await API.get(`/budgets?month=${currentMonth}&year=${currentYear}`); 
    console.log("Data received from backend:", res.data);
    setBudgets(res.data);
  } catch (err) {
    console.error("Frontend se request fail ho gayi:", err);
  }
};
  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editData.newLimit || editData.newLimit <= 0) {
      alert("Please enter a valid limit");
      return;
    }

    try {
      await API.post('/budgets', { 
        category: editData.category, 
        limit: parseFloat(editData.newLimit),
        month: currentMonth,
        year: currentYear
      });

      alert(`${editData.category} ka budget update ho gaya!`);
      setShowModify(false);
      setEditData({ ...editData, newLimit: '' });
      fetchData();
    } catch (err) {
      alert("Database update fail ho gaya!");
    }
  };

  const categoriesList = ['Food', 'Rent', 'Entertainment', 'Shopping', 'Travel', 'Bills', 'Health', 'Other'];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          Budget - {new Date().toLocaleString('default', { month: 'long' })} {currentYear}
        </h1>
        <button onClick={() => setShowModify(true)} style={styles.modifyBtn}>
          ⚙️ Modify Budget
        </button>
      </div>

      <div className="budget-list-scroll" style={styles.scrollArea}>
        <div style={styles.list}>
          {budgets.length > 0 ? budgets.map((item, index) => {
            const isOverBudget = item.spent > item.limit;
            const percentage = Math.min((item.spent / item.limit) * 100, 100);

            return (
              <div key={index} style={styles.card}>
                <div style={styles.cardInfo}>
                  <span style={styles.category}>{item.category}</span>
                  <span style={styles.amount}>
                    ₹{item.spent} <span style={{ color: '#7f8c8d', fontWeight: 'normal' }}>of ₹{item.limit}</span>
                  </span>
                </div>

                <div style={styles.barBackground}>
                  <div
                    style={{
                      ...styles.barFill,
                      width: `${percentage}%`,
                      backgroundColor: isOverBudget ? '#e74c3c' : '#2ecc71'
                    }}
                  />
                </div>

                {isOverBudget && (
                  <p style={styles.warningText}>⚠️ Warning: You have exceeded your budget for {item.category}!</p>
                )}
              </div>
            );
          }) : (
            <p style={{textAlign: 'center', color: '#666', marginTop: '20px'}}>
              Bhai, is mahine ka koi budget set nahi hai. 'Modify Budget' se shuru karo!
            </p>
          )}
        </div>
      </div>

      {showModify && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>Modify {new Date().toLocaleString('default', { month: 'short' })} Budget</h3>
            <form onSubmit={handleUpdate} style={styles.form}>
              <label style={styles.label}>Select Category</label>
              <select 
                style={styles.inputField} 
                value={editData.category}
                onChange={(e) => setEditData({...editData, category: e.target.value})}
              >
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat} style={{color: '#000'}}>{cat}</option>
                ))}
              </select>
              <label style={styles.label}>New Limit (₹)</label>
              <input type="number" placeholder="Enter new limit" style={styles.inputField} value={editData.newLimit} onChange={(e) => setEditData({...editData, newLimit: e.target.value})} />
              <div style={styles.modalActions}>
                <button type="button" onClick={() => setShowModify(false)} style={styles.cancelBtn}>Cancel</button>
                <button type="submit" style={styles.saveBtn}>Update Limit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
    container: { padding: '20px', backgroundColor: '#ffffff', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexShrink: 0 },
    scrollArea: { flexGrow: 1, overflowY: 'auto', paddingRight: '10px' },
    title: { color: '#2c3e50', margin: 0, fontSize: '24px' },
    modifyBtn: { padding: '10px 20px', backgroundColor: '#34495e', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    list: { display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' },
    card: { backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #f0f0f0', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' },
    cardInfo: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' },
    category: { fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' },
    amount: { fontSize: '16px', fontWeight: 'bold', color: '#2c3e50' },
    barBackground: { width: '100%', height: '14px', backgroundColor: '#f1f2f6', borderRadius: '7px', overflow: 'hidden' },
    barFill: { height: '100%', transition: 'width 0.6s ease-in-out' },
    warningText: { color: '#e74c3c', fontSize: '13px', marginTop: '10px', fontWeight: '500' },
    overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000 },
    modal: { backgroundColor: '#ffffff', padding: '30px', borderRadius: '20px', width: '400px', boxShadow: '0 15px 35px rgba(0,0,0,0.2)' },
    form: { display: 'flex', flexDirection: 'column', textAlign: 'left' },
    label: { fontSize: '14px', fontWeight: 'bold', color: '#34495e', marginBottom: '8px' },
    inputField: { 
      padding: '12px', borderRadius: '10px', border: '1px solid #dcdde1', marginBottom: '20px', 
      fontSize: '16px', color: '#000000', backgroundColor: '#ffffff', outline: 'none',
      WebkitBoxShadow: '0 0 0px 1000px white inset', boxShadow: '0 0 0px 1000px white inset'
    },
    modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' },
    cancelBtn: { padding: '12px 20px', border: 'none', background: '#f5f6fa', color: '#7f8c8d', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' },
    saveBtn: { padding: '12px 20px', border: 'none', backgroundColor: '#007bff', color: '#ffffff', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }
};

export default Budget;