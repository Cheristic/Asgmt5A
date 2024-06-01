class Test2 extends MiniGame {
    constructor(camPos, center, index) {
        super(camPos, center, index, "Click the lil dot", 7);
    }

    buildScreen() {
        gameManager.world.buildBox(0x23A0EF, this.center.position)

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

        var sphereGeometry = new THREE.SphereGeometry(1, 32, 16);
        var sphereMaterial = new THREE.MeshLambertMaterial({
            color: 0xD9D924
        })
        this.winSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.winSphere.position.set(0, 0, -2);
        this.objects.add(this.winSphere);
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
        let src = gameManager.minigames[1];
        hud.pointer.x = (event.clientX / canvas.width) * 2 - 1;
        hud.pointer.y = (event.clientY / canvas.height) * 2 - 1;
        hud.mouseRaycaster.setFromCamera(hud.pointer, w_Camera);
        const intersects = hud.mouseRaycaster.intersectObject(src.winSphere)
        if (intersects.length > 0) 
        {
            src.winSphere.material.color.set(0x6ee343)
        } else {
            src.winSphere.material.color.set(0xD9D924)
        }
    }

    handleMouseDown() {
        hud.mouseRaycaster.setFromCamera(hud.pointer, w_Camera);
        const intersects = hud.mouseRaycaster.intersectObject(gameManager.minigames[1].winSphere)
        if (intersects.length > 0) {
            gameManager.winScreen();
            gameManager.readyForNextScreen();
        }
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