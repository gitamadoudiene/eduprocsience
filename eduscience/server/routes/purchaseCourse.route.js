// import express from "express";
// import isAuthenticated from "../middlewares/isAuthenticated.js";
// import {
//   createCheckoutSession,
//   getAllPurchasedCourse,
//   getCourseDetailWithPurchaseStatus,
//   paydunyaWebhook,
// } from "../controllers/coursePurchase.controller.js";

// const router = express.Router();



// // Créer une session de paiement
// router.route("/checkout/create-checkout-session").post(isAuthenticated, createCheckoutSession);

// // Webhook Paydunya
// router.route("/webhook").post(express.json(), paydunyaWebhook);

// // Obtenir les détails du cours avec le statut d'achat
// router.route("/course/:courseId/detail-with-status").get(isAuthenticated, getCourseDetailWithPurchaseStatus);

// // Obtenir tous les cours achetés
// router.route("/").get(isAuthenticated, getAllPurchasedCourse);

// export default router;


// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Route pour initier un paiement
router.post('/initiate', paymentController.initiatePayment);

// Route pour gérer le retour après paiement
router.get('/callback', paymentController.handleCallback);

module.exports = router;
