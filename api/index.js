import express from 'express'
import { WebSocketServer } from 'ws';
import path from 'node:path'
import morgan from 'morgan'
import moongose from 'mongoose'

import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';


dotenv.config();

import authRouter from './routes/auth.route.js';
import chatRouter from './routes/chat.route.js';

import cookieParser from 'cookie-parser'

import { 
        initSocketConnection, 
        disconnectSocketFromChat, 
        broadcastMessageInSocketChat 
    } from './sockets/socketManager.js';
import { obtainQueryParamFromUrl, prepareResponseMessage } from './utils/sockets.js';

import { storeMessageInDatabase } from './controllers/chat.controller.js';


const PORT_WS = process.env.PORT_WS || 8765
const server = new WebSocketServer({ port: PORT_WS });

server.on('connection', (socket, req) => {
    const uniqueSocketIdentifier = initSocketConnection(socket, req)
    const url = req.url
    const chat = obtainQueryParamFromUrl(url, "chat")
    const userId = obtainQueryParamFromUrl(url, "userId")

    console.log(`Client connected, User: ${userId}, Chat: ${chat}`);

    socket.on('message', async (message) => {
        const messageSent = JSON.parse(message)

        console.log(messageSent)
        let response = prepareResponseMessage(messageSent)
        broadcastMessageInSocketChat(response, chat)
        response.chatId = "1"
        await storeMessageInDatabase(response)
        
    });

    socket.on('close', () => {
        disconnectSocketFromChat(uniqueSocketIdentifier)
        console.log('Client disconnected');
    });

    socket.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

moongose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

const app = express();
app.use(express.json());
app.use(morgan('dev')); 
app.use(cookieParser())

app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'frontend'));

app.use('/CSS', express.static(path.join(process.cwd(), 'CSS')));

app.use((req, res, next) => {
    const token = req.cookies.access_token

    let data = null
  
    req.session = { user: null }
  
    try {
      data = jwt.verify(token, process.env.JWT_SECRET)
      console.log(data)
      req.session.user = data
    } catch {}
  
    next() 
  })

app.get('/', (req, res) => {
    const { user } = req.session
    if (!user) {
        return res.redirect('/signin')
    }

    res.render('chatModel', { user: user.username });
})

app.get('/signin', (req, res) => {
    const filePath = path.join(process.cwd(), 'frontend', 'login.html');
    res.sendFile(filePath);
})

app.get('/signup', (req, res) => {
    const filePath = path.join(process.cwd(), 'frontend', 'register.html');
    res.sendFile(filePath);
})

app.get('/menu', (req, res) => {
    const { user } = req.session
    if (!user) {
        return res.redirect('/signin')
    }
    res.render('menu', {user: user.username});
})

app.use('/auth', authRouter);

app.use('/chat', chatRouter);

const PORT = process.env.PORT_API || 3000
app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`)
})