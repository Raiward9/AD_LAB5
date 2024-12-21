import express from 'express';
import { getMessages, newChat, newUserInChat } from '../controllers/chat.controller.js';

const chatRouter = express.Router();
chatRouter.get('/:id/messages/:numMessages', getMessages);
chatRouter.post('/newChat', newChat);
chatRouter.post('/:chatId/newUser/:username', newUserInChat);


export default chatRouter;