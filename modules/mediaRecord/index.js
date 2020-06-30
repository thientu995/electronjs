console.warn(`> Import module: ${__filename}`);
const Capture = require('./desktopCapture');
const Record = require('./desktopRecord');
const Audio = require('./audioRecord');
module.exports = {
    Capture, Record, Audio
}