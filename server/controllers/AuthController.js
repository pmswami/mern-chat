import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const maxAge = 3 * 24 * 60 * 60 * 1000; //3days expiry
const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge });
};

export const signup = async (request, response, next) => {
    try {
        const { email, password } = request.body;
        if (!email || !password) {
            return response.status(400).send("Email or password is required");
        }
        const user = await User.create({ email, password });
        response.cookie("jwt", createToken(email, user.id), {
            maxAge, secure: true, sameSite: "None"
        });
        return response.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                // firstName: user.firstName,
                // lastName: user.lastName,
                // image: user.image,
                profileSetup: user.profileSetup
            }
        });
    }
    catch (error) {
        console.log(error);
        return response.status(500).send("Internal Server Error");
    }
};

export const login = async (request, response, next) => {
    try {
        console.log("login route");
        const { email, password } = request.body;
        if (!email || !password) {
            return response.status(400).send("Email or password is required");
        }
        const user = await User.findOne({ email });
        if (!user) {
            return response.status(404).send("User not found");
        }
        const auth = await bcrypt.compare(password, user.password);
        if (!auth) {
            return response.status(400).send("Password is incorrect");
        }
        response.cookie("jwt", createToken(email, user.id), {
            maxAge, secure: true, sameSite: "None"
        });
        return response.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                color: user.color,
                image: user.image,
                profileSetup: user.profileSetup
            }
        });
    }
    catch (error) {
        console.log(error);
        return response.status(500).send("Internal Server Error");
    }
};

export const getUserInfo = async (request, response, next) => {
    try {
        // console.log(request.userId);
        const userData = await User.findById(request.userId);
        if (!userData) {
            return response.status(404).send("User with given ID doesnt exists");
        }

        return response.status(200).json({
            id: userData.id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            color: userData.color,
            image: userData.image,
            profileSetup: userData.profileSetup
        });
    }
    catch (error) {
        console.log(error);
        return response.status(500).send("Internal Server Error");
    }
};