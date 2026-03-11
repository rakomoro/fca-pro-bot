module.exports = async function({ event, api }) {
    const { reaction, messageID, userID, threadID } = event;
    const reactionItem = global.client.handleReaction.find(item => item.messageID === messageID);

    if (reactionItem) {
        const command = global.client.commands.get(reactionItem.commandName);
        if (command && command.handleReaction) {
            try {
                await command.handleReaction({ api, event, reactionItem });
            } catch (error) {
                console.error(`خطأ في handleReaction للأمر ${reactionItem.commandName}:`, error);
            }
        }
    }
};
