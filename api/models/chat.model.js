import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    chatId: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    CreationDate: {
        type: Date,
        default: Date.now
    },
}, { 
    timestamps: true, 
    // Indicar el índice TTL en el campo 'CreationDate'
    expireAfterSeconds: 86400 // 86400 segundos = 24 horas
});

// Crear el modelo de Mongoose
const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
