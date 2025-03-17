import  {User}  from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { deleteVideoFromCloudinary } from "../utils/cloudinary.js";
import { uploadMedia } from "../utils/cloudinary.js";


export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Tous les champs sont obligatoires" });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "L'utilisateur existe deja" });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, password:hashPassword });
        return res.status(201).json({ message: "Utilisateur cree avec success" });
} catch (error) {
    return res.status(500).json({ message: error.message });
}
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Tous les champs sont obligatoires" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "L'utilisateur n'existe pas" });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Mot de passe incorrect" });
        }
        generateToken(res, user, `Bon retour ${user.name}`);


        
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const logout = async (_, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).cookie("token", "", {maxAge: 0}).json({ message: "Deconnexion reussie" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select("-password").populate("enrolledCourses");
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouve" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { name} = req.body;
        const profilPhoto = req.file;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouve" });
        }
        // extract image id
        if(user.photoUrl){
            const publicId = user.photoUrl.split("/").pop().split(".")[0];
            deleteVideoFromCloudinary(publicId);
        }

        //upload new image
        const cloudResponse = await uploadMedia(profilPhoto.path);
        const photoUrl = cloudResponse.secure_url;

        const updatedData ={name, photoUrl};
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true }).select("-password");

        return res.status(200).json({ message: "Profil mis a jour avec success", user: updatedUser });



        user.name = name;
        user.email = email;
        await user.save();
        return res.status(200).json({ message: "Profil mis a jour avec success" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}