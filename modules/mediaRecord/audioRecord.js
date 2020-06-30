const fs = require('fs');
module.exports = class AudioRecord extends require('./base') {
    constructor(format, option) {
        super();
        this.option = option || {
            onerror: null,
            onstart: null,
            onstop: null,
            onwarning: null,
            onpause: null,
            onresume: null,
            pathFile: `./example.ogg`,
        };
        this.status = null;
        this.format = format || 'audio/ogg';
        this.recorder = null;

        // process
        try {
            this.getMediaUserAudio().then(stream => {
                handleStream(this, stream);
            });
        } catch (e) {
            console.error(e);
        }

        function callback(self, nameFn, evt) {
            nameFn = 'on' + nameFn;
            if (self.option[nameFn] != null) {
                self.option[nameFn](evt);
            }
            else {
                if (nameFn === 'onstop') {
                    self.toArrayBuffer(evt.target.blob, (ab) => {
                        fs.writeFile(self.option.pathFile, self.toBuffer(ab), function (err) {
                            if (err) {
                                console.error('Failed: ' + err);
                            } else {
                                console.log('Saved: ' + self.option.pathFile);
                            }
                        });
                    });
                }
            }
            self.getStatus();
        }

        function handleStream(self, stream) {
            let blobs = [];
            self.recorder = self.toMediaRecorder(stream, 'audio');
            self.status = self.recorder.state;
            
            self.recorder.ondataavailable = (event) => {
                blobs.push(event.data);
            };

            self.recorder.onerror = function (e) {
                callback(self, 'error', e);
            };

            self.recorder.onstart = function (e) {
                callback(self, 'start', e);
            };

            self.recorder.onstop = function (e) {
                e.target.blob = new Blob(blobs, { type: self.format });
                e.target.url = URL.createObjectURL(e.target.blob);
                callback(self, 'stop', e);
            };

            self.recorder.onpause = function (e) {
                callback(self, 'pause', e);
            };

            self.recorder.onresume = function (e) {
                callback(self, 'resume', e);
            };

            self.recorder.onwarning = function (e) {
                callback(self, 'warning', e);
            };
        }
    }

    Start(callbackWhenReady) {
        const isCallback = callbackWhenReady || true;
        if (this.recorder != null && this.status === 'inactive') {
            this.recorder.start();
        }
        else {
            if (isCallback) {
                setTimeout(() => { this.Start() }, 500);
            }
        }
    }

    Pause() {
        if (this.recorder != null && this.status == 'recording') {
            this.recorder.pause();
        }
    }

    Resume() {
        if (this.recorder != null && this.status == 'paused') {
            this.recorder.resume();
        }
    }

    Stop() {
        if (this.recorder != null && this.status !== 'inactive') {
            this.recorder.stop();
            this.status = null;
        }
    }

    getStatus() {
        this.status = this.recorder.state;
        return this.status;
    }
}