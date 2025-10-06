const express = require('express');
const router = express.Router();
const Utilisateur = require('../models/Utilisateur');
const bcrypt = require('bcrypt');

router.post('/login', async (req, res) => {
  const { email, motDePasse } = req.body;

  console.log("📥 Requête reçue :", req.body);

  if (!req.body || typeof req.body !== 'object') {
    console.warn("❌ Requête mal formée");
    return res.status(400).json({ error: "Requête mal formée" });
  }

  if (!email || !motDePasse) {
    console.warn("❌ Champs manquants");
    return res.status(400).json({ error: "Champs requis manquants" });
  }

  try {
     const user = await Utilisateur.findOne({ email });



    if (!user) {
      console.warn("❌ Utilisateur introuvable :", email);
      return res.status(401).json({ error: 'Utilisateur introuvable' });
    }

    if (!user.mot_de_passe) {
      console.warn("❌ Aucun mot de passe enregistré pour :", email);
      return res.status(500).json({ error: "Aucun mot de passe enregistré pour cet utilisateur" });
    }

    const match = await bcrypt.compare(motDePasse, user.mot_de_passe);
    if (!match) {
      console.warn("❌ Mot de passe incorrect pour :", email);
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }

    const { mot_de_passe, ...userData } = user.toObject();
    res.json(userData);

  } catch (err) {
    console.error("💥 Erreur serveur :", err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

module.exports = router;