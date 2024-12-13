export const obtainQueryParamFromUrl = (url, paramName) => {
    const urlParams = new URLSearchParams(url.split('?')[1])
    const chat = urlParams.get('chat')
    return chat
}

export const initSocketConnection = (socket, req) => {
    const url = req.url
    const chat = obtainQueryParamFromUrl(url, 'chat')
    addSocketConnectionToChat(chat, socket)
    addChatToSocketConnection(socket, chat)
}

export const addSocketConnectionToChat = (chat, socket) => {
    if (chat in socketConnectionsInChat) {
        socketConnectionsInChat[chat].push(socket)
    }
    else socketConnectionsInChat[chat] = [socket]
}

export const addChatToSocketConnection = (socket, chat) => {
    chatInSocketConnection[socket] = chat
}

export const disconnectSocket = (socket) => {
    console.log("Removing socket")

    // remove entry from chatInSocketConnection
    const chat = chatInSocketConnection[socket]
    delete chatInSocketConnection[socket]

    // remove entry from socketConnectionsInChat
    const indexSocket = socketConnectionsInChat[chat].indexOf(socket) + 1
    socketConnectionsInChat[chat] = socketConnectionsInChat[chat].splice(indexSocket)

    if(socketConnectionsInChat[chat].length === 0) {
        console.log("Destroying chat")
        delete socketConnectionsInChat[chat]
    }
}

// chat -> list(connected sockets in the chat)
export const socketConnectionsInChat = {

}

// socket -> chat
export const chatInSocketConnection = {

}