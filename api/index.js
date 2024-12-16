import express from 'express'
import { WebSocketServer } from 'ws';
import path from 'node:path'
import morgan from 'morgan'
import moongose from 'mongoose'

import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';


dotenv.config();

import chatRouter from './routes/chat.route.js';

import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser'

import fs from 'fs'

import { 
        initSocketConnection, 
        disconnectSocketFromChat, 
        broadcastMessageInSocketChat 
    } from './sockets/socketManager.js';
import { obtainQueryParamFromUrl } from './utils/sockets.js';



const server = new WebSocketServer({ port: 8765 });

server.on('connection', (socket, req) => {
    const uniqueSocketIdentifier = initSocketConnection(socket, req)
    const url = req.url
    const chat = obtainQueryParamFromUrl(url, "chat")
    const userId = obtainQueryParamFromUrl(url, "userId")

    console.log(`Client connected, User: ${userId}, Chat: ${chat}`);

    socket.on('message', (message) => {
        const messageSent = JSON.parse(message)

        console.log(messageSent)
        let response;
        if(messageSent.type == "text") {
            console.log(`Received Message: Content: ${messageSent.content} UserId: ${messageSent.userId} ChatId: ${chat}`);
            response = {
                type: "text",
                message: `${messageSent.content}`,
                userId: `${messageSent.userId}`,
                chatId: `${messageSent.chatId}`
            }
            console.log("RESP:", response)   
            broadcastMessageInSocketChat(response, chat)
        }
        else if(messageSent.type == "image") {
            console.log(`Recieved image`)
            response = {
                type: "image",
                content: messageSent.content,
                mimeType: `${messageSent.mimeType}`,
                userId: `${messageSent.userId}`,
                chatId: `${messageSent.chatId}`
            }
            
            broadcastMessageInSocketChat(response, chat)
        }
        
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
app.set('views', path.join(process.cwd(), 'chats'));

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
        //console.log(req.session.user)
        return res.redirect('/signin')
    }

    //const filePath = path.join(process.cwd(), 'chats', 'chat1.html');
    //res.sendFile(filePath);
    res.render('chatModel', { user: user.username });
})

app.get('/signin', (req, res) => {
    const filePath = path.join(process.cwd(), 'frontend', 'login.html');
    //const CSSpath = path.join(process.cwd(), 'CSS', 'login.css');
    res.sendFile(filePath);
})

app.get('/signup', (req, res) => {
    const filePath = path.join(process.cwd(), 'frontend', 'register.html');
    res.sendFile(filePath);
})


// app.get('/chat/2/id', (req, res) => {
//     const filePath = path.join(process.cwd(), 'chats', 'chat2.html');
//     res.sendFile(filePath);
// })


app.use('/auth', authRouter);

app.use('/chats', chatRouter);

app.get('/chats/id', (req, res) => {
    const filePath = path.join(process.cwd(), 'chats', `chat${id}.html`);
    res.sendFile(filePath);
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`)
})