keysHeldState = {}
class GameManager {
    constructor() {
        // set up scene
        this.world = new World();

        this.MainMenu = new MainMenu([0, 0, 20], [0, 0, 0]);
        this.minigames = [
            new Test1([150, 0, 20], [150, 0, 0], 0),
            new Test2([75, 150, 20], [75, 150, 0], 1)
        ];

        this.currentScreen = this.MainMenu;
        this.cameraObject = new Camera(this.MainMenu.camPos);
    }

    buildScreens() {
        this.MainMenu.buildMainMenu();
        for (let i = 0; i < this.minigames.length; i++) {
            this.minigames[i].buildScreen();
        }
    }

    startScene() {
        this.currentScreen.enterScreen();
        document.addEventListener("keydown", function(ev) {keysHeldState[ev.keyCode || ev.which] = true;}, true);
        document.addEventListener("keyup", function(ev) {keysHeldState[ev.keyCode || ev.which] = false;}, true);
    }

    update() {
        this.cameraObject.update();


        // if (!this.cameraObject.isLerping) {
        //     if (keysHeldState[51] && this.currentScreen != this.Test1) {
        //         this.currentScreen.exitScreen();
        //         this.cameraObject.lerpToScreen(this.Test1.camPos);
        //         this.currentScreen = this.Test1;
        //         this.Test1.enterScreen();
        //     } else if (keysHeldState[49] && this.currentScreen != this.MainMenu) {
        //         this.currentScreen.exitScreen();
        //         this.cameraObject.lerpToScreen(this.MainMenu.camPos);
        //         this.currentScreen = this.MainMenu;
        //         this.MainMenu.enterScreen();
        //     } else if (keysHeldState[50] && this.currentScreen != this.Test2) {
        //         this.currentScreen.exitScreen();
        //         this.cameraObject.lerpToScreen(this.Test2.camPos);
        //         this.currentScreen = this.Test2;
        //         this.Test2.enterScreen();
        //     }
        // }

        this.currentScreen.update();
    }

    startGame() {
        this.chooseScreen();
    }
    winScreen() {
        this.chooseScreen();
        hud.scorePoint();
    }

    chooseScreen() {
        this.currentScreen.exitScreen();
        let next_minigame;
        do {
            next_minigame = this.minigames[Math.floor(Math.random()*this.minigames.length)];
        } while (next_minigame.minigameIndex == this.currentScreen.minigameIndex)
        this.cameraObject.lerpToScreen(next_minigame.camPos);
        this.currentScreen = next_minigame;
        this.currentScreen.enterScreen();
    }
}
