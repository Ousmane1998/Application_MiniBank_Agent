const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  date_transaction: Date,
  type: String,
  montant: Number,
  frais: Number,
  statut: String,
  compte_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Compte' },
  utilisateur_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' },
  numero_transaction: String,
  motif_annulation: String,
  annule_par: String,
});

module.exports = mongoose.model('Transaction', transactionSchema);
