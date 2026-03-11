const login = require('ws3-fca');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const logger = require('./utils/logger.js');

global.client = {
    commands: new Map(),
    events: new Map(),
    handleReply: [],
    handleReaction: [],
    api: null,
    config: {
        prefix: "/",
        admins: ["100000000000000"], // أضف معرفات الأدمن هنا
        botName: "Manus Bot"
    }
};

async function loadModules() {
    const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        if (command.config && command.config.name) {
            global.client.commands.set(command.config.name, command);
        }
    }
    logger.info(`تم تحميل ${global.client.commands.size} أمراً.`);
}

async function startBot() {
    try {
        await loadModules();
        
        // قراءة ملف الـ appstate.json (يجب توفره)
        let appState;
        if (fs.existsSync('./appstate.json')) {
            appState = JSON.parse(fs.readFileSync('./appstate.json', 'utf8'));
        } else {
            logger.error("لم يتم العثور على ملف appstate.json. يرجى تسجيل الدخول أولاً.");
            return;
        }

        login({ appState }, (err, api) => {
            if (err) return logger.error("فشل تسجيل الدخول:", err);
            
            global.client.api = api;
            api.setOptions({ listenEvents: true, selfListen: false });

            const mainHandler = require('./handlers/mainHandler.js');
            api.listenMqtt(async (err, event) => {
                if (err) return logger.error("خطأ في الاستماع للأحداث:", err);
                await mainHandler({ event });
            });

            logger.success("تم تشغيل البوت بنجاح!");
        });
    } catch (error) {
        logger.error("حدث خطأ أثناء تشغيل البوت:", error);
    }
}

startBot();
