import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { deleteMediaFromCloudinary, deleteVideoFromCloudinary } from "../utils/cloudinary.js";
import { uploadMedia } from "../utils/cloudinary.js";
import { Quiz } from "../models/quiz.model.js"; // Importez le modèle Quiz


export const createCourse = async (req, res) => {
    try {
        const {courseTitle, category} = req.body;
        if(!courseTitle || !category){
            return res.status(400).json({ message: "Tous les champs sont obligatoires" });
        }

        const course = await Course.create({courseTitle, category, creator: req.id});
        return res.status(201).json({ message: "Cours créé avec succès" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "erreur lors de la creation du cours" });
    }
}

export const searchCourse = async (req,res) => {
    try {
        const {query = "", categories = [], sortByPrice =""} = req.query;
        console.log(categories);
        
        // create search query
        const searchCriteria = {
            isPublished:true,
            $or:[
                {courseTitle: {$regex:query, $options:"i"}},
                {subTitle: {$regex:query, $options:"i"}},
                {category: {$regex:query, $options:"i"}},
            ]
        }

        // if categories selected
        if(categories.length > 0) {
            searchCriteria.category = {$in: categories};
        }

        // define sorting order
        const sortOptions = {};
        if(sortByPrice === "low"){
            sortOptions.coursePrice = 1;//sort by price in ascending
        }else if(sortByPrice === "high"){
            sortOptions.coursePrice = -1; // descending
        }

        let courses = await Course.find(searchCriteria).populate({path:"creator", select:"name photoUrl"}).sort(sortOptions);

        return res.status(200).json({
            success:true,
            courses: courses || []
        });

    } catch (error) {
        console.log(error);
        
    }
}

export const getPublishedCourse = async (_,res) => {
    try {
        const courses = await Course.find({isPublished:true}).populate({path:"creator", select:"name photoUrl"});
        if(!courses){
            return res.status(404).json({
                message:"Aucun Cours publier"
            })
        }
        return res.status(200).json({
            courses,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"erreur lors de la recuperation des cours"
        })
    }
}
export const getCreatorCourses = async (req, res) => {
    try {
        const userId = req.id;
        const courses = await Course.find({creator: userId});
        if(!courses){
            return res.status(404).json({ courses: [], message: "Aucun cours trouve" });
        }
        return res.status(200).json({ courses });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "erreur lors de la recuperation des Cours" });
    }
}

export const editCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const {courseTitle, category, subTitle, description, courseLevel, coursePrice} = req.body;
        const thumbnail = req.file;

        let course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({ message: "Cours non trouve" });
        }
        let courseThumbnail;

        if(thumbnail){
            if(course.courseThumbnail){
                const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
                await deleteMediaFromCloudinary(publicId);
            }
            courseThumbnail = await uploadMedia(thumbnail.path);
        }

        const updateData = {courseTitle, category, subTitle, description, courseLevel, coursePrice, courseThumbnail: courseThumbnail?.secure_url};

        course = await Course.findByIdAndUpdate(courseId, updateData, {new: true});
        return res.status(200).json({ message: "Cours mis a jour avec success", course });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "erreur lors de la mise a jour du Cours" });
    }
}

export const getCourseById = async (req,res) => {
    try {
        const {courseId} = req.params;

        const course = await Course.findById(courseId);

        if(!course){
            return res.status(404).json({
                message:"Cours non trouver"
            })
        }
        return res.status(200).json({
            course
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"erreur pour touver le Cours"
        })
    }
}

export const createLecture = async (req,res) => {
    try {
        const {lectureTitle} = req.body;
        const {courseId} = req.params;

        if(!lectureTitle || !courseId){
            return res.status(400).json({
                message:"Le titre de la lecon est obligatoires"
            })
        };

        // creation lecture
        const lecture = await Lecture.create({lectureTitle});

        const course = await Course.findById(courseId);
        if(course){
            course.lectures.push(lecture._id);
            await course.save();
        }

        return res.status(201).json({
            lecture,
            message:"Leçon créée avec succès."
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"erreur lors de la creation de la lecon"
        })
    }
}

export const getCourseLecture = async (req,res) => {
    try {
        const {courseId} = req.params;
        const course = await Course.findById(courseId).populate("lectures");
        if(!course){
            return res.status(404).json({
                message:"cours non trouver"
            })
        }
        return res.status(200).json({
            lectures: course.lectures
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"erreur lors de la recuperation des leçons"
        })
    }
}

export const editLecture = async (req,res) => {
    try {
        const {lectureTitle,description, videoInfo, isPreviewFree} = req.body;
        
        const {courseId, lectureId} = req.params;
        const lecture = await Lecture.findById(lectureId);
        if(!lecture){
            return res.status(404).json({
                message:"leçon non trouver"
            })
        }

        if(lectureTitle) lecture.lectureTitle = lectureTitle;
        if(description) lecture.description = description;
        if(videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
        if(videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
        lecture.isPreviewFree = isPreviewFree;

        await lecture.save();

        
        const course = await Course.findById(courseId);
        if(course && !course.lectures.includes(lecture._id)){
            course.lectures.push(lecture._id);
            await course.save();
        };
        return res.status(200).json({
            lecture,
            message:"Leçon mise à jour avec succès."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Échec de la modification de la leçon."
        })
    }
}

export const removeLecture = async (req,res) => {
    try {
        const {lectureId} = req.params;
        const lecture = await Lecture.findByIdAndDelete(lectureId);
        if(!lecture){
            return res.status(404).json({
                message:"Leçon non trouvée "
            });
        }
       
        if(lecture.publicId){
            await deleteVideoFromCloudinary(lecture.publicId);
        }

       
        await Course.updateOne(
            {lectures:lectureId}, 
            {$pull:{lectures:lectureId}} 
        );

        return res.status(200).json({
            message:"Leçon supprimée avec succès."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Échec de la suppression de la leçon."
        })
    }
}

export const getLectureById = async (req,res) => {
    try {
        const {lectureId} = req.params;
        const lecture = await Lecture.findById(lectureId);
        if(!lecture){
            return res.status(404).json({
                message:"Leçon non trouvée !"
            });
        }
        return res.status(200).json({
            lecture
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Échec de la récupération de la leçon "
        })
    }
}

//publier cours

export const togglePublishCourse = async (req,res) => {
    try {
        const {courseId} = req.params;
        const {publish} = req.query; // true, false
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                message:"Cours non trouver"
            });
        }
       
        course.isPublished = publish === "true";
        await course.save();

        const statusMessage = course.isPublished ? "Publier" : "Dépublier";
        return res.status(200).json({
            message:`Le Cours est ${statusMessage}`
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Erreur lors de la publication du cours"
        })
    }
}

export const createQuiz = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { quizTitle, questions } = req.body;

        // Vérifiez que tous les champs obligatoires sont présents
        if (!quizTitle || !questions || !courseId) {
            return res.status(400).json({ message: "Tous les champs sont obligatoires" });
        }

        // Vérifiez que chaque question a exactement 4 réponses et une réponse correcte
        const isValidQuiz = questions.every(question =>
            question.question &&
            question.answers.length === 4 &&
            question.correctAnswer >= 0 &&
            question.correctAnswer < 4
        );

        if (!isValidQuiz) {
            return res.status(400).json({ message: "Chaque question doit avoir exactement 4 réponses et une réponse correcte valide." });
        }

        // Créez un nouveau quiz
        const newQuiz = new Quiz({
            quizTitle,
            courseId,
            questions,
        });

        // Sauvegardez le quiz dans la base de données
        await newQuiz.save();

        // Mettez à jour le cours pour ajouter la référence du quiz
        await Course.findByIdAndUpdate(
            courseId,
            { $push: { quizzes: newQuiz._id } }, // Ajoutez l'ID du quiz au tableau `quizzes`
            { new: true }
        );

        // Retournez une réponse réussie
        return res.status(201).json({ message: "Quiz créé avec succès", quiz: newQuiz });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erreur lors de la création du quiz", error });
    }
};


export const getQuizzesByCourseId = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Vérifiez si le cours existe
        const course = await Course.findById(courseId).populate("quizzes");
        if (!course) {
            console.log("Cours non trouvé"); // Log pour débogage
            return res.status(404).json({ message: "Cours non trouvé" });
        }

        console.log("Quiz peuplés :", course.quizzes); // Log pour vérifier les quiz peuplés

        return res.status(200).json({
            quizzes: course.quizzes || [], // Retourne les quiz peuplés
            message: "Quiz récupérés avec succès"
        });
    } catch (error) {
        console.log("Erreur :", error); // Log pour afficher l'erreur
        return res.status(500).json({
            message: "Erreur lors de la récupération des quiz",
            error: error.message // Retourne le message d'erreur
        });
    }
};