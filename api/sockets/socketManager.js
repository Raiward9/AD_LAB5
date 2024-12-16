import { obtainQueryParamFromUrl } from "../utils/sockets.js";
import crypto from 'crypto'

export const broadcastMessageInSocketChat = (message, chat) => {
    const uniqueSocketIdentifierInChatList = socketConnectionsInChat[chat]
    
    uniqueSocketIdentifierInChatList.forEach(uniqueSocketIdentifierInChat => {
        const socket = uniqueIdentifierToSocketConnection[uniqueSocketIdentifierInChat]
        socket.send(JSON.stringify(message))
    });
}

export const initSocketConnection = (socket, req) => {
    const url = req.url
    const chat = obtainQueryParamFromUrl(url, 'chat')
    const userId = obtainQueryParamFromUrl(url, 'userId')

    return addSocketConnection(socket, chat, userId)
}

export const addSocketConnection = (socket, chatId, userId) => {
    const uniqueSocketIdentifier = generateUniqueSocketIdentifier(chatId, userId)

    cleanConnectionsWhereUniqueSocketIdentifierAppears(uniqueSocketIdentifier)
    addUniqueSocketIdentifierToChat(chatId, uniqueSocketIdentifier)
    addSocketToUniqueSocketIdentifier(socket, uniqueSocketIdentifier)
    return uniqueSocketIdentifier
}

export const cleanConnectionsWhereUniqueSocketIdentifierAppears = (uniqueSocketIdentifier) => {
    // if socket already in the system, erase all the entries related to it before creating the 
    if(uniqueSocketIdentifier in uniqueIdentifierToSocketConnection) {
        disconnectSocketFromChat(uniqueSocketIdentifier)
    }
}

export const addUniqueSocketIdentifierToChat = (chat, uniqueSocketIdentifier) => {    
    if (chat in socketConnectionsInChat) {
        socketConnectionsInChat[chat].push(uniqueSocketIdentifier)
    }
    else socketConnectionsInChat[chat] = [uniqueSocketIdentifier]
}

export const addSocketToUniqueSocketIdentifier = (socket, uniqueSocketIdentifier) => {
    uniqueIdentifierToSocketConnection[uniqueSocketIdentifier] = socket
}

export const disconnectSocketFromChat = (uniqueSocketIdentifier) => {
    
    const chat = getChatFromUniqueSocketIdentifier(uniqueSocketIdentifier)

    // if it has already been removed or wrong input
    if (! (uniqueSocketIdentifier in uniqueIdentifierToSocketConnection)) return;

    // remove entry from uniqueIdentifierToSocketConnection
    delete uniqueIdentifierToSocketConnection[uniqueIdentifierToSocketConnection]

    // remove entry from socketConnectionsInChat    
    if(chat in socketConnectionsInChat) {
        const indexSocket = socketConnectionsInChat[chat].indexOf(uniqueSocketIdentifier)

        if(indexSocket != -1) 
            socketConnectionsInChat[chat].splice(indexSocket, 1)
    }
    
    // optional
    if(chat in socketConnectionsInChat && socketConnectionsInChat[chat].length === 0) {
        delete socketConnectionsInChat[chat]
    }
}

const generateUniqueSocketIdentifier = (chatId, userId) => {
    return chatId + '.' + userId;
}

const getChatFromUniqueSocketIdentifier = (uniqueSocketIdentifier) => {
    return uniqueSocketIdentifier.split('.')[0]
}

// chat -> list(uniqueSocketIdentifier of sockets connections in chat)
export const socketConnectionsInChat = {

}

// UniqueIdentifier -> socket
export const uniqueIdentifierToSocketConnection = {

}