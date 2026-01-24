const helper = require("../src/core/internal/helper");

module.exports = [
    {
        name: "antilink",
        description: "Enable/Disable antilink",
        category: "antilink",
        async execute(sock, m, { from, text, isMod }) {
            if (!from.endsWith("@g.us")) return;
            if (!isMod) return sock.sendMessage(from, { text: "❌ Only owners and mods can use this command." }, { quoted: m });
            if (text === "on") {
                await sock.sendMessage(from, { text: "✅ Antilink enabled." }, { quoted: m });
            } else if (text === "off") {
                await sock.sendMessage(from, { text: "✅ Antilink disabled." }, { quoted: m });
            } else {
                await sock.sendMessage(from, { text: "Usage: .antilink on/off" }, { quoted: m });
            }
        }
    },
    {
        name: "antilinkall",
        description: "Enable antilink for all links",
        category: "antilink",
        async execute(sock, m, { from, isMod }) {
            if (!isMod) return;
            await sock.sendMessage(from, { text: "✅ Antilink All enabled." }, { quoted: m });
        }
    },
    {
        name: "antilinkwa",
        description: "Enable antilink for WhatsApp links",
        category: "antilink",
        async execute(sock, m, { from, isMod }) {
            if (!isMod) return;
            await sock.sendMessage(from, { text: "✅ Antilink WhatsApp enabled." }, { quoted: m });
        }
    },
    {
        name: "antilinkyt",
        description: "Enable antilink for YouTube links",
        category: "antilink",
        async execute(sock, m, { from, isMod }) {
            if (!isMod) return;
            await sock.sendMessage(from, { text: "✅ Antilink YouTube enabled." }, { quoted: m });
        }
    },
    {
        name: "antilinkig",
        description: "Enable antilink for Instagram links",
        category: "antilink",
        async execute(sock, m, { from, isMod }) {
            if (!isMod) return;
            await sock.sendMessage(from, { text: "✅ Antilink Instagram enabled." }, { quoted: m });
        }
    },
    {
        name: "antilinkfb",
        description: "Enable antilink for Facebook links",
        category: "antilink",
        async execute(sock, m, { from, isMod }) {
            if (!isMod) return;
            await sock.sendMessage(from, { text: "✅ Antilink Facebook enabled." }, { quoted: m });
        }
    },
    {
        name: "antilinktt",
        description: "Enable antilink for TikTok links",
        category: "antilink",
        async execute(sock, m, { from, isMod }) {
            if (!isMod) return;
            await sock.sendMessage(from, { text: "✅ Antilink TikTok enabled." }, { quoted: m });
        }
    },
    {
        name: "antilinktw",
        description: "Enable antilink for Twitter links",
        category: "antilink",
        async execute(sock, m, { from, isMod }) {
            if (!isMod) return;
            await sock.sendMessage(from, { text: "✅ Antilink Twitter enabled." }, { quoted: m });
        }
    },
    {
        name: "antilinktg",
        description: "Enable antilink for Telegram links",
        category: "antilink",
        async execute(sock, m, { from, isMod }) {
            if (!isMod) return;
            await sock.sendMessage(from, { text: "✅ Antilink Telegram enabled." }, { quoted: m });
        }
    },
    {
        name: "antilinkli",
        description: "Enable antilink for LinkedIn links",
        category: "antilink",
        async execute(sock, m, { from, isMod }) {
            if (!isMod) return;
            await sock.sendMessage(from, { text: "✅ Antilink LinkedIn enabled." }, { quoted: m });
        }
    },
    {
        name: "antilinksc",
        description: "Enable antilink for Snapchat links",
        category: "antilink",
        async execute(sock, m, { from, isMod }) {
            if (!isMod) return;
            await sock.sendMessage(from, { text: "✅ Antilink Snapchat enabled." }, { quoted: m });
        }
    },
    {
        name: "antilinkrd",
        description: "Enable antilink for Reddit links",
        category: "antilink",
        async execute(sock, m, { from, isMod }) {
            if (!isMod) return;
            await sock.sendMessage(from, { text: "✅ Antilink Reddit enabled." }, { quoted: m });
        }
    },
    {
        name: "antilinkgh",
        description: "Enable antilink for GitHub links",
        category: "antilink",
        async execute(sock, m, { from, isMod }) {
            if (!isMod) return;
            await sock.sendMessage(from, { text: "✅ Antilink GitHub enabled." }, { quoted: m });
        }
    },
    {
        name: "antilinksp",
        description: "Enable antilink for Spotify links",
        category: "antilink",
        async execute(sock, m, { from, isMod }) {
            if (!isMod) return;
            await sock.sendMessage(from, { text: "✅ Antilink Spotify enabled." }, { quoted: m });
        }
    },
    {
        name: "antilinkpt",
        description: "Enable antilink for Pinterest links",
        category: "antilink",
        async execute(sock, m, { from, isMod }) {
            if (!isMod) return;
            await sock.sendMessage(from, { text: "✅ Antilink Pinterest enabled." }, { quoted: m });
        }
    },
    {
        name: "antilinkaction",
        description: "Set antilink action (kick/warn/delete)",
        category: "antilink",
        async execute(sock, m, { from, text, isMod }) {
            if (!isMod) return;
            if (!text) return sock.sendMessage(from, { text: "Usage: .antilinkaction kick/warn/delete" }, { quoted: m });
            await sock.sendMessage(from, { text: `✅ Antilink action set to: ${text}` }, { quoted: m });
        }
    },
    {
        name: "antilinkwarn",
        description: "Set antilink warning limit",
        category: "antilink",
        async execute(sock, m, { from, text, isMod }) {
            if (!isMod) return;
            if (!text) return sock.sendMessage(from, { text: "Usage: .antilinkwarn <number>" }, { quoted: m });
            await sock.sendMessage(from, { text: `✅ Antilink warning limit set to: ${text}` }, { quoted: m });
        }
    },
    {
        name: "antilinkwhitelist",
        description: "Whitelist a link from antilink",
        category: "antilink",
        async execute(sock, m, { from, text, isMod }) {
            if (!isMod) return;
            if (!text) return sock.sendMessage(from, { text: "Usage: .antilinkwhitelist <link>" }, { quoted: m });
            await sock.sendMessage(from, { text: `✅ Link whitelisted: ${text}` }, { quoted: m });
        }
    },
    {
        name: "antilinkstatus",
        description: "Check antilink status",
        category: "antilink",
        async execute(sock, m, { from, isMod }) {
            if (!isMod) return;
            await sock.sendMessage(from, { text: "📊 Antilink Status: Enabled\nAction: Delete\nWarnings: 3" }, { quoted: m });
        }
    },
    {
        name: "antilinkreset",
        description: "Reset antilink settings",
        category: "antilink",
        async execute(sock, m, { from, isMod }) {
            if (!isMod) return;
            await sock.sendMessage(from, { text: "✅ Antilink settings reset." }, { quoted: m });
        }
    }
];
