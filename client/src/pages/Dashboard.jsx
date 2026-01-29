import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import API from '../api';

const Dashboard = () => {
  const [viewType, setViewType] = useState('Monthly');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({ category: '', amount: '', date: '' });
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await API.get('/transactions');
        setTransactions(res.data);
      } catch (err) {
        console.error("Bhai data nahi aaya:", err);
      }
    };
    fetchTransactions();
  }, []);

  const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];
  const expenseCategories = ['Food', 'Rent', 'Shopping', 'Bills', 'Travel', 'Entertainment', 'Health', 'Other'];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919'];

const today = new Date().toISOString().split('T')[0];
const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();

const monthlyTransactions = transactions.filter(t => {
  const tDate = new Date(t.date);
  return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
});


const totalIncome = monthlyTransactions
  .filter(t => t.type === 'Income')
  .reduce((acc, curr) => acc + Number(curr.amount), 0);

const totalExpense = monthlyTransactions
  .filter(t => t.type === 'Expense')
  .reduce((acc, curr) => acc + Number(curr.amount), 0);

const remaining = totalIncome - totalExpense;

  const getPieData = (type) => {
  const filtered = monthlyTransactions.filter(t => t.type === type);
  const summary = filtered.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
    return acc;
  }, {});
  return Object.keys(summary).map(key => ({ name: key, value: summary[key] }));
};

const getMonthlyBarData = () => {
  const last12Months = [];
  const now = new Date();

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthYear = d.toLocaleString('default', { month: 'short', year: '2-digit' });
    last12Months.push({
      name: monthYear,
      income: 0,
      expense: 0,
      monthIndex: d.getMonth(),
      year: d.getFullYear()
    });
  }

  transactions.forEach(t => {
    const tDate = new Date(t.date);
    const mYear = tDate.toLocaleString('default', { month: 'short', year: '2-digit' });
    
    const monthData = last12Months.find(m => m.name === mYear);
    if (monthData) {
      if (t.type === 'Income') monthData.income += Number(t.amount);
      else if (t.type === 'Expense') monthData.expense += Number(t.amount);
    }
  });

  return last12Months;
};

const barData = getMonthlyBarData();

  const handleSave = async () => {
    if (!formData.amount || formData.amount <= 0) return alert("Please enter amount");
    const today = new Date().toISOString().split('T')[0];
    if (new Date(formData.date) > new Date(today)) {
      return alert("Bhai, bhavishya (future) ki entry allow nahi hai!");
    }
    
    try {
      const newTransaction = { 
        type: modalType, 
        category: formData.category,
        amount: Number(formData.amount),
        date: formData.date 
      };
      const res = await API.post('/transactions', newTransaction);
      setTransactions([...transactions, res.data]);
      setShowModal(false);
      alert(`${modalType} save ho gaya!`);
    } catch (err) {
      alert("Data save nahi ho pa raha!");
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setFormData({ 
      category: type === 'Income' ? incomeCategories[0] : expenseCategories[0], 
      amount: '', 
      date: new Date().toISOString().split('T')[0] 
    });
    setShowModal(true);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.blackText}>Dashboard Overview</h2>
        <div style={styles.buttonGroup}>
          <button onClick={() => openModal('Income')} style={styles.incomeBtn}>+ Add Income</button>
          <button onClick={() => openModal('Expense')} style={styles.expenseBtn}>- Add Expense</button>
        </div>
      </div>

      <div style={styles.statsGrid}>
        <div style={{ ...styles.card, borderLeft: '6px solid #2ecc71' }}>
          <h4 style={styles.cardLabel}>Total Income</h4>
          <p style={{ ...styles.amountText, color: '#2ecc71' }}>₹{totalIncome.toLocaleString('en-IN')}</p>
        </div>
        <div style={{ ...styles.card, borderLeft: '6px solid #e74c3c' }}>
          <h4 style={styles.cardLabel}>Total Expense</h4>
          <p style={{ ...styles.amountText, color: '#e74c3c' }}>₹{totalExpense.toLocaleString('en-IN')}</p>
        </div>
        <div style={{ ...styles.card, borderLeft: '6px solid #3498db' }}>
          <h4 style={styles.cardLabel}>Remaining</h4>
          <p style={{ ...styles.amountText, color: '#3498db' }}>₹{remaining.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div style={styles.analyticsSection}>
        <div style={styles.graphHeader}>
          <h3 style={styles.blackText}>Analytics</h3>
          <select value={viewType} onChange={(e) => setViewType(e.target.value)} style={styles.dropdown}>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>

        {viewType === 'Monthly' ? (
          <div style={styles.pieContainer}>
            <div style={styles.pieBox}>
              <h4 style={{ textAlign: 'center', color: '#000' }}>Income</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={getPieData('Income')} cx="50%" cy="50%" outerRadius={70} dataKey="value" label>
                    {getPieData('Income').map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={styles.pieBox}>
              <h4 style={{ textAlign: 'center', color: '#000' }}>Expenses</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={getPieData('Expense')} cx="50%" cy="50%" outerRadius={70} dataKey="value" label>
                    {getPieData('Expense').map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" name="Income" fill="#2ecc71" />
                <Bar dataKey="expense" name="Expense" fill="#e74c3c" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={{ marginBottom: '20px', color: '#000' }}>Add {modalType}</h2>
            <div style={styles.inputGroup}>
              <label style={styles.modalLabel}>Category</label>
              <select style={styles.modalSelect} value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                {(modalType === 'Income' ? incomeCategories : expenseCategories).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.modalLabel}>Amount (₹)</label>
              <input type="number" placeholder="0" style={styles.modalInput} value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.modalLabel}>Date</label>
              <input type="date" style={styles.modalInput} value={formData.date} max={today} onChange={(e) => setFormData({...formData, date: e.target.value})} />
            </div>
            <div style={styles.modalActions}>
              <button onClick={() => setShowModal(false)} style={styles.cancelBtn}>Cancel</button>
              <button style={{...styles.saveBtn, backgroundColor: modalType === 'Income' ? '#2ecc71' : '#e74c3c'}} onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '20px', backgroundColor: '#ffffff', minHeight: '100vh', paddingBottom: '40px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  blackText: { color: '#000', margin: 0, fontSize: '24px', fontWeight: 'bold' },
  buttonGroup: { display: 'flex', gap: '10px' },
  incomeBtn: { padding: '10px 18px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  expenseBtn: { padding: '10px 18px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  statsGrid: { display: 'flex', gap: '20px', marginBottom: '25px' },
  card: { flex: 1, padding: '20px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' },
  cardLabel: { color: '#666', margin: '0 0 10px 0', fontSize: '13px' },
  amountText: { fontSize: '24px', fontWeight: 'bold', margin: 0 },
  analyticsSection: { background: 'white', padding: '25px', borderRadius: '15px', border: '1px solid #eee', marginBottom: '30px' },
  graphHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' },
  dropdown: { padding: '8px', borderRadius: '5px', border: '1px solid #000', color: '#000', backgroundColor: '#fff', cursor: 'pointer' },
  pieContainer: { display: 'flex', gap: '20px', marginTop: '10px' },
  pieBox: { flex: 1, padding: '10px', border: '1px solid #f0f0f0', borderRadius: '10px' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 },
  modalContent: { background: '#fff', padding: '30px', borderRadius: '20px', width: '400px' },
  inputGroup: { display: 'flex', flexDirection: 'column', marginBottom: '15px' },
  modalLabel: { color: '#000', marginBottom: '5px', fontWeight: 'bold' },
  modalSelect: { padding: '12px', borderRadius: '8px', border: '1px solid #000', color: '#000', backgroundColor: '#fff' },
  modalInput: { padding: '12px', borderRadius: '8px', border: '1px solid #000', color: '#000', backgroundColor: '#fff' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' },
  cancelBtn: { padding: '10px 20px', border: 'none', background: '#f0f0f0', borderRadius: '8px', cursor: 'pointer', color: '#333' },
  saveBtn: { padding: '10px 20px', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
};

export default Dashboard;