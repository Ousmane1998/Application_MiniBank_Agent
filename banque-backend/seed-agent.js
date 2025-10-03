const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Utilisateur = require('./models/Utilisateur');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const users = [
    {
      nom: "Faye",
      prenom: "Agent",
      email: "agent@gmail.com",
      telephone: "770000000",
      adresse: "Dakar",
      role: "Agent",
      carte_identite: "AG123456",
      photo: "http://localhost:5000/images/agent.jpg",
      date_naissance: new Date("1990-01-01"),
      mot_de_passe: "agent123"
    },
    {
      nom: "sall",
      prenom: "khadim",
      email: "khadim@gmail.com",
      telephone: "779999999",
      adresse: "Dakar",
      role: "Agent",
      carte_identite: "AG123456",
      photo: "http://localhost:5000/images/agent.jpg",
      date_naissance: new Date("1990-01-01"),
      mot_de_passe: "agent123"
    },
    {
      nom: "Diop",
      prenom: "Mamadou",
      email: "client@gmail.com",
      telephone: "771111111",
      adresse: "Kaolack",
      role: "Client",
      carte_identite: "CL987654",
      photo: "http://localhost:5000/images/agent.jpg",
      date_naissance: new Date("1995-05-05"),
      mot_de_passe: "client123"
    },
    {
      nom: "Sow",
      prenom: "Awa",
      email: "distributeur@gmail.com",
      telephone: "772222222",
      adresse: "Thiès",
      role: "Distributeur",
      carte_identite: "DS654321",
      photo: "http://localhost:5000/images/agent.jpg",
      date_naissance: new Date("1988-03-15"),
      mot_de_passe: "distrib123"
    }
  ];

  for (const user of users) {
    const existing = await Utilisateur.findOne({ email: user.email });

    if (existing) {
      console.log(`⚠️ ${user.email} existe déjà — mise à jour en cours...`);
      Object.assign(existing, user, {
        mot_de_passe: await bcrypt.hash(user.mot_de_passe, 10),
      });
      await existing.save();
      console.log(`✅ ${user.email} mis à jour`);
    } else {
      const hashedPassword = await bcrypt.hash(user.mot_de_passe, 10);
      await Utilisateur.create({ ...user, mot_de_passe: hashedPassword });
      console.log(`✅ ${user.email} ajouté avec succès`);
    }
  }

  console.log("🎉 Insertion terminée !");
  mongoose.disconnect();
});
