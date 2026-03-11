const { userDb } = require('../../database/db.js');

module.exports = {
    config: {
        name: "cave",
        description: "لعبة المغارة - استكشف الكنوز",
        usage: "",
        category: "ألعاب",
        cooldowns: 10
    },
    run: async function({ api, event }) {
        const { senderID, threadID, messageID } = event;
        const reward = Math.floor(Math.random() * 200) + 50;
        const loss = Math.floor(Math.random() * 100) + 20;
        const outcome = Math.random();

        let user = await userDb.getUser(senderID);
        if (!user) {
            const userInfo = await api.getUserInfo(senderID);
            const name = userInfo[senderID].name;
            await userDb.createUser(senderID, name);
            user = await userDb.getUser(senderID);
        }

        if (outcome > 0.4) {
            await userDb.updateMoney(senderID, reward);
            api.sendMessage(`🔦 استكشفت المغارة ووجدت كنزاً بقيمة ${reward} عملة!`, threadID, messageID);
        } else {
            await userDb.updateMoney(senderID, -loss);
            api.sendMessage(`🦇 هاجمتك الخفافيش وفقدت ${loss} عملة!`, threadID, messageID);
        }
    }
};
