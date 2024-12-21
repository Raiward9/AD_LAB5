import express from 'express';
import { getChats } from "../controllers/user.controller.js";

const userRouter = express.Router();
userRouter.get('/:username/getChats', getChats);

export default userRouter;