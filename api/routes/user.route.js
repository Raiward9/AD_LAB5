import express from 'express';
import { getChats, getChat } from "../controllers/user.controller.js";

const userRouter = express.Router();
userRouter.get('/:username/getChats', getChats);
userRouter.get('/:username/chat/:chatId', getChat);

export default userRouter;