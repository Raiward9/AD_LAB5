export const obtainQueryParamFromUrl = (url, paramName) => {
    const urlParams = new URLSearchParams(url.split('?')[1])
    const chat = urlParams.get('chat')
    const userId = urlParams.get('userId')
    return chat
}