import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useParams, useNavigate } from "react-router-dom";
import { useGetCourseProgressQuery } from "@/features/api/courseProgressApi";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const QuizPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetCourseProgressQuery(courseId);

  // États pour gérer le quiz
  const [quizStarted, setQuizStarted] = useState(false); // Pour démarrer le quiz
  const [quizResults, setQuizResults] = useState(null); // Résultats du quiz
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0); // Index du quiz actuel
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Index de la question actuelle
  const [userAnswers, setUserAnswers] = useState({}); // Réponses de l'utilisateur
  const [wrongAnswersCount, setWrongAnswersCount] = useState(0); // Nombre de mauvaises réponses
  const [solvedQuestions, setSolvedQuestions] = useState({}); // Questions résolues
  const [disabledQuestions, setDisabledQuestions] = useState({}); // Questions désactivées
  const [timeRemaining, setTimeRemaining] = useState(30); // Temps restant pour la question
  const [isTimeUp, setIsTimeUp] = useState(false); // Si le temps est écoulé

  // Récupérer les quizzes depuis les données de l'API
  const quizzes = data?.data?.courseDetails?.quizzes || [];

  // Sauvegarder les réponses et l'état du quiz dans le localStorage
  useEffect(() => {
    localStorage.setItem("userAnswers", JSON.stringify(userAnswers));
    localStorage.setItem("currentQuizIndex", currentQuizIndex.toString());
    localStorage.setItem("currentQuestionIndex", currentQuestionIndex.toString());
  }, [userAnswers, currentQuizIndex, currentQuestionIndex]);

  // Gérer le timer
  useEffect(() => {
    if (!quizStarted || quizResults) return; // Ne pas démarrer le timer si le quiz n'a pas commencé ou est terminé

    if (timeRemaining === 0) {
      setIsTimeUp(true); // Désactiver les réponses après 30 secondes
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => prev - 1); // Décrémenter le temps restant
    }, 1000);

    return () => clearInterval(interval); // Nettoyer l'intervalle
  }, [timeRemaining, quizStarted, quizResults]);

  // Réinitialiser le timer à chaque nouvelle question
  useEffect(() => {
    if (!quizStarted || quizResults) return; // Ne pas réinitialiser si le quiz n'a pas commencé ou est terminé
    setTimeRemaining(30);
    setIsTimeUp(false);
  }, [currentQuizIndex, currentQuestionIndex, quizStarted, quizResults]);

  // Gérer la réponse de l'utilisateur
  const handleAnswer = (questionIndex, answerIndex) => {
    if (isTimeUp || solvedQuestions[`${currentQuizIndex}-${questionIndex}`]) return; // Ne pas accepter de réponse si le temps est écoulé ou si la question est déjà résolue

    const currentQuestion = quizzes[currentQuizIndex].questions[questionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;

    const updatedUserAnswers = {
      ...userAnswers,
      [`${currentQuizIndex}-${questionIndex}`]: answerIndex,
    };

    setUserAnswers(updatedUserAnswers);

    if (isCorrect) {
      setSolvedQuestions((prev) => ({
        ...prev,
        [`${currentQuizIndex}-${questionIndex}`]: true,
      }));

      toast.success("Bonne réponse !", {
        position: "top-right",
        autoClose: 2000,
      });

      if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        handleNextQuestion();
      }
    } else {
      setWrongAnswersCount((prev) => prev + 1);

      if (wrongAnswersCount + 1 === 2) {
        setDisabledQuestions((prev) => ({
          ...prev,
          [`${currentQuizIndex}-${questionIndex}`]: true,
        }));

        toast.error("Deux mauvaises réponses. Les choix sont désactivés.", {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        toast.warning("Mauvaise réponse. Essayez encore !", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    }
  };

  // Passer à la question suivante
  const handleNextQuestion = () => {
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < quizzes[currentQuizIndex].questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      handleNextQuiz();
    }
  };

  // Passer au quiz suivant
  const handleNextQuiz = () => {
    if (currentQuizIndex < quizzes.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
      setCurrentQuestionIndex(0);
    } else {
      handleSubmitQuiz(); // Soumettre le quiz si c'est le dernier quiz
    }
  };

  // Soumettre le quiz et calculer le score
  const handleSubmitQuiz = () => {
    const results = quizzes.map((quiz, quizIndex) => {
      return quiz.questions.map((question, questionIndex) => {
        return userAnswers[`${quizIndex}-${questionIndex}`] === question.correctAnswer;
      });
    });

    const totalQuestions = quizzes.reduce((acc, quiz) => acc + quiz.questions.length, 0);
    const correctAnswers = results.flat().filter((isCorrect) => isCorrect).length;
    const score = ((correctAnswers / totalQuestions) * 100).toFixed(2);

    setQuizResults({ results, score });
  };

  // Afficher un spinner de chargement si les données sont en cours de chargement
  if (isLoading) return <LoadingSpinner />;

  // Afficher une erreur si les données n'ont pas pu être chargées
  if (isError || !data || !data.data) return <p>Failed to load quiz data</p>;

  // Récupérer le quiz actuel
  const currentQuiz = quizzes[currentQuizIndex];
  const isLastQuestion = currentQuestionIndex === currentQuiz.questions.length - 1;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-8 text-blue-600">Quiz</h1>
      <ToastContainer />

      {!quizStarted ? (
        // Écran des règles du quiz
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">Règles du Quiz</h2>
            <div className="space-y-4">
              <p className="text-lg font-medium text-gray-700">
                Bienvenue au quiz ! Voici les règles :
              </p>
              <ul className="list-disc list-inside text-gray-600">
                <li>Vous avez 30 secondes pour répondre à chaque question.</li>
                <li>Après deux mauvaises réponses, les choix seront désactivés.</li>
              </ul>
              <Button
                onClick={() => setQuizStarted(true)}
                className="w-full bg-blue-600 text-white hover:bg-blue-700 transition duration-300"
              >
                Commencer le Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : quizResults ? (
        // Écran des résultats du quiz
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-800">Résultats du Quiz</h2>
            <div className="space-y-4">
              <p className="text-lg font-medium">
                Score final : <span className="text-green-600">{quizResults.score}%</span>
              </p>
              {quizResults.results.map((quizResults, quizIndex) => (
                <div key={quizIndex} className="space-y-2">
                  <h3 className="font-semibold text-blue-800">Quiz {quizIndex + 1}</h3>
                  {quizResults.map((isCorrect, questionIndex) => (
                    <div key={questionIndex} className="flex items-center">
                      <p className="font-medium text-gray-700">
                        Question {questionIndex + 1}:{" "}
                        <span
                          className={isCorrect ? "text-green-600" : "text-red-600"}
                        >
                          {isCorrect ? "Correct" : "Incorrect"}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <Button
              onClick={() => navigate(-1)}
              className="mt-6 w-full bg-blue-600 text-white hover:bg-blue-700 transition duration-300"
            >
              Retour au cours
            </Button>
          </CardContent>
        </Card>
      ) : (
        // Écran du quiz en cours
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-purple-800">
              Quiz {currentQuizIndex + 1} / {quizzes.length}: {currentQuiz.quizTitle}
            </h2>
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-lg font-medium text-gray-700">
                  Question {currentQuestionIndex + 1}: {currentQuiz.questions[currentQuestionIndex].question}
                </p>
                <p className="text-sm text-gray-500">
                  Temps restant : <span className="font-bold">{timeRemaining}</span> secondes
                </p>
                <div className="space-y-2">
                  {currentQuiz.questions[currentQuestionIndex].answers.map((answer, answerIndex) => (
                    <Button
                      key={answerIndex}
                      onClick={() => handleAnswer(currentQuestionIndex, answerIndex)}
                      className={`w-full text-left transition duration-300 ${
                        userAnswers[`${currentQuizIndex}-${currentQuestionIndex}`] === answerIndex
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                      disabled={
                        solvedQuestions[`${currentQuizIndex}-${currentQuestionIndex}`] ||
                        disabledQuestions[`${currentQuizIndex}-${currentQuestionIndex}`] ||
                        isTimeUp
                      }
                    >
                      {answer}
                    </Button>
                  ))}
                </div>
                <Button
                  onClick={handleNextQuestion}
                  className="w-full bg-yellow-500 text-white hover:bg-yellow-600 transition duration-300"
                  disabled={isLastQuestion} // Désactiver si c'est la dernière question
                >
                  Passer à la question suivante
                </Button>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button
                onClick={handleSubmitQuiz}
                className="bg-green-600 text-white hover:bg-green-700 transition duration-300"
              >
                Soumettre le Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuizPage;