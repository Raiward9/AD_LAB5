import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import {errorHandler} from '../utils/error.js';
import jwt from 'jsonwebtoken';
import {statusCodes} from '../utils/statusCodes.js';
import dotenv from 'dotenv';
dotenv.config();

export const signup = async (req, res, next) => {
    const {username, password} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({username, password: hashedPassword});

    try {
        await newUser.save();
        res.status(statusCodes.CREATED).json({message: 'User created successfully', username: newUser.username});
    } catch (error) {
        next(errorHandler(res, error));
    }
}

export const signin = async (req, res, next) => {
    const {username, password} = req.body;
    try {
        const validUser = await User.findOne({username});
        if (!validUser) {
            return res.status(statusCodes.UNAUTHORIZED).json({message: 'User not found'});
        }
        const isPasswordValid = bcrypt.compareSync(password, validUser.password);
        if (!isPasswordValid) {
            return res.status(statusCodes.UNAUTHORIZED).json({message: 'Invalid password'});
        }
        const {password: _, ...restUser} = validUser._doc;
        const token = jwt.sign({username}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res
        .cookie('access_token', token, {httpOnly: true})
        .status(statusCodes.OK)
        .json(restUser);
    } catch (error) {
        next(errorHandler(res, error));
    }
}

export const signout = (req, res, next) => {
    try {
        res
        .clearCookie('access_token', { httpOnly: true })
        .status(statusCodes.OK)
        .json({ message: 'User signed out successfully' });
    } catch (error) {
        next(errorHandler(res, error));
    }
};


