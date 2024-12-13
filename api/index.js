import express from 'express'
import { WebSocketServer } from 'ws';
import path from 'node:path'
import morgan from 'morgan'


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


const app = express();
app.use(morgan('dev')); // Logging

app.get('/', (req, res) => {
    const filePath = path.join(process.cwd(), 'chats', 'chat1.html');
    res.sendFile(filePath);
})

app.get('/chats/id', (req, res) => {
    const filePath = path.join(process.cwd(), 'chats', `chat${id}.html`);
    res.sendFile(filePath);
})

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`)
})