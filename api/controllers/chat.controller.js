import ChatMessage from '../models/chatMessage.model.js';
import ChatUser from '../models/chatUser.model.js';
import User from '../models/user.model.js';

import {errorHandler} from '../utils/error.js';

import {statusCodes} from '../utils/statusCodes.js';


export const getMessages = async (req, res, next) => {
    const chatId = req.params.id;
    const numMessages = req.params.numMessages;

    console.log(`Chat id: ${chatId}`)
    console.log(`Num messages: ${numMessages}`)

    try {
        const messages = await ChatMessage.find({chatId}).sort({CreationDate: 1}).limit(numMessages);
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
    let newMessage = null;
    const typeMessage = message.type;
    if (typeMessage == "text") {
        const {chatId, userId, message: messageText, type} = message;
        newMessage = new ChatMessage({chatId, username:userId, message: messageText, type});
    } 
    else {
        const {chatId, userId, content, type} = message;
        newMessage = new ChatMessage({chatId, username:userId, message: content, mimeType: message.mimeType, type});
    }
    
    try {
        await newMessage.save();
    } catch (error) {
        console.error('Error storing message:', error);
    }
}

export const newChat = async (req, res, next) => {
    const {username} = req.body;
    console.log('New chat for:', username);
    let chatId;
    try {
        const maxChatId = await ChatUser.aggregate([
            {
                $sort: { chatId: -1 }  
            },
            {
                $limit: 1  
            },
            {
                $project: { chatId: 1, _id: 0 }
            }  
        ])
        if (maxChatId.length == 0) {
            const allChats = await ChatUser.find();
            if (!allChats) {
                return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({message: 'Error getting max chatId'});
            }
            else  chatId = 1;
            //return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({message: 'Error getting max chatId'});
        }
        else  chatId = maxChatId[0].chatId + 1;
    } catch (error) {
        next(errorHandler(res, error));
    }
    const newChat = new ChatUser({chatId, username});

    try {
        await newChat.save();
        res.status(statusCodes.CREATED).json({message: 'New Chat created or user added to chat', newChat: newChat});
    } catch (error) {
        next(errorHandler(res, error));
    }
}

export const newUserInChat = async (req, res, next) => {
    const {chatId, username} = req.params;
    console.log('New user:', username, 'in chat:', chatId);

    const chatUser = await ChatUser.findOne({chatId, username})
    if (chatUser != null)
        return res.status(statusCodes.BAD_REQUEST).json({ message: "User is already in the chat." })

    const user = await User.findOne({username});
    if (user == null) {
        return res.status(statusCodes.BAD_REQUEST).json({ message: "User doesn't exist" });
    }

    const newUser = new ChatUser({chatId, username});

    try {
        await newUser.save();
        res.status(statusCodes.CREATED).json({message: 'New user added to chat', newUser: newUser});
    } catch (error) {
        next(errorHandler(res, error));
    }
}