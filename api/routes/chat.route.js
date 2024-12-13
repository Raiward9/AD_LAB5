import express from 'express'
import { getChats } from '../controllers/chat.controller.js'

const chatRouter = express.Router()

chatRouter.get('/getAll', getChats);

export default chatRouter