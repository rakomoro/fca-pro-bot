const axios = require('axios');

module.exports = {
    config: {
        name: "ai",
        description: "اسأل الذكاء الاصطناعي",
        usage: "[سؤالك]",
        category: "ذكاء اصطناعي"
    },
    run: async function({ api, event, args }) {
        const { threadID, messageID } = event;
        const prompt = args.join(" ");

        if (!prompt) return api.sendMessage("يرجى كتابة سؤال للذكاء الاصطناعي.", threadID, messageID);

        try {
            api.sendMessage("⏳ جاري التفكير...", threadID, messageID);
            // استخدام API مجاني للذكاء الاصطناعي (مثال)
            const response = await axios.get(`https://api.openai.com/v1/chat/completions`, {
                headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
                data: {
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: prompt }]
                }
            });
            const answer = response.data.choices[0].message.content;
            api.sendMessage(answer, threadID, messageID);
        } catch (error) {
            console.error(error);
            api.sendMessage("حدث خطأ أثناء التواصل مع الذكاء الاصطناعي.", threadID, messageID);
        }
    }
};
