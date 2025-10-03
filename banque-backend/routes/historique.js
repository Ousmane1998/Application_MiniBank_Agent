const express = require('express');
const router = express.Router();
const Historique = require('../models/Historique');
const Transaction = require('../models/Transaction');
const Utilisateur = require('../models/Utilisateur');
const Compte = require('../models/Compte');





router.get('/', async (req, res) => {
  try {
    const historique = await Historique.find()
      .populate({
        path: 'transactionID',
        select: 'type montant statut numero_transaction date_transaction'
      })
      .populate({
        path: 'utilisateurID',
        select: 'nom prenom'
      })
      .populate({
        path: 'compteID',
        select: 'numeroCompte'
      })
      .sort({ dateHeure: -1 });

  const formatted = historique.map((h) => {
  const statut = h.transactionID?.statut || "Inconnue";
  const type = h.type || h.transactionID?.type || "Inconnu";

  const nom = h.utilisateurID?.nom || "—";
  const prenom = h.utilisateurID?.prenom || "—";
  const numeroTransaction = h.transactionID?.numero_transaction || "—";

  const texte = h.texte || (
    statut === "Annulée"
      ? `Transaction ${numeroTransaction} annulée par ${nom} ${prenom}`
      : `${type} effectué par ${nom} ${prenom}`
  );

      return {
    id: h._id,
    texte,
    dateHeure: h.dateHeure?.toLocaleString() || "—",
    montant: h.montant ? `${h.montant.toLocaleString()} FCFA` : "—",
    solde_avant: h.solde_avant ? `${h.solde_avant.toLocaleString()} FCFA` : "—",
    solde_apres: h.solde_apres ? `${h.solde_apres.toLocaleString()} FCFA` : "—",
    type,
    expediteur: `${nom} ${prenom}`,
    destinataire: h.compteID?.numeroCompte || "—",
    numero_transaction: numeroTransaction,
    statut
  };
});

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur lors de la récupération de l'historique." });
  }
});

module.exports = router;
