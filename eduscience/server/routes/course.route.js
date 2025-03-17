import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
    createCourse,
    createLecture,
    editCourse,
    editLecture,
    getCourseById,
    getCourseLecture,
    getCreatorCourses,
    getLectureById,
    getPublishedCourse,
    removeLecture,
    searchCourse,
    togglePublishCourse,
    createQuiz, // Importez la fonction createQuiz
} from "../controllers/course.controller.js";
import upload from "../utils/multer.js";

const router = express.Router();

// Route pour créer un cours
router.route("/").post(isAuthenticated, createCourse);

// Route pour rechercher des cours
router.route("/search").get(isAuthenticated, searchCourse);

// Route pour obtenir les cours publiés
router.route("/published-courses").get(getPublishedCourse);

// Route pour obtenir les cours créés par l'utilisateur
router.route("/").get(isAuthenticated, getCreatorCourses);

// Route pour modifier un cours
router.route("/:courseId").put(isAuthenticated, upload.single("courseThumbnail"), editCourse);

// Route pour obtenir un cours par son ID
router.route("/:courseId").get(isAuthenticated, getCourseById);

// Route pour créer une lecture
router.route("/:courseId/lecture").post(isAuthenticated, createLecture);

// Route pour obtenir les lectures d'un cours
router.route("/:courseId/lecture").get(isAuthenticated, getCourseLecture);

// Route pour modifier une lecture
router.route("/:courseId/lecture/:lectureId").post(isAuthenticated, editLecture);

// Route pour supprimer une lecture
router.route("/lecture/:lectureId").delete(isAuthenticated, removeLecture);

// Route pour obtenir une lecture par son ID
router.route("/lecture/:lectureId").get(isAuthenticated, getLectureById);

// Route pour publier/dépublier un cours
router.route("/:courseId").patch(isAuthenticated, togglePublishCourse);

// Nouvelle route pour créer un quiz
router.route("/:courseId/quiz").post(isAuthenticated, createQuiz);

export default router;