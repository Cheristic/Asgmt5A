class MainMenu {
    constructor(camPos, center) {
        this.camPos = camPos;
        this.center = new THREE.Object3D();
        this.center.position.set(center[0], center[1], center[2]);   
        
    }

    buildMainMenu() {
        this.boxData = gameManager.world.buildBox(0xFFDD33, this.center.position)

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

        this.clickToStart = null;
        this.titleText = null;

        const fontLoader = new FontLoader();
    
        fontLoader.load('resources/fonts/helvetiker_bold.typeface.json', function(f) {
            let clickToStart = new TextGeometry("click to start", {
                font: f,
                size: 2,
                depth: 15
            });

            let title = new TextGeometry("160 - WARE", {
                font: f,
                size: 2,
                depth: 3
            });

            // console.log([
            //     THREE.ShaderLib.phong.uniforms,
            //     {
            //         color: {value:0x6361be}, specular: {value:0x5590b4}, shininess: {value:30}, emissive: {value:0x1a1a1a}, 
            //         clippingPlanes: {value:gameManager.MainMenu.boxData[1]}, clipIntersection: {value:gameManager.world.clipParams}
            //     }
            // ])

            // var customUniforms = {
            //     color: {value: new THREE.Color(0x6361be)}, specular: {value: new THREE.Color(0x5590b4)}, shininess: {value:30}, 
            //     emissive: {value: new THREE.Color(0x1a1a1a)}, opacity: {value: 1},   
            // };

            // //var uniforms = THREE.UniformsUtils.merge([THREE.ShaderLib.phong.uniforms, customUniforms])
            // var uniforms = THREE.UniformsUtils.clone(THREE.ShaderLib.phong.uniforms);
            // console.log(uniforms);

            // let define = {};
            // define["USE_COLOR"] = "";

            //let boxUniforms = Object.assign({}, phongUniforms, customUniforms);
            
            // var textMaterial = new THREE.ShaderMaterial({
            //     uniforms: customUniforms,
            //     vertexShader:THREE.ShaderLib.phong.vertexShader,
            //     fragmentShader: THREE.ShaderLib.phong.fragmentShader,
            //     defines: define,
            //     clippingPlanes: gameManager.MainMenu.boxData[1], 
            //     clipIntersection: gameManager.world.clipParams,
            //     clipping: true,
            //     uniformsNeedUpdate: true,
            // });
        


            var textMaterial = new THREE.MeshPhongMaterial( 
                { color: 0x6361be, specular: 0x5590b4, shininess: 30, emissive: 0x1a1a1a, 
                    clippingPlanes: gameManager.MainMenu.boxData[1],
                    clipIntersection: false, flatShading: true
                }
            );

            gameManager.MainMenu.clickToStart = new THREE.Mesh( clickToStart, textMaterial );
            
            gameManager.MainMenu.clickToStart.position.set(-8, -1, -10);
            gameManager.MainMenu.clickToStart.castShadow = true;
            gameManager.MainMenu.clickToStart.receiveShadow = true;

            w_Scene.add(gameManager.MainMenu.clickToStart);
            
            
            var titleMaterial = new THREE.MeshPhongMaterial( 
                { color: 0xc2a3e7, specular: 0x5590b4, shininess: 15, emissive: 0x1a1a1a, 
                    clippingPlanes: gameManager.MainMenu.boxData[1], clipIntersection: false, flatShading: true
                }
            );
            gameManager.MainMenu.titleText = new THREE.Mesh( title, titleMaterial );
            gameManager.MainMenu.titleText.position.set(-8, 4, -10);
            gameManager.MainMenu.titleText.castShadow = true;
            gameManager.MainMenu.titleText.receiveShadow = true;
            
            w_Scene.add(gameManager.MainMenu.titleText);

            
        })
    }

    enterScreen() {
        document.addEventListener(("OnCameraDone"), this.onReady )
        gameManager.MainMenu.clickToStart.material.color.set(0x6361be)
    }

    onReady() {
        let src = gameManager.MainMenu
        if (src.clickToStart != null) {
            w_Scene.add(src.clickToStart);
            w_Scene.add(src.titleText);
        }
        document.addEventListener('mousemove', src.handleMouseMove);
        document.addEventListener('mousedown', src.handleMouseDown)
        document.removeEventListener(("OnCameraDone"), src.onReady )
    }

    handleMouseMove(event) {
        let src = gameManager.MainMenu
        if (src.clickToStart == null) return;

        hud.pointer.x = (event.clientX / canvas.width) * 2 - 1;
        hud.pointer.y = (event.clientY / canvas.height) * 2 - 1;
        hud.mouseRaycaster.setFromCamera(hud.pointer, w_Camera);
        const intersects = hud.mouseRaycaster.intersectObject(src.clickToStart)
        if (intersects.length > 0) 
        {
            src.clickToStart.material.color.set(0x339e8f)
        } else {
            src.clickToStart.material.color.set(0x6361be)
        }
    }

    handleMouseDown() {
        let src = gameManager.MainMenu

        hud.mouseRaycaster.setFromCamera(hud.pointer, w_Camera);
        const intersects = hud.mouseRaycaster.intersectObject(src.clickToStart)
        if (intersects.length > 0) {
            gameManager.startGame();
            w_Scene.remove(src.clickToStart);
            w_Scene.remove(src.titleText);
        }
    }

    exitScreen() {
        document.removeEventListener('mousemove', gameManager.MainMenu.handleMouseMove);
        document.removeEventListener('mousedown', gameManager.MainMenu.handleMouseDown);
        document.addEventListener(("OnCameraDone"), this.clear )
    }

    update() {

    }

    clear() {
        let src = gameManager.MainMenu
        
        document.removeEventListener(("OnCameraDone"), src.clear)
    }
}
