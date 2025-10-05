const express = require('express');
const router = express.Router();
const Utilisateur = require('../models/Utilisateur');
const bcrypt = require('bcrypt');

router.post('/login', async (req, res) => {
  const { email, motDePasse } = req.body;

  try {
    const user = await Utilisateur.findOne({ email }).select(
      "nom prenom email telephone adresse role photo mot_de_passe"
    );

    console.log("📥 Requête reçue :", req.body);

    const { email, motDePasse } = req.body;
    
    if (!user) {
      console.warn("❌ Utilisateur introuvable :", email);
      return res.status(401).json({ error: 'Utilisateur introuvable' });
    }

    const match = await bcrypt.compare(motDePasse, user.mot_de_passe);
    if (!match) {
      console.warn("❌ Mot de passe incorrect pour :", email);
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }

    const { mot_de_passe, ...userData } = user.toObject();
    res.json(userData);


  } catch (err) {
    console.error("💥 Erreur serveur :", err.message);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});



module.exports = router;
