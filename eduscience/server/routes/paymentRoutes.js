import express from 'express';
import paydunya from 'paydunya';
import dotenv from 'dotenv';
dotenv.config();

// Server DHCP UNIFY 

const app = express();
app.use(express.json());

const router = express.Router();

const setup = new paydunya.Setup({
  masterKey: process.env.PAYDUNYA_MASTER_KEY,
  privateKey: process.env.PAYDUNYA_PRIVATE_KEY,
  publicKey: process.env.PAYDUNYA_PUBLIC_KEY,
  token: process.env.PAYDUNYA_TOKEN,
  mode: process.env.PAYDUNYA_MODE || 'test',
});
//Informations a changer par Ibou
const store = new paydunya.Store({
  name: 'Edu-Pro Science',
  tagline: "Découvre le monde passionnant des Sciences",
  phoneNumber: '336530583',
  postalAddress: 'Dakar Plateau - Etablissement kheweul',
  websiteURL: 'http://www.Edu-Pro.sn',
  logoURL: 'http://www.Edu-Pro.sn/logo.png',
});

// Route pour initier un paiement
router.post('/initier-paiement', async (req, res) => {
  console.log('Corps de la requête reçu :', req.body);

  const { titre,description, montant } = req.body;

  if ( !titre || !description || !montant) {
    return res.status(400).json({ error: 'Titre, Description et montant sont requis.' });
  }

  const montantNum = Number(montant);
  if (isNaN(montantNum)) {
    return res.status(400).json({ error: 'Le montant doit être un nombre valide.' });
  }

  // Création d'une nouvelle facture
  const invoice = new paydunya.CheckoutInvoice(setup, store);

  // Ajout d'un identifiant unique
  const uniqueId = `edu-${Date.now()}`;
  invoice.addCustomData('transaction_id', uniqueId);

  // Ajout d'un article à la facture
  invoice.addItem(titre, 1, montantNum, montantNum, description);

  // Définition du montant total de la facture
  invoice.totalAmount = montantNum;

  // Définition des URLs de redirection
  invoice.returnURL = 'http://localhost:8080/api/retour-paiement';
  invoice.cancelURL = 'http://localhost:8080/api/annulation-paiement';

  try {
    if (await invoice.create()) {
      console.log('Facture créée avec succès :', invoice);
      res.json({ url: invoice.url, invoiceId: invoice.token });
    } else {
      console.error('Erreur de PayDunya complète :', invoice.responseText);
      // Si la transaction existe déjà, renvoyez les informations pertinentes
      if (invoice.responseText.includes('Transaction Found')) {
        res.status(200).json({
          message: 'Transaction déjà existante',
          url: invoice.url,
          invoiceId: invoice.token,
        });
      } else {
        res.status(400).json({
          message: 'Nouvelle Transaction',
           error: invoice.responseText });
      }
    }
  } catch (error) {
    console.error('Erreur lors de la création de la facture :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour gérer le retour après paiement
router.post('/retour-paiement', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token est requis.' });
  }

  const invoice = new paydunya.CheckoutInvoice(setup, store);

  try {
    if (await invoice.confirm(token)) {
      if (invoice.status === 'completed') {
        res.json({ message: 'Paiement réussi' });
      } else {
        res.json({ message: 'Paiement non complété' });
      }
    } else {
      res.status(400).json({ error: invoice.responseText });
    }
  } catch (error) {
    console.error('Erreur lors de la confirmation du paiement :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour gérer l'annulation
router.get('/annulation-paiement', (req, res) => {
  res.json({ message: 'Paiement annulé' });
});

// Route de test
router.get('/test', (req, res) => {
  console.log('Route /api/test atteinte');
  res.send('Route de test fonctionnelle');
});

export default router;
