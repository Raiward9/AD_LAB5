import express from 'express';
import { getMessages, newChat} from '../controllers/chat.controller.js';

const chatRouter = express.Router();
chatRouter.get('/:id/messages/:numMessages', getMessages);
chatRouter.post('/newChat', newChat);


export default chatRouter;