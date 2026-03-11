const { spawn } = require("child_process");
const logger = require("./utils/logger.js");

function start() {
    const child = spawn("node", ["index.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    child.on("close", (codeExit) => {
        if (codeExit !== 0) {
            logger.warn(`توقف البوت بكود ${codeExit}. جاري إعادة التشغيل تلقائياً...`);
            start();
        }
    });

    child.on("error", (error) => {
        logger.error(`حدث خطأ في تشغيل العملية: ${error.message}`);
    });
}

start();
