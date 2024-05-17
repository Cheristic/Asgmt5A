class World {
    constructor() {
        this.buildWorld();


        this.boxSize = 20;
        this.planeGeometry = new THREE.PlaneGeometry(this.boxSize, this.boxSize);
        this.planeMaterial = new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            side: THREE.DoubleSide
        });
        this.boxPlanes = new THREE.InstancedMesh(this.planeGeometry, this.planeMaterial, 15);
        this.boxPlanes.receiveShadow = true;
        this.boxPlaneMatrix = new THREE.Matrix4();
        this.boxPlaneCounter = 0;
        w_Scene.add(this.boxPlanes);

    }

    buildWorld() {
        // SET UP FULL SCENE STUFF
        var amblight = new THREE.AmbientLight(0xffffff, 0.1);
        w_Scene.add(amblight);

        var dirLight = new THREE.DirectionalLight(0xffffff, .1);
        dirLight.position.set(0, 0, 5);
        w_Scene.add(dirLight);

        var skyBoxGeometry = new THREE.BoxGeometry(2000, 2000, 2000);
        const skyBoxTexture = new THREE.TextureLoader().load('resources/160-wario-Background.jpg');
        skyBoxTexture.wrapS = THREE.RepeatWrapping;
        skyBoxTexture.wrapT = THREE.RepeatWrapping;
        skyBoxTexture.repeat.set(-10, 10);
        skyBoxTexture.colorSpace = THREE.SRGBColorSpace;
        const skyMat = new THREE.MeshBasicMaterial({map: skyBoxTexture, side: THREE.BackSide})
        this.skyBox = new THREE.Mesh(skyBoxGeometry, skyMat);
        w_Scene.add(this.skyBox);
    }

    buildBox(color, pos) {
        this.boxPlaneMatrix.identity();
        this.boxPlaneMatrix.makeRotationY(Math.PI);
        this.boxPlaneMatrix.setPosition(pos.x, pos.y,-this.boxSize*.5+pos.z);
        this.boxPlanes.setMatrixAt(this.boxPlaneCounter, this.boxPlaneMatrix);
        this.boxPlanes.setColorAt(this.boxPlaneCounter, color);
        this.boxPlaneCounter++;

        this.boxPlaneMatrix.identity();
        this.boxPlaneMatrix.makeRotationY(Math.PI/2);
        this.boxPlaneMatrix.setPosition(this.boxSize*.5+pos.x, pos.y, pos.z);
        this.boxPlanes.setMatrixAt(this.boxPlaneCounter, this.boxPlaneMatrix);
        this.boxPlanes.setColorAt(this.boxPlaneCounter, color);
        this.boxPlaneCounter++;

        this.boxPlaneMatrix.identity();
        this.boxPlaneMatrix.makeRotationY(Math.PI/2);
        this.boxPlaneMatrix.setPosition(-this.boxSize*.5+pos.x, pos.y, pos.z);
        this.boxPlanes.setMatrixAt(this.boxPlaneCounter, this.boxPlaneMatrix);
        this.boxPlanes.setColorAt(this.boxPlaneCounter, color);
        this.boxPlaneCounter++;

        this.boxPlaneMatrix.identity();
        this.boxPlaneMatrix.makeRotationX(Math.PI/2);
        this.boxPlaneMatrix.setPosition(pos.x, this.boxSize*.5+pos.y, pos.z);
        this.boxPlanes.setMatrixAt(this.boxPlaneCounter, this.boxPlaneMatrix);
        this.boxPlanes.setColorAt(this.boxPlaneCounter, color);
        this.boxPlaneCounter++;

        this.boxPlaneMatrix.identity();
        this.boxPlaneMatrix.makeRotationX(Math.PI/2);
        this.boxPlaneMatrix.setPosition(pos.x, -this.boxSize*.5+pos.y, pos.z);
        this.boxPlanes.setMatrixAt(this.boxPlaneCounter, this.boxPlaneMatrix);
        this.boxPlanes.setColorAt(this.boxPlaneCounter, color);
        this.boxPlaneCounter++;
    }
}