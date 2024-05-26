class RGB extends MiniGame {
    constructor(camPos, center, index) {
        super(camPos, center, index, "What's at the dot?", 8);
        this.screenTimer = 0;
        this.screenFrameCount = 0;
    }

    buildScreen() {
        this.boxData = gameManager.world.buildBox(0xAAEE22, this.center.position)

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

        // ### SET UP COLOR BOX ###
        this.colorBox = {
            colors: [
                [0, 0, 0],
                [1, 0, 0],
                [0, 1, 0],
                [0, 0, 1],
                [1, 1, 0],
                [0, 1, 1],
                [1, 0, 1],
                [1,1,1]
            ],
            elementaryColors: [
                [1, 0, 0],
                [0, 1, 0],
                [0, 0, 1]
            ],
            time: 0,
            animate: false
        }
        let c = this.colorBox.colors;
        this.colorBox.vertColors = [  c[1][0],c[1][1],c[1][2],    c[0][0],c[0][1],c[0][2],  
                            c[6][0],c[6][1],c[6][2],  c[3][0],c[3][1],c[3][2],    

                            c[2][0],c[2][1],c[2][2],    c[4][0],c[4][1],c[4][2],  
                            c[5][0],c[5][1],c[5][2],  c[7][0],c[7][1],c[7][2],
                        
                            c[2][0],c[2][1],c[2][2],    c[0][0],c[0][1],c[0][2],  
                            c[4][0],c[4][1],c[4][2],  c[1][0],c[1][1],c[1][2],

                            c[7][0],c[7][1],c[7][2],    c[6][0],c[6][1],c[6][2],  
                            c[5][0],c[5][1],c[5][2],  c[3][0],c[3][1],c[3][2],

                            c[4][0],c[4][1],c[4][2],    c[1][0],c[1][1],c[1][2],  
                            c[7][0],c[7][1],c[7][2],  c[6][0],c[6][1],c[6][2],

                            c[0][0],c[0][1],c[0][2],    c[2][0],c[2][1],c[2][2],  
                            c[3][0],c[3][1],c[3][2],  c[5][0],c[5][1],c[5][2],
                        ];

        this.colorBox.colorBoxGeo = new THREE.BoxGeometry(3.3, 3.3, 3),        
        
        this.colorBox.colorBoxGeo.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(this.colorBox.vertColors), 3));
        this.colorBox.colorAttribute = this.colorBox.colorBoxGeo.getAttribute('color');
        this.colorBox.colorAttribute.needsUpdate = true;
        let colorBoxMat = new THREE.MeshBasicMaterial({vertexColors: true, clippingPlanes: this.boxData[1],
            clipIntersection: false, transparent: true});
        this.colorBox.mesh = new THREE.Mesh(this.colorBox.colorBoxGeo, colorBoxMat);
        
        this.colorBox.mesh.rotateZ(Math.PI);
        let distort = new THREE.Matrix4();
        distort.makeShear(0,.1,0,0,-1.2,-1.2);
        this.colorBox.mesh.scale.set(.9,.8, 1)
        this.colorBox.mesh.applyMatrix4(distort)  
        this.colorBox.mesh.rotateY(-.1);
        this.colorBox.mesh.position.set(.2, .7, 5)
        
        // ###############


        let graphSpriteMap = new THREE.TextureLoader().load('resources/minigames/rgb/rgb-graph.png');
        graphSpriteMap.magFilter = THREE.NearestFilter;
        graphSpriteMap.repeat.set(1/2, 1);
        let graphSpriteMaterial = new THREE.SpriteMaterial({map: graphSpriteMap});
        this.graph = {
            sprite: new THREE.Sprite(graphSpriteMaterial),
            spriteIndex: 0,
            spriteCount: 2,
            framesTilSwap: 3,
            map: graphSpriteMap
        }
        this.graph.sprite.scale.set(13, 13, 13)
        this.graph.sprite.position.set(0, .5, 0);
        this.objects.add(this.graph.sprite);

        
        let rLabelMap = new THREE.TextureLoader().load('resources/minigames/rgb/rgb-r.png');
        rLabelMap.magFilter = THREE.NearestFilter;
        rLabelMap.repeat.set(1/2, 1);
        let rLabelMat = new THREE.SpriteMaterial({map: rLabelMap});
        let rSprite = new THREE.Sprite(rLabelMat);
        rSprite.scale.set(2,2,2);
        let gLabelMap = new THREE.TextureLoader().load('resources/minigames/rgb/rgb-g.png');
        gLabelMap.magFilter = THREE.NearestFilter;
        gLabelMap.repeat.set(1/2, 1);
        let gLabelMat = new THREE.SpriteMaterial({map: gLabelMap});
        let gSprite = new THREE.Sprite(gLabelMat);
        gSprite.scale.set(2,2,2);
        let bLabelMap = new THREE.TextureLoader().load('resources/minigames/rgb/rgb-b.png');
        bLabelMap.magFilter = THREE.NearestFilter;
        bLabelMap.repeat.set(1/2, 1);
        let bLabelMat = new THREE.SpriteMaterial({map: bLabelMap});
        let bSprite = new THREE.Sprite(bLabelMat);
        bSprite.scale.set(2,2,2);
        this.objects.add(rSprite, gSprite, bSprite);

        this.graphLabels = {
            spriteIndex: 0,
            spriteCount: 2,
            rMap: rLabelMap,
            rLabel: rSprite,
            gMap: gLabelMap,
            gLabel: gSprite,
            bMap: bLabelMap,
            bLabel: bSprite
        };

        let rgbDotTex = new THREE.TextureLoader().load('resources/minigames/rgb/rgb-dot.png');
        rgbDotTex.magFilter = THREE.NearestFilter;
        rgbDotTex.repeat.set(1/2, 1);
        let dotMat = new THREE.SpriteMaterial({map: rgbDotTex});
        let rgbDot = new THREE.Sprite(dotMat);
        rgbDot.scale.set(1.5,1.5,1.5);
        this.rgbDot = {
            map: rgbDotTex,
            sprite: rgbDot,
            positions: [
                [-1.1,-.2],
                [-4.3,-3.3],
                [4.5,-.2],
                [-1.1,4.7],
                [2,-3.5],
                [4.5,4.7],
                [-4.5,1.8],
                [2,1.8]
            ],
        }

        this.buttons = gameManager.generalAssets.button;
        this.button1 = this.buttons.sprite.clone();
        this.button1.material = this.buttons.sprite.material.clone();
        this.button1.position.set(-7, -7, 5);
        this.button2 = this.buttons.sprite.clone();
        this.button2.material = this.buttons.sprite.material.clone();
        this.button2.position.set(0, -7, 5);
        this.button3 = this.buttons.sprite.clone();
        this.button3.material = this.buttons.sprite.material.clone();
        this.button3.position.set(7, -7, 5);
        this.buttonOptions = [this.button1, this.button2, this.button3];
        this.objects.add(this.button1, this.button2, this.button3);

        // GENERATE ANSWER TEXTS
        let answer1Map = new THREE.TextureLoader().load('resources/minigames/rgb/color-names.png');
        answer1Map.magFilter = THREE.NearestFilter;
        answer1Map.repeat.set(1/8, 1);
        let answer1Mat = new THREE.SpriteMaterial({map: answer1Map});
        let answer1Sprite = new THREE.Sprite(answer1Mat);
        answer1Sprite.scale.set(3,1.5,1.5);
        answer1Sprite.position.set(-6.5, -6.5, 6)
        let answer2Map = new THREE.TextureLoader().load('resources/minigames/rgb/color-names.png');
        answer2Map.magFilter = THREE.NearestFilter;
        answer2Map.repeat.set(1/8, 1);
        let answer2Mat = new THREE.SpriteMaterial({map: answer2Map});
        let answer2Sprite = new THREE.Sprite(answer2Mat);
        answer2Sprite.scale.set(3,1.5,1.5);
        answer2Sprite.position.set(0, -6.5, 6)
        let answer3Map = new THREE.TextureLoader().load('resources/minigames/rgb/color-names.png');
        answer3Map.magFilter = THREE.NearestFilter;
        answer3Map.repeat.set(1/8, 1);
        let answer3Mat = new THREE.SpriteMaterial({map: answer3Map});
        let answer3Sprite = new THREE.Sprite(answer3Mat);
        answer3Sprite.scale.set(3,1.5,1.5);
        answer3Sprite.position.set(6.5, -6.5, 6)
        this.answersText = [
            [answer1Map, answer1Sprite],
            [answer2Map, answer2Sprite],
            [answer3Map, answer3Sprite],
            [
                [[0, 0, 1], 0],
                [[0, 1, 1], 1],
                [[0, 0, 0], 2],
                [[0, 1, 0], 3],
                [[1, 0, 0], 4],
                [[1, 0, 1], 5],
                [[1, 1, 1], 6],
                [[1, 1, 0], 7]
            ],
            
        ]

    

        this.objects.position.set(this.center.position.x, this.center.position.y, this.center.position.z)
    }

    enterScreen() {
        this.screenTimer = 0;

        // GENERATE COLOR BOX
        shuffleArray(this.colorBox.elementaryColors);
        let c = this.colorBox.colors;
        c[1] = this.colorBox.elementaryColors[0];
        c[2] = this.colorBox.elementaryColors[1];
        c[3] = this.colorBox.elementaryColors[2];
        c[4] = [c[1][0] | c[2][0], c[1][1] | c[2][1], c[1][2] | c[2][2]]
        c[5] = [c[3][0] | c[2][0], c[3][1] | c[2][1], c[3][2] | c[2][2]]
        c[6] = [c[3][0] | c[1][0], c[3][1] | c[1][1], c[3][2] | c[1][2]]
        this.colorBox.vertColors = [    c[1][0],c[1][1],c[1][2],    c[0][0],c[0][1],c[0][2],  
                                        c[6][0],c[6][1],c[6][2],  c[3][0],c[3][1],c[3][2],    

                                        c[2][0],c[2][1],c[2][2],    c[4][0],c[4][1],c[4][2],  
                                        c[5][0],c[5][1],c[5][2],  c[7][0],c[7][1],c[7][2],
                                    
                                        c[2][0],c[2][1],c[2][2],    c[0][0],c[0][1],c[0][2],  
                                        c[4][0],c[4][1],c[4][2],  c[1][0],c[1][1],c[1][2],

                                        c[7][0],c[7][1],c[7][2],    c[6][0],c[6][1],c[6][2],  
                                        c[5][0],c[5][1],c[5][2],  c[3][0],c[3][1],c[3][2],

                                        c[4][0],c[4][1],c[4][2],    c[1][0],c[1][1],c[1][2],  
                                        c[7][0],c[7][1],c[7][2],  c[6][0],c[6][1],c[6][2],

                                        c[0][0],c[0][1],c[0][2],    c[2][0],c[2][1],c[2][2],  
                                        c[3][0],c[3][1],c[3][2],  c[5][0],c[5][1],c[5][2],
        ];
        for (let i = 0; i < this.colorBox.colorAttribute.array.length; i++) {
            this.colorBox.colorAttribute.array[i] = this.colorBox.vertColors[i];
        }

        // ASSIGN LABELS
        let pTwo = [-6.5, -4, 0]
        let pThree = [6, -1.7, 0]
        let pFour = [-2.7, 6, 0]
        if (c[1][0] == 1) this.graphLabels.rLabel.position.set(pTwo[0],pTwo[1],pTwo[2]);
        else if (c[2][0] == 1) this.graphLabels.rLabel.position.set(pThree[0],pThree[1],pThree[2]);
        else this.graphLabels.rLabel.position.set(pFour[0],pFour[1],pFour[2]);
        if (c[1][1] == 1) this.graphLabels.gLabel.position.set(pTwo[0],pTwo[1],pTwo[2]);
        else if (c[2][1] == 1) this.graphLabels.gLabel.position.set(pThree[0],pThree[1],pThree[2]);
        else this.graphLabels.gLabel.position.set(pFour[0],pFour[1],pFour[2]);
        if (c[1][2] == 1) this.graphLabels.bLabel.position.set(pTwo[0],pTwo[1],pTwo[2]);
        else if (c[2][2] == 1) this.graphLabels.bLabel.position.set(pThree[0],pThree[1],pThree[2]);
        else this.graphLabels.bLabel.position.set(pFour[0],pFour[1],pFour[2]);

        // CHOOSE ANSWER + OTHER CHOICES
        let aNum = Math.floor(Math.random() * 8)
        let pos = this.rgbDot.positions;
        let answerTexts = this.answersText[3];
        let answerOffset = 0;
        // get sprite offset
        for (let i = 0; i < answerTexts.length; i++) {
            if (c[aNum][0] == answerTexts[i][0][0]) {
                if (c[aNum][1] == answerTexts[i][0][1]) {
                    if (c[aNum][2] == answerTexts[i][0][2]) {
                        answerOffset = i;
                        break;
                    }
                }
            }
        }

        this.buttonWithCorrectAnswer = Math.floor(Math.random() * 3);

        let offsetChosen = -1; // placeholder
        // assign answers to buttons
        for (let i = 0; i < 3; i++) {
            if (i == this.buttonWithCorrectAnswer) {
                this.answersText[i][0].offset.x = answerOffset/8;
            }
            else {
                let offset = 0;
                do {
                    offset = Math.floor(Math.random() * 8)
                } while (offset == offsetChosen || offset == answerOffset)
                offsetChosen = offset;
                this.answersText[i][0].offset.x = offset/8
            }
        }

        this.rgbDot.sprite.position.set(pos[aNum][0],pos[aNum][1] ,0);

        // DEBUG

    }

    update() {
        // ### HANDLE SPRITE SHAKE ###
        if (this.screenFrameCount % this.graph.framesTilSwap == 0) {
            this.graph.spriteIndex = (this.graph.spriteIndex+1) % this.graph.spriteCount;
            this.graph.map.offset.x = this.graph.spriteIndex/this.graph.spriteCount;

            this.buttons.spriteIndex = (this.buttons.spriteIndex+1) % this.buttons.spriteCount;
            this.buttons.map.offset.x = this.buttons.spriteIndex/this.buttons.spriteCount;

            this.graphLabels.spriteIndex = (this.graphLabels.spriteIndex+1) % this.graphLabels.spriteCount;
            this.graphLabels.rMap.offset.x = this.graphLabels.spriteIndex/this.graphLabels.spriteCount;
            this.graphLabels.gMap.offset.x = this.graphLabels.spriteIndex/this.graphLabels.spriteCount;
            this.graphLabels.bMap.offset.x = this.graphLabels.spriteIndex/this.graphLabels.spriteCount;

            this.rgbDot.map.offset.x = this.graphLabels.spriteIndex/this.graphLabels.spriteCount;
        }

        if (this.colorBox.animate) this.animateBox();

        this.screenTimer += g_dt;
        this.screenFrameCount++;
    }

    startGame() {
        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mousedown', this.handleMouseDown);
        document.dispatchEvent(gameManager.triggerMiniGameEvent);
        this.objects.add(this.answersText[0][1]);
        this.objects.add(this.answersText[1][1]);
        this.objects.add(this.answersText[2][1]);
        this.objects.add(this.rgbDot.sprite);

    }

    handleMouseMove(event) {
        let src = gameManager.minigames[0];
        hud.pointer.x = (event.clientX / canvas.width) * 2 - 1;
        hud.pointer.y = -1*((event.clientY / canvas.height) * 2 - 1);
        hud.mouseRaycaster.setFromCamera(hud.pointer, w_Camera);
        const intersects = hud.mouseRaycaster.intersectObjects(src.buttonOptions)
        for (let i = 0; i < src.buttonOptions.length; i++) {
            src.buttonOptions[i].material.color.set(0xffffff);
        }
        for (let i = 0; i < intersects.length; i++) {
            intersects[i].object.material.color.set(0xa5a5a5);
        }

    }

    handleMouseDown() {
        let src = gameManager.minigames[0];
        hud.mouseRaycaster.setFromCamera(hud.pointer, w_Camera);
        const intersects = hud.mouseRaycaster.intersectObjects(src.buttonOptions)
        if (intersects.length > 0) {
            if (intersects[0].object == src.buttonOptions[src.buttonWithCorrectAnswer]) {
                console.log("correct");
                gameManager.winScreen();
                setTimeout(() => {
                    gameManager.readyForNextScreen();
                }, 250);
            } else {
                gameManager.loseScreen();  
            }
            src.handleColorBox();      
        }
    }

    loseScreen() {
        console.log("incorrect");
        setTimeout(() => {
            gameManager.restartBackToMain();
        }, 1500);
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mousedown', this.handleMouseDown);
    }

    handleColorBox() {
        this.objects.add(this.colorBox.mesh);
        this.colorBox.time = 0;
        this.colorBox.mesh.material.opacity = 0;
        this.colorBox.animate = true;
    }
    animateBox() {

        this.colorBox.mesh.material.opacity += g_dt*3.5;

        if (!gameManager.gameRunning) {
            let amt = 0;
            let rot = -.18;
            amt = Math.sin(this.colorBox.time * 5) * .3
            this.colorBox.mesh.translateY(amt);
            this.colorBox.mesh.rotateY(rot);
        }
        

        this.colorBox.time += g_dt;
        if (this.colorBox.time >= 2) {
            this.colorBox.animate = false;
        }
    }

    exitScreen() {
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mousedown', this.handleMouseDown);
        document.addEventListener(("OnCameraDone"), this.clear )
    }

    clear() {
        let src = gameManager.minigames[0];
        src.objects.remove(src.colorBox.mesh);
        src.objects.remove(src.answersText[0][1]);
        src.objects.remove(src.answersText[1][1]);
        src.objects.remove(src.answersText[2][1]);
        src.objects.remove(src.rgbDot.sprite);
        src.colorBox.mesh.rotation.set(0.3687053205511489, -0.26934274716997353, -3.0679499892181967)
        src.colorBox.mesh.position.set(.2, .7, 5);
        src.objects.remove(src.colorBox.mesh);
        document.removeEventListener(("OnCameraDone"), src.clear)
        for (let i = 0; i < src.buttonOptions.length; i++) {
            src.buttonOptions[i].material.color.set(0xffffff);
        }
    }
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}