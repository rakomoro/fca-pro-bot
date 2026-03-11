const { userDb } = require('../../database/db.js');

module.exports = {
    config: {
        name: "war",
        description: "لعبة الحرب - ادخل معركة",
        usage: "",
        category: "ألعاب",
        cooldowns: 15
    },
    run: async function({ api, event }) {
        const { senderID, threadID, messageID } = event;
        const reward = Math.floor(Math.random() * 500) + 100;
        const loss = Math.floor(Math.random() * 300) + 50;
        const outcome = Math.random();

        let user = await userDb.getUser(senderID);
        if (!user) {
            const userInfo = await api.getUserInfo(senderID);
            const name = userInfo[senderID].name;
            await userDb.createUser(senderID, name);
            user = await userDb.getUser(senderID);
        }

        if (outcome > 0.5) {
            await userDb.updateMoney(senderID, reward);
            api.sendMessage(`⚔️ انتصرت في الحرب وحصلت على ${reward} عملة!`, threadID, messageID);
        } else {
            await userDb.updateMoney(senderID, -loss);
            api.sendMessage(`🛡️ خسرت في الحرب وفقدت ${loss} عملة!`, threadID, messageID);
        }
    }
};
