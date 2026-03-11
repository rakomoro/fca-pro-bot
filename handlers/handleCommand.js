const stringSimilarity = require('string-similarity');
const logger = require('../utils/logger.js');

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

let isBotActive = true;
const botOwnerID = "100003922506337";

module.exports = async function({ event, api }) {
    const { body, senderID, threadID, messageID } = event;

    if (!body) return;
    if (senderID === botOwnerID) {
        if (body.toLowerCase() === "ايقاف") {
            isBotActive = false;
            return api.sendMessage("واخيرا وقت الراحة ヽʕ•͡-•ʔﾉ ", threadID, messageID);
        }
        if (body.toLowerCase() === "تشغيل") {
            isBotActive = true;
            return api.sendMessage("عاد الاسد اللهم لا حسد ヽʕ•͡-•ʔﾉ ", threadID, messageID);
        }
    }

    if (!isBotActive && senderID !== botOwnerID) {
        return; 
    }

    const { config, commands, cooldowns } = global.client;
    const prefix = config.PREFIX;
    const prefixRegex = new RegExp(`^(${escapeRegex(prefix)})\\s*`);

    if (!prefixRegex.test(body)) return;
    const [matchedPrefix] = body.match(prefixRegex);
    const args = body.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
        
    let command = commands.get(commandName);
    
    if (!command) {
        const allCommandNames = Array.from(commands.keys());
        const bestMatch = stringSimilarity.findBestMatch(commandName, allCommandNames);
        if (bestMatch.bestMatch.rating >= 0.5) {
            return api.sendMessage(`الأمر "${commandName}" غير موجود. هل تقصد "${bestMatch.bestMatch.target}"ʕ•͡-•ʔ`, threadID, messageID);
        }
        return;
    }

    let userPermission = 0;
    try {
        const threadInfo = await api.getThreadInfo(threadID); 
        if (config.ADMINBOT.includes(senderID)) { 
            userPermission = 2;
        } else if (threadInfo.adminIDs.some(admin => admin.id === senderID)) {
            userPermission = 1;
        }
    } catch (e) {
        userPermission = 0;
    }

    if ((command.config.hasPermssion || 0) > userPermission) {
        return api.sendMessage("ليس لديك الصلاحية الكافية لاستخدام هذا الأمر.", threadID, messageID);
    }

    const now = Date.now();
    const cooldownTime = (command.config.cooldowns || 3) * 1000;
    const userCooldowns = cooldowns.get(senderID) || new Map();
        
    if (userCooldowns.has(command.config.name) && (now - userCooldowns.get(command.config.name)) < cooldownTime) {
        return api.setMessageReaction("⏳", messageID, () => {}, true);
    }

    try {
        const props = { api, event, args, permission: userPermission };
        await command.run(props);
            
        userCooldowns.set(command.config.name, now);
        cooldowns.set(senderID, userCooldowns);

    } catch (error) {
        logger.error(`خطأ في تنفيذ الأمر ${command.config.name}:`, error);
        api.sendMessage(`حدث خطأ أثناء تنفيذ الأمر: ${error.message}`, threadID, messageID);
    }
};
