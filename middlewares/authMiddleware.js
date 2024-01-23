import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import AppError from "../utils/appError.js";

// Protected Routes token base
export const requredSignIn = async (req, res, next) => {
    const { token } = req.cookies;
    console.log("req.cookies", req.cookies);

    if (!token) {
        return next(new AppError("Unauthenticated, please login", 400));
    }

    try {
        const tokenDetails = jwt.verify(token, process.env.JWT_SECRET);
        if (!tokenDetails) {
            console.error("Token verification failed");
            return next(new AppError("Unauthenticated, please login", 401));
        }
        req.user = tokenDetails;
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        return next(new AppError("Unauthenticated, please login", 401));
    }
};

// Middleware for protecting routes
export const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    console.log("token", token);

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                console.error("Token verification failed", err);
                return res.status(403).json({ success: false, message: "Token verification failed" });
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401); // Unauthorized
    }
};

export const isAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);
        if (user.role !== "ADMIN") {
            return res.status(401).send({ success: false, message: "Unauthorized Access" });
        } else {
            next();
        }
    } catch (error) {
        console.error(error);
        res.status(401).send({ success: false, error, message: "Error in admin middleware" });
    }
};

export const validateBody = (req, res, next) => {
    const requiredParams = ["checked", "radio"];
    if (!requiredParams.every((param) => req.body.hasOwnProperty(param))) {
        return res.status(400).send({ success: false, message: "Missing required parameters" });
    }
    next();
};