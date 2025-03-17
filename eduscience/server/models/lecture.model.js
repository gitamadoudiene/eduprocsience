import mongoose from "mongoose";

// Définition du schéma pour la collection "Lecture"
const lectureSchema = new mongoose.Schema({
  lectureTitle: {
    type: String,
    required: true, // Ce champ est obligatoire
  },
  videoUrl: { type: String }, // URL de la vidéo
  description: { type: String }, // Description de la lecture
  publicId: { type: String }, // Identifiant public (peut-être pour Cloudinary ou un autre service)
  isPreviewFree: { type: Boolean }, // Indique si la lecture est en accès libre
}, { timestamps: true }); // Ajoute automatiquement `createdAt` et `updatedAt`

// Création du modèle "Lecture" basé sur le schéma
export const Lecture = mongoose.model("Lecture", lectureSchema);