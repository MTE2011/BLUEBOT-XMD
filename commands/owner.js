const db = require("../database/db_manager");
const { exec } = require("child_process");

const blue = { bot: [] };

blue.bot.push(
    {
        name: "ban",
        description: "Ban a user",
        category: "owner",
        async execute(sock, m, { from, isOwner }) {
            if (!isOwner) return;
            const target = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message?.extendedTextMessage?.contextInfo?.participant;
            if (!target) return sock.sendMessage(from, { text: "❌ Tag or reply to a user." }, { quoted: m });
            db.banUser(target);
            await sock.sendMessage(from, { text: `✅ @${target.split("@")[0]} banned.`, mentions: [target] }, { quoted: m });
        }
    },
    {
        name: "unban",
        description: "Unban a user",
        category: "owner",
        async execute(sock, m, { from, isOwner }) {
            if (!isOwner) return;
            const target = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message?.extendedTextMessage?.contextInfo?.participant;
            if (!target) return sock.sendMessage(from, { text: "❌ Tag or reply to a user." }, { quoted: m });
            db.unbanUser(target);
            await sock.sendMessage(from, { text: `✅ @${target.split("@")[0]} unbanned.`, mentions: [target] }, { quoted: m });
        }
    },
    {
        name: "bangroup",
        description: "Ban this group",
        category: "owner",
        async execute(sock, m, { from, isOwner }) {
            if (!isOwner) return;
            db.banGroup(from);
            await sock.sendMessage(from, { text: "✅ Group banned." }, { quoted: m });
        }
    },
    {
        name: "unbangroup",
        description: "Unban this group",
        category: "owner",
        async execute(sock, m, { from, isOwner }) {
            if (!isOwner) return;
            db.unbanGroup(from);
            await sock.sendMessage(from, { text: "✅ Group unbanned." }, { quoted: m });
        }
    },
    {
        name: "restart",
        description: "Restart the bot",
        category: "owner",
        async execute(sock, m, { from, isOwner }) {
            if (!isOwner) return;
            await sock.sendMessage(from, { text: "🔄 Restarting..." });
            process.exit(0);
        }
    }
);

module.exports = blue.bot;
