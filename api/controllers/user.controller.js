import ChatUser from '../models/chatUser.model.js';
import User from '../models/user.model.js';

import {errorHandler} from '../utils/error.js';

import {statusCodes} from '../utils/statusCodes.js';

export const getChats = async (req, res, next) => {
    try {
        const username = req.params.username;
        const chats = await ChatUser.find({username}).sort({CreationDate: 1});
        if (!chats) {
            return res.status(statusCodes.NO_CONTENT).json(chats);
        }
        res
        .status(statusCodes.OK)
        .json(chats);
    } catch (error) {
        next(errorHandler(res, error));
    }
}

export const getChat = async (req, res) => {
    const {username, chatId} = req.params

    const chatUser = await ChatUser.findOne({username, chatId});
    if (chatUser == null) {
        return res.status(statusCodes.BAD_REQUEST).json({ message: "Chat not accessible" });
    }

    const user = await User.findOne({username});
    if (user == null) {
        return res.status(statusCodes.BAD_REQUEST).json({ message: "User doesn't exist" });
    }

    res.render('chatModel', { user: username, chatId: chatId });
}