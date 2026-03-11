const { userDb } = require('../database/db.js');

module.exports = {
    config: {
        name: "freefire",
        description: "لعبة فري فاير - اهبط في الجزيرة وحاول البقاء حياً",
        usage: "",
        category: "ألعاب"
    },
    run: async function({ api, event }) {
        const { senderID, threadID, messageID } = event;
        const reward = Math.floor(Math.random() * 400) + 150;
        const loss = Math.floor(Math.random() * 200) + 80;
        const outcome = Math.random();

        let user = await userDb.getUser(senderID);
        if (!user) {
            const userInfo = await api.getUserInfo(senderID);
            const name = userInfo[senderID].name;
            await userDb.createUser(senderID, name);
            user = await userDb.getUser(senderID);
        }

        if (outcome > 0.45) {
            await userDb.updateMoney(senderID, reward);
            api.sendMessage(`🔫 حصلت على "Booyah!" في فري فاير وربحت ${reward} عملة!`, threadID, messageID);
        } else {
            await userDb.updateMoney(senderID, -loss);
            api.sendMessage(`💣 قُتلت في المنطقة الآمنة وفقدت ${loss} عملة!`, threadID, messageID);
        }
    }
};
