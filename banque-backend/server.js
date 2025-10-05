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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Serveur lancé sur http://localhost:${PORT}`));

// 🔒 Route non trouvée
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route non trouvée' });
});
