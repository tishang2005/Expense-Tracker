import React, { useState, useEffect } from 'react';
import API from '../api';

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      const res = await API.get('/transactions');
      setTransactions(res.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bhai, pakka delete karna hai?")) {
      try {
        await API.delete(`/transactions/${id}`);
        setTransactions(transactions.filter(t => t._id !== id));
        alert("Transaction delete ho gayi!");
      } catch (err) {
        alert("Delete nahi ho pa raha!");
      }
    }
  };

  const filteredTransactions = transactions.filter((item) => {
    const matchesSearch = item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Transaction History</h1>

      <div style={styles.filterSection}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Search Category</label>
          <input 
            type="text" 
            placeholder="Type to search..." 
            style={styles.inputField}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Filter by Type</label>
          <select 
            style={styles.selectField}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">All Transactions</option>
            <option value="Income">Income Only</option>
            <option value="Expense">Expense Only</option>
          </select>
        </div>
      </div>

      <div style={styles.tableWrapper}>
        <div className="scroll-area" style={styles.scrollContainer}>
          <table style={styles.table}>
            <thead style={styles.stickyHeader}>
              <tr>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((item) => (
                  <tr key={item._id} style={styles.tableRow} className="t-row">
                    <td style={styles.td}>
                      {new Date(item.date).toLocaleDateString('en-IN')}
                    </td>
                    <td style={styles.td}>{item.category}</td>
                    <td style={{ 
                      ...styles.td, 
                      color: item.type === 'Income' ? '#2ecc71' : '#e74c3c',
                      fontWeight: 'bold'
                    }}>
                      {item.type}
                    </td>
                    <td style={{...styles.td, fontWeight: 'bold'}}>
                      ₹{item.amount.toLocaleString('en-IN')}
                    </td>
                    <td style={styles.td}>
                      <button 
                        onClick={() => handleDelete(item._id)} 
                        style={styles.deleteBtn}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{...styles.td, textAlign: 'center', padding: '30px', color: '#7f8c8d'}}>
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div style={{ height: '50px' }}></div> 
        </div>
      </div>
      <style>
        {`
          .t-row:hover { background-color: #fcfcfc; }
          .scroll-area::-webkit-scrollbar { width: 6px; }
          .scroll-area::-webkit-scrollbar-thumb { background: #ddd; border-radius: 10px; }
        `}
      </style>
    </div>
  );
};

const styles = {
  container: { padding: '20px', backgroundColor: '#ffffff', height: 'calc(100vh - 40px)', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflow: 'hidden' },
  title: { color: '#000000', marginBottom: '20px', fontSize: '28px', fontWeight: 'bold', flexShrink: 0 },
  filterSection: { display: 'flex', gap: '20px', marginBottom: '30px', flexShrink: 0 },
  inputGroup: { display: 'flex', flexDirection: 'column', flex: 1 },
  label: { color: '#000000', fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' },
  inputField: { padding: '12px', borderRadius: '10px', border: '1px solid #000000', fontSize: '16px', color: '#000000', backgroundColor: '#ffffff', outline: 'none' },
  selectField: { padding: '12px', borderRadius: '10px', border: '1px solid #000000', fontSize: '16px', color: '#000000', backgroundColor: '#ffffff', cursor: 'pointer' },
  tableWrapper: { flexGrow: 1, background: '#ffffff', borderRadius: '15px', border: '1px solid #eeeeee', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden', marginBottom: '20px' },
  scrollContainer: { overflowY: 'auto', flexGrow: 1 },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  stickyHeader: { position: 'sticky', top: 0, backgroundColor: '#f8f9fa', zIndex: 10, boxShadow: '0 2px 2px -1px rgba(0,0,0,0.1)' },
  th: { padding: '15px', color: '#000000', fontWeight: 'bold', fontSize: '15px', borderBottom: '2px solid #eeeeee' },
  td: { padding: '15px', color: '#000000', borderBottom: '1px solid #f1f1f1', fontSize: '15px' },
  tableRow: { transition: 'background 0.2s' },
  deleteBtn: {
    padding: '6px 12px',
    backgroundColor: '#ff4d4d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold',
    transition: '0.3s'
  }
};

export default Transactions;