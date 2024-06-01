class GradeGame extends MiniGame {
    constructor(camPos, center, index) {
        super(camPos, center, index, "Shake!", 10);
        this.screenFrameCount = 0;
        this.screenTimer = 0;

        this.endAnim = {
            totalTime: 1000,
            loseColor: new THREE.Color(0xcd2d14),
            winColor: new THREE.Color(0x2fb117),
        }
    }

    buildScreen() {
        this.boxData = gameManager.world.buildBox(0x23A0EF, this.center.position)

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
        this.objects.add(light2);

        let gradeMap = new THREE.TextureLoader().load('resources/minigames/grade/grades.png');
        gradeMap.repeat.set(1/5, 1);
        let gradeMat = new THREE.SpriteMaterial({map: gradeMap, clippingPlanes: this.boxData[1],
            clipIntersection: false});
        let gradeSprite = new THREE.Sprite(gradeMat);
        gradeSprite.scale.set(5,5,5)
        this.grade = {
            sprite: gradeSprite,
            map: gradeMap,
            index: 0,
            shakeAmounts: [200, 1000, 2000, 3000, 500000]
        }
        this.objects.add(gradeSprite);

        let gradeTxtMap = new THREE.TextureLoader().load('resources/minigames/grade/gradeText.png')
        gradeTxtMap.repeat.set(1/2, 1);
        let gradeTxtMat = new THREE.SpriteMaterial({map: gradeTxtMap, clippingPlanes: this.boxData[1],
            clipIntersection: false});
        this.gradeText = {
            sprite: new THREE.Sprite(gradeTxtMat),
            map: gradeTxtMap,
            currSprite: 0
        }
        this.gradeText.sprite.scale.set(12,6,6);
        this.gradeText.sprite.position.set(0, -7, 0);
        this.objects.add(this.gradeText.sprite);


        this.winCondition = {
            shakeAmount: 0,
            shakeNeeded:3000,
            won: false
        }

        this.objects.position.set(this.center.position.x, this.center.position.y, this.center.position.z)
    }

    enterScreen() {
        this.screenTimer = 0;
        this.screenFrameCount = 0;
        this.grade.sprite.position.set(0,0,0);
        this.winCondition.shakeAmount = 0;
        this.winCondition.won = false;
        this.grade.index = 0;
        this.grade.map.offset.x = this.grade.index/5;
    }

    update() {
        this.screenTimer += g_dt;
        this.screenFrameCount++;

        // ### HANDLE SPRITE SHAKE

        if (this.screenFrameCount % 3 == 0) {
            this.gradeText.currSprite = (this.gradeText.currSprite + 1) % 2;
            this.gradeText.map.offset.x = this.gradeText.currSprite/2
        }

        if (this.winCondition.shakeAmount >= this.grade.shakeAmounts[this.grade.index] &&
            this.grade.index < 4
        ) {
            this.grade.index++;
            this.grade.map.offset.x = this.grade.index/5;
        }

        this.grade.sprite.position.set(hud.pointer.x*14, hud.pointer.y*14, 0);
        
    }

    startGame() {
        document.addEventListener('mousemove', this.handleMouseMove);
        document.dispatchEvent(gameManager.triggerMiniGameEvent);
    }

    handleMouseMove(event) {
        let src = gameManager.minigames[4];
        hud.pointer.x = (event.clientX / canvas.width) * 2 - 1;
        hud.pointer.y = -1*((event.clientY / canvas.height) * 2 - 1);
        
        src.winCondition.shakeAmount += Math.sqrt(Math.pow(Math.abs(event.movementX),2) + Math.pow(Math.abs(event.movementY),2));
    
        if (src.winCondition.shakeNeeded <= src.winCondition.shakeAmount && !src.winCondition.won) {
            gameManager.winScreen();
            src.winCondition.won = true;
            src.boxData[0].children[0].material.color = src.endAnim.winColor;
            setTimeout(() => {
                gameManager.readyForNextScreen();
            }, src.endAnim.totalTime/gameManager.speed.speed);
        }
    
    }


    loseScreen() {
        setTimeout(() => {
            gameManager.restartBackToMain();
        }, 1500);
        this.boxData[0].children[0].material.color = this.endAnim.loseColor;
        document.removeEventListener('mousemove', this.handleMouseMove);
    }

    exitScreen() {
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.addEventListener(("OnCameraDone"), this.clear )
    }

    clear() {
        let src = gameManager.minigames[4];

        src.boxData[0].children[0].material.color = src.boxData[2];
        document.removeEventListener(("OnCameraDone"), src.clear)
    }
}