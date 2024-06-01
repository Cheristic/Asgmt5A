class UVGame extends MiniGame {
    constructor(camPos, center, index) {
        super(camPos, center, index, "Match the UVs", 15);
        this.screenFrameCount = 0;
        this.screenTimer = 0;

        this.endAnim = {
            totalTime: 1000,
            loseColor: new THREE.Color(0xcd2d14),
            winColor: new THREE.Color(0x2fb117),
        }
    }

    buildScreen() {
        this.boxData = gameManager.world.buildBox(0xa6afe6, this.center.position)

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

        let interfaceMap = new THREE.TextureLoader().load('resources/minigames/uv/uvimages.png');
        interfaceMap.repeat.set(1/3, 1);
        let interfaceMat = new THREE.SpriteMaterial({map: interfaceMap, clippingPlanes: this.boxData[1],
            clipIntersection: false});
        let uvInterface = new THREE.Sprite(interfaceMat);
        uvInterface.position.set(0, -1.5, 15)
        uvInterface.scale.set(2,2,2)
        
        let uvButtGeo = new THREE.CircleGeometry(.15, 28);
        let uvButtMap = new THREE.TextureLoader().load('resources/minigames/uv/uv_butt.png')
        uvButtMap.repeat.set(1/4, 1);
        let uvButtMat = new THREE.MeshBasicMaterial({map: uvButtMap, color: 0xFFFFFF, clippingPlanes: this.boxData[1],
            clipIntersection: false});
        let uvUnlockedButtMap = uvButtMap.clone();
        let uvUnlockedButtMat = new THREE.MeshBasicMaterial({map: uvUnlockedButtMap, color: 0xFFFFFF, clippingPlanes: this.boxData[1],
            clipIntersection: false});
        let uv0 = new THREE.Mesh(uvButtGeo, uvButtMat);
        uv0.position.set(-.9, -2.23, 15.5);
        let uv1 = uv0.clone();
        uv1.position.set(.9, -2.23, 15.5);
        let uv2 = uv0.clone();
        uv2.position.set(.9, -0.46, 15.5);
        let uv3 = uv0.clone();
        uv3.position.set(-.9, -0.46, 15.5);

        this.objects.add(uvInterface, uv0, uv1, uv2, uv3);
        this.interface = {
            map: interfaceMap,
            sprite: uvInterface,
            uvs: [uv0, uv1, uv2, uv3],
            isPressing: -1,
            max: [-.9, -2.13, .9, -0.36],
            speed: .0078,
            uvFrameShake: [uvButtMap, 0],
            corners: [[-.9, -2.23], [.9, -2.23], [.9, -0.46], [-.9, -0.46]],
            uvDefaultCorners: [0, 1, 3, 2],
            unlockedUVs: [],
            unlockedInfo: [uvUnlockedButtMap, uvUnlockedButtMat, uvButtMat],
        }

        let boxGeo = new THREE.BoxGeometry(6, 6, 6);
        let boxMat = new THREE.MeshLambertMaterial({map: interfaceMap, clippingPlanes: this.boxData[1],
            clipIntersection: false});

        let myBox = new THREE.Mesh(boxGeo, boxMat);
        myBox.rotateY(-.6)
        myBox.position.set(5, 2.5, 5)
        let goalBoxGeo = new THREE.BoxGeometry(6, 6, 6);
        let goalBox = new THREE.Mesh(goalBoxGeo, boxMat);
        goalBox.rotateY(.6);
        goalBox.position.set(-5, 2.5, 5);
        this.objects.add(myBox, goalBox);
        this.boxes = {
            myBox: myBox,
            myBoxUVA: boxGeo.attributes.uv,
            normalUVs: [0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0],
            goalBox: goalBox,
            goalBoxUVA: goalBoxGeo.attributes.uv,
            goalUVPos: []
        };        
        
        this.objects.position.set(this.center.position.x, this.center.position.y, this.center.position.z)

        this.winCondition = {
            time: 0,
            timeNeeded: 1.4
        }

    }

    enterScreen() {
        this.screenTimer = 0;
        this.screenFrameCount = 0;

        // CHOOSE IMAGE
        this.interface.map.offset.x = Math.floor(Math.random()*3)/3

        // CHOOSE DEFAULT POSITIONS & RESET
        this.boxes.goalUVPos.length = 0;
        for (let i = 0; i < 4; i++) {
            let pos = this.interface.corners[(this.interface.uvDefaultCorners[i])];
            this.interface.uvs[i].position.set(pos[0], pos[1], 15.5);
            this.interface.uvs[i].material = this.interface.unlockedInfo[2];
            this.boxes.goalUVPos.push([pos[0], pos[1], 15.5]);
        }

        // CHOOSE UNLOCKED UVS
        this.interface.unlockedUVs.length = 0;
        let choice = Math.floor(Math.random()*4)
        if (choice == 0) {
            this.interface.unlockedUVs.push(this.interface.uvs[0]);
            this.interface.uvs[0].material = this.interface.unlockedInfo[1];
        } else if (choice == 1){
            this.interface.unlockedUVs.push(this.interface.uvs[1]);
            this.interface.uvs[1].material = this.interface.unlockedInfo[1];
        } else if (choice == 2) {
            this.interface.unlockedUVs.push(this.interface.uvs[2]);
            this.interface.uvs[2].material = this.interface.unlockedInfo[1];
        } else {
            this.interface.unlockedUVs.push(this.interface.uvs[3]);
            this.interface.uvs[3].material = this.interface.unlockedInfo[1];
        }

        // update uvs with orientation
        let adjU = 0;
        let adjV = 0
        for (var i = 0; i < this.boxes.myBoxUVA.count; i++) {
            let norIndex = i * 2;
            let norX = this.boxes.normalUVs[norIndex];
            let norY = this.boxes.normalUVs[norIndex+1];

            if (norX == 0 && norY == 0) {
                adjU = (this.interface.uvs[0].position.x + .9)/1.8;
                adjV = (this.interface.uvs[0].position.y + 2.23)/1.77;
            } else if (norX == 1 && norY == 0) {
                adjU = (this.interface.uvs[1].position.x + .9)/1.8;
                adjV = (this.interface.uvs[1].position.y + 2.23)/1.77;
            } else if (norX == 0 && norY == 1) {
                adjU = (this.interface.uvs[2].position.x + .9)/1.8;
                adjV = (this.interface.uvs[2].position.y + 2.23)/1.77;
            } else if (norX == 1 && norY == 1) {
                adjU = (this.interface.uvs[3].position.x + .9)/1.8;
                adjV = (this.interface.uvs[3].position.y + 2.23)/1.77;
            }
            this.boxes.myBoxUVA.setXY(i, adjU, adjV);
        }
        this.boxes.goalBoxUVA.copyArray(this.boxes.myBoxUVA.array);

        // choose and assign goal UVs
        let quad = this.interface.unlockedUVs[0];
        let posG = this.boxes.goalUVPos[this.interface.uvs.indexOf(quad)];
        do {
            posG[0] = -.9+Math.random()*1.8;
            posG[1] = -2.23+Math.random()*1.77;
        } while (posG[0] < quad.position.x+.3 && posG[0] > quad.position.x-.3 || 
            posG[1] < quad.position.y+.3 && posG[1] > quad.position.y-.3)

        for (var i = 0; i < this.boxes.goalBoxUVA.count; i++) {
            let norIndex = i * 2;
            let norX = this.boxes.normalUVs[norIndex];
            let norY = this.boxes.normalUVs[norIndex+1];

            if (norX == 0 && norY == 0) {
                adjU = (this.boxes.goalUVPos[0][0] + .9)/1.8;
                adjV = (this.boxes.goalUVPos[0][1] + 2.23)/1.77;
            } else if (norX == 1 && norY == 0) {
                adjU = (this.boxes.goalUVPos[1][0] + .9)/1.8;
                adjV = (this.boxes.goalUVPos[1][1] + 2.23)/1.77;
            } else if (norX == 0 && norY == 1) {
                adjU = (this.boxes.goalUVPos[2][0] + .9)/1.8;
                adjV = (this.boxes.goalUVPos[2][1] + 2.23)/1.77;
            } else if (norX == 1 && norY == 1) {
                adjU = (this.boxes.goalUVPos[3][0] + .9)/1.8;
                adjV = (this.boxes.goalUVPos[3][1] + 2.23)/1.77;
            }
            this.boxes.goalBoxUVA.setXY(i, adjU, adjV);
        }

        this.boxes.myBoxUVA.needsUpdate = true;
        this.boxes.goalBoxUVA.needsUpdate = true;

        this.winCondition.time = 0;
        
    }

    update() {
        // ### HANDLE SPRITE SHAKE ###
        this.screenTimer += g_dt;
        this.screenFrameCount++;

        if (this.screenFrameCount % 3 == 0) {
            this.interface.uvFrameShake[1] = (this.interface.uvFrameShake[1] + 1) % 2;
            this.interface.uvFrameShake[0].offset.x = (this.interface.uvFrameShake[1]+2) / 4;
            this.interface.unlockedInfo[0].offset.x = (this.interface.uvFrameShake[1]) / 4;
        }

        if (!gameManager.miniGameRunning) return;

        // ### CHECK WIN CONDITION
        let err = 0.3;
        for (let i = 0; i < 4; i++) {
            let uv = this.interface.uvs[i];
            let goal =this.boxes.goalUVPos[i]
            if (uv.position.x < goal[0]-err || uv.position.x > goal[0]+err ||
                uv.position.y < goal[1]-err || uv.position.y > goal[1]+err)
            {
                this.winCondition.time = 0; break;
            }
            if (i == 3) { // reached last uv
                console.log("win")
                this.winCondition.time += g_dt*gameManager.speed.speed;
                if (this.winCondition.time >= this.winCondition.timeNeeded) {
                    gameManager.winScreen();
                    this.boxData[0].children[0].material.color = this.endAnim.winColor;
                    this.interface.isPressing = -1;
                    setTimeout(() => {
                        gameManager.readyForNextScreen();
                    }, this.endAnim.totalTime/gameManager.speed.speed);
                }
            }
        }
    }

    startGame() {
        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mousedown', this.handleMouseDown);
        document.addEventListener('mouseup', this.handleMouseUp);
        document.dispatchEvent(gameManager.triggerMiniGameEvent);
    }

    handleMouseMove(event) {
        let src = gameManager.minigames[3];
        hud.pointer.x = (event.clientX / canvas.width) * 2 - 1;
        hud.pointer.y = -1*((event.clientY / canvas.height) * 2 - 1);
        hud.mouseRaycaster.setFromCamera(hud.pointer, w_Camera);

        if (src.interface.isPressing < 0) return;
        let uv = src.interface.uvs[src.interface.isPressing];
        let max = src.interface.max;
        uv.position.x += event.movementX*src.interface.speed;
        if (uv.position.x <= max[0] && Math.sign(event.movementX) == -1) {
            uv.position.x = max[0];
        } else if (uv.position.x >= max[2] && Math.sign(event.movementX) == 1) {
            uv.position.x = max[2];
        }

        uv.position.y += -event.movementY*src.interface.speed;
        if (uv.position.y <= max[1] && Math.sign(event.movementY) == 1) {
            uv.position.y = max[1];
        } else if (uv.position.y >= max[3] && Math.sign(event.movementY) == -1) {
            uv.position.y = max[3];
        }

        // update uvs
        let adjU = (uv.position.x + .9)/1.8;
        let adjV = (uv.position.y+2.23)/1.77;
        for (var i = 0; i < src.boxes.myBoxUVA.count; i++) {
            let norIndex = i * 2;
            let norX = src.boxes.normalUVs[norIndex];
            let norY = src.boxes.normalUVs[norIndex+1];

            if (norX == 0 && norY == 0 && src.interface.isPressing == 0) {
                src.boxes.myBoxUVA.setXY(i, adjU, adjV);
            } else if (norX == 1 && norY == 0 && src.interface.isPressing == 1) {
                src.boxes.myBoxUVA.setXY(i, adjU, adjV);
            } else if (norX == 0 && norY == 1 && src.interface.isPressing == 2) {
                src.boxes.myBoxUVA.setXY(i, adjU, adjV);
            } else if (norX == 1 && norY == 1 && src.interface.isPressing == 3) {
                src.boxes.myBoxUVA.setXY(i, adjU, adjV);
            }
        }
        src.boxes.myBoxUVA.needsUpdate = true;
    }

    handleMouseDown() {
        let src = gameManager.minigames[3];
        hud.mouseRaycaster.setFromCamera(hud.pointer, w_Camera);
        const intersects = hud.mouseRaycaster.intersectObjects(src.interface.unlockedUVs)
        if (intersects.length > 0) {      
            for (let i = 0; i < src.interface.uvs.length; i++) {
                if (intersects[0].object == src.interface.uvs[i]) {
                    src.interface.isPressing = i;
                    return;
                }
            }
        }
    }

    handleMouseUp() {
        let src = gameManager.minigames[3];
        src.interface.isPressing = -1;
    }

    loseScreen() {
        setTimeout(() => {
            gameManager.restartBackToMain();
        }, 1500);
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mousedown', this.handleMouseDown);
        document.removeEventListener('mouseup', this.handleMouseUp);
        this.boxData[0].children[0].material.color = this.endAnim.loseColor;
        this.interface.isPressing = -1;
    }

    exitScreen() {
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mousedown', this.handleMouseDown);
        document.removeEventListener('mouseup', this.handleMouseUp);
        document.addEventListener(("OnCameraDone"), this.clear )
    }

    clear() {
        let src = gameManager.minigames[0];
        src.boxData[0].children[0].material.color = src.boxData[2];
        document.removeEventListener(("OnCameraDone"), src.clear)
    }
}