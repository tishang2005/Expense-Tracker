const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

exports.getBudgets = async (req, res) => {
  try {
    const { month, year } = req.query;
    const userId = req.user.id;

    const budgets = await Budget.find({ 
      user: userId, 
      month: parseInt(month), 
      year: parseInt(year) 
    });

    const startOfMonth = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, 1, 0, 0, 0));
    const endOfMonth = new Date(Date.UTC(parseInt(year), parseInt(month), 0, 23, 59, 59, 999));

    const transactions = await Transaction.find({
      user: userId,
      type: { $regex: /^expense$/i },
      date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const uniqueBudgets = [];
    const seenCategories = new Set();
    budgets.forEach(b => {
      const catLower = b.category.trim().toLowerCase();
      if (!seenCategories.has(catLower)) {
        seenCategories.add(catLower);
        uniqueBudgets.push(b);
      }
    });

    const budgetStatus = uniqueBudgets.map(b => {
      const spent = transactions
        .filter(t => t.category.trim().toLowerCase() === b.category.trim().toLowerCase())
        .reduce((acc, curr) => acc + Number(curr.amount), 0);
      
      return { category: b.category, limit: b.limit, spent: spent };
    });

    res.json(budgetStatus);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.setBudget = async (req, res) => {
  const { category, limit, month, year } = req.body;
  try {
    let budget = await Budget.findOneAndUpdate(
      { user: req.user.id, category: category.trim(), month: parseInt(month), year: parseInt(year) },
      { limit: parseFloat(limit) },
      { upsert: true, new: true }
    );
    res.json(budget);
  } catch (err) {
    res.status(500).json({ msg: "Save Error" });
  }
};