class Camera {
    constructor(currScreen) {
        this.focusingOnScreen = currScreen;
        w_Camera.position.set(currScreen[0], currScreen[1], currScreen[2])
        this.targetScreen = null;

        this.lerpTime = 3;
        this.elapsedTime = 100;
        this.isLerping = false;
    }

    lerpToScreen(targetScreen) {
        this.elapsedTime = 0;
        this.isLerping = true;
        this.targetScreen = targetScreen;
    }

    update() {
        if (this.isLerping) {
            if (this.elapsedTime < this.lerpTime) {
                this.elapsedTime += g_dt;
                let t = this.elapsedTime/this.lerpTime;
                let easeIn = t*t
                let easeOut = 1-(1-t)*(1-t)*1.5;
                let perc = easeIn + (easeOut-easeIn)*t;
                w_Camera.position.set(this.focusingOnScreen[0] + (this.targetScreen[0]-this.focusingOnScreen[0])*perc,
                this.focusingOnScreen[1] + (this.targetScreen[1]-this.focusingOnScreen[1])*perc,
                this.focusingOnScreen[2] + (this.targetScreen[2]-this.focusingOnScreen[2])*perc)
            }
            else {
                this.isLerping = false;
                w_Camera.position.set(this.targetScreen[0], this.targetScreen[1], this.targetScreen[2]);
                this.focusingOnScreen = this.targetScreen;
            }
        }   
    }
}