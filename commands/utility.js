const config = require('../config');

const blue = { bot: [] };

blue.bot.push(
    {
        name: "ping",
        description: "Check bot speed",
        category: "utility",
        async execute(sock, msg, { from }) {
            const start = Date.now();
            const { key } = await sock.sendMessage(from, { text: "Testing speed..." });
            const end = Date.now();
            await sock.sendMessage(from, { text: `🚀 Speed: ${end - start}ms`, edit: key });
        }
    },
    {
        name: "runtime",
        alias: ["uptime"],
        description: "Check bot runtime",
        category: "utility",
        async execute(sock, msg, { from }) {
            const seconds = process.uptime();
            const d = Math.floor(seconds / (3600 * 24));
            const h = Math.floor((seconds % (3600 * 24)) / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = Math.floor(seconds % 60);
            const runtime = `${d > 0 ? d + "d " : ""}${h > 0 ? h + "h " : ""}${m > 0 ? m + "m " : ""}${s}s`;
            await sock.sendMessage(from, { text: `🕒 Runtime: ${runtime}` }, { quoted: msg });
        }
    }
);

module.exports = blue.bot;
