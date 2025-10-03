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

    if (!user) return res.status(401).json({ error: 'Utilisateur introuvable' });

    const match = await bcrypt.compare(motDePasse, user.mot_de_passe);
    if (!match) return res.status(401).json({ error: 'Mot de passe incorrect' });

    // ✅ Exclure le mot de passe avant de renvoyer la réponse
    const { mot_de_passe, ...userData } = user.toObject();
 res.json({
  _id: user._id,
  nom: user.nom,
  prenom: user.prenom,
  email: user.email,
  telephone: user.telephone,
  adresse: user.adresse,
  role: user.role,
  photo: user.photo
});


  } catch (err) {
    console.error("Erreur login:", err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});



module.exports = router;
