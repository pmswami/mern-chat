import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { renameSync, unlink } from "fs";

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
        console.log(email, password);
        const old_user = await User.findOne({ email });
        if (old_user) {
            console.log("old user", old_user);
            return response.status(400).send("User Already exists");
        }
        const user = await User.create({ email, password });
        console.log("new user", user);
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

export const updateProfile = async (request, response, next) => {
    try {

        const { userId } = request;
        const { firstName, lastName, color } = request.body;
        console.log(userId, firstName, lastName, color);
        if (!firstName || !lastName) {
            return response.status(404).send("Firstname, lastname and color is required");
        }
        const userData = await User.findByIdAndUpdate(userId, { firstName, lastName, color, profileSetup: true }, { new: true, runValidators: true });
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



export const addProfileImage = async (request, response, next) => {
    try {
        if (!request.file) {
            return response.status(400).send("File is required");
        }

        const date = Date.now();
        console.log(request.file);
        let fileName = "upload/profiles/" + date + "-" + request.file.originalname;
        console.log(fileName);
        renameSync(request.file.path, fileName);
        // console.log("date", date);
        // console.log("user ID", request.userId);
        const updateUser = await User.findOneAndUpdate({ _id: request.userId }, { image: fileName }, { new: true, runValidators: true });
        return response.status(200).json({ image: updateUser.image });
    }
    catch (error) {
        console.log(error);
        return response.status(500).send("Internal Server Error");
    }
};


export const removeProfileImage = async (request, response, next) => {
    try {

        const { userId } = request;
        const { firstName, lastName, color } = request.body;
        console.log(userId, firstName, lastName, color);
        if (!firstName || !lastName) {
            return response.status(404).send("Firstname, lastname and color is required");
        }
        const userData = await User.findByIdAndUpdate(userId, { firstName, lastName, color, profileSetup: true }, { new: true, runValidators: true });
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