const { isAdmin, isMod, isOwner, isBanned } = require("./database/handlers/userHandler");
const config = require("./config");
const fs = require("fs");
const crypto = require("crypto");

// ANTI-EDIT PROTECTION
// This code ensures that any modification to this file will shut down the bot.
// Hardcoded checksum of the "pure" version of this file
const PURE_CHECKSUM = "682a96eb8d08e160b88ac6320f9742e8866503a16d0a2215607ec69c2be1fcba"; 

function verifyIntegrity() {
    // We normalize the file content by removing all whitespace and line endings 
    // to prevent the check from failing due to different hosting environments (LF vs CRLF)
    const content = fs.readFileSync(__filename, "utf8");
    const normalizedContent = content.replace(/\s+/g, "");
    const hash = crypto.createHash("sha256").update(normalizedContent).digest("hex");
    
    if (PURE_CHECKSUM === "ANTI_EDIT_STUB") {
        console.log(`[INTEGRITY] New normalized hash: ${hash}`);
    } else if (hash !== PURE_CHECKSUM) {
        console.error("🛑 [SECURITY] UNAUTHORIZED EDIT DETECTED IN blue.js!");
        console.error("🛑 The bot will now shut down to prevent instability.");
        process.exit(1);
    }
}

// Initial verification
verifyIntegrity();

const blue = { bot: {} };

/**
 * Check if user is the developer (LOCKED - cannot be changed)
 * @param {string} number - User number without @s.whatsapp.net
 * @returns {boolean}
 */
function isDeveloper(number) {
    const devNumber = config.DEVELOPER_NUMBER.replace(/[^0-9]/g, "");
    const userNumber = number.replace(/[^0-9]/g, "");
    return userNumber === devNumber;
}

blue.bot.isDeveloper = isDeveloper;

/**
 * Handles group participants update events (Welcome/Goodbye).
 * @param {object} sock - The socket connection.
 * @param {object} anu - The update event data.
 */
blue.bot.handleGroupParticipantsUpdate = async (sock, anu) => {
    verifyIntegrity(); // Check integrity on events
    try {
        const { id, participants, action } = anu;
        
        if (action === "add") {
            const metadata = await sock.groupMetadata(id);
            for (const num of participants) {
                let msg = (config.WELCOME_MSG || "Welcome @user to @group")
                    .replace(/{user}/g, `@${num.split("@")[0]}`)
                    .replace(/{group}/g, metadata.subject)
                    .replace(/{count}/g, metadata.participants.length);

                await sock.sendMessage(id, { 
                    text: msg, 
                    mentions: [num],
                    contextInfo: {
                        externalAdReply: {
                            title: "BLUEBOT-XMD Welcome",
                            body: config.BOT_NAME,
                            thumbnailUrl: config.MENU_IMAGE,
                            sourceUrl: "https://github.com/Vhadau2011/BLUEBOT-XMD",
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
                    }
                });
            }
        }
    } catch (err) {
        console.error("Group Participants Update Error:", err);
    }
};

/**
 * Handles group metadata updates or other group-related events.
 * @param {object} sock - The socket connection.
 * @param {object} anu - The update event data.
 */
blue.bot.handleGroupUpdate = async (sock, anu) => {
    verifyIntegrity();
    console.log("Group Update:", anu);
};

blue.bot.isAdmin = isAdmin;
blue.bot.isMod = isMod;
blue.bot.isOwner = isOwner;
blue.bot.isBanned = isBanned;
blue.bot.isDeveloper = isDeveloper;

module.exports = blue.bot;
