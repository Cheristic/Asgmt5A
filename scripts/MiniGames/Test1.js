class Test1 extends MiniGame {
    constructor(camPos, center, index) {
        super(camPos, center, index);
    }

    buildScreen() {
        gameManager.world.buildBox(new THREE.Color(0xAAEE22), this.center.position)

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

        var sphereGeometry = new THREE.SphereGeometry(1, 32, 16);
        var sphereMaterial = new THREE.MeshLambertMaterial({
            color: 0xD9D924
        })
        this.winSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.winSphere.position.set(0, 0, -2);
        this.winSphere.receiveShadow = true;
        this.objects.add(this.winSphere);
        this.objects.position.set(this.center.position.x, this.center.position.y, this.center.position.z)
    }

    enterScreen() {
        document.addEventListener('mousemove', this.handleMouseMove, true);
        document.addEventListener('mousedown', this.handleMouseDown, true)
    }

    handleMouseMove(event) {
        let src = gameManager.minigames[0];
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
        const intersects = hud.mouseRaycaster.intersectObject(gameManager.minigames[0].winSphere)
        if (intersects.length > 0) {
            gameManager.winScreen();
        }
    }

    exitScreen() {
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mousedown', this.handleMouseDown);
    }
}