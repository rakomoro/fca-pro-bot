module.exports = {
    config: {
        name: "uptime",
        description: "عرض مدة تشغيل البوت وحالة النظام",
        usage: "",
        category: "نظام",
        cooldowns: 5
    },
    run: async function({ api, event }) {
        const { threadID, messageID } = event;
        const uptime = Date.now() - global.client.startTime;
        
        const hours = Math.floor(uptime / (1000 * 60 * 60));
        const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((uptime % (1000 * 60)) / 1000);
        
        const memoryUsage = process.memoryUsage().rss / 1024 / 1024;
        
        let msg = `🕒 حالة البوت:\n\n`;
        msg += `⏳ مدة التشغيل: ${hours} ساعة، ${minutes} دقيقة، ${seconds} ثانية.\n`;
        msg += `💻 استهلاك الذاكرة: ${memoryUsage.toFixed(2)} MB.\n`;
        msg += `📡 الحالة: متصل (Online).\n`;
        msg += `🤖 الاسم: ${global.client.config.BOTNAME}.\n`;
        
        api.sendMessage(msg, threadID, messageID);
    }
};
