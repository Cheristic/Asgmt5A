class HUDManager {
    constructor() {
        this.hudElem = document.getElementById('ui').getContext('2d');

        this.mouseRaycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();

        // build score
        this.score = {
            counter: 0,
            imgAlpha: 0,
            elapsedTime: 0
        };
        this.hudElem.font = "bold 40px serif";
        this.hudElem.textAlign = "left";
        this.hudElem.textBaseLine = "middle";
        this.hudElem.strokeStyle = "#EFEFEF";

        this.hudElem.lineWidth = 5
        this.hudElem.stroke();
        this.hudElem.fillStyle = "#db9f05"

        this.timer = {
            img0: new Image(),
            img1: new Image(),
            imgAlpha: 0,
            totalMiniGameTime: 0,
            currTime: 0,
            timeCropChunks: new Array(8),
            currTimeChunk: 0,
            shakeFPS: 8,
            currShakeFrame: 0,
            currShakeImage: 0,
            fade: {
                elapsedTime: 0,
                fadeOut: false
            }
        };
        this.timer.img0.src = 'resources/UI/160-Ware-timer0.png';
        this.timer.img1.src = 'resources/UI/160-Ware-timer1.png';


        // GAME TRANSITION
        this.showInstructionText = false;
        this.nextScreen = null;
        this.instructionAlpha = 1.0;
        this.cam = gameManager.cameraObject;

        this.hudDisplay = {
            showHUD: false,
            fadeOutHUD: false,
            fadeInHUD: false
        }

        document.addEventListener("OnStartGame", () => {hud.hudDisplay.showHUD = true; hud.hudDisplay.fadeInHUD = true;});
        document.addEventListener("OnGameOver", () => {hud.hudDisplay.showHUD = false; hud.hudDisplay.fadeOutHUD = true; hud.timer.fade.elapsedTime = 0;});
    }

    update() {
        this.hudElem.clearRect(0, 0, canvas.width, canvas.height);

        
        // #### TIMER SHAKE ####
        this.hudElem.globalAlpha = this.timer.imgAlpha;
        let t_img = this.timer.currShakeImage == 0 ? this.timer.img0 : this.timer.img1;

        let width = gameManager.onGameOver ? 100 : 100+(597*this.timer.timeCropChunks[this.timer.currTimeChunk]);
        this.hudElem.drawImage(t_img, 0, 0, width, 113, 40, canvas.height-120,width, 113);
        this.timer.currShakeFrame = (this.timer.currShakeFrame + 1) % this.timer.shakeFPS;
        if (this.timer.currShakeFrame == 0) {
            this.timer.currShakeImage = (this.timer.currShakeImage + 1) % 2;
        }
        this.hudElem.globalAlpha = 1.0;
        // ################################

        
        // #### MINIGAME INSTRUCTIONS ####
        if (this.showInstructionText) {
            if (this.cam.isLerping) { // while transitioning
                if (this.cam.elapsedTime > .1) {
                    if (this.cam.elapsedTime < (this.cam.lerpTime*.2)) {
                        this.instructionAlpha = (this.cam.elapsedTime - this.cam.lerpTime*.1)/(this.cam.lerpTime*.2-this.cam.lerpTime*.1);
                    } 
                    else if (this.cam.elapsedTime > (this.cam.lerpTime*.97)) {
                        let amt = (this.cam.elapsedTime - this.cam.lerpTime*.97)/(this.cam.lerpTime*.03);
                        this.instructionAlpha = 1 - amt;
                        this.timer.imgAlpha = amt; // also fade in timer cuz why not
                    } else {this.instructionAlpha = 1.0;}
                    this.hudElem.font = "bold 40px serif";
                    this.hudElem.textAlign = "center";
                    this.hudElem.fillStyle = "rgba(219, 159, 5, " + this.instructionAlpha + ")";
                    this.hudElem.strokeStyle = "rgba(239, 239, 239, " + this.instructionAlpha + ")";
                    this.hudElem.strokeText(this.nextScreen.infoText, canvas.width/2, canvas.height/2);
                    this.hudElem.fillText(this.nextScreen.infoText, canvas.width/2, canvas.height/2);
                }                
            } 
            else {
                this.showInstructionText = false;
                this.instructionAlpha = 1.0;
            }
        }
        // ################################   

        // #### DRAW SCORE ####
        this.hudElem.globalAlpha = this.score.imgAlpha;
        this.hudElem.font = "bold 40px serif";
        this.hudElem.textAlign = "left";
        this.hudElem.fillStyle = "#db9f05"
        this.hudElem.strokeStyle = "#EFEFEF";
        this.hudElem.strokeText(this.score.counter.toString(), 50, 65);
        this.hudElem.fillText(this.score.counter.toString(), 50, 65);
        this.hudElem.globalAlpha = 1.0;

        if (this.hudDisplay.fadeInHUD) {
            if (this.score.elapsedTime < .2) {
                this.score.imgAlpha = this.score.elapsedTime/.2;
                this.score.elapsedTime += g_dt;
            } else {
                this.score.imgAlpha = 1.0;
                this.score.elapsedTime = 0;
                this.hudDisplay.fadeInHUD = false;
            }
        }
        // ################################  

        if (this.hudDisplay.fadeOutHUD) {
            if (this.timer.fade.elapsedTime < .2) {
                this.timer.imgAlpha = 1 - this.timer.fade.elapsedTime/.2;
                this.score.imgAlpha = this.timer.imgAlpha;
                this.timer.fade.elapsedTime += g_dt;
            } else {
                this.timer.imgAlpha = 0;
                this.score.imgAlpha = 0;
                this.timer.fade.fadeOut = false;
                this.timer.fade.elapsedTime = 0;
                this.timer.currTimeChunk = 0;
                this.hudDisplay.fadeOutHUD = false;
            }
            
            return;
        }
        if (!this.hudDisplay.showHUD || !gameManager.gameRunning) return;

        // #### IF GAME IS RUNNING ####
        
        // #### TIMER LOGIC ####
        if (this.timer.fade.fadeOut) { // TIMER FADE OUT
            if (this.timer.fade.elapsedTime < .2) {
                this.timer.imgAlpha = 1 - this.timer.fade.elapsedTime/.2;
            } else {
                this.timer.imgAlpha = 0;
                this.timer.fade.fadeOut = false;
                this.timer.fade.elapsedTime = 0;
                this.timer.currTimeChunk = 0;
            }
            this.timer.fade.elapsedTime += g_dt;
        }
        if (gameManager.miniGameRunning) { // LOWER TIMER AND CHECK FOR LOSS
            this.timer.currTime += g_dt;
            if (this.timer.currTime/this.timer.totalMiniGameTime >= (1-this.timer.timeCropChunks[this.timer.currTimeChunk+1]) &&
             this.timer.currTimeChunk < this.timer.timeCropChunks.length-1) {  

                this.timer.currTimeChunk++;
            }
            if (this.timer.currTime >= this.timer.totalMiniGameTime) {
                gameManager.loseScreen();
            }
        }
        // ################################
   
    }

    winGame() {
        this.score.counter++;
        this.timer.fade.fadeOut = true;
        this.timer.currTime = 0;
    }
    goToNextScreen(nextScreen) {
        this.transitionNextScreen(nextScreen);
    }
    startGame(nextScreen) {
        this.timer.currTime = 0;
        this.score.counter = 0;
        this.transitionNextScreen(nextScreen);
    }
    transitionNextScreen(nextScreen) {
        this.showInstructionText = true;
        this.nextScreen = nextScreen;
        this.instructionAlpha = 0;
        this.timer.totalMiniGameTime = nextScreen.timerTime;
        
       
        let chunkInterval = 1/this.timer.timeCropChunks.length;
        this.timer.timeCropChunks[0] = 1;
        for (let i = 1; i < this.timer.timeCropChunks.length; i++) { 
            this.timer.timeCropChunks[i] = (this.timer.timeCropChunks.length-i + (Math.random()*.5)-.25) * chunkInterval;
        }
    }
}