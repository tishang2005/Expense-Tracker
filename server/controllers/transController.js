const Transaction = require('../models/Transaction');

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user;
    const transactions = await Transaction.find({ user: userId });

    let totalIncome = 0;
    let totalExpense = 0;
    let categoryData = {};

    transactions.forEach(trans => {
      if (trans.type === 'Income') {
        totalIncome += trans.amount;
      } else {
        totalExpense += trans.amount;
        categoryData[trans.category] = (categoryData[trans.category] || 0) + trans.amount;
      }
    });

    res.json({
      totalIncome,
      totalExpense,
      remainingBalance: totalIncome - totalExpense,
      pieChartData: categoryData,
      recentTransactions: transactions.slice(-5).reverse()
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.addTransaction = async (req, res) => {
  try {
    const { type, category, amount, date } = req.body;
    const newTrans = new Transaction({
      user: req.user.id,
      type, category, amount, date
    });
    await newTrans.save();
    res.status(201).json(newTrans);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const trans = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.json(trans);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ msg: "Transaction delete ho gayi!" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};