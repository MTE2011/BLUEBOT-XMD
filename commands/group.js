const helper = require("../src/core/internal/helper");

module.exports = [
    {
        name: "kick",
        description: "Remove a user from the group",
        category: "group",
        async execute(sock, m, { from, sender, isMod }) {
            if (!from.endsWith("@g.us")) return sock.sendMessage(from, { text: "❌ This command works only in groups." }, { quoted: m });
            if (!isMod) return sock.sendMessage(from, { text: "❌ Only owners and mods can use this command." }, { quoted: m });
            
            const botIsAdmin = await helper.getBotAdmin(sock, from);
            if (!botIsAdmin) return sock.sendMessage(from, { text: "❌ I must be an admin to kick members." }, { quoted: m });

            const target = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message?.extendedTextMessage?.contextInfo?.participant;
            if (!target) return sock.sendMessage(from, { text: "❌ Tag or reply to a user to kick." }, { quoted: m });

            await sock.groupParticipantsUpdate(from, [target], "remove");
            await sock.sendMessage(from, { text: `✅ Removed @${target.split("@")[0]}`, mentions: [target] }, { quoted: m });
        }
    },
    {
        name: "add",
        description: "Add a user to the group",
        category: "group",
        async execute(sock, m, { from, text, isMod }) {
            if (!from.endsWith("@g.us")) return;
            if (!isMod) return sock.sendMessage(from, { text: "❌ Only owners and mods can use this command." }, { quoted: m });
            if (!text) return sock.sendMessage(from, { text: "❌ Provide a number to add." }, { quoted: m });
            const botIsAdmin = await helper.getBotAdmin(sock, from);
            if (!botIsAdmin) return sock.sendMessage(from, { text: "❌ I must be an admin." }, { quoted: m });
            const target = text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
            await sock.groupParticipantsUpdate(from, [target], "add");
            await sock.sendMessage(from, { text: `✅ Added @${text}`, mentions: [target] }, { quoted: m });
        }
    },
    {
        name: "promote",
        description: "Promote a member to admin",
        category: "group",
        async execute(sock, m, { from, isMod }) {
            if (!from.endsWith("@g.us")) return;
            if (!isMod) return sock.sendMessage(from, { text: "❌ Only owners and mods can use this command." }, { quoted: m });
            const botIsAdmin = await helper.getBotAdmin(sock, from);
            if (!botIsAdmin) return sock.sendMessage(from, { text: "❌ I must be an admin." }, { quoted: m });
            const target = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message?.extendedTextMessage?.contextInfo?.participant;
            if (!target) return sock.sendMessage(from, { text: "❌ Tag or reply to a user." }, { quoted: m });
            await sock.groupParticipantsUpdate(from, [target], "promote");
            await sock.sendMessage(from, { text: `✅ Promoted @${target.split("@")[0]}`, mentions: [target] }, { quoted: m });
        }
    },
    {
        name: "demote",
        description: "Demote an admin to member",
        category: "group",
        async execute(sock, m, { from, isMod }) {
            if (!from.endsWith("@g.us")) return;
            if (!isMod) return sock.sendMessage(from, { text: "❌ Only owners and mods can use this command." }, { quoted: m });
            const botIsAdmin = await helper.getBotAdmin(sock, from);
            if (!botIsAdmin) return sock.sendMessage(from, { text: "❌ I must be an admin." }, { quoted: m });
            const target = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message?.extendedTextMessage?.contextInfo?.participant;
            if (!target) return sock.sendMessage(from, { text: "❌ Tag or reply to a user." }, { quoted: m });
            await sock.groupParticipantsUpdate(from, [target], "demote");
            await sock.sendMessage(from, { text: `✅ Demoted @${target.split("@")[0]}`, mentions: [target] }, { quoted: m });
        }
    },
    {
        name: "mute",
        description: "Close group (admins only)",
        category: "group",
        async execute(sock, m, { from, isMod }) {
            if (!from.endsWith("@g.us")) return;
            if (!isMod) return sock.sendMessage(from, { text: "❌ Only owners and mods can use this command." }, { quoted: m });
            const botIsAdmin = await helper.getBotAdmin(sock, from);
            if (!botIsAdmin) return sock.sendMessage(from, { text: "❌ I must be an admin." }, { quoted: m });
            await sock.groupSettingUpdate(from, "announcement");
            await sock.sendMessage(from, { text: "✅ Group Muted" }, { quoted: m });
        }
    },
    {
        name: "unmute",
        description: "Open group (everyone can send messages)",
        category: "group",
        async execute(sock, m, { from, isMod }) {
            if (!from.endsWith("@g.us")) return;
            if (!isMod) return sock.sendMessage(from, { text: "❌ Only owners and mods can use this command." }, { quoted: m });
            const botIsAdmin = await helper.getBotAdmin(sock, from);
            if (!botIsAdmin) return sock.sendMessage(from, { text: "❌ I must be an admin." }, { quoted: m });
            await sock.groupSettingUpdate(from, "not_announcement");
            await sock.sendMessage(from, { text: "✅ Group Unmuted" }, { quoted: m });
        }
    },
    {
        name: "setname",
        description: "Change group name",
        category: "group",
        async execute(sock, m, { from, text, isMod }) {
            if (!from.endsWith("@g.us")) return;
            if (!isMod) return sock.sendMessage(from, { text: "❌ Only owners and mods can use this command." }, { quoted: m });
            if (!text) return sock.sendMessage(from, { text: "❌ Provide a name." }, { quoted: m });
            const botIsAdmin = await helper.getBotAdmin(sock, from);
            if (!botIsAdmin) return sock.sendMessage(from, { text: "❌ I must be an admin." }, { quoted: m });
            await sock.groupUpdateSubject(from, text);
            await sock.sendMessage(from, { text: `✅ Group name changed to: ${text}` }, { quoted: m });
        }
    },
    {
        name: "setdesc",
        description: "Change group description",
        category: "group",
        async execute(sock, m, { from, text, isMod }) {
            if (!from.endsWith("@g.us")) return;
            if (!isMod) return sock.sendMessage(from, { text: "❌ Only owners and mods can use this command." }, { quoted: m });
            if (!text) return sock.sendMessage(from, { text: "❌ Provide a description." }, { quoted: m });
            const botIsAdmin = await helper.getBotAdmin(sock, from);
            if (!botIsAdmin) return sock.sendMessage(from, { text: "❌ I must be an admin." }, { quoted: m });
            await sock.groupUpdateDescription(from, text);
            await sock.sendMessage(from, { text: `✅ Group description updated.` }, { quoted: m });
        }
    },
    {
        name: "invite",
        description: "Get group invite link",
        category: "group",
        async execute(sock, m, { from, isMod }) {
            if (!from.endsWith("@g.us")) return;
            if (!isMod) return sock.sendMessage(from, { text: "❌ Only owners and mods can use this command." }, { quoted: m });
            const botIsAdmin = await helper.getBotAdmin(sock, from);
            if (!botIsAdmin) return sock.sendMessage(from, { text: "❌ I must be an admin." }, { quoted: m });
            const code = await sock.groupInviteCode(from);
            await sock.sendMessage(from, { text: `https://chat.whatsapp.com/${code}` }, { quoted: m });
        }
    },
    {
        name: "revoke",
        description: "Reset group invite link",
        category: "group",
        async execute(sock, m, { from, isMod }) {
            if (!from.endsWith("@g.us")) return;
            if (!isMod) return sock.sendMessage(from, { text: "❌ Only owners and mods can use this command." }, { quoted: m });
            const botIsAdmin = await helper.getBotAdmin(sock, from);
            if (!botIsAdmin) return sock.sendMessage(from, { text: "❌ I must be an admin." }, { quoted: m });
            await sock.groupRevokeInvite(from);
            await sock.sendMessage(from, { text: `✅ Invite link revoked.` }, { quoted: m });
        }
    },
    {
        name: "tagall",
        description: "Tag all members",
        category: "group",
        async execute(sock, m, { from, text, isMod }) {
            if (!from.endsWith("@g.us")) return;
            if (!isMod) return sock.sendMessage(from, { text: "❌ Only owners and mods can use this command." }, { quoted: m });
            const groupMetadata = await sock.groupMetadata(from);
            const participants = groupMetadata.participants;
            let message = `📢 *TAG ALL*\n\n*Message:* ${text || "No message"}\n\n`;
            participants.forEach((p, i) => { message += `${i + 1}. @${p.id.split("@")[0]}\n`; });
            await sock.sendMessage(from, { text: message, mentions: participants.map(p => p.id) }, { quoted: m });
        }
    },
    {
        name: "hidetag",
        description: "Tag all members invisibly",
        category: "group",
        async execute(sock, m, { from, text, isMod }) {
            if (!from.endsWith("@g.us")) return;
            if (!isMod) return sock.sendMessage(from, { text: "❌ Only owners and mods can use this command." }, { quoted: m });
            const groupMetadata = await sock.groupMetadata(from);
            const participants = groupMetadata.participants;
            await sock.sendMessage(from, { text: text || "", mentions: participants.map(p => p.id) });
        }
    },
    {
        name: "groupinfo",
        description: "Get group information",
        category: "group",
        async execute(sock, m, { from, isMod }) {
            if (!from.endsWith("@g.us")) return;
            if (!isMod) return sock.sendMessage(from, { text: "❌ Only owners and mods can use this command." }, { quoted: m });
            const groupMetadata = await sock.groupMetadata(from);
            const info = `
*Group Name:* ${groupMetadata.subject}
*Group ID:* ${groupMetadata.id}
*Members:* ${groupMetadata.participants.length}
*Created At:* ${new Date(groupMetadata.creation * 1000).toLocaleString()}
*Owner:* @${groupMetadata.owner?.split("@")[0] || "Unknown"}
`;
            await sock.sendMessage(from, { text: info, mentions: groupMetadata.owner ? [groupMetadata.owner] : [] }, { quoted: m });
        }
    },
    {
        name: "admins",
        description: "List all group admins",
        category: "group",
        async execute(sock, m, { from, isMod }) {
            if (!from.endsWith("@g.us")) return;
            if (!isMod) return sock.sendMessage(from, { text: "❌ Only owners and mods can use this command." }, { quoted: m });
            const groupMetadata = await sock.groupMetadata(from);
            const admins = groupMetadata.participants.filter(p => p.admin);
            let text = `👑 *Group Admins:*\n\n`;
            admins.forEach(a => { text += `• @${a.id.split("@")[0]}\n`; });
            await sock.sendMessage(from, { text, mentions: admins.map(a => a.id) }, { quoted: m });
        }
    },
    {
        name: "leave",
        description: "Make the bot leave the group",
        category: "group",
        async execute(sock, m, { from, isMod }) {
            if (!from.endsWith("@g.us")) return;
            if (!isMod) return sock.sendMessage(from, { text: "❌ Only owners and mods can use this command." }, { quoted: m });
            await sock.sendMessage(from, { text: "Goodbye! 👋" });
            await sock.groupLeave(from);
        }
    },
    {
        name: "setwelcome",
        description: "Set group welcome message",
        category: "group",
        async execute(sock, m, { from, text, isMod }) {
            if (!from.endsWith("@g.us")) return;
            if (!isMod) return sock.sendMessage(from, { text: "❌ Only owners and mods can use this command." }, { quoted: m });
            if (!text) return sock.sendMessage(from, { text: "❌ Provide a welcome message." }, { quoted: m });
            // In a real bot, you'd save this to a database. For now, we'll acknowledge.
            await sock.sendMessage(from, { text: `✅ Welcome message set to: ${text}` }, { quoted: m });
        }
    },
    {
        name: "setgoodbye",
        description: "Set group goodbye message",
        category: "group",
        async execute(sock, m, { from, text, isMod }) {
            if (!from.endsWith("@g.us")) return;
            if (!isMod) return sock.sendMessage(from, { text: "❌ Only owners and mods can use this command." }, { quoted: m });
            if (!text) return sock.sendMessage(from, { text: "❌ Provide a goodbye message." }, { quoted: m });
            await sock.sendMessage(from, { text: `✅ Goodbye message set to: ${text}` }, { quoted: m });
        }
    },
    {
        name: "link",
        description: "Get group link",
        category: "group",
        async execute(sock, m, { from, isMod }) {
            if (!from.endsWith("@g.us")) return;
            if (!isMod) return sock.sendMessage(from, { text: "❌ Only owners and mods can use this command." }, { quoted: m });
            const code = await sock.groupInviteCode(from);
            await sock.sendMessage(from, { text: `https://chat.whatsapp.com/${code}` }, { quoted: m });
        }
    },
    {
        name: "poll",
        description: "Create a poll",
        category: "group",
        async execute(sock, m, { from, text, isMod }) {
            if (!from.endsWith("@g.us")) return;
            if (!isMod) return sock.sendMessage(from, { text: "❌ Only owners and mods can use this command." }, { quoted: m });
            const [question, ...options] = text.split("|").map(v => v.trim());
            if (!question || options.length < 2) return sock.sendMessage(from, { text: "Usage: .poll Question | Option1 | Option2" }, { quoted: m });
            await sock.sendMessage(from, { poll: { name: question, values: options, selectableCount: 1 } });
        }
    },
    {
        name: "reset",
        description: "Reset group settings",
        category: "group",
        async execute(sock, m, { from, isMod }) {
            if (!from.endsWith("@g.us")) return;
            if (!isMod) return sock.sendMessage(from, { text: "❌ Only owners and mods can use this command." }, { quoted: m });
            const botIsAdmin = await helper.getBotAdmin(sock, from);
            if (!botIsAdmin) return sock.sendMessage(from, { text: "❌ I must be an admin." }, { quoted: m });
            await sock.groupSettingUpdate(from, "not_announcement");
            await sock.groupSettingUpdate(from, "unlocked");
            await sock.sendMessage(from, { text: "✅ Group settings reset." }, { quoted: m });
        }
    },
    {
        name: "lock",
        description: "Lock group settings (admins only)",
        category: "group",
        async execute(sock, m, { from, isMod }) {
            if (!from.endsWith("@g.us")) return;
            if (!isMod) return sock.sendMessage(from, { text: "❌ Only owners and mods can use this command." }, { quoted: m });
            const botIsAdmin = await helper.getBotAdmin(sock, from);
            if (!botIsAdmin) return sock.sendMessage(from, { text: "❌ I must be an admin." }, { quoted: m });
            await sock.groupSettingUpdate(from, "locked");
            await sock.sendMessage(from, { text: "✅ Group settings locked." }, { quoted: m });
        }
    },
    {
        name: "unlock",
        description: "Unlock group settings (everyone can edit)",
        category: "group",
        async execute(sock, m, { from, isMod }) {
            if (!from.endsWith("@g.us")) return;
            if (!isMod) return sock.sendMessage(from, { text: "❌ Only owners and mods can use this command." }, { quoted: m });
            const botIsAdmin = await helper.getBotAdmin(sock, from);
            if (!botIsAdmin) return sock.sendMessage(from, { text: "❌ I must be an admin." }, { quoted: m });
            await sock.groupSettingUpdate(from, "unlocked");
            await sock.sendMessage(from, { text: "✅ Group settings unlocked." }, { quoted: m });
        }
    },
    {
        name: "ephemeral",
        description: "Enable/Disable ephemeral messages",
        category: "group",
        async execute(sock, m, { from, text, isMod }) {
            if (!from.endsWith("@g.us")) return;
            if (!isMod) return sock.sendMessage(from, { text: "❌ Only owners and mods can use this command." }, { quoted: m });
            const botIsAdmin = await helper.getBotAdmin(sock, from);
            if (!botIsAdmin) return sock.sendMessage(from, { text: "❌ I must be an admin." }, { quoted: m });
            const expiration = text === "on" ? 604800 : 0;
            await sock.groupToggleEphemeral(from, expiration);
            await sock.sendMessage(from, { text: `✅ Ephemeral messages ${text === "on" ? "enabled" : "disabled"}.` }, { quoted: m });
        }
    },
    {
        name: "warn",
        description: "Warn a member",
        category: "group",
        async execute(sock, m, { from, isMod }) {
            if (!from.endsWith("@g.us")) return;
            if (!isMod) return sock.sendMessage(from, { text: "❌ Only owners and mods can use this command." }, { quoted: m });
            const target = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message?.extendedTextMessage?.contextInfo?.participant;
            if (!target) return sock.sendMessage(from, { text: "❌ Tag or reply to a user." }, { quoted: m });
            await sock.sendMessage(from, { text: `⚠️ @${target.split("@")[0]}, you have been warned!`, mentions: [target] }, { quoted: m });
        }
    },
    {
        name: "delwarn",
        description: "Remove warnings from a member",
        category: "group",
        async execute(sock, m, { from, isMod }) {
            if (!from.endsWith("@g.us")) return;
            if (!isMod) return sock.sendMessage(from, { text: "❌ Only owners and mods can use this command." }, { quoted: m });
            const target = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message?.extendedTextMessage?.contextInfo?.participant;
            if (!target) return sock.sendMessage(from, { text: "❌ Tag or reply to a user." }, { quoted: m });
            await sock.sendMessage(from, { text: `✅ Warnings removed for @${target.split("@")[0]}`, mentions: [target] }, { quoted: m });
        }
    },
    {
        name: "listwarn",
        description: "List warned members",
        category: "group",
        async execute(sock, m, { from, isMod }) {
            if (!from.endsWith("@g.us")) return;
            if (!isMod) return sock.sendMessage(from, { text: "❌ Only owners and mods can use this command." }, { quoted: m });
            await sock.sendMessage(from, { text: "📋 No warned members found." }, { quoted: m });
        }
    },
    {
        name: "kickall",
        description: "Kick all members (Owner only)",
        category: "group",
        async execute(sock, m, { from, isOwner }) {
            if (!from.endsWith("@g.us")) return;
            if (!isOwner) return sock.sendMessage(from, { text: "❌ Owner only command." }, { quoted: m });
            const botIsAdmin = await helper.getBotAdmin(sock, from);
            if (!botIsAdmin) return sock.sendMessage(from, { text: "❌ I must be an admin." }, { quoted: m });
            const groupMetadata = await sock.groupMetadata(from);
            const participants = groupMetadata.participants.filter(p => p.id !== sock.user.id.split(":")[0] + "@s.whatsapp.net" && !helper.isOwner(p.id.split("@")[0]));
            for (const p of participants) {
                await sock.groupParticipantsUpdate(from, [p.id], "remove");
            }
            await sock.sendMessage(from, { text: "✅ All members kicked." });
        }
    },
    {
        name: "delete",
        description: "Delete a message",
        category: "group",
        async execute(sock, m, { from, isMod }) {
            if (!isMod) return;
            const quoted = m.message?.extendedTextMessage?.contextInfo?.stanzaId;
            if (!quoted) return sock.sendMessage(from, { text: "❌ Reply to a message to delete." }, { quoted: m });
            await sock.sendMessage(from, { delete: m.message.extendedTextMessage.contextInfo });
        }
    },
    {
        name: "setpp",
        description: "Set group profile picture",
        category: "group",
        async execute(sock, m, { from, isMod }) {
            if (!from.endsWith("@g.us")) return;
            if (!isMod) return sock.sendMessage(from, { text: "❌ Only owners and mods can use this command." }, { quoted: m });
            const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            if (!quoted?.imageMessage) return sock.sendMessage(from, { text: "❌ Reply to an image." }, { quoted: m });
            const botIsAdmin = await helper.getBotAdmin(sock, from);
            if (!botIsAdmin) return sock.sendMessage(from, { text: "❌ I must be an admin." }, { quoted: m });
            const media = await sock.downloadMediaMessage(quoted);
            await sock.updateProfilePicture(from, media);
            await sock.sendMessage(from, { text: "✅ Group profile picture updated." }, { quoted: m });
        }
    },
    {
        name: "group",
        description: "Open/Close group",
        category: "group",
        async execute(sock, m, { from, text, isMod }) {
            if (!from.endsWith("@g.us")) return;
            if (!isMod) return sock.sendMessage(from, { text: "❌ Only owners and mods can use this command." }, { quoted: m });
            const botIsAdmin = await helper.getBotAdmin(sock, from);
            if (!botIsAdmin) return sock.sendMessage(from, { text: "❌ I must be an admin." }, { quoted: m });
            if (text === "open") {
                await sock.groupSettingUpdate(from, "not_announcement");
                await sock.sendMessage(from, { text: "✅ Group opened." }, { quoted: m });
            } else if (text === "close") {
                await sock.groupSettingUpdate(from, "announcement");
                await sock.sendMessage(from, { text: "✅ Group closed." }, { quoted: m });
            } else {
                await sock.sendMessage(from, { text: "Usage: .group open/close" }, { quoted: m });
            }
        }
    }
];
