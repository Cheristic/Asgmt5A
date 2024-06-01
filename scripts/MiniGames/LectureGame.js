class LectureGame extends MiniGame {
    constructor(camPos, center, index) {
        super(camPos, center, index, "Click!", 9);
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

        const mtlLoader = new MTLLoader();
        mtlLoader.load('resources/models/laptop/Lowpoly_Notebook_2.mtl', (mtl) => {
            mtl.preload();
            const objLoader = new OBJLoader();
            objLoader.setMaterials(mtl);
            objLoader.load('resources/models/laptop/Lowpoly_Notebook_2.obj', (root) => {
                let src = gameManager.minigames[1];
                root.scale.set(3,3,3);
                root.children[0].material.forEach((mat) => {
                    mat.clippingPlanes = src.boxData[1];
                    mat.clipIntersection = false;
                })
                root.position.set(0, -3, 0);
                src.inner.add(root);

                let screenMap = new THREE.TextureLoader().load('resources/minigames/lecture/laptopScreen.png');
                screenMap.repeat.set(1/3, 1);
                screenMap.wrapS = THREE.RepeatWrapping;
                screenMap.wrapT = THREE.RepeatWrapping;
                let box = new THREE.BoxGeometry(.0001, 1, 1);
                let screenMat = new THREE.MeshBasicMaterial({map: screenMap});
                src.screen = {
                    sprite: new THREE.Mesh(box, screenMat),
                    spriteCount: 3,
                    spriteIndex: 0,
                    framesTilSwap: 3,
                    map: screenMap
                }
                src.screen.sprite.scale.set(1,5.6,9);
                src.screen.sprite.position.set(.63, .4, 0);
                src.inner.add(src.screen.sprite);

                let webcamMap = new THREE.TextureLoader().load('resources/minigames/lecture/webcam.png');
                webcamMap.repeat.set(1/7,  1);
                webcamMap.wrapS = THREE.RepeatWrapping;
                webcamMap.wrapT = THREE.RepeatWrapping;
                let webcamMat = new THREE.MeshBasicMaterial({map: webcamMap});
                src.webcam = {
                    sprite: new THREE.Mesh(box, webcamMat),
                    map: webcamMap,
                    index: 0,
                    clicks: [1, 2, 4, 7, 10, 14]
                }
                src.webcam.sprite.scale.set(1, 1.8, 2.95);
                src.webcam.sprite.position.set(.615, .39, -.04)
                src.inner.add(src.webcam.sprite)
                
            });
        });

        mtlLoader.load('resources/models/thumbs_up/Blank.mtl', (mtl) => {
            mtl.preload();
            const objLoader = new OBJLoader();
            objLoader.setMaterials(mtl);
            objLoader.load('resources/models/thumbs_up/15809_Thumbs_Up_v1.obj', (root) => {
                let src = gameManager.minigames[1];
                root.children[0].material.clippingPlanes = src.boxData[1];
                root.children[0].material.clipIntersection = false;
                root.children[0].material.color = new THREE.Color(0x83babc);
                root.scale.set(.2,.2,.2);
                root.position.set(-12,-8.5,8)
                src.inner.add(root);  
                src.inner.hand = root;    
                root.rotation.z = 2.5
            });
        });

        // CONSTRUCT PLAYER AND LAPTOP
        this.screen = null;

        this.inner = new THREE.Group();

        this.inner.rotateY(Math.PI/2 * 5.15);
        this.inner.scale.set(2,2,2);
        this.inner.position.set(0,0, 4);

        let headGeo = new THREE.CapsuleGeometry(5.394, 12, 1, 7);
        let headMat = new THREE.MeshLambertMaterial( {
            color: 0x83babc, clippingPlanes: this.boxData[1],
            clipIntersection: false
        })
        let head = new THREE.Mesh(headGeo, headMat);
        head.scale.set(.5,.5,.5);
        head.position.set(-10, 4, 0);
        head.updateWorldMatrix(true);
        this.inner.add(head);

        let shouldersGeo = new THREE.CylinderGeometry(3, 13, 7.8, 14);
        let shirtMat = new THREE.MeshLambertMaterial( {
            color: 0x73c845, clippingPlanes: this.boxData[1],
            clipIntersection: false
        });
        let shoulders = new THREE.Mesh(shouldersGeo, shirtMat);
        shoulders.scale.set(.3,.3,.5)
        shoulders.rotateZ(-.3)
        shoulders.position.set(-11, -2, 0)
        shoulders.updateWorldMatrix(true);
        this.inner.add(shoulders);

        let bodyGeo = new THREE.CylinderGeometry(13, 10, 50, 14);
        let body = new THREE.Mesh(bodyGeo, shirtMat);
        body.applyMatrix4(shoulders.matrixWorld);
       // body.rotateZ(.05)
        body.position.set(-12.7, -7.4, 0);
        body.translateY(-3)
        this.inner.add(body);

        let eyeGeo = new THREE.SphereGeometry(3, 8, 12);
        let eyeMat = new THREE.MeshPhongMaterial( {
            color: 0xf6f3f2, clippingPlanes: this.boxData[1],
            clipIntersection: false
        })
        let eyeL = new THREE.Mesh(eyeGeo, eyeMat);
        eyeL.applyMatrix4(head.matrixWorld);
        eyeL.translateX(2.2);
        eyeL.translateY(1);
        let eyeR = eyeL.clone();
        eyeL.translateZ(-2)
        eyeR.translateZ(2);
        let pupilL = eyeL.clone();
        pupilL.material = new THREE.MeshPhongMaterial( {
            color: 0x1f1c1c, clippingPlanes: this.boxData[1],
            clipIntersection: false
        });
        pupilL.scale.set(.4,.4,.4);
        pupilL.translateX(.9);
        pupilL.translateY(-.35);
        pupilL.translateZ(.1);
        let pupilR = eyeR.clone();
        pupilR.material = pupilL.material;
        pupilR.scale.set(.4,.4,.4);
        pupilR.translateX(.9);
        pupilR.translateY(-.35);
        pupilR.translateZ(-.1);
        this.inner.add(eyeL, eyeR, pupilL, pupilR);

        this.inner.pupilL = pupilL;
        this.inner.pupilR = pupilR;
        this.objects.add(this.inner);
        this.objects.position.set(this.center.position.x, this.center.position.y, this.center.position.z)
        

        this.winAnim = {
            playAnim: false,
            animTime: 0,
            anim1: new TWEEN.Tween({scale: 2, yRotation: 1.3351768777756614,
                x: 0, y: 0, z: 4
            })
                .to({scale: 1.3, yRotation: -0.47123889803846836,
                    x: -5, y: -5, z: 5
                }, this.endAnim.totalTime/2*1/gameManager.speed.speed)
                .onUpdate((u) => {
                    this.inner.rotation.y = u.yRotation;
                    this.inner.scale.set(u.scale, u.scale, u.scale);
                    this.inner.position.set(u.x, u.y, u.z);
                })
                .easing(TWEEN.Easing.Quartic.InOut),
            anim2: new TWEEN.Tween({
                eyelx: -6.9, eyely: 4.65, eyelz: -1.9,
                eyerx: -6.9, eyery: 4.65, eyerz: 1.9
            })
                .to({eyelx: -6.9, eyely: 4.8, eyelz: -3,
                    eyerx: -6.9, eyery: 4.8, eyerz: .8
                }, this.endAnim.totalTime*1/8*1/gameManager.speed.speed)
                .onUpdate((u) => {
                    this.inner.pupilL.position.set(u.eyelx, u.eyely, u.eyelz);
                    this.inner.pupilR.position.set(u.eyerx, u.eyery, u.eyerz);
                })
                .easing(TWEEN.Easing.Quartic.InOut),
            anim3: new TWEEN.Tween({
                x: -11, y: -8, z: 8, rot: 2.5
            })
                .to({x: -4, y: -2, z: 8, rot: Math.PI
                }, this.endAnim.totalTime*3/8*1/gameManager.speed.speed)
                .onUpdate((u) => {
                    this.inner.hand.position.set(u.x, u.y, u.z);
                    this.inner.hand.rotation.z = u.rot;
                })
                .easing(TWEEN.Easing.Quartic.InOut)
        }
        this.winAnim.anim1.chain(this.winAnim.anim2);
        this.winAnim.anim2.chain(this.winAnim.anim3)
    }

    enterScreen() {
        this.screenTimer = 0;
        this.screenFrameCount = 0;

        if (this.webcam != null) {
            this.webcam.index = 0;
            this.webcam.map.offset.x = this.webcam.index / 7;
        }

        this.scoreTracker = {
            curr: 0,
            goal: 14
        };
    }

    update() {
        this.screenTimer += g_dt;
        this.screenFrameCount++;
        //this.inner.rotateY(g_dt);
        TWEEN.update(g_lastTimeStamp*1000);

        if (!gameManager.miniGameRunning) {
            if(this.screenFrameCount % 2 == 0) {
                if (this.screen != null) {
                    this.screen.spriteIndex = this.screen.spriteIndex == 1 ? 2 : 1;
                    this.screen.map.offset.x = this.screen.spriteIndex/this.screen.spriteCount;
                }
            }
            return;
        }
        // ### HANDLE SPRITE SHAKE ###
        if(this.screenFrameCount % 3 == 0) {
            
            if (this.screen != null) {
                this.screen.spriteIndex = (this.screen.spriteIndex + 1) % this.screen.spriteCount;
                this.screen.map.offset.x = this.screen.spriteIndex/this.screen.spriteCount;
            }
        }

        if (this.webcam != null) {
            if (this.scoreTracker.curr >= this.webcam.clicks[this.webcam.index] &&
                this.webcam.index < 6
            ) {
                this.webcam.index++;
                this.webcam.map.offset.x = this.webcam.index / 7;
            }
        }

        
    }

    startGame() {
        document.addEventListener('mousedown', this.handleMouseDown);
        document.dispatchEvent(gameManager.triggerMiniGameEvent);
    }


    handleMouseDown() {
        let src = gameManager.minigames[1];
        hud.mouseRaycaster.setFromCamera(hud.pointer, w_Camera);
        src.scoreTracker.curr++;
        if (src.scoreTracker.goal == src.scoreTracker.curr) {
            gameManager.winScreen();
            src.boxData[0].children[0].material.color = src.endAnim.winColor;
            src.winAnim.anim1.start();
            setTimeout(() => {
                gameManager.readyForNextScreen();
            }, src.endAnim.totalTime/gameManager.speed.speed);
        }
    }

    loseScreen() {
        setTimeout(() => {
            gameManager.restartBackToMain();
        }, 1500);
        document.removeEventListener('mousedown', this.handleMouseDown);
        this.boxData[0].children[0].material.color = this.endAnim.loseColor;
    }

    exitScreen() {
        document.removeEventListener('mousedown', this.handleMouseDown);
        document.addEventListener(("OnCameraDone"), this.clear )
    }

    clear() {
        let src = gameManager.minigames[1];
        src.boxData[0].children[0].material.color = src.boxData[2];
        src.inner.rotation.y = 1.3351768777756614
        src.inner.scale.set(2, 2, 2);
        src.inner.position.set(0, 0, 4);
        src.inner.pupilL.position.set(-6.9, 4.65, -1.9);
        src.inner.pupilR.position.set(-6.9, 4.65, 1.9);
        src.inner.hand.position.set(-11, -8, 8);
        src.inner.hand.rotation.z = 2.5;
        document.removeEventListener(("OnCameraDone"), src.clear)
    }
}