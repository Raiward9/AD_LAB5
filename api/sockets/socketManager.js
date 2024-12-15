import { obtainQueryParamFromUrl } from "../utils/sockets.js";

export const broadcastMessageInSocketChat = (message, chat) => {
    const uniqueSocketIdentifierInChatList = socketConnectionsInChat[chat]
    console.log(uniqueSocketIdentifierInChatList)
    uniqueSocketIdentifierInChatList.forEach(uniqueSocketIdentifierInChat => {
        const socket = uniqueIdentifierToSocketConnection[uniqueSocketIdentifierInChat]
        socket.send(message)
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

    addUniqueSocketIdentifierToChat(chatId, uniqueSocketIdentifier)
    addSocketToUniqueSocketIdentifier(socket, uniqueSocketIdentifier)

    return uniqueSocketIdentifier
}

export const addUniqueSocketIdentifierToChat = (chat, uniqueSocketIdentifier) => {

    // if the socket connection is already in the system. Useful for local testing
    if(uniqueSocketIdentifier in uniqueIdentifierToSocketConnection) return;

    if (chat in socketConnectionsInChat) {
        socketConnectionsInChat[chat].push(uniqueSocketIdentifier)
    }
    else socketConnectionsInChat[chat] = [uniqueSocketIdentifier]
}

export const addSocketToUniqueSocketIdentifier = (socket, uniqueSocketIdentifier) => {
    uniqueIdentifierToSocketConnection[uniqueSocketIdentifier] = socket
}

export const disconnectSocketFromChat = (uniqueSocketIdentifier) => {
    
    // if it has already been removed or wrong input
    if (! (uniqueSocketIdentifier in uniqueIdentifierToSocketConnection)) return;

    // remove entry from uniqueIdentifierToSocketConnection
    const chat = getChatFromUniqueSocketIdentifier(uniqueSocketIdentifier)
    console.log(chat)
    delete uniqueIdentifierToSocketConnection[uniqueIdentifierToSocketConnection]


    // remove entry from socketConnectionsInChat    
    if(chat in socketConnectionsInChat) {
        const indexSocket = socketConnectionsInChat[chat].indexOf(uniqueIdentifierToSocketConnection)
        socketConnectionsInChat[chat].splice(indexSocket, 1)
    }
    
    for (const [key, value] of Object.entries(socketConnectionsInChat)) {
        console.log(`Chat ${key} has ${value.length}`)
    }

    if(socketConnectionsInChat[chat].length === 0) {
        delete socketConnectionsInChat[chat]
    }
}

const generateUniqueSocketIdentifier = (chatId, userId) => {
    return chatId + '.' + userId
}

const getChatFromUniqueSocketIdentifier = (uniqueIdentifierToSocketConnection) => {
    return uniqueIdentifierToSocketConnection.split('.')[0]
}

// chat -> list(uniqueSocketIdentifier of sockets connections in chat)
export const socketConnectionsInChat = {

}

// UniqueIdentifier -> socket
export const uniqueIdentifierToSocketConnection = {

}