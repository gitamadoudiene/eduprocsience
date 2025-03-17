/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateQuizMutation } from "@/features/api/courseApi";; // Importez la mutation

const AddCourseQuiz = () => {
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([
    {
      question: "",
      answers: ["", "", "", ""],
      correctAnswer: 0, // Index de la réponse correcte
    },
  ]);
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();

  // Utilisez la mutation pour créer un quiz
  const [createQuiz, { isLoading }] = useCreateQuizMutation();

  // Ajouter une nouvelle question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        answers: ["", "", "", ""],
        correctAnswer: 0,
      },
    ]);
  };

  // Supprimer une question
  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  // Mettre à jour une question
  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  // Mettre à jour une réponse
  const updateAnswer = (questionIndex, answerIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers[answerIndex] = value;
    setQuestions(newQuestions);
  };

  // Soumettre le quiz
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation des champs
    if (!quizTitle.trim()) {
      toast.error("Veuillez entrer un titre pour le quiz.");
      return;
    }

    if (
      questions.some(
        (q) => !q.question.trim() || q.answers.some((a) => !a.trim())
      )
    ) {
      toast.error("Veuillez remplir tous les champs des questions et réponses.");
      return;
    }

    try {
      // Appeler la mutation pour créer le quiz
      const response = await createQuiz({
        courseId,
        quizTitle,
        questions,
      }).unwrap();

      // Afficher un message de succès
      toast.success("Quiz ajouté avec succès !");

      // Rediriger vers la page du cours
      navigate(`/admin/course/${courseId}`);
    } catch (error) {
      // Gérer les erreurs
      toast.error("Erreur lors de l'ajout du quiz");
      console.error(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold mb-6 text-dark-blue dark:text-white">
          Ajouter un Quiz
        </h2>
        <Button
          className="bg-dark-blue hover:bg-dark-blue/90"
          onClick={() => navigate(`/admin/course/${courseId}`)}
        >
          Retour
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Titre du quiz */}
        <div className="mb-6">
          <Label
            htmlFor="quizTitle"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Titre du Quiz
          </Label>
          <Input
            id="quizTitle"
            type="text"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            placeholder="Entrez le titre du quiz"
            className="mt-1 w-full"
          />
        </div>

        {/* Liste des questions */}
        {questions.map((question, questionIndex) => (
          <motion.div
            key={questionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: questionIndex * 0.1 }}
            className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm"
          >
            <div className="flex justify-between items-center mb-4">
              <Label className="text-lg font-semibold text-dark-blue dark:text-white">
                Question {questionIndex + 1}
              </Label>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeQuestion(questionIndex)}
                className="flex items-center gap-1"
              >
                <Trash size={16} />
                Supprimer
              </Button>
            </div>

            {/* Champ de la question */}
            <div className="mb-4">
              <Label
                htmlFor={`question-${questionIndex}`}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Question
              </Label>
              <Input
                id={`question-${questionIndex}`}
                type="text"
                value={question.question}
                onChange={(e) =>
                  updateQuestion(questionIndex, "question", e.target.value)
                }
                placeholder="Entrez la question"
                className="mt-1 w-full"
              />
            </div>

            {/* Réponses */}
            <div className="space-y-2">
              {question.answers.map((answer, answerIndex) => (
                <div key={answerIndex} className="flex items-center gap-2">
                  <Input
                    type="text"
                    value={answer}
                    onChange={(e) =>
                      updateAnswer(questionIndex, answerIndex, e.target.value)
                    }
                    placeholder={`Réponse ${answerIndex + 1}`}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant={
                      question.correctAnswer === answerIndex
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      updateQuestion(
                        questionIndex,
                        "correctAnswer",
                        answerIndex
                      )
                    }
                  >
                    {question.correctAnswer === answerIndex
                      ? "Correcte"
                      : "Marquer comme correcte"}
                  </Button>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Bouton pour ajouter une question */}
        <Button
          type="button"
          variant="outline"
          onClick={addQuestion}
          className="w-full flex items-center justify-center gap-2 mb-6"
        >
          <Plus size={16} />
          Ajouter une question
        </Button>

        {/* Bouton de soumission */}
        <div className="flex items-center justify-between">
          <Button
            type="submit"
            className="bg-dark-blue hover:bg-dark-blue/90 w-full"
            disabled={isLoading} // Désactiver le bouton pendant le chargement
          >
            {isLoading ? "Enregistrement..." : "Enregistrer le Quiz"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddCourseQuiz;