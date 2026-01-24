/**
 * Internal Logger Utility
 * Handles system-level logging for core processes.
 */
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../../../logs/system.log');

function log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}\n`;
    
    // Ensure logs directory exists
    const logDir = path.dirname(logFile);
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
    
    fs.appendFileSync(logFile, logMessage);
}

module.exports = { log };
