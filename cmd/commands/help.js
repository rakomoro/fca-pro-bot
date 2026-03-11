module.exports = {
    config: {
        name: "help",
        description: "عرض قائمة الأوامر",
        usage: "[الأمر]",
        category: "نظام",
        cooldowns: 5
    },
    run: async function({ api, event, args }) {
        const { threadID, messageID } = event;
        const prefix = global.client.config.PREFIX;
        
        if (!args[0]) {
            let msg = "📜 قائمة الأوامر المتاحة:\n\n";
            const categories = {};

            global.client.commands.forEach(cmd => {
                const cat = cmd.config.category || "عام";
                if (!categories[cat]) categories[cat] = [];
                categories[cat].push(cmd.config.name);
            });

            for (const cat in categories) {
                msg += `🔹 ${cat}:\n  ${categories[cat].join(", ")}\n\n`;
            }

            msg += `استخدم ${prefix}help [اسم الأمر] لمعرفة المزيد.`;
            return api.sendMessage(msg, threadID, messageID);
        }

        const command = global.client.commands.get(args[0].toLowerCase());
        if (!command) return api.sendMessage(`لا يوجد أمر باسم: ${args[0]}`, threadID, messageID);

        const { name, description, usage, category } = command.config;
        api.sendMessage(`🔍 تفاصيل الأمر:\n\n📌 الاسم: ${name}\n📖 الوصف: ${description}\n📂 الفئة: ${category}\n💡 الاستخدام: ${prefix}${name} ${usage}`, threadID, messageID);
    }
};
