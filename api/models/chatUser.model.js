import mongoose from "mongoose";

const chatUserSchema = new mongoose.Schema({
    chatId: {
        type: Number,
        required: true
    },
    
    username: {
        type: String,
        required: true,
    },
    CreationDate: {
        type: Date,
        default: Date.now
    },
}, { 
    timestamps: true, 
});

// Crear el modelo de Mongoose
const ChatUser = mongoose.model('ChatUser', chatUserSchema);

export default ChatUser;
