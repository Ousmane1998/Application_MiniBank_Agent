const mongoose = require('mongoose');

const historiqueSchema = new mongoose.Schema({
  dateHeure: Date,
  montant: Number,
  solde_avant: Number,
  solde_apres: Number,
  compteID: { type: mongoose.Schema.Types.ObjectId, ref: 'Compte' },
  utilisateurID: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' },
  transactionID: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
});

module.exports = mongoose.model('Historique', historiqueSchema);
