export const obtainQueryParamFromUrl = (url, paramName) => {
    const urlParams = new URLSearchParams(url.split('?')[1])
    const param = urlParams.get(paramName)
    return param
}

export const prepareResponseMessage = (messageSent) => {
    let response;
    if (messageSent.type == "text") {
        console.log(`Received Message: Content: ${messageSent.content} UserId: ${messageSent.userId}`);
        response = {
            message: `${messageSent.content}`
        }
    }
    else if (messageSent.type == "image") {
        console.log(`Recieved image`)
        response = {
            content: messageSent.content
        }
    }

    response = {
        ...response,
        type: `${messageSent.type}`,
        userId: `${messageSent.userId}`,
        chatId: `${messageSent.chatId}`
    }

    return response
}