import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js";
import cors from "cors";
import courseRoute from "./routes/course.route.js";
import mediaRoute from "./routes/media.route.js";
// import purchaseRoute from "./routes/purchaseCourse.route.js";
import courseProgressRoute from "./routes/courseProgress.route.js";
// import paymentRoutes from './routes/paymentRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
dotenv.config({});


//connection bd
connectDB();
const app = express();

const PORT = process.env.PORT || 3000
 
//default middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

//api
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
// app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/progress", courseProgressRoute);
app.use('/payments', paymentRoutes);




app.get("/api/v1/user/register", (_, res) => {
    res.status(200).json({ message: "Welcome to backend" });    
    
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});

