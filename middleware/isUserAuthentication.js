
const jwt = require("jsonwebtoken");
const userSchema = require("../model/user");

exports.isUserAuthentication = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await userSchema.findById(decoded.userId);
        if (!user || user.isDeleted) {
            return res.status(403).json({ message: "User Not Found" });
        }

        if (!user.active) {
            return res.status(403).json({ message: "User Not Active" });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("JWT Error:", err.message);
        return res.status(401).json({ message: "Token invalid or expired" });
    }
}