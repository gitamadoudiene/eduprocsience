import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Token not found" });
        }
        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        if (!decode) {
            return res.status(401).json({ message: "Invalid token" });
        }
        req.id = decode.userId;
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export default isAuthenticated