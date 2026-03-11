const logger = require('../utils/logger.js');

module.exports = async function({ event, api }) {
    const { body, threadID, messageID, senderID } = event;
    const prefix = global.client.config.prefix;

    if (!body || !body.startsWith(prefix)) return;

    const args = body.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = global.client.commands.get(commandName);

    if (command) {
        try {
            await command.run({ api, event, args });
        } catch (error) {
            logger.error(`خطأ في تنفيذ الأمر ${commandName}:`, error);
            api.sendMessage(`حدث خطأ أثناء تنفيذ الأمر: ${error.message}`, threadID, messageID);
        }
    }
};
