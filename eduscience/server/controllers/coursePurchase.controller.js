// import paydunya from 'paydunya';
// import { Course } from "../models/course.model.js";
// import { CoursePurchase } from "../models/coursePurchase.model.js";
// import { User } from "../models/user.model.js";
// import { Lecture } from "../models/lecture.model.js";

// // Configuration de Paydunya
// const { Setup, CheckoutInvoice, Store } = paydunya;

// const setup = new Setup({
//   masterKey: process.env.PAYDUNYA_MASTER_KEY,
//   privateKey: process.env.PAYDUNYA_PRIVATE_KEY,
//   publicKey: process.env.PAYDUNYA_PUBLIC_KEY,
//   token: process.env.PAYDUNYA_TOKEN,
//   mode: process.env.PAYDUNYA_MODE || 'test',
// });

// const store = new Store({
//   name: 'Edu-pro-sciense',
//   callbackURL: 'http://localhost:5173/api/v1/webhook',
//   cancelURL: 'http://localhost:5173/api/v1/cancel',
//   returnURL: 'http://localhost:5173/api/v1/return',
// });

// export const createCheckoutSession = async (req, res) => {
//   try {
//     const { courseId } = req.body;
//     const course = await Course.findById(courseId);
//     if (!course) return res.status(404).json({ message: "Course not found!" });

//     const invoice = new CheckoutInvoice(setup, store);
//     invoice.addItem({
//       name: course.courseTitle,
//       quantity: 1,
//       unit_price: course.coursePrice,
//       total_price: course.coursePrice,
//     });
//     invoice.totalAmount = course.coursePrice;

//     await invoice.create();

//     if (!invoice.url) {
//       return res.status(400).json({ success: false, message: "Error creating invoice" });
//     }

//     const newPurchase = new CoursePurchase({
//       courseId,
//       userId: req.id,
//       amount: course.coursePrice,
//       status: "pending",
//       paymentId: invoice.token,
//     });
//     await newPurchase.save();

//     return res.status(200).json({ success: true, url: invoice.url });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// // Webhook Paydunya
// export const paydunyaWebhook = async (req, res) => {
//   const payload = req.body;

//   try {
//     if (payload.status === "completed") {
//       const invoiceToken = payload.invoice.token;

//       // Trouver l'achat correspondant dans la base de données
//       const purchase = await CoursePurchase.findOne({
//         paymentId: invoiceToken,
//       }).populate({ path: "courseId" });

//       if (!purchase) {
//         return res.status(404).json({ message: "Achat non trouvé" });
//       }

//       // Mettre à jour le statut de l'achat
//       purchase.status = "completed";
//       await purchase.save();

//       // Mettre à jour les cours de l'utilisateur
//       await User.findByIdAndUpdate(
//         purchase.userId,
//         { $addToSet: { enrolledCourses: purchase.courseId._id } },
//         { new: true }
//       );

//       // Mettre à jour les étudiants inscrits au cours
//       await Course.findByIdAndUpdate(
//         purchase.courseId._id,
//         { $addToSet: { enrolledStudents: purchase.userId } },
//         { new: true }
//       );
//     }
//   } catch (error) {
//     console.error("Erreur lors du traitement du webhook:", error);
//     return res.status(500).json({ message: "Erreur interne du serveur" });
//   }

//   res.status(200).send();
// };

// // Obtenir les détails du cours avec le statut d'achat
// export const getCourseDetailWithPurchaseStatus = async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     const userId = req.id;

//     const course = await Course.findById(courseId)
//       .populate({ path: "creator" })
//       .populate({ path: "lectures" });

//     const purchased = await CoursePurchase.findOne({ userId, courseId });

//     if (!course) {
//       return res.status(404).json({ message: "Cours non trouvé !" });
//     }

//     return res.status(200).json({
//       course,
//       purchased: !!purchased, // true si acheté, false sinon
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Erreur interne du serveur" });
//   }
// };

// // Obtenir tous les cours achetés
// export const getAllPurchasedCourse = async (_, res) => {
//   try {
//     const purchasedCourse = await CoursePurchase.find({
//       status: "completed",
//     }).populate("courseId");

//     if (!purchasedCourse) {
//       return res.status(404).json({
//         purchasedCourse: [],
//       });
//     }

//     return res.status(200).json({
//       purchasedCourse,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Erreur interne serveur" });
//   }
// };

// controllers/paymentController.js
const paydunya = require('paydunya');

// Fonction pour initier un paiement
exports.initiatePayment = (req, res) => {
  // Configuration de PayDunya
  const setup = new paydunya.Setup({
    masterKey: 'VOTRE_MASTER_KEY',
    privateKey: 'VOTRE_PRIVATE_KEY',
    publicKey: 'VOTRE_PUBLIC_KEY',
    token: 'VOTRE_TOKEN',
    mode: 'test' // Passez à 'live' en production
  });

  const store = new paydunya.Store({
    name: 'Nom de votre entreprise',
    tagline: 'Slogan de votre entreprise',
    phoneNumber: 'Numéro de téléphone',
    postalAddress: 'Adresse postale',
    websiteURL: 'URL de votre site web',
    logoURL: 'URL de votre logo'
  });

  const invoice = new paydunya.CheckoutInvoice(setup, store);

  // Ajout des éléments à la facture
  invoice.addItem('Nom du produit', 1, 10000, 10000, 'Description du produit');

  // Définition du montant total
  invoice.setTotalAmount(10000);

  // Création de la facture
  invoice.create()
    .then(response => {
      // Redirection vers l'URL de paiement
      res.redirect(invoice.getInvoiceUrl());
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Erreur lors de la création de la facture');
    });
};

// Fonction pour gérer le retour après paiement
exports.handleCallback = (req, res) => {
  // Logique pour traiter le retour de paiement
  res.send('Paiement réussi');
};

