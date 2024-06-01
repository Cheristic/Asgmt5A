keysHeldState = {}
class GameManager {
    constructor() {
        // set up scene
        this.world = new World();

        this.MainMenu = new MainMenu([0, 0, 20], [0, 0, 0]);
        this.minigames = [
            new RGB([55, -20, 30], [55, -20, 10], 0),
            new LectureGame([35, 90, 50], [35, 90, 30], 1),
            new NearFarGame([-75, 75, 0], [-75, 75, -20], 2),
            new UVGame([-30, -40, -70], [-30, -40, -90], 3),
            new GradeGame([45, 25, -60], [45, 25, -80], 4)
        ];

        //this.currentScreen = this.minigames[4];

        this.currentScreen = this.MainMenu;
        //this.cameraObject = new Camera(this.minigames[4].camPos);
        this.cameraObject = new Camera(this.MainMenu.camPos);

        this.gameRunning = false;
        this.onGameOver = false;
        this.triggerStartGame = new Event("OnStartGame");
        this.triggerMiniGameEvent = new Event("OnStartMiniGame"); // called by mini games
        this.triggerGameOver = new Event("OnGameOver");
        this.miniGameRunning = false;

        let buttonMap = new THREE.TextureLoader().load('resources/minigames/game-button.png');
        buttonMap.magFilter = THREE.NearestFilter;
        buttonMap.repeat.set(1/2, 1);
        let buttonMaterial = new THREE.SpriteMaterial({map: buttonMap});
        let button = {
            sprite: new THREE.Sprite(buttonMaterial),
            spriteIndex: 0,
            spriteCount: 2,
            framesTilSwap: 3,
            map: buttonMap
        }
        button.sprite.scale.set(6, 3, 0)
        this.generalAssets = {
            button: button
        };

        this.speed = {
            speed: 1,
            add: 0.05,
            slowdown: 10
        }
    }

    buildScreens() {
        this.MainMenu.buildMainMenu();
        for (let i = 0; i < this.minigames.length; i++) {
            this.minigames[i].buildScreen();
        }
    }

    startScene() {
        this.currentScreen.onReady();
        document.addEventListener("keydown", function(ev) {keysHeldState[ev.keyCode || ev.which] = true;}, true);
        document.addEventListener("keyup", function(ev) {keysHeldState[ev.keyCode || ev.which] = false;}, true);
    }

    update() {
        this.cameraObject.update();
        this.currentScreen.update();
        audioManager.update();
    }

    startGame() {
        this.gameRunning = true;
        this.onGameOver = false;
        audioManager.triggerMusic(true);
        document.dispatchEvent(this.triggerStartGame);
        hud.startGame(this.chooseScreen());
        this.speed.speed = 1;
        document.addEventListener("OnCameraDone", this.startMiniGame);
    }

    startMiniGame() {
        gameManager.miniGameRunning = true;
        gameManager.currentScreen.startGame();
    }

    winScreen() {
        this.miniGameRunning = false;
        hud.winGame();
        audioManager.triggerSound(audioManager.win);
        if (hud.score.counter >= this.speed.slowdown) this.speed.speed += this.speed.add/2;
        else this.speed.speed += this.speed.add;
        console.log(this.speed.speed);
    }

    readyForNextScreen() {
        hud.goToNextScreen(this.chooseScreen());
    }

    loseScreen() {
        if (!this.miniGameRunning) return;
        audioManager.triggerSound(audioManager.lose);
        audioManager.stopMusic();
        this.gameRunning = false;
        this.miniGameRunning = false;
        this.onGameOver = true;
        this.speed.speed = 1;
        document.dispatchEvent(this.triggerGameOver);
        this.currentScreen.loseScreen();
        document.removeEventListener("OnCameraDone", this.startMiniGame);
    }

    restartBackToMain() {
        this.currentScreen.exitScreen();
        this.currentScreen = this.MainMenu;
        this.cameraObject.lerpToScreen(this.currentScreen.camPos);
        this.currentScreen.enterScreen();
    }

    chooseScreen() {
        this.currentScreen.exitScreen();
        let next_minigame;
        do {
            next_minigame = this.minigames[Math.floor(Math.random()*this.minigames.length)];
        } while (next_minigame.minigameIndex == this.currentScreen.minigameIndex)
           //next_minigame = this.minigames[3];
        this.cameraObject.lerpToScreen(next_minigame.camPos);
        this.currentScreen = next_minigame;
        this.currentScreen.enterScreen();
        return this.currentScreen;
    }
}
