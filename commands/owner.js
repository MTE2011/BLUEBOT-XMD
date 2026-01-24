const {const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

module.exports = [
  {
    name: "update",
    category: "owner",
    description: "Update bot from GitHub (safe)",
    async execute(sock, m, { from, isOwner }) {
      if (!isOwner) {
        return sock.sendMessage(from, { text: "❌ Owner only command." }, { quoted: m });
      }

      const BOT_DIR = path.resolve(__dirname, "..");
      const TMP_DIR = path.join(BOT_DIR, "__update_tmp__");
      const REPO = "https://github.com/Vhadau2011/BLUEBOT-XMD.git";

      await sock.sendMessage(from, { text: "🔄 Checking for updates..." }, { quoted: m });

      // Clean temp folder
      if (fs.existsSync(TMP_DIR)) {
        fs.rmSync(TMP_DIR, { recursive: true, force: true });
      }

      // Clone latest repo
      exec(`git clone --depth=1 ${REPO} ${TMP_DIR}`, async (err) => {
        if (err) {
          return sock.sendMessage(from, { text: "❌ Git clone failed." }, { quoted: m });
        }

        /**
         * FILES/FOLDERS TO SKIP
         */
        const SKIP = [
          "config.js",
          ".env",
          "node_modules",
          "session",
          "sessions",
          "auth_info",
          "__update_tmp__"
        ];

        /**
         * Recursive copy (safe)
         */
        const copySafe = (src, dest) => {
          if (SKIP.includes(path.basename(src))) return;

          const stat = fs.statSync(src);

          if (stat.isDirectory()) {
            if (!fs.existsSync(dest)) fs.mkdirSync(dest);
            for (const file of fs.readdirSync(src)) {
              copySafe(path.join(src, file), path.join(dest, file));
            }
          } else {
            fs.copyFileSync(src, dest);
          }
        };

        // Copy everything except skipped files
        for (const file of fs.readdirSync(TMP_DIR)) {
          copySafe(
            path.join(TMP_DIR, file),
            path.join(BOT_DIR, file)
          );
        }

        // Cleanup
        fs.rmSync(TMP_DIR, { recursive: true, force: true });

        await sock.sendMessage(from, {
          text: "✅ Update complete!\n♻ Restarting bot..."
        }, { quoted: m });

        // Restart
        setTimeout(() => process.exit(0), 2000);
      });
    }
  }
];
        name: "setmode",
        description: "Change bot mode (public/private)",
        category: "owner",
        async execute(sock, m, { from, isMod, args, config }) {
            if (!isMod) return sock.sendMessage(from, { text: "❌ This command is for Owner/Mods only." }, { quoted: m });
            
            const mode = args[0]?.toLowerCase();
            if (mode !== "public" && mode !== "private") {
                return sock.sendMessage(from, { text: "❌ Usage: .setmode public/private" }, { quoted: m });
            }

            config.MODE = mode;
            await sock.sendMessage(from, { text: `✅ Bot mode changed to: *${mode}*` }, { quoted: m });
        }
    },
    {
        name: "eval",
        description: "Evaluate JavaScript code",
        category: "owner",
        async execute(sock, m, { from, isOwner, text }) {
            if (!isOwner) return sock.sendMessage(from, { text: "❌ This command is for Owner only." }, { quoted: m });
            if (!text) return sock.sendMessage(from, { text: "❌ Provide code to evaluate." }, { quoted: m });

            try {
                let evaled = await eval(text);
                if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
                await sock.sendMessage(from, { text: evaled }, { quoted: m });
            } catch (err) {
                await sock.sendMessage(from, { text: `❌ Error: ${err.message}` }, { quoted: m });
            }
        }
    },
    {
        name: "broadcast",
        description: "Send a message to all chats",
        category: "owner",
        async execute(sock, m, { from, isMod, text }) {
            if (!isMod) return sock.sendMessage(from, { text: "❌ This command is for Owner/Mods only." }, { quoted: m });
            if (!text) return sock.sendMessage(from, { text: "❌ Provide a message to broadcast." }, { quoted: m });

            const chats = await sock.groupFetchAllParticipating();
            const groups = Object.values(chats).map(v => v.id);

            await sock.sendMessage(from, { text: `📢 Broadcasting to ${groups.length} groups...` }, { quoted: m });

            for (let id of groups) {
                await sock.sendMessage(id, { text: `📢 *BROADCAST*\n\n${text}` });
                await new Promise(resolve => setTimeout(resolve, 1000)); // Delay to avoid spam
            }

            await sock.sendMessage(from, { text: "✅ Broadcast complete." }, { quoted: m });
        }
    }
];
