const login = require('ws3-fca');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const logger = require('./utils/logger.js');

global.client = {
    commands: new Map(),
    events: new Map(),
    cooldowns: new Map(),
    handleReply: [],
    handleReaction: [],
    api: null,
    config: require('./config.json')
};

async function loadModules() {
    // تحميل الأوامر
    const commandFiles = fs.readdirSync(path.join(__dirname, 'cmd/commands')).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./cmd/commands/${file}`);
        if (command.config && command.config.name) {
            global.client.commands.set(command.config.name, command);
        }
    }
    
    // تحميل الأحداث
    const eventFiles = fs.readdirSync(path.join(__dirname, 'cmd/events')).filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const event = require(`./cmd/events/${file}`);
        if (event.config && event.config.name) {
            global.client.events.set(event.config.name, event);
        }
    }
    
    logger.info(`تم تحميل ${global.client.commands.size} أمراً و ${global.client.events.size} حدثاً.`);
}

async function startBot() {
    try {
        await loadModules();
        
        if (!fs.existsSync('./appstate.json')) {
            logger.error("لم يتم العثور على ملف appstate.json.");
            return;
        }
        
        const appState = JSON.parse(fs.readFileSync('./appstate.json', 'utf8'));

        login({ appState }, (err, api) => {
            if (err) return logger.error("فشل تسجيل الدخول:", err);
            
            global.client.api = api;
            api.setOptions(global.client.config.FCA_OPTIONS);

            const mainHandler = require('./handlers/mainHandler.js');
            api.listenMqtt(async (err, event) => {
                if (err) return logger.error("خطأ في الاستماع للأحداث:", err);
                await mainHandler({ event, api });
            });

            logger.success("تم تشغيل البوت بنجاح بواسطة Manus!");
        });
    } catch (error) {
        logger.error("حدث خطأ أثناء تشغيل البوت:", error);
    }
}

startBot();
