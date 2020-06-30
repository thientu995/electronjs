const { desktopCapturer } = require('electron');
module.exports = class DesktopCapture extends require('./base') {
    constructor(format) {
        super();
        this.imageFormat = format || 'image/png';
    }

    CurrentScreen() {
        return new Promise((resolve, reject) => {
            desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
                try {
                    resolve(await this.getMediaUserVideo(sources));
                } catch (e) {
                    console.error(e);
                }
            });
        });
    }

    toTagCanvas = function (streamResult) {
        if (streamResult == null) return;
        const videoTrack = streamResult.getVideoTracks()[0];
        const imageCapture = new ImageCapture(videoTrack);
        const canvas = document.createElement('canvas');
        return new Promise((resolve, reject) => {
            imageCapture.grabFrame()
                .then(imageBitmap => {
                    canvas.width = imageBitmap.width;
                    canvas.height = imageBitmap.height;
                    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                    canvas.getContext('2d').drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);
                    resolve(canvas);
                    try {
                        videoTrack.stop();
                    } catch (e) { }
                })
                .catch(error => console.log(error));
        });
    }

    toDataUrl = function (streamResult) {
        if (streamResult == null) return;
        return new Promise((resolve, reject) => {
            this.toTagCanvas(streamResult).then(result => {
                resolve(result.toDataURL(this.imageFormat));
            })
        });
    }

    toDataStrBase64 = function (streamResult) {
        if (streamResult == null) return;
        const reg = new RegExp('data:' + this.imageFormat + ";base64,", 'g');
        return new Promise((resolve, reject) => {
            this.toDataURL(streamResult).then(result => {
                resolve(result.replace(reg, ""));
            });
        });
    }
}