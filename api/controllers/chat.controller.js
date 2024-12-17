import Chat from '../models/chat.model.js';

import {errorHandler} from '../utils/error.js';

import {statusCodes} from '../utils/statusCodes.js';


export const getMessages = async (req, res, next) => {
    const chatId = req.params.id;
    const numMessages = req.params.numMessages;

    console.log(`Chat id: ${chatId}`)
    console.log(`Num messages: ${numMessages}`)

    try {
        const messages = await Chat.find({chatId}).sort({CreationDate: 1}).limit(numMessages);
        console.log(messages)
        if (!messages) {
            return res.status(statusCodes.NO_CONTENT).json(messages);
        }
        res
        .status(statusCodes.OK)
        .json(messages);
    } catch (error) {
        next(errorHandler(res, error));
    }

}

export const storeMessageInDatabase = async (message) => {
    const {chatId, userId, message: messageText, type} = message;
    //console.log('Message:', message);
    const newMessage = new Chat({chatId, username:userId, message: messageText, type});

    try {
        //console.log('Message to store:', newMessage);
        await newMessage.save();
    } catch (error) {
        console.error('Error storing message:', error);
    }
}