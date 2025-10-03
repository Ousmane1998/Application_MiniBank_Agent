const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Compte = require('../models/Compte');
const Historique = require('../models/Historique');

router.put('/annuler/:id', async (req, res) => {
  try {
    const { motif, agent } = req.body;
    // ✅ Correct : cherche par numero_transaction
const transaction = await Transaction.findOne({ numero_transaction: req.params.id });

    if (!transaction) return res.status(404).json({ error: "Transaction introuvable" });
    if (transaction.statut === "Annulée") return res.status(400).json({ error: "Déjà annulée" });

    const compte = await Compte.findById(transaction.compte_id);
    const solde_avant = compte.solde;

    // Remboursement si c'était un retrait
    if (transaction.type === "Retrait") {
      compte.solde += transaction.montant;
    }

    // Suppression si c'était un dépôt
    if (transaction.type === "Dépôt") {
      compte.solde -= transaction.montant;
    }

    await compte.save();

    transaction.statut = "Annulée";
    transaction.motif_annulation = motif;
    transaction.annule_par = agent;
    await transaction.save();

    const historique = new Historique({
      dateHeure: new Date(),
      montant: transaction.montant,
      solde_avant,
      solde_apres: compte.solde,
      compteID: compte._id,
      utilisateurID: transaction.utilisateur_id,
      transactionID: transaction._id
    });
    await historique.save();

    res.status(200).json({ message: " Transaction annulée", transaction, historique });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('utilisateur_id');
    const formatted = transactions.map((tx) => ({
      id: tx.numero_transaction,
      montant: tx.montant,
      beneficiaire: tx.utilisateur_id?.nom + ' ' + tx.utilisateur_id?.prenom,
      date: tx.date_transaction,
      statut: tx.statut,
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});



module.exports = router;
