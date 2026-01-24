const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const https = require("https");

const TAR_URL =
  "https://github.com/Vhadau2011/BLUEBOT-XMD/archive/refs/heads/main.tar.gz";

module.exports = [
  {
    name: "update",
    description: "Update the bot from GitHub",
    category: "owner",

    async execute(sock, m, { from, isOwner }) {
      if (!isOwner) {
        return sock.sendMessage(
          from,
          { text: "❌ Owner only command." },
          { quoted: m }
        );
      }

      const root = path.join(__dirname, "..");
      const tarPath = path.join(root, "update.tar.gz");

      await sock.sendMessage(
        from,
        { text: "🔄 Downloading latest update..." },
        { quoted: m }
      );

      // Download tar.gz
      const file = fs.createWriteStream(tarPath);
      https.get(TAR_URL, res => {
        res.pipe(file);
        file.on("finish", () => {
          file.close(() => extract());
        });
      }).on("error", () => {
        if (fs.existsSync(tarPath)) fs.unlinkSync(tarPath);
        sock.sendMessage(from, { text: "❌ Download failed." }, { quoted: m });
      });

      function extract() {
        exec(`tar -xzf update.tar.gz`, { cwd: root }, err => {
          if (err) {
            return sock.sendMessage(
              from,
              { text: "❌ Extract failed." },
              { quoted: m }
            );
          }

          const extracted = path.join(root, "BLUEBOT-XMD-main");

          // Copy files EXCEPT config.js
          exec(
            `rsync -av --exclude=config.js ${extracted}/ ${root}/`,
            err => {
              if (err) {
                return sock.sendMessage(
                  from,
                  { text: "❌ Update sync failed." },
                  { quoted: m }
                );
              }

              fs.rmSync(extracted, { recursive: true, force: true });
              fs.rmSync(tarPath, { force: true });

              sock.sendMessage(
                from,
                { text: "✅ Update complete. Restarting bot..." },
                { quoted: m }
              );

              setTimeout(() => process.exit(0), 2000);
            }
          );
        });
      }
    }
  }
];
