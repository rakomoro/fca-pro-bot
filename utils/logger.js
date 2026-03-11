const chalk = require('chalk');

module.exports = {
    info: (msg) => console.log(chalk.blue(`[ INFO ] ${msg}`)),
    success: (msg) => console.log(chalk.green(`[ SUCCESS ] ${msg}`)),
    error: (msg, err) => {
        console.error(chalk.red(`[ ERROR ] ${msg}`));
        if (err) console.error(err);
    },
    warn: (msg) => console.log(chalk.yellow(`[ WARN ] ${msg}`))
};
