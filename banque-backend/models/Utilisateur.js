const mongoose = require('mongoose');

const utilisateurSchema = new mongoose.Schema({
  prenom: String,
  nom: String,
  adresse: String,
  email: { type: String, unique: true },
  telephone: String,
  photo: String,
  date_naissance: Date,
  carte_identite: String,
  role: { type: String, enum: ['Client', 'Distributeur','Agent'] }, // ✅ Agent exclu
 mot_de_passe: {
  type: String,
  required: true,
  select: false
},
  is_archived: { type: Boolean, default: false },
  is_blocking: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Utilisateur', utilisateurSchema);
