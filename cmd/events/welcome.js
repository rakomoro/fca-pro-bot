module.exports = {
    config: {
        name: "welcome",
        eventType: ["log:subscribe"]
    },
    run: async function({ api, event }) {
        const { threadID, logMessageData } = event;
        if (logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
            api.sendMessage("شكراً لإضافتي! أنا بوت Manus المتطور. اكتب /help لرؤية قائمة الأوامر.", threadID);
        } else {
            for (const participant of logMessageData.addedParticipants) {
                api.sendMessage(`مرحباً بك يا ${participant.fullName} في المجموعة! استمتع بوقتك معنا.`, threadID);
            }
        }
    }
};
