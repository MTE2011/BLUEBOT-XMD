const { bluebot, commands, config } = require("../src/core/bluebot_adapter");
const fs = require("fs");
const path = require("path");

bluebot({
    cmd: "menu",
    desc: "Show full command menu",
    type: "general",
}, async (m, text) => {
    const readMore = '\u200B'.repeat(4001);
    const categories = {};
    const commandsPath = path.join(__dirname, "../commands");
    const adapter = require("../src/core/bluebot_adapter");
    
    // Clear and reload commands for menu to ensure all are captured
    adapter.commands.length = 0;
    const allCmds = [];

    const loadFolderCommands = (dir) => {
        if (!fs.existsSync(dir)) return;
        const items = fs.readdirSync(dir);
        for (const item of items) {
            const itemPath = path.join(dir, item);
            if (fs.statSync(itemPath).isDirectory()) {
                loadFolderCommands(itemPath);
            } else if (item.endsWith(".js")) {
                try {
                    require(itemPath);
                    const current = adapter.commands;
                    current.forEach(cmd => {
                        if (cmd && cmd.name && !allCmds.find(c => c.name === cmd.name)) {
                            if (!cmd.category || cmd.category === "misc") {
                                const relative = path.relative(commandsPath, itemPath);
                                const cat = relative.split(path.sep)[0];
                                cmd.category = (cat && cat.endsWith(".js")) ? "general" : (cat || "general");
                            }
                            allCmds.push(cmd);
                        }
                    });
                } catch (e) {}
            }
        }
    };

    loadFolderCommands(commandsPath);

    // Organize commands into categories
    allCmds.forEach(cmd => {
        const cat = (cmd.category || "GENERAL").toUpperCase();
        if (!categories[cat]) categories[cat] = [];
        if (!categories[cat].includes(cmd.name)) {
            categories[cat].push(cmd.name);
        }
    });

    // Sort categories alphabetically
    const sortedCategories = Object.keys(categories).sort();

    // ── MENU TEXT ──
    let menuText = `
╔═══════════════╗
     ❖ BLUEBOT-XMD ❖
╚═══════════════╝
👑 *Owner :* ${config.OWNER_NAME}
✨ *Prefix:* ${config.PREFIX}
🌐 *Mode  :* ${config.MODE}
────────────────────
${readMore}
`;

    for (const cat of sortedCategories) {
        const cmds = categories[cat];
        menuText += `\n📂 *${cat}* (${cmds.length})\n`;
        menuText += '────────────────────\n';
        
        let cmdList = "";
        for (let i = 0; i < cmds.length; i++) {
            cmdList += `• ${cmds[i]}\n`;
        }
        menuText += cmdList;
    }

    menuText += `
────────────────────
${readMore} 💻 Developer: mudau_t
🚀 Enjoy your bot!
`;

    // ── SEND MENU ──
    const menuImage = config.MENU_IMAGE || "https://files.catbox.moe/p9i3jp.jpg";
    
    await m.client.sendMessage(m.chat, {
        image: { url: menuImage },
        caption: menuText
    }, { quoted: m });
});
