const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { getBuffer } = require('./internal/helper'); // Assuming helper has getBuffer
const config = require('../../config');

/**
 * This adapter provides the 'kord' function and other utilities 
 * that Kord-Ai commands expect, mapping them to BLUEBOT-XMD's structure.
 */

const commands = [];

const kord = (cmdConfig, handler) => {
    const blueCmd = {
        name: cmdConfig.cmd || cmdConfig.on,
        alias: cmdConfig.alias || [],
        description: cmdConfig.desc || "",
        category: cmdConfig.type || "general",
        async execute(sock, m, context) {
            // Create a wrapper for 'm' that mimics Kord-Ai's message object
            const kordM = {
                ...m,
                client: sock,
                chat: context.from,
                sender: context.sender,
                text: context.text,
                args: context.args,
                quoted: m.message?.extendedTextMessage?.contextInfo?.quotedMessage ? {
                    text: m.message.extendedTextMessage.contextInfo.quotedMessage.conversation || m.message.extendedTextMessage.contextInfo.quotedMessage.extendedTextMessage?.text,
                    download: async () => {
                        // Implementation for downloading quoted media
                        const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
                        const quoted = m.message.extendedTextMessage.contextInfo.quotedMessage;
                        const type = Object.keys(quoted)[0];
                        const stream = await downloadContentFromMessage(quoted[type], type.replace('Message', ''));
                        let buffer = Buffer.from([]);
                        for await (const chunk of stream) {
                            buffer = Buffer.concat([buffer, chunk]);
                        }
                        return buffer;
                    },
                    sticker: !!m.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage,
                    image: !!m.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage,
                    video: !!m.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage,
                    audio: !!m.message.extendedTextMessage.contextInfo.quotedMessage.audioMessage,
                } : null,
                send: async (content, options = {}, type = 'text') => {
                    if (Buffer.isBuffer(content) || (typeof content === 'string' && content.startsWith('http'))) {
                        if (type === 'image') return sock.sendMessage(context.from, { image: typeof content === 'string' ? { url: content } : content, ...options });
                        if (type === 'video') return sock.sendMessage(context.from, { video: typeof content === 'string' ? { url: content } : content, ...options });
                        if (type === 'audio') return sock.sendMessage(context.from, { audio: typeof content === 'string' ? { url: content } : content, ...options });
                        if (type === 'sticker') return sock.sendMessage(context.from, { sticker: typeof content === 'string' ? { url: content } : content, ...options });
                        if (type === 'document') return sock.sendMessage(context.from, { document: typeof content === 'string' ? { url: content } : content, ...options });
                    }
                    return sock.sendMessage(context.from, { text: content, ...options });
                },
                react: (emoji) => sock.sendMessage(context.from, { react: { text: emoji, key: m.key } }),
                axios: async (url) => (await axios.get(url)).data,
            };

            try {
                await handler(kordM, context.text, cmdConfig.cmd);
            } catch (err) {
                console.error(`Error in command ${cmdConfig.cmd}:`, err);
                sock.sendMessage(context.from, { text: `❌ Error: ${err.message}` });
            }
        }
    };
    commands.push(blueCmd);
};

module.exports = {
    kord,
    commands,
    wtype: false, // Default to public
    config: () => config,
    getBuffer,
    // Add other Kord-Ai core utilities as needed
};
