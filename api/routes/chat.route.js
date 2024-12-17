import express from 'express';
import { getMessages } from '../controllers/chat.controller.js';

const chatRouter = express.Router();
chatRouter.get('/:id/messages/:numMessages', getMessages);

export default chatRouter;