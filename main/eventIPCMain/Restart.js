module.exports = function (event, args) {
    this.app.relaunch();
    this.app.exit();
}