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
    config: require('./config.json'),
    startTime: Date.now()
};

async function loadModules() {
    const commandFiles = fs.readdirSync(path.join(__dirname, 'cmd/commands')).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        delete require.cache[require.resolve(`./cmd/commands/${file}`)];
        const command = require(`./cmd/commands/${file}`);
        if (command.config && command.config.name) {
            global.client.commands.set(command.config.name, command);
        }
    }
    
    const eventFiles = fs.readdirSync(path.join(__dirname, 'cmd/events')).filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        delete require.cache[require.resolve(`./cmd/events/${file}`)];
        const event = require(`./cmd/events/${file}`);
        if (event.config && event.config.name) {
            global.client.events.set(event.config.name, event);
        }
    }
    
    logger.info(`تم تحميل ${global.client.commands.size} أمراً و ${global.client.events.size} حدثاً.`);
}

function startBot() {
    try {
        if (!fs.existsSync('./appstate.json')) {
            logger.error("لم يتم العثور على ملف appstate.json.");
            return;
        }
        
        const appState = JSON.parse(fs.readFileSync('./appstate.json', 'utf8'));

        login({ appState }, (err, api) => {
            if (err) {
                logger.error("فشل تسجيل الدخول، سيتم إعادة المحاولة بعد 10 ثوانٍ...", err);
                return setTimeout(startBot, 10000);
            }
            
            global.client.api = api;
            api.setOptions(global.client.config.FCA_OPTIONS);

            const mainHandler = require('./handlers/mainHandler.js');
            const listenEmitter = api.listenMqtt(async (err, event) => {
                if (err) {
                    logger.error("خطأ في الاستماع (MQTT)، جاري إعادة التشغيل...", err);
                    if (listenEmitter) listenEmitter.stopListening();
                    return startBot();
                }
                await mainHandler({ event, api });
            });

            logger.success("تم تشغيل البوت بنجاح بواسطة Manus!");
        });
    } catch (error) {
        logger.error("حدث خطأ غير متوقع، سيتم إعادة المحاولة بعد 10 ثوانٍ...", error);
        setTimeout(startBot, 10000);
    }
}

async function init() {
    await loadModules();
    startBot();
}

init();

// نظام مراقبة بسيط لإعادة التشغيل عند التوقف المفاجئ
process.on('unhandledRejection', (reason, p) => {
    logger.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception thrown', err);
    // يمكنك إضافة منطق إعادة تشغيل هنا إذا لزم الأمر
});
