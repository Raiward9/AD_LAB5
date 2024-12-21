import ChatMessage from '../models/chatMessage.model.js';
import ChatUser from '../models/chatUser.model.js';

import {errorHandler} from '../utils/error.js';

import {statusCodes} from '../utils/statusCodes.js';

export const getChats = async (req, res, next) => {
    try {
        const chats = await ChatUser.find();
        if (!chats) {
            return res.status(statusCodes.NO_CONTENT).json(chats);
        }
        console.log(chats)
        res
        .status(statusCodes.OK)
        .json(chats);
    } catch (error) {
        next(errorHandler(res, error));
    }
}