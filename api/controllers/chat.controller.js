export const getMessages = (req, res) => {
    const chatId = req.params.id;
    const numMessages = req.params.numMessages;

    console.log(`Chat id: ${chatId}`)
    console.log(`Num messages: ${numMessages}`)
}