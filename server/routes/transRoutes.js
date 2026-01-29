const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  addTransaction, 
  getTransactions, 
  deleteTransaction, 
  getDashboardStats 
} = require('../controllers/transController');

router.post('/', auth, addTransaction);
router.get('/', auth, getTransactions);
router.delete('/:id', auth, deleteTransaction);
router.get('/stats', auth, getDashboardStats);

module.exports = router;