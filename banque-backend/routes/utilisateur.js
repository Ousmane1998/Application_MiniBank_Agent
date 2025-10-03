const express = require('express');
const router = express.Router();
const Utilisateur = require('../models/Utilisateur');
const Compte = require('../models/Compte');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const generatePassword = (length = 12) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const generateNumeroCompte = () => {
  return 'SN' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 1000);
};

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/images"),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post('/', upload.single("photo"), async (req, res) => {
  try {
    console.log("📥 Requête reçue avec données :", req.body);
    console.log("📷 Fichier reçu :", req.file);

    const { nom, prenom, email, adresse, telephone, role, date_naissance, carte_identite } = req.body;
    const photo = req.file ? req.file.filename : null;

    const mot_de_passe = generatePassword();
    const hashed = await bcrypt.hash(mot_de_passe, 10);

    const utilisateur = new Utilisateur({
      nom, prenom, adresse, email, telephone, photo, date_naissance, carte_identite, role,
      mot_de_passe: hashed
    });

    const savedUser = await utilisateur.save();
    console.log("✅ Utilisateur enregistré :", savedUser);

    const compte = new Compte({
      numeroCompte: generateNumeroCompte(),
      solde: 0,
      etat: "Actif",
      type: "Classique",
      date_creation: new Date(),
      utilisateur_id: savedUser._id
    });

    await compte.save();
    console.log(" Compte créé :", compte);

    res.status(201).json({ utilisateur: savedUser, compte, mot_de_passe });
  } catch (err) {
    console.error("❌ Erreur backend :", err.message);
    console.error("🧨 Stack trace :", err.stack);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


router.get('/', async (req, res) => {
 try {
    const comptes = await Compte.find().populate('utilisateur_id');

    const utilisateurs = comptes.map((compte) => {
      const user = compte.utilisateur_id;
      if (!user) return null;

      return {
        _id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        adresse: user.adresse,
        role: user.role,
        photo: user.photo,
        numeroCompte: compte.numeroCompte,
        solde: compte.solde,
        etat: compte.etat,
        typeCompte: compte.type,
      };
    }).filter(Boolean);

    res.json(utilisateurs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Modifier un utilisateur
router.put('/:id', async (req, res) => {
  console.log("ID reçu :", req.params.id);
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'ID invalide' });
  }
  try {
    const updated = await Utilisateur.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Erreur modification' });
  }
});

// Archiver (supprimer visuellement)
router.patch('/:id/archive', async (req, res) => {
  try {
    const updated = await Utilisateur.findByIdAndUpdate(req.params.id, { is_archived: true }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Erreur archivage' });
  }
});

// Bloquer
router.patch('/:id/block', async (req, res) => {
  try {
    const user = await Utilisateur.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });

    user.is_blocking = !user.is_blocking; // ✅ toggle
    await user.save();

    res.json({ message: `Utilisateur ${user.is_blocking ? 'bloqué' : 'débloqué'}`, user });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors du changement de statut de blocage' });
  }
});

//Delete
// Supprimer définitivement un utilisateur
router.delete('/:id', async (req, res) => {
  try {
    await Utilisateur.findByIdAndDelete(req.params.id);
    res.json({ message: '✅ Utilisateur supprimé' });
  } catch (err) {
    console.error("❌ Erreur suppression :", err);
    res.status(500).json({ error: 'Erreur suppression' });
  }
});


module.exports = router;
