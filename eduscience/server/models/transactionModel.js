const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: Number,
  status: String,
  date: { type: Date, default: Date.now },
  // Autres champs pertinents
});

module.exports = mongoose.model('Transaction', transactionSchema);