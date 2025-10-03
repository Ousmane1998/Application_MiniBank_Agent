const mongoose = require('mongoose');

const compteSchema = new mongoose.Schema({
  numeroCompte: String,
  solde: { type: Number, default: 0 },
  etat: { type: String, default: "Actif" },
  type: { type: String, default: "Classique" },
  date_creation: { type: Date, default: Date.now },
  utilisateur_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' },
});


module.exports = mongoose.model('Compte', compteSchema);
