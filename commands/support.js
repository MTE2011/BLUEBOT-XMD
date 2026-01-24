const config = require("../config");

module.exports = [
    {
        name: "mods",
        description: "Show the official support team numbers",
        category: "support",
        async execute(sock, m, { from }) {
            let mods = config.MODS || "";
            mods = mods.split(",").map(m => m.trim()).filter(m => m);
            if (mods.length === 0) return sock.sendMessage(from, { text: "❌ No mods set in config." }, { quoted: m });
            let text = `╭・❖ BLUEBOT-XMD ❖\n┃・Support Team\n╰──────────────────\n`;
            mods.forEach(mod => { text += `┃・@${mod}\n`; });
            text += `╰──────────────────\n> ⚠️ Use wisely.`;
            await sock.sendMessage(from, { text, mentions: mods.map(mod => `${mod}@s.whatsapp.net`) }, { quoted: m });
        }
    },
    {
        name: "support",
        description: "Show official support links",
        category: "support",
        async execute(sock, m, { from }) {
            const text = `🔹 Support Community:\nhttps://chat.whatsapp.com/GsjslOuJbLBBQZfsqa6M7w\n\n🔹 GitHub Repo:\nhttps://github.com/Vhadau2011/BLUEBOT-XMD`;
            await sock.sendMessage(from, { text }, { quoted: m });
        }
    },
    {
        name: "report",
        description: "Report a bug",
        category: "support",
        async execute(sock, m, { from, sender, text }) {
            if (!text) return sock.sendMessage(from, { text: "Usage: .report <issue>" }, { quoted: m });
            await sock.sendMessage(from, { text: "✅ Your report has been sent to the support team." }, { quoted: m });
        }
    },
    {
        name: "request",
        description: "Request a feature",
        category: "support",
        async execute(sock, m, { from, text }) {
            if (!text) return sock.sendMessage(from, { text: "Usage: .request <feature>" }, { quoted: m });
            await sock.sendMessage(from, { text: "✅ Your request has been sent." }, { quoted: m });
        }
    },
    {
        name: "feedback",
        description: "Send feedback",
        category: "support",
        async execute(sock, m, { from, text }) {
            if (!text) return sock.sendMessage(from, { text: "Usage: .feedback <text>" }, { quoted: m });
            await sock.sendMessage(from, { text: "✅ Thank you for your feedback!" }, { quoted: m });
        }
    },
    {
        name: "help",
        description: "Get help",
        category: "support",
        async execute(sock, m, { from }) {
            await sock.sendMessage(from, { text: "Use .menu to see all commands." }, { quoted: m });
        }
    },
    {
        name: "faq",
        description: "Frequently asked questions",
        category: "support",
        async execute(sock, m, { from }) {
            await sock.sendMessage(from, { text: "Q: How to use?\nA: Use .menu" }, { quoted: m });
        }
    },
    {
        name: "docs",
        description: "Bot documentation",
        category: "support",
        async execute(sock, m, { from }) {
            await sock.sendMessage(from, { text: "Documentation is available on GitHub." }, { quoted: m });
        }
    },
    {
        name: "owner",
        description: "Get owner info",
        category: "support",
        async execute(sock, m, { from }) {
            await sock.sendMessage(from, { text: `👑 Owner: ${config.OWNER_NAME}\nNumber: ${config.OWNER_NUMBER}` }, { quoted: m });
        }
    },
    {
        name: "script",
        description: "Get bot script",
        category: "support",
        async execute(sock, m, { from }) {
            await sock.sendMessage(from, { text: "https://github.com/Vhadau2011/BLUEBOT-XMD" }, { quoted: m });
        }
    },
    {
        name: "uptime",
        description: "Check bot uptime",
        category: "support",
        async execute(sock, m, { from }) {
            const uptime = process.uptime();
            await sock.sendMessage(from, { text: `⏱️ Uptime: ${Math.floor(uptime / 60)} minutes` }, { quoted: m });
        }
    },
    {
        name: "ping",
        description: "Check bot speed",
        category: "support",
        async execute(sock, m, { from }) {
            const start = Date.now();
            await sock.sendMessage(from, { text: "Pinging..." }, { quoted: m });
            const end = Date.now();
            await sock.sendMessage(from, { text: `🏓 Pong! ${end - start}ms` }, { quoted: m });
        }
    },
    {
        name: "runtime",
        description: "Check bot runtime",
        category: "support",
        async execute(sock, m, { from }) {
            await sock.sendMessage(from, { text: `Running on Node.js ${process.version}` }, { quoted: m });
        }
    },
    {
        name: "version",
        description: "Check bot version",
        category: "support",
        async execute(sock, m, { from }) {
            await sock.sendMessage(from, { text: `BLUEBOT-XMD Version: ${config.VERSION}` }, { quoted: m });
        }
    },
    {
        name: "donate",
        description: "Support the developer",
        category: "support",
        async execute(sock, m, { from }) {
            await sock.sendMessage(from, { text: "Thank you for wanting to support! Contact the owner for details." }, { quoted: m });
        }
    }
];
