class AudioManager {
    constructor() {
        this.listener = new THREE.AudioListener();
        w_Camera.add(this.listener);

        this.audioLoader = new THREE.AudioLoader();

        this.music = new THREE.Audio(this.listener);
        this.audioLoader.load('resources/audio/alla-turca.mp3', (buffer) => {
            this.music.setBuffer(buffer);
            this.music.setLoop(true);
            this.music.setVolume(0.3);
        });

        this.win = new THREE.Audio(this.listener);
        this.audioLoader.load('resources/audio/QuizRight.wav', (buffer) => {
            this.win.setBuffer(buffer);
            this.win.setLoop(false);
            this.win.setVolume(0.25);
        })

        this.lose = new THREE.Audio(this.listener);
        this.audioLoader.load('resources/audio/QuizWrong.wav', (buffer) => {
            this.lose.setBuffer(buffer);
            this.lose.setLoop(false);
            this.lose.setVolume(0.4);
        })

        this.playMusic = false;
    }

    update() {
        if (this.playMusic == true && this.music.isPlaying == false &&
            this.music.sourceType != "empty"
        ) {
            this.music.play();
        }
    }

    triggerMusic(bool) {
        this.playMusic = bool;
    }

    stopMusic() {
        if (this.playMusic || this.music.isPlaying) {
            this.playMusic = false;
            this.music.stop();
        }
    }

    triggerSound(sfx) {
        if (sfx.sourceType != "empty") {
            sfx.setDetune(Math.random()*80-40);
            sfx.play();
        }
    }
}