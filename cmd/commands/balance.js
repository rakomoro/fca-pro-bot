const { userDb } = require('../../database/db.js');

module.exports = {
    config: {
        name: "balance",
        description: "عرض رصيدك الحالي",
        usage: "",
        category: "نظام",
        cooldowns: 3
    },
    run: async function({ api, event }) {
        const { senderID, threadID, messageID } = event;
        let user = await userDb.getUser(senderID);
        if (!user) {
            const userInfo = await api.getUserInfo(senderID);
            const name = userInfo[senderID].name;
            await userDb.createUser(senderID, name);
            user = await userDb.getUser(senderID);
        }
        api.sendMessage(`💰 رصيدك الحالي هو: ${user.money} عملة.`, threadID, messageID);
    }
};
