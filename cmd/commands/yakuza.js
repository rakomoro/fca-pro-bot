const { userDb } = require('../../database/db.js');

module.exports = {
    config: {
        name: "yakuza",
        description: "لعبة الياكوزا - مهام عصابة",
        usage: "",
        category: "ألعاب",
        cooldowns: 30
    },
    run: async function({ api, event }) {
        const { senderID, threadID, messageID } = event;
        const reward = Math.floor(Math.random() * 1000) + 500;
        const loss = Math.floor(Math.random() * 500) + 200;
        const outcome = Math.random();

        let user = await userDb.getUser(senderID);
        if (!user) {
            const userInfo = await api.getUserInfo(senderID);
            const name = userInfo[senderID].name;
            await userDb.createUser(senderID, name);
            user = await userDb.getUser(senderID);
        }

        if (outcome > 0.6) {
            await userDb.updateMoney(senderID, reward);
            api.sendMessage(`👺 نفذت مهمة للياكوزا وحصلت على ${reward} عملة!`, threadID, messageID);
        } else {
            await userDb.updateMoney(senderID, -loss);
            api.sendMessage(`🚔 تم القبض عليك وفقدت ${loss} عملة!`, threadID, messageID);
        }
    }
};
