const { bluebot, commands, config } = require("../src/core/kord_adapter");

bluebot({
    cmd: "menu",
    desc: "Show full command menu",
    type: "general",
}, async (m, text) => {
    const readMore = '\u200B'.repeat(4001);
    const categories = {};

    // Organize commands into categories
    commands.forEach(cmd => {
        if (cmd && cmd.name) {
            const cat = (cmd.category || "GENERAL").toUpperCase();
            if (!categories[cat]) categories[cat] = [];
            if (!categories[cat].includes(cmd.name)) {
                categories[cat].push(cmd.name);
            }
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
        
        // Arrange commands in a grid or list
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
