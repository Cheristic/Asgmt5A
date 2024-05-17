class HUDManager {
    constructor() {
        this.hudElem = document.getElementById('ui').getContext('2d');

        this.mouseRaycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();

        // build score
        this.scoreCounter = 0;
        this.hudElem.font = "bold 40px serif";
        this.hudElem.textAlign = "left";
        this.hudElem.textBaseLine = "middle";
        this.hudElem.strokeStyle = "#EFEFEF";

        this.hudElem.lineWidth = 5
        this.hudElem.stroke();
        this.hudElem.fillStyle = "#db9f05"
    }

    update() {
        this.hudElem.clearRect(0, 0, canvas.width, canvas.height);

        this.hudElem.strokeText(this.scoreCounter.toString(), 50, 65);
        this.hudElem.fillText(this.scoreCounter.toString(), 50, 65);
    }

    scorePoint() {
        this.scoreCounter++;
    }
}