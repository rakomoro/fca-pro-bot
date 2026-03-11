module.exports = async function({ event, api }) {
    const { messageReply, threadID, messageID, body } = event;
    const replyItem = global.client.handleReply.find(item => item.messageID === messageReply.messageID);

    if (replyItem) {
        const command = global.client.commands.get(replyItem.commandName);
        if (command && command.handleReply) {
            try {
                await command.handleReply({ api, event, replyItem });
            } catch (error) {
                console.error(`خطأ في handleReply للأمر ${replyItem.commandName}:`, error);
            }
        }
    }
};
