import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    courseTitle: {
        type: String,
        required: true,
    },
    subTitle: {
        type: String,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
        required: true,
    },
    courseLevel: {
        type: String,
        enum: ["Facile", "Moyen", "Difficile"],
    },
    coursePrice: {
        type: Number,
        required: false,
    },
    courseThumbnail: {
        type: String,
    },
    enrolledStudents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    lectures: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lecture",
        },
    ],
    quizzes: [ // Ajoutez ce champ pour référencer les quiz
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz",
        },
    ],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

export const Course = mongoose.model("Course", courseSchema);