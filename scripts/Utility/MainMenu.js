
class MainMenu {
    constructor(camPos, center) {
        this.camPos = camPos;
        this.center = new THREE.Object3D();
        this.center.position.set(center[0], center[1], center[2]);      
    }

    buildMainMenu() {
        gameManager.world.buildBox(new THREE.Color(0xFFDD33), this.center.position)

        var sphereGeometry = new THREE.SphereGeometry(1, 32, 16);
        var sphereMaterial = new THREE.MeshLambertMaterial({
            color: 0xD9D924
        })
        const sphere1 = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere1.position.set(0, -6, -2);
        sphere1.receiveShadow = true;
        sphere1.castShadow = true;
        w_Scene.add(sphere1);

        var boxIlluminator = new THREE.PointLight(0xffffff, 100, 50);
        boxIlluminator.position.set(0, 0, 12);
        w_Scene.add(boxIlluminator);

        const lightTarget = new THREE.Object3D();
        lightTarget.position.set(0, -10, 0);
        w_Scene.add(lightTarget);

        var light2 = new THREE.SpotLight(0xffffff, 30, 30, Math.PI/2.05, .5, .8);
        light2.target = lightTarget;
        light2.position.set(0, 4, 10)
        light2.castShadow = true;
        light2.shadow.radius = 2;
        light2.shadow.mapSize.width = 8182;
        light2.shadow.mapSize.height = 8182;
        w_Scene.add(light2);

        const textLightTarget = new THREE.Object3D();
        textLightTarget.position.set(0, -10, -1);
        w_Scene.add(textLightTarget);

        var textLight1 = new THREE.SpotLight(0xffffff, 20, 10, Math.PI/3, .3, .8);
        textLight1.target = textLightTarget;
        textLight1.position.set(-2, -1, -5)
        w_Scene.add(textLight1);

        var textLight2 = new THREE.SpotLight(0xffffff, 20, 10, Math.PI/3, .3, .8);
        textLight2.target = textLightTarget;
        textLight2.position.set(2, -1, -5)
        w_Scene.add(textLight2);

        const fontLoader = new FontLoader();
        
        fontLoader.load('resources/fonts/helvetiker_bold.typeface.json', function(f) {
            const menuText = new TextGeometry("click to start", {
                font: f,
                size: 2,
                depth: 15
            });
            var textMaterial = new THREE.MeshPhongMaterial( 
                { color: 0x6361be, specular: 0x5590b4, shininess: 30, emissive: 0x1a1a1a }
            );
            gameManager.MainMenu.clickToStart = new THREE.Mesh( menuText, textMaterial );
            gameManager.MainMenu.clickToStart.position.set(-8, -1, -10);
            gameManager.MainMenu.clickToStart.castShadow = true;
            gameManager.MainMenu.clickToStart.receiveShadow = true;
            w_Scene.add(gameManager.MainMenu.clickToStart);
        })
    }

    enterScreen() {
        document.addEventListener('mousemove', this.handleMouseMove, true);
        document.addEventListener('mousedown', this.handleMouseDown, true)
    }

    handleMouseMove(event) {
        if (gameManager.MainMenu.clickToStart == null) return;

        hud.pointer.x = (event.clientX / canvas.width) * 2 - 1;
        hud.pointer.y = (event.clientY / canvas.height) * 2 - 1;
        hud.mouseRaycaster.setFromCamera(hud.pointer, w_Camera);
        const intersects = hud.mouseRaycaster.intersectObject(gameManager.MainMenu.clickToStart)
        if (intersects.length > 0) 
        {
            gameManager.MainMenu.clickToStart.material.color.set(0x339e8f)
        } else {
            gameManager.MainMenu.clickToStart.material.color.set(0x6361be)
        }
    }

    handleMouseDown() {
        hud.mouseRaycaster.setFromCamera(hud.pointer, w_Camera);
        const intersects = hud.mouseRaycaster.intersectObject(gameManager.MainMenu.clickToStart)
        if (intersects.length > 0) {
            gameManager.startGame();
        }
    }

    exitScreen() {
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mousedown', this.handleMouseDown);
    }

    update() {

    }
}
