module.exports = class Base {
    constructor() {

    }

    getMediaUserFull(sources) {
        const source = sources.find(function (x) { return x.name == 'Entire Screen' });
        return navigator.mediaDevices.getUserMedia({
            audio: {
                mandatory: {
                    chromeMediaSource: 'desktop'
                }
            },
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: source.id,
                }
            }
        });
    }

    getMediaUserVideo(sources) {
        const source = sources.find(function (x) { return x.name == 'Entire Screen' });
        return navigator.mediaDevices.getUserMedia({
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: source.id,
                }
            },
        });
    }

    getMediaUserAudio() {
        return navigator.mediaDevices.getUserMedia({
            audio: {
                mandatory: {
                    chromeMediaSource: 'desktop'
                }
            },
        });
    }

    toBuffer(ab) {
        let buffer = Buffer.alloc(ab.byteLength);
        let arr = new Uint8Array(ab);
        for (let i = 0; i < arr.byteLength; i++) {
            buffer[i] = arr[i];
        }
        return buffer;
    }

    toArrayBuffer(blob, cb) {
        let fileReader = new FileReader();
        fileReader.onload = (event) => {
            cb(event.target.result);
        };
        fileReader.readAsArrayBuffer(blob);
    }


    toMediaRecorder(localStream, type) {
        if (typeof MediaRecorder.isTypeSupported == 'function') {
            if (type == 'video') {
                if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
                    var options = { mimeType: 'video/webm;codecs=vp9' };
                } else if (MediaRecorder.isTypeSupported('video/webm;codecs=h264')) {
                    var options = { mimeType: 'video/webm;codecs=h264' };
                } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
                    var options = { mimeType: 'video/webm;codecs=vp8' };
                }
                return new MediaRecorder(localStream, options);
            }
        }
        return new MediaRecorder(localStream);
    }
}