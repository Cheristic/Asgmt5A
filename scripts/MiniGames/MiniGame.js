class MiniGame {
    constructor(camPos, center, index, infoText, timer) {
        this.camPos = camPos;
        this.center = new THREE.Object3D();
        this.center.position.set(center[0], center[1], center[2]);
        this.minigameIndex = index;
        this.infoText = infoText;
        this.timerTime = timer;

    }

    buildScreen() {
        
    }

    // reset/prepare screen
    enterScreen() {

    }
  
    update() {

    }

    startGame() {

    }


    loseScreen() {
        
    }

    exitScreen() {
        
    }

    clear() {

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

5)

6)
*/