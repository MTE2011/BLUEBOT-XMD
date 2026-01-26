const fs = require("fs");
const path = require("path");

const blue = { bot: {} };

blue.bot.name = "menu";
blue.bot.description = "Show full command menu";
blue.bot.category = "general";

blue.bot.execute = async (sock, m, { from, config }) => {
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
                try {
                    delete require.cache[require.resolve(fullPath)];
                    const exp = require(fullPath);
                    
                    // Support both array and object exports (blue.bot)
                    const cmds = Array.isArray(exp) ? exp : (exp && typeof exp === 'object' ? Object.values(exp) : []);
                    const finalCmds = Array.isArray(cmds[0]) ? cmds[0] : cmds;

                    finalCmds.forEach(cmd => {
                        if (cmd && cmd.name) {
                            const cat = (cmd.category || "GENERAL").toUpperCase();
                            if (!categories[cat]) categories[cat] = [];
                            if (!categories[cat].includes(cmd.name)) {
                                categories[cat].push(cmd.name);
                            }
                        }
                    });
                } catch (e) {
                    console.error(`Error loading command in menu: ${fullPath}`, e);
                }
            }
        }
    };

    loadCommands(commandsDir);

    // ── MENU TEXT ──
    let text = `
╔═══════════════╗
     ❖ BLUEBOT-XMD ❖
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
        if (config.MENU_IMAGE.startsWith("http")) {
            await sock.sendMessage(from, {
                image: { url: config.MENU_IMAGE },
                caption: text
            }, { quoted: m });
        } else {
            const imagePath = path.resolve(config.MENU_IMAGE);
            if (fs.existsSync(imagePath)) {
                await sock.sendMessage(from, {
                    image: fs.readFileSync(imagePath),
                    caption: text
                }, { quoted: m });
            } else {
                await sock.sendMessage(from, { text }, { quoted: m });
            }
        }
    } else {
        await sock.sendMessage(from, { text }, { quoted: m });
    }
};

module.exports = blue.bot;
