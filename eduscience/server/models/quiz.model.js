import mongoose from "mongoose";

// Définition du schéma pour la collection "Quiz"
const quizSchema = new mongoose.Schema({
  quizTitle: {
    type: String,
    required: true, // Le titre du quiz est obligatoire
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course", // Référence à la collection "Course"
    required: true, // L'ID du cours est obligatoire
  },
  questions: [
    {
      question: {
        type: String,
        required: true, // La question est obligatoire
      },
      answers: {
        type: [String],
        required: true, // Les réponses sont obligatoires
        validate: {
          validator: function (answers) {
            return answers.length === 4; // Assurez-vous qu'il y a exactement 4 réponses
          },
          message: "Il doit y avoir exactement 4 réponses.",
        },
      },
      correctAnswer: {
        type: Number,
        required: true, // L'index de la réponse correcte est obligatoire
        min: 0,
        max: 3, // L'index doit être compris entre 0 et 3 (car il y a 4 réponses)
      },
    },
  ],
}, { timestamps: true }); // Ajoute automatiquement `createdAt` et `updatedAt`

// Création du modèle "Quiz" basé sur le schéma
export const Quiz = mongoose.model("Quiz", quizSchema);