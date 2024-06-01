class NearFarGame extends MiniGame {
    constructor(camPos, center, index) {
        super(camPos, center, index, "Show only Blue Balls!", 14);
        this.screenTimer = 0;
        this.screenFrameCount = 0;

        this.endAnim = {
            totalTime: 1000,
            loseColor: new THREE.Color(0xcd2d14),
            winColor: new THREE.Color(0x2fb117),
        }
    }

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
        
        // CREATE NEAR FAR PLANES
        let normal = new THREE.Vector3();
        let coPoint = new THREE.Vector3();

        let farPlane = new THREE.Plane();
        normal.set(0,0,-1).applyQuaternion( this.boxData[0].children[0].quaternion);
        coPoint.copy( this.boxData[0].children[0].position);
        farPlane.set(normal, 21.5);

        let nearPlane = new THREE.Plane();
        normal.set(0,0,1).applyQuaternion( this.boxData[0].children[0].quaternion);
        coPoint.copy( this.boxData[0].children[0].position);
        nearPlane.set(normal, -22);

        // let planeHelper = new THREE.PlaneHelper(nearPlane, 1000);
        // w_Scene.add(planeHelper);
        // let planeHelper2 = new THREE.PlaneHelper(farPlane, 1000, 0x0000ee);
        // w_Scene.add(planeHelper2);

        let planeMaterial = gameManager.world.planeMaterial.clone();
        let nearMarker = new THREE.Mesh(gameManager.world.planeGeometry, planeMaterial);
        nearMarker.material = nearMarker.material.clone();
        nearMarker.material.color = new THREE.Color(0xf1d960)
        nearMarker.scale.set(1, .05, .05)
        nearMarker.position.set(0, -gameManager.world.boxSize/2+.08, -1);
        nearMarker.rotateX(Math.PI/2);

        let farMarker = nearMarker.clone();
        farMarker.material = farMarker.material.clone();
        farMarker.material.color = new THREE.Color(0x4581e1);
        farMarker.position.set(0, -gameManager.world.boxSize/2+.05, -1);

        this.objects.add(nearMarker, farMarker);

        this.adjustmentPlanes = [
            [
                nearPlane,
                farPlane
            ],
            [
                nearPlane.constant, // default value
                farPlane.constant
            ],
            [
                nearMarker,
                farMarker
            ],
            [
                nearMarker.position.z,
                farMarker.position.z
            ]
        ]

        let sliderMap = new THREE.TextureLoader().load('resources/minigames/NearFar/slider.png');
        sliderMap.magFilter = THREE.NearestFilter;
        sliderMap.repeat.set(1/2, 1);
        let sliderMat = new THREE.SpriteMaterial({map: sliderMap});
        let nearSliderSprite = new THREE.Sprite(sliderMat);
        nearSliderSprite.scale.set(10, 2.5, 0);
        nearSliderSprite.material.rotation = Math.PI/2
        nearSliderSprite.position.set(6.5, 0, 7)
        let farSliderSprite = nearSliderSprite.clone();
        farSliderSprite.translateX(2);

        let buttMap = new THREE.TextureLoader().load('resources/minigames/NearFar/slider_butt.png');
        buttMap.magFilter = THREE.NearestFilter;
        buttMap.repeat.set(1/2, 1);
        let buttMat = new THREE.SpriteMaterial({map: buttMap});
        let nearButtSprite = new THREE.Sprite(buttMat);
        nearButtSprite.scale.set(2,2,0);
        nearButtSprite.position.set(6.5, 0, 7)
        let farButtSprite = nearButtSprite.clone();
        farButtSprite.translateX(2);

       
        let nearButtObject = nearButtSprite.clone();
        nearButtObject.translateZ(.1);
        nearButtObject.material = nearButtObject.material.clone();
        nearButtObject.material.opacity = 0;
        let farButtObject = nearButtObject.clone();
        farButtObject.translateX(2);

        this.objects.add(nearSliderSprite, farSliderSprite,  nearButtSprite, farButtSprite, nearButtObject, farButtObject);

        this.sliders = {
            sliderMap: sliderMap,
            nearSliderSprite: nearSliderSprite,
            farSliderSprite: farSliderSprite,
            buttMap: buttMap,
            buttons: [
                [nearButtSprite, farButtSprite],
                [false, false],
                [nearButtObject, farButtObject],
                4.25
            ],
            spriteIndex: 0,
            framesTilSwap: 3
        }

        var sphereGeometry = new THREE.SphereGeometry(1, 32, 16);
        var sphereMaterial = new THREE.MeshLambertMaterial({
            color: 0xf23c0f, clippingPlanes: this.adjustmentPlanes[0],
            clipIntersection: false,
        })
        let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(0, 0, 6);

        let ballPool = [sphere];

        for (let i = 0; i < 5; i++) {
            let ball = sphere.clone();
            ball.material = ball.material.clone();
            ball.material.clippingPlanes = this.adjustmentPlanes[0];
            ball.material.clipIntersection = false;
            ballPool.push(ball);
        }


        this.ballInfo = {
            ballPool: ballPool,
            positionsChosen: [[], [], []],
            blue: [],
            red: [],
            num: 0,
            blueNum: 0
        }

        this.winCondition = {
            time: 0,
            timeNeeded: 1.0
        }

        let NFLabelMap = new THREE.TextureLoader().load('resources/minigames/NearFar/NF.png');
        NFLabelMap.repeat.set(1/2, 1);
        let NFLabelMat = new THREE.SpriteMaterial({map: NFLabelMap});
        let NFLabelSprite = new THREE.Sprite(NFLabelMat);
        NFLabelSprite.scale.set(4,2,0);
        NFLabelSprite.position.set(7.6, 5.5, 7);
        this.objects.add(NFLabelSprite);

        this.NFLabel = {
            map: NFLabelMap,
            sprite: NFLabelSprite
        }

        this.objects.position.set(this.center.position.x, this.center.position.y, this.center.position.z)
    }

    enterScreen() {
        this.screenTimer = 0;

        // GENERATE BALL DISTRIBUTION
        let numOfBalls = Math.floor(Math.random()*4)+3;
        this.ballInfo.num = numOfBalls;
        let numOfBlueBalls = Math.floor(numOfBalls/2+Math.random()+.5);
        this.ballInfo.blueNum = numOfBlueBalls;

        // clear arrays
        this.ballInfo.positionsChosen[0].length = 0;
        this.ballInfo.positionsChosen[1].length = 0;
        this.ballInfo.positionsChosen[2].length = 0;
        this.ballInfo.blue.length = 0;
        this.ballInfo.red.length = 0;

        for (let i = 0; i < numOfBlueBalls; i++) {
            let ball = this.ballInfo.ballPool[i];
            ball.material.color = new THREE.Color(0x0f62f2);
            this.ballInfo.blue.push(ball);
            // select x position
            let x = 0;
            do {
                x = Math.round(Math.random() * 18 - 9);
            } while (this.ballInfo.positionsChosen[0].includes(x));
            this.ballInfo.positionsChosen[0].push(x);

            let y = 0;
            do {
                y = Math.round(Math.random() * 17 - 8);
            } while (this.ballInfo.positionsChosen[1].includes(y));
            this.ballInfo.positionsChosen[1].push(y);

            let z = 0;
            do {
                z = Math.round((Math.random() * 8 - 2)/2)*2;
            } while (this.ballInfo.positionsChosen[2].includes(z));
            this.ballInfo.positionsChosen[2].push(z);

            ball.position.set(x,y,z);
            this.objects.add(ball);
        }


        for (let i = 0; i < numOfBalls-numOfBlueBalls; i++) {
            let ball = this.ballInfo.ballPool[i+numOfBlueBalls];
            ball.material.color = new THREE.Color(0xf23c0f);
            this.ballInfo.red.push(ball);
             // select x position
             let x = 0;
             do {
                 x = Math.round(Math.random() * 18 - 9);
             } while (this.ballInfo.positionsChosen[0].includes(x));
             this.ballInfo.positionsChosen[0].push(x);
 
             let y = 0;
             do {
                 y = Math.round(Math.random() * 17 - 8);
             } while (this.ballInfo.positionsChosen[1].includes(y));
             this.ballInfo.positionsChosen[1].push(y);
 
             let z = 0;
             do {
                 z = Math.round((Math.random() * 16 - 10)/2)*2;
             } while (this.ballInfo.positionsChosen[2].includes(z) || (z >= Math.min(...this.ballInfo.positionsChosen[2]) && z <= Math.max(...this.ballInfo.positionsChosen[2])));
             this.ballInfo.positionsChosen[2].push(z);
 
             ball.position.set(x,y,z);
             this.objects.add(ball);
        }

        // CHOOSE NEAR FAR POSITIONS
        let near = Math.round(Math.random()*9-5);
        let far = Math.round(Math.random()*6-4);
        this.adjustmentPlanes[0][0].constant = -22 + near;
        this.adjustmentPlanes[0][1].constant = 21.5 - far;
        this.adjustmentPlanes[2][0].position.z = -1 + near;
        this.adjustmentPlanes[2][1].position.z = -1 + far;
        this.sliders.buttons[0][0].position.y = -near/2.2;
        this.sliders.buttons[2][0].position.y = near/2.2;
        this.sliders.buttons[0][1].position.y = -far/2.2;
        this.sliders.buttons[2][1].position.y = far/2.2;

    }

    update() {
        // ### HANDLE SPRITE SHAKE ###
        if (this.screenFrameCount % this.sliders.framesTilSwap == 0) {
            this.sliders.spriteIndex = (this.sliders.spriteIndex + 1) % 2;
            this.sliders.sliderMap.offset.x = this.sliders.spriteIndex/2;
            this.sliders.buttMap.offset.x = this.sliders.spriteIndex/2;
            this.NFLabel.map.offset.x = this.sliders.spriteIndex/2;
        }

        if (!gameManager.miniGameRunning) return;

        // ### CHECK WIN CONDITION
        let nearPos = this.adjustmentPlanes[2][0].position.z-2;
        let farPos = this.adjustmentPlanes[2][1].position.z-.25;

        let err = 0.2;
        for (let i = 0; i < this.ballInfo.num; i++) {
            let ball = this.ballInfo.ballPool[i];
            if (i < this.ballInfo.blueNum) {
                if (ball.position.z > nearPos+err || ball.position.z < farPos-err) {
                    console.log(ball.position.z, nearPos, ball.position.z, farPos)
                    this.winCondition.time = 0; break;}
                
            } else {
                if (ball.position.z < nearPos && ball.position.z > farPos) {
                    this.winCondition.time = 0; break;
                }
            }

            if (i == this.ballInfo.num-1) { // reached the end
                this.winCondition.time += g_dt*gameManager.speed.speed;
                if (this.winCondition.time >= this.winCondition.timeNeeded) {
                    gameManager.winScreen();
                    console.log("win");
                    this.boxData[0].children[0].material.color = this.endAnim.winColor;
                    setTimeout(() => {
                        gameManager.readyForNextScreen();
                    }, this.endAnim.totalTime/gameManager.speed.speed);
                }
            }
        }


        this.screenTimer += g_dt;
        this.screenFrameCount++;
    }

    startGame() {
        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mousedown', this.handleMouseDown);
        document.addEventListener('mouseup', this.handleMouseUp);
        document.dispatchEvent(gameManager.triggerMiniGameEvent);
    }

    handleMouseMove(event) {
        let src = gameManager.minigames[2];

        // set button positions
        hud.pointer.x = (event.clientX / canvas.width) * 2 - 1;
        hud.pointer.y = (event.clientY / canvas.height) * 2 - 1;
        hud.mouseRaycaster.setFromCamera(hud.pointer, w_Camera);
        if (src.sliders.buttons[1][0]) {
            if (src.sliders.buttons[0][0].position.y >= src.sliders.buttons[3] && Math.sign(event.movementY) == -1 ||
            src.sliders.buttons[0][0].position.y <= -src.sliders.buttons[3] && Math.sign(event.movementY) == 1) {
                src.sliders.buttons[0][0].position.y = src.sliders.buttons[3] * -Math.sign(event.movementY);
                src.sliders.buttons[2][0].position.y = src.sliders.buttons[3] * Math.sign(event.movementY);
                return;
            }
            src.sliders.buttons[0][0].position.y -= event.movementY/45;
            src.sliders.buttons[2][0].position.y += event.movementY/45;
        } else if (src.sliders.buttons[1][1]) {
            if (src.sliders.buttons[0][1].position.y >= src.sliders.buttons[3] && Math.sign(event.movementY) == -1 ||
            src.sliders.buttons[0][1].position.y <= -src.sliders.buttons[3] && Math.sign(event.movementY) == 1) {
                src.sliders.buttons[0][1].position.y = src.sliders.buttons[3] * -Math.sign(event.movementY);
                src.sliders.buttons[2][1].position.y = src.sliders.buttons[3] * Math.sign(event.movementY);
                return;
            }
            src.sliders.buttons[0][1].position.y -= event.movementY/45;
            src.sliders.buttons[2][1].position.y += event.movementY/45;
        } 

        src.adjustmentPlanes[0][0].constant = src.adjustmentPlanes[1][0] + src.sliders.buttons[2][0].position.y*2.2
        src.adjustmentPlanes[0][1].constant = src.adjustmentPlanes[1][1] - src.sliders.buttons[2][1].position.y*2.2

        src.adjustmentPlanes[2][0].position.z = src.adjustmentPlanes[3][0] + src.sliders.buttons[2][0].position.y*2.2
        src.adjustmentPlanes[2][1].position.z = src.adjustmentPlanes[3][1] + src.sliders.buttons[2][1].position.y*2.2
    }

    handleMouseDown() {
        let src = gameManager.minigames[2];
        hud.mouseRaycaster.setFromCamera(hud.pointer, w_Camera);
        const intersects = hud.mouseRaycaster.intersectObjects(src.sliders.buttons[2])
        src.sliders.buttons[1][0] = false;
        src.sliders.buttons[1][1] = false;
        if (intersects.length > 0) {
            if (intersects[0].object == src.sliders.buttons[2][0]) {
                src.sliders.buttons[1][0] = true;
            } else if (intersects[0].object == src.sliders.buttons[2][1]) {
                src.sliders.buttons[1][1] = true;
            }
        }
    }

    handleMouseUp() {
        let src = gameManager.minigames[2];
        src.sliders.buttons[1][0] = false;
        src.sliders.buttons[1][1] = false;
    }

    loseScreen() {
        setTimeout(() => {
            gameManager.restartBackToMain();
        }, 1500);
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mousedown', this.handleMouseDown);
        document.removeEventListener('mouseup', this.handleMouseUp);
        this.boxData[0].children[0].material.color = this.endAnim.loseColor;
    }


    exitScreen() {
        this.sliders.buttons[1][0] = false;
        this.sliders.buttons[1][1] = false;
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mousedown', this.handleMouseDown);
        document.removeEventListener('mouseup', this.handleMouseUp);
        document.addEventListener(("OnCameraDone"), this.clear );
    }

    clear() {
        let src = gameManager.minigames[2];
        src.boxData[0].children[0].material.color = src.boxData[2];
        document.removeEventListener(("OnCameraDone"), src.clear)
    }
}