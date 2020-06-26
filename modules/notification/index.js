console.warn(`> Import Module: ${__filename}`);
const {remote, Notification} = require('electron');
module.exports = Notification || remote.Notification