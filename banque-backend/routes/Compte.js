const express = require('express');
const router = express.Router();
const Compte = require('../models/Compte');
const Transaction = require('../models/Transaction');
const Historique = require('../models/Historique');
const montantMin = 1000;
const montantMax = 1000000;

const generateNumeroTransaction = () => {
  return 'TX' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 1000);
};


router.post('/depot', async (req, res) => {
  try {
    const { numeroCompte, montant } = req.body;

    if (!montant || montant <= 0 || montant < montantMin || montant > montantMax) {
      return res.status(400).json({ error: "Montant invalide" });
    }

    const compte = await Compte.findOne({ numeroCompte });
    if (!compte) {
      return res.status(404).json({ error: "Compte introuvable" });
    }

    const utilisateurID = compte.utilisateur_id;
    const solde_avant = compte.solde;
    compte.solde += montant;
    await compte.save();

    const transaction = new Transaction({
      date_transaction: new Date(),
      type: "Dépôt",
      montant,
      frais: 0,
      statut: "Validée",
      compte_id: compte._id,
      utilisateur_id: utilisateurID,
      numero_transaction: generateNumeroTransaction()
    });

    await transaction.save();

    const historique = new Historique({
      dateHeure: new Date(),
      montant: parseFloat(montant),
      solde_avant,
      solde_apres: compte.solde,
      compteID: compte._id,
      utilisateurID,
      transactionID: transaction._id
    });
    await historique.save();

    res.status(200).json({ message: "✅ Dépôt effectué", compte, transaction, historique });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});
module.exports = router;