import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  createCheckoutSession,
  getAllPurchasedCourse,
  getCourseDetailWithPurchaseStatus,
  paydunyaWebhook,
} from "../controllers/coursePurchase.controller.js";

const router = express.Router();

// Créer une session de paiement
router.route("/checkout/create-checkout-session").post(isAuthenticated, createCheckoutSession);

// Webhook Paydunya
router.route("/webhook").post(express.json(), paydunyaWebhook);

// Obtenir les détails du cours avec le statut d'achat
router.route("/course/:courseId/detail-with-status").get(isAuthenticated, getCourseDetailWithPurchaseStatus);

// Obtenir tous les cours achetés
router.route("/").get(isAuthenticated, getAllPurchasedCourse);

export default router;