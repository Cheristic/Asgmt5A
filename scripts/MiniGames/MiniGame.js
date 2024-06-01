class MiniGame {
    constructor(camPos, center, index, infoText, timer) {
        this.camPos = camPos;
        this.center = new THREE.Object3D();
        this.center.position.set(center[0], center[1], center[2]);
        this.minigameIndex = index;
        this.infoText = infoText;
        this.timerTime = timer;

    }

    onReady() {}

    buildScreen() {
        this.boxData = gameManager.world.buildBox(0xeb537d, this.center.position)

        this.objects = new THREE.Group();
        w_Scene.add(this.objects);

        var boxIlluminator = new THREE.PointLight(0xffffff, 100, 50);
        boxIlluminator.position.set(0, 0, 12);
        this.objects.add(boxIlluminator);

        var light2 = new THREE.SpotLight(0xffffff, 10, 30, Math.PI, .05, .8);
        const lightTarget = new THREE.Object3D();
        lightTarget.position.set(0, 10, 0);
        this.objects.add(lightTarget);
        light2.target = lightTarget;
        light2.position.set(0, 9, 0)
        light2.castShadow = true;
        this.objects.add(light2);
    
        
    

    

        this.objects.position.set(this.center.position.x, this.center.position.y, this.center.position.z)
    }

    enterScreen() {
        this.screenTimer = 0;
        this.screenFrameCount = 0;

    }

    update() {
        // ### HANDLE SPRITE SHAKE ###
        this.screenTimer += g_dt;
        this.screenFrameCount++;
    }

    startGame() {
        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mousedown', this.handleMouseDown);
        document.dispatchEvent(gameManager.triggerMiniGameEvent);
    }

    handleMouseMove(event) {
        let src = gameManager.minigames[0];

    }

    handleMouseDown() {
        let src = gameManager.minigames[0];
    }

    loseScreen() {
        setTimeout(() => {
            gameManager.restartBackToMain();
        }, 1500);
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mousedown', this.handleMouseDown);
    }


    exitScreen() {
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mousedown', this.handleMouseDown);
        document.addEventListener(("OnCameraDone"), this.clear )
    }

    clear() {
        let src = gameManager.minigames[0];
        document.removeEventListener(("OnCameraDone"), src.clear)
    }

}


/*
MINIGAME IDEAS

1) Choose correct color on grid
"What's the color?"
Take the RGB 3D cube grid from Quiz 3 and choose one of the 5 combinations
Provide 3 options of colors (White, Black, Magenta, Cyan, Yellow) on screen to choose from.

2) Zoom lecture
"Click to pay attention"
3d Model of Laptop with recording of zoom lecture pasted on top (3-frames pixelated, shaky?)
Replace on zoom classmate with image of 3d player model with eyes closed.
Tap to open eyes. Once open, win!
Box elements all rotate and zoom out from screen to reveal player who gives thumbs up, then proceeds to next game

3) UV Map
"Match the UVs"
Display on left a cube with text above "Goal" and on right cube with text "You"
Below near the bottom taking up most of screen is 2d texture grid (3 variations) with 4 points scattered randomly
Those points correspond to the UV mapping of the "You" cube.
Move the points to match the "Goal" cube's mapping and once within success margin, win.
Maybe cubes spin on win. Having success animation would be nice, but stretch goal.

4) Near Far planes
"Get only red balls in view"
Two sliders near bottom with text Near and Far to the left of either of them.
Graphic underneath with - ----> + like a volume ramping up thing to show depth.
~3 balls are put into view, some red, some blue and the goal is to only have red viewable by adjusting planes.
I'll have to make sliders and probably choose premade spawning locations.

5) Child rotations
"Match!"
On the left is a 3+ connected limb model with "Goal" text and on the right is the same one but rotated wrong.
CLick on each limb on right to rotate by 90 degrees until it matches the left.

6)
*/