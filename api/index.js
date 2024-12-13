import express from 'express'
import { WebSocketServer } from 'ws';
import path from 'node:path'
import morgan from 'morgan'
import moongose from 'mongoose'

import dotenv from 'dotenv';
dotenv.config();

import chatRouter from './routes/chat.route.js';
import authRouter from './routes/auth.route.js';


const server = new WebSocketServer({ port: 8765 });

server.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('message', (message) => {
        console.log(`Received from client: ${message}`);
        const response = `Server received: ${message}`;
        socket.send(response); // Send response back to client
    });

    socket.on('close', () => {
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

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`)
})