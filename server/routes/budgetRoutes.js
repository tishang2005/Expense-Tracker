const express = require('express');
const router = express.Router();
const { getBudgets, setBudget } = require('../controllers/budgetController');
const auth = require('../middleware/auth');

router.get('/', auth, getBudgets);
router.post('/', auth, setBudget);

module.exports = router;