const { isBotAdmin } = require("../database/handlers/userHandler");
const config = require("../config");

const blue = { bot: [] };

blue.bot.push(
    {
        name: "kick",
        description: "Remove a member",
        category: "group",
        async execute(sock, m, { from, isMod, isAdmin }) {
            if (!from.endsWith("@g.us")) return;
            const botIsAdmin = await isBotAdmin(sock, from);

            if (!isAdmin && !isMod) return sock.sendMessage(from, { text: "❌ Only admins can kick." }, { quoted: m });
            if (!botIsAdmin) return sock.sendMessage(from, { text: "❌ I am not an admin. Please make me admin first." }, { quoted: m });

            const target = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message?.extendedTextMessage?.contextInfo?.participant;
            if (!target) return sock.sendMessage(from, { text: "❌ Tag or reply to a user." }, { quoted: m });
            
            const metadata = await sock.groupMetadata(from);
            if (target === metadata.owner) return sock.sendMessage(from, { text: "❌ Cannot kick group owner." }, { quoted: m });

            await sock.groupParticipantsUpdate(from, [target], "remove");
            await sock.sendMessage(from, { text: `✅ Removed @${target.split("@")[0]}`, mentions: [target] }, { quoted: m });
        }
    },
    {
        name: "promote",
        description: "Promote to admin",
        category: "group",
        async execute(sock, m, { from, isMod, isAdmin }) {
            if (!from.endsWith("@g.us")) return;
            const botIsAdmin = await isBotAdmin(sock, from);

            if (!isAdmin && !isMod) return;
            if (!botIsAdmin) return sock.sendMessage(from, { text: "❌ I am not an admin. Please make me admin first." }, { quoted: m });

            const target = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message?.extendedTextMessage?.contextInfo?.participant;
            if (!target) return;

            await sock.groupParticipantsUpdate(from, [target], "promote");
            await sock.sendMessage(from, { text: `✅ Promoted @${target.split("@")[0]}`, mentions: [target] }, { quoted: m });
        }
    },
    {
        name: "demote",
        description: "Demote from admin",
        category: "group",
        async execute(sock, m, { from, isMod, isAdmin }) {
            if (!from.endsWith("@g.us")) return;
            const botIsAdmin = await isBotAdmin(sock, from);

            if (!isAdmin && !isMod) return;
            if (!botIsAdmin) return sock.sendMessage(from, { text: "❌ I am not an admin. Please make me admin first." }, { quoted: m });

            const target = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message?.extendedTextMessage?.contextInfo?.participant;
            if (!target) return;
            
            const metadata = await sock.groupMetadata(from);
            if (target === metadata.owner) return;

            await sock.groupParticipantsUpdate(from, [target], "demote");
            await sock.sendMessage(from, { text: `✅ Demoted @${target.split("@")[0]}`, mentions: [target] }, { quoted: m });
        }
    },
    {
        name: "tagall",
        description: "Tag all members",
        category: "group",
        async execute(sock, m, { from, text, isMod, isAdmin }) {
            if (!from.endsWith("@g.us")) return;
            if (!isAdmin && !isMod) return;
            
            const metadata = await sock.groupMetadata(from);
            const participants = metadata.participants;
            let msg = `*TAG ALL*\n\n*Message:* ${text || "No message"}\n\n`;
            participants.forEach(p => {
                msg += `@${p.id.split("@")[0]} `;
            });
            
            await sock.sendMessage(from, { text: msg, mentions: participants.map(p => p.id) }, { quoted: m });
        }
    }
);

module.exports = blue.bot;
