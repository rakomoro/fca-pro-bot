const handleCommand = require('./handleCommand.js');
const handleReply = require('./handleReply.js');
const handleReaction = require('./handleReaction.js');
const logger = require('../utils/logger.js');

module.exports = async function({ event }) {
    if (!event) return;

    // تشغيل handleEvent لجميع الأوامر
    for (const [name, command] of global.client.commands) {
        if (command.handleEvent) {
            try {
                await command.handleEvent({ api: global.client.api, event });
            } catch (e) {
                logger.error(`خطأ في handleEvent للأمر ${name}:`, e);
            }
        }
    }

    try {
        switch (event.type) {
            case "message":
            case "message_reply":
                if (event.messageReply) {
                    await handleReply({ event, api: global.client.api });
                } else {
                    await handleCommand({ event, api: global.client.api });
                }
                break;

            case "message_reaction":
                await handleReaction({ event, api: global.client.api });
                break;

            case "log:subscribe":
            case "log:unsubscribe":
                for (const [name, command] of global.client.commands) {
                    if (command.config && command.config.eventType && command.config.eventType.includes(event.logMessageType)) {
                        await command.run({ api: global.client.api, event });
                    }
                }
                break;
        }
    } catch (error) {
        logger.error("خطأ غير متوقع في المعالج الرئيسي:", error);
    }
};
