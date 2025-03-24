// // controllers/paymentController.js
// import { setup, store } from '../config/paydunya';
// import { CheckoutInvoice } from 'paydunya';

// export function initiatePayment(req, res) {
//   const invoice = new CheckoutInvoice(setup, store);

//   // Ajoutez les articles à la facture
//   invoice.addItem('Nom du produit', 1, 10000, 10000, 'Description du produit');

//   // Définissez le montant total
//   invoice.setTotalAmount(10000);

//   // Créez la facture
//   invoice.create()
//     .then(() => {
//       // Redirigez l'utilisateur vers l'URL de paiement
//       res.redirect(invoice.getInvoiceUrl());
//     })
//     .catch(error => {
//       console.error(error);
//       res.status(500).send('Erreur lors de la création de la facture');
//     });
// }

// // Gérez le retour après paiement
// export function handleCallback(req, res) {
//   // Logique pour traiter le retour de paiement
//   res.send('Paiement réussi');
// }
