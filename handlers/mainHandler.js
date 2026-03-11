const handleCommand = require('./handleCommand.js');
const handleReply = require('./handleReply.js');
const handleReaction = require('./handleReaction.js');
const logger = require('../utils/logger.js');

module.exports = async function({ event, api }) {
    if (!event) return;

    // تشغيل الأحداث (Events) لجميع الأوامر
    for (const [name, command] of global.client.commands) {
        if (command.handleEvent) {
            try {
                await command.handleEvent({ api, event });
            } catch (e) {
                logger.error(`خطأ في handleEvent للأمر ${name}:`, e);
            }
        }
    }

    // تشغيل ملفات الأحداث المستقلة (Events in cmd/events)
    for (const [name, eventModule] of global.client.events) {
        if (eventModule.config && eventModule.config.eventType && eventModule.config.eventType.includes(event.logMessageType || event.type)) {
            try {
                await eventModule.run({ api, event });
            } catch (e) {
                logger.error(`خطأ في تنفيذ الحدث ${name}:`, e);
            }
        }
    }

    try {
        switch (event.type) {
            case "message":
            case "message_reply":
                if (event.messageReply) {
                    await handleReply({ event, api });
                } else {
                    await handleCommand({ event, api });
                }
                break;

            case "message_reaction":
                await handleReaction({ event, api });
                break;
        }
    } catch (error) {
        logger.error("خطأ غير متوقع في المعالج الرئيسي:", error);
    }
};
