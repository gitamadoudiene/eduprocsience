import { configDotenv } from 'dotenv'; // Ajoutez cette ligne en haut du fichier
import express, { json } from 'express';
const app = express();
import paymentRoutes from './routes/paymentRoutes.js'; // Import des routes

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use(json()); // Middleware pour parser le JSON
app.use((req, res, next) => {
  console.log(`Requête reçue : ${req.method} ${req.url}`);
  next();
});
app.use('/api', paymentRoutes); // Ajout du préfixe '/api' pour les routes

console.log('Routes enregistrées sous le préfixe /api');

// Middleware pour capturer les routes non trouvées
app.use((req, res, next) => {
  res.status(404).send('Route non trouvée');
});

// Middleware pour capturer les erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Erreur serveur');
});

const PORT = process.env.PORT || 8080; // Définit le port 8080 par défaut
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});