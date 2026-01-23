module.exports = {
    name: 'owner',
    description: 'Show owner info',
    async execute(sock, m, { from, config }) {
        const vcard = 'BEGIN:VCARD\n'
            + 'VERSION:3.0\n' 
            + `FN:${config.OWNER_NAME}\n`
            + `TEL;type=CELL;type=VOICE;waid=${config.OWNER_NUMBER}:${config.OWNER_NUMBER}\n`
            + 'END:VCARD';
        await sock.sendMessage(from, { 
            contacts: { 
                displayName: config.OWNER_NAME, 
                contacts: [{ vcard }] 
            }
        }, { quoted: m });
    }
};

const { exec } = require("child_process");
const config = require("../config");

module.exports = [
    // -----------------------
    // UPDATE COMMAND
    // -----------------------
    {
        name: "update",
        description: "Update the bot from GitHub (owner only)",
        category: "owner",
        async execute(sock, m, { from, sender }) {
            if (!sender.includes(config.OWNER_NUMBER)) {
                return sock.sendMessage(from, { text: "❌ Only the owner can use this command." }, { quoted: m });
            }

            await sock.sendMessage(from, { text: "🔄 Updating bot from GitHub..." }, { quoted: m });

            exec("git pull", (err, stdout, stderr) => {
                if (err) {
                    console.error("Update error:", err);
                    return sock.sendMessage(from, { text: `❌ Update failed:\n${err.message}` }, { quoted: m });
                }

                if (stderr) console.error("Git stderr:", stderr);

                sock.sendMessage(from, { text: `✅ Update completed:\n${stdout || "No changes found."}` }, { quoted: m });

                sock.sendMessage(from, { text: "♻️ Restarting bot to apply changes..." }, { quoted: m });
                process.exit(0); // relies on PM2/Pterodactyl for auto-restart
            });
        }
    },

    // -----------------------
    // EVAL COMMAND
    // -----------------------
    {
        name: "eval",
        description: "Execute JavaScript code (owner only)",
        category: "owner",
        async execute(sock, m, { args, from, sender }) {
            if (!sender.includes(config.OWNER_NUMBER)) {
                return sock.sendMessage(from, { text: "❌ Only the owner can use this command." }, { quoted: m });
            }

            try {
                const code = args.join(" ");
                let result = eval(code);
                if (typeof result !== "string") result = require("util").inspect(result);
                await sock.sendMessage(from, { text: `✅ Result:\n${result}` }, { quoted: m });
            } catch (err) {
                await sock.sendMessage(from, { text: `❌ Error:\n${err.message}` }, { quoted: m });
            }
        }
    },

    // -----------------------
    // EXEC COMMAND
    // -----------------------
    {
        name: "exec",
        description: "Run shell commands (owner only)",
        category: "owner",
        async execute(sock, m, { args, from, sender }) {
            if (!sender.includes(config.OWNER_NUMBER)) {
                return sock.sendMessage(from, { text: "❌ Only the owner can use this command." }, { quoted: m });
            }

            const cmd = args.join(" ");
            if (!cmd) return sock.sendMessage(from, { text: "❌ Usage: .exec <command>" }, { quoted: m });

            exec(cmd, (err, stdout, stderr) => {
                if (err) return sock.sendMessage(from, { text: `❌ Error:\n${err.message}` }, { quoted: m });
                if (stderr) return sock.sendMessage(from, { text: `⚠️ Stderr:\n${stderr}` }, { quoted: m });

                sock.sendMessage(from, { text: `✅ Output:\n${stdout || "No output"}` }, { quoted: m });
            });
        }
    },

    // -----------------------
    // RESTART COMMAND
    // -----------------------
    {
        name: "restart",
        description: "Restart the bot (owner only)",
        category: "owner",
        async execute(sock, m, { from, sender }) {
            if (!sender.includes(config.OWNER_NUMBER)) {
                return sock.sendMessage(from, { text: "❌ Only the owner can use this command." }, { quoted: m });
            }

            await sock.sendMessage(from, { text: "♻️ Restarting bot..." }, { quoted: m });
            process.exit(0); // relies on PM2/Pterodactyl to auto-restart
        }
    },

    // -----------------------
    // SHUTDOWN COMMAND
    // -----------------------
    {
        name: "shutdown",
        description: "Shutdown the bot (owner only)",
        category: "owner",
        async execute(sock, m, { from, sender }) {
            if (!sender.includes(config.OWNER_NUMBER)) {
                return sock.sendMessage(from, { text: "❌ Only the owner can use this command." }, { quoted: m });
            }

            await sock.sendMessage(from, { text: "🛑 Shutting down bot..." }, { quoted: m });
            process.exit(0);
        }
    }
];
