import express from 'express'
import { WebSocketServer } from 'ws';
import path from 'node:path'
import morgan from 'morgan'
import moongose from 'mongoose'

import dotenv from 'dotenv';
dotenv.config();

import chatRouter from './routes/chat.route.js';

import authRouter from './routes/auth.route.js';


import { 
    initSocketConnection,
    disconnectSocket
    } from './utils/sockets.js'
import fs from 'fs'


const server = new WebSocketServer({ port: 8765 });

server.on('connection', async (socket, req) => {
    initSocketConnection(socket, req)

    console.log('Client connected');

    socket.on('message', (message) => {
        const messageSent = JSON.parse(message)

        let response;
        if(messageSent.type == "text") {
            console.log(`Received from client: ${messageSent.content}`);
            response = `Server received message: ${messageSent.content}, userId: ${messageSent.userId}, chatId: ${messageSent.chatId}`;
            socket.send(response);
        }
        else if(messageSent.type == "image") {
            const filePath = path.join(process.cwd(), 'api', 'assets', 'received_image.webp');
            const imageData = messageSent.content
            const buffer = Buffer.from(imageData, 'base64');
            
            fs.writeFile(filePath, buffer, (err) => {
                if (err) {
                    console.error('Error saving image:', err);
                } else {
                    console.log(`Image saved successfully as ${filePath}`);
                }
            });

            console.log(`Received from client ${messageSent.userId}`)
            response = `Server received message: ${messageSent.content}, userId: ${messageSent.userId}, chatId: ${messageSent.chatId}`;
            socket.send(response);
        }
        
    });

    socket.on('close', () => {
        disconnectSocket(socket)
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

app.use(morgan('dev')); // Logging

app.get('/', (req, res) => {
    const filePath = path.join(process.cwd(), 'chats', 'chat1.html');
    res.sendFile(filePath);
})

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