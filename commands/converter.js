const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const config = require('../config');

const blue = { bot: [] };

const downloadMedia = async (m) => {
    const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const msg = quoted ? quoted : m.message;
    const type = Object.keys(msg)[0];
    const stream = await downloadContentFromMessage(msg[type], type.replace('Message', ''));
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
};

blue.bot.push(
    {
        name: "sticker",
        alias: ["s", "stk"],
        description: "Convert media to sticker",
        category: "converter",
        async execute(sock, msg, { from }) {
            try {
                const buffer = await downloadMedia(msg);
                await sock.sendMessage(from, { sticker: buffer }, { quoted: msg });
            } catch (e) {
                sock.sendMessage(from, { text: "Error creating sticker. Make sure you reply to an image or video." }, { quoted: msg });
            }
        }
    },
    {
        name: "toimg",
        alias: ["photo"],
        description: "Convert sticker to image",
        category: "converter",
        async execute(sock, msg, { from }) {
            try {
                const buffer = await downloadMedia(msg);
                await sock.sendMessage(from, { image: buffer }, { quoted: msg });
            } catch (e) {
                sock.sendMessage(from, { text: "Error converting sticker to image." }, { quoted: msg });
            }
        }
    },
    {
        name: "tomp3",
        alias: ["toaudio"],
        description: "Convert video to audio",
        category: "converter",
        async execute(sock, msg, { from }) {
            try {
                const buffer = await downloadMedia(msg);
                await sock.sendMessage(from, { audio: buffer, mimetype: "audio/mpeg" }, { quoted: msg });
            } catch (e) {
                sock.sendMessage(from, { text: "Error converting video to audio." }, { quoted: msg });
            }
        }
    }
);

module.exports = blue.bot;
