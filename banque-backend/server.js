require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

const utilisateursRoutes = require('./routes/utilisateur');
app.use('/api/utilisateurs', utilisateursRoutes);

const historiqueRoutes = require('./routes/historique');
app.use('/api/historique', historiqueRoutes);
const comptesRoutes = require('./routes/Compte');
app.use('/api/comptes', comptesRoutes);
const transactionRoutes = require('./routes/Transaction');
app.use('/api/transactions', transactionRoutes);
app.use('/images', express.static('public/images'));



mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connexion MongoDB réussie"))
.catch((err) => console.error("❌ Erreur MongoDB :", err));

// Routes ici...
app.listen(5000, () => console.log(' Serveur lancé sur http://localhost:5000'));

// 🔒 Route non trouvée
app.use((req, res, next) => {
  res.status(404).redirect('/login'); // 👈 redirige vers la page login
});