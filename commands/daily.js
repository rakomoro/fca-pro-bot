const { userDb } = require('../database/db.js');

module.exports = {
    config: {
        name: "daily",
        description: "احصل على مكافأتك اليومية من العملات",
        usage: "",
        category: "نظام"
    },
    run: async function({ api, event }) {
        const { senderID, threadID, messageID } = event;
        const now = Date.now();
        const dailyAmount = 500;
        const cooldown = 24 * 60 * 60 * 1000; // 24 ساعة

        let user = await userDb.getUser(senderID);
        if (!user) {
            const userInfo = await api.getUserInfo(senderID);
            const name = userInfo[senderID].name;
            await userDb.createUser(senderID, name);
            user = await userDb.getUser(senderID);
        }

        if (now - user.last_daily < cooldown) {
            const timeLeft = cooldown - (now - user.last_daily);
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            return api.sendMessage(`لقد حصلت بالفعل على مكافأتك اليومية. انتظر ${hours} ساعة و ${minutes} دقيقة أخرى.`, threadID, messageID);
        }

        await userDb.updateMoney(senderID, dailyAmount);
        await userDb.updateLastDaily(senderID, now);
        api.sendMessage(`✅ تم إضافة ${dailyAmount} عملة إلى رصيدك!`, threadID, messageID);
    }
};
