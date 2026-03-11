module.exports = {
    config: {
        name: "reboot",
        description: "إعادة تشغيل البوت يدوياً (للمطور فقط)",
        usage: "",
        category: "نظام",
        hasPermssion: 2, // المطور فقط
        cooldowns: 10
    },
    run: async function({ api, event }) {
        const { threadID, messageID } = event;
        
        api.sendMessage("⏳ جاري إعادة تشغيل البوت... يرجى الانتظار قليلاً.", threadID, messageID, () => {
            process.exit(1); // سنعتمد على نظام إعادة التشغيل التلقائي مثل PM2 أو nodemon أو loop
        });
    }
};
