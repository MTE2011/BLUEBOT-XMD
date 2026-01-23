const fs = require("fs");
const path = require("path");

module.exports = {
    name: "menu",
    description: "Show all commands dynamically in a fancy grid",
    async execute(sock, m, { from, config }) {

        // 🔹 BOT INFO HEADER
        let menuText = `
╭───『 ${config.BOT_NAME} 』───
│
│ ✨ *Prefix* : ${config.PREFIX}
│ 👑 *Creator* : ${config.OWNER_NAME}
│ 🌐 *Mode* : ${config.MODE}
╰────────────────────
`;

        // 🔹 COMMAND GRID HEADER
        menuText += `
╭───『 *COMMAND MENU* 』───
│
`;

        // 🔹 COLLECT ALL COMMANDS DYNAMICALLY
        const commandsPath = path.join(__dirname, "..");
        const commandList = [];

        const items = fs.readdirSync(commandsPath);

        for (const item of items) {
            const itemPath = path.join(commandsPath, item);

            if (fs.statSync(itemPath).isDirectory()) {
                const files = fs.readdirSync(itemPath).filter(f => f.endsWith(".js"));
                for (const f of files) {
                    if (f === "menu.js") continue;
                    commandList.push(f.replace(".js", ""));
                }
            } else if (item.endsWith(".js") && item !== "menu.js") {
                commandList.push(item.replace(".js", ""));
            }
        }

        // 🔹 FORMAT COMMANDS IN 2 COLUMNS
        for (let i = 0; i < commandList.length; i += 2) {
            const left = commandList[i];
            const right = commandList[i + 1] || "";
            menuText += `│ • ${left.padEnd(10)} • ${right.padEnd(10)}\n`;
        }

        menuText += `╰────────────────────
`;

        // 🔹 FOOTER
        menuText += `
🔹 *Usage* : ${config.PREFIX}[command]
🔹 *Example* : ${config.PREFIX}menu

📌 *Developers* :
*${config.OWNER_NAME}*

✦⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅⋅✦
`;

        // 🔹 SEND MENU WITH IMAGE IF SET
        const message = {};
        const isURL = config.MENU_IMAGE?.startsWith("http://") || config.MENU_IMAGE?.startsWith("https://");

        if (config.MENU_IMAGE && (isURL || fs.existsSync(config.MENU_IMAGE))) {
            message.image = { url: config.MENU_IMAGE };
            message.caption = menuText;
        } else {
            message.text = menuText;
        }

        await sock.sendMessage(from, message, { quoted: m });
    }
};
