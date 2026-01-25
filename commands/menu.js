const fs = require("fs");
const path = require("path");

module.exports = {
    name: "menu",
    description: "Show full command menu",
    category: "general",

    async execute(sock, m, { from, config }) {
        const readMore = '\u200B'.repeat(4001);

        const commandsDir = path.join(__dirname);
        const categories = {};

        // 🔁 Load commands recursively
        const loadCommands = (dir) => {
            for (const file of fs.readdirSync(dir)) {
                const fullPath = path.join(dir, file);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) loadCommands(fullPath);
                else if (file.endsWith(".js") && file !== "menu.js") {
                    delete require.cache[require.resolve(fullPath)];
                    const exp = require(fullPath);
                    const cmds = Array.isArray(exp) ? exp : [exp];

                    cmds.forEach(cmd => {
                        const cat = (cmd.category || "GENERAL").toUpperCase();
                        if (!categories[cat]) categories[cat] = [];
                        categories[cat].push(cmd.name);
                    });
                }
            }
        };

        loadCommands(commandsDir);

        // ── MENU TEXT ──
        let text = `
╔═══════════════╗
     ❖ Re:Zero | Nexus ❖
╚═══════════════╝
👑 *Owner :* ${config.OWNER_NAME}
✨ *Prefix:* ${config.PREFIX}
🌐 *Mode  :* ${config.MODE}
────────────────────
${readMore}
`;

        for (const [cat, cmds] of Object.entries(categories)) {
            text += `\n📂 *${cat}* (${cmds.length})\n`;
            text += '────────────────────\n';
            cmds.forEach(cmd => text += `• ${cmd}\n`);
        }

        text += `
────────────────────
${readMore} 💻 Developer: mudau_t
🚀 Enjoy your bot!
`;

        // ── SEND IMAGE ──
        if (config.MENU_IMAGE) {
            // If MENU_IMAGE is a URL
            if (config.MENU_IMAGE.startsWith("http")) {
                await sock.sendMessage(from, {
                    image: { url: config.MENU_IMAGE },
                    caption: text
                }, { quoted: m });
            } else {
                // If MENU_IMAGE is a local file path
                const imagePath = path.resolve(config.MENU_IMAGE);
                if (fs.existsSync(imagePath)) {
                    await sock.sendMessage(from, {
                        image: fs.readFileSync(imagePath),
                        caption: text
                    }, { quoted: m });
                } else {
                    // fallback: text only
                    await sock.sendMessage(from, { text }, { quoted: m });
                }
            }
        } else {
            await sock.sendMessage(from, { text }, { quoted: m });
        }
    }
};
