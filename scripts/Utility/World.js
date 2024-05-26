class World {
    constructor() {
        this.buildWorld();


        this.boxSize = 20;
        this.planeGeometry = new THREE.PlaneGeometry(this.boxSize, this.boxSize);
        this.planeMaterial = new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            side: THREE.DoubleSide
        });
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
        if (this.boxPlaneTemplate == null) { // on first call, create template (so probably main menu)
            this.boxPlaneTemplate = new THREE.Group();

            let p0 = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
            p0.position.set(pos.x, pos.y,-this.boxSize*.5+pos.z);
            p0.material.color.setHex(color);
            p0.rotateY(Math.PI);

            let p1 = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
            p1.position.set(this.boxSize*.5+pos.x, pos.y, pos.z);
            p1.material.color.setHex(color);
            p1.rotateY(Math.PI/2);

            let p2 = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
            p2.position.set(-this.boxSize*.5+pos.x, pos.y, pos.z);
            p2.material.color.setHex(color);
            p2.rotateY(Math.PI/2);

            let p3 = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
            p3.position.set(pos.x, this.boxSize*.5+pos.y, pos.z);
            p3.material.color.setHex(color);
            p3.rotateX(Math.PI/2);

            let p4 = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
            p4.position.set(pos.x, -this.boxSize*.5+pos.y, pos.z);
            p4.material.color.setHex(color);
            p4.rotateX(Math.PI/2);

            this.boxPlaneTemplate.add(p0, p1, p2, p3, p4);
            w_Scene.add(this.boxPlaneTemplate);

            // let clipPlanes = [            
            //     new THREE.Plane(new THREE.Vector3(-1, 0, 0), 10),
            //     new THREE.Plane(new THREE.Vector3(1, 0, 0), 10),
            //     new THREE.Plane(new THREE.Vector3(0, 0, 1), 10),
            //     new THREE.Plane(new THREE.Vector3(0, -1, 0), 10),
            //     new THREE.Plane(new THREE.Vector3(0, 1, 0), 10)
            // ]

            // return [this.boxPlaneTemplate, clipPlanes];
            let normal = new THREE.Vector3();
            let coPoint = new THREE.Vector3();

            let pl0 = new THREE.Plane();
            normal.set(0,0,-1).applyQuaternion( p0.quaternion);
            coPoint.copy( p0.position);
            pl0.setFromNormalAndCoplanarPoint(normal, coPoint);
            let pl5 = new THREE.Plane();
            normal.set(0,0,1).applyQuaternion( p0.quaternion);
            coPoint.copy( p0.position);
            pl5.set(normal, this.boxSize/2);

            let pl1 = new THREE.Plane();
            normal.set(0,0,-1).applyQuaternion( p1.quaternion);
            coPoint.copy( p1.position);
            pl1.setFromNormalAndCoplanarPoint(normal, coPoint);

            let pl2 = new THREE.Plane();
            normal.set(0,0,1).applyQuaternion( p2.quaternion);
            coPoint.copy( p2.position);
            pl2.setFromNormalAndCoplanarPoint(normal, coPoint);

            let pl3 = new THREE.Plane();
            normal.set(0,0,1).applyQuaternion( p3.quaternion);
            coPoint.copy( p3.position);
            pl3.setFromNormalAndCoplanarPoint(normal, coPoint);

            let pl4 = new THREE.Plane();
            normal.set(0,0,-1).applyQuaternion( p4.quaternion);
            coPoint.copy( p4.position);
            pl4.setFromNormalAndCoplanarPoint(normal, coPoint);
            return [this.boxPlaneTemplate, [pl0, pl1, pl2, pl3, pl4, pl5]];
        } 
        else {
            let box = this.boxPlaneTemplate.clone();
            let mat = box.children[0].material.clone();
            mat.color.setHex(color);
            box.children[0].position.set(pos.x, pos.y,-this.boxSize*.5+pos.z);
            box.children[0].material = mat;

            box.children[1].position.set(this.boxSize*.5+pos.x, pos.y, pos.z);
            box.children[1].material = mat;

            box.children[2].position.set(-this.boxSize*.5+pos.x, pos.y, pos.z);
            box.children[2].material = mat;

            box.children[3].position.set(pos.x, this.boxSize*.5+pos.y, pos.z);
            box.children[3].material = mat;

            box.children[4].position.set(pos.x, -this.boxSize*.5+pos.y, pos.z);
            box.children[4].material = mat;

            w_Scene.add(box);

            let normal = new THREE.Vector3();
            let coPoint = new THREE.Vector3();

            let pl0 = new THREE.Plane();
            normal.set(0,0,-1).applyQuaternion( box.children[0].quaternion);
            coPoint.copy( box.children[0].position);
            pl0.setFromNormalAndCoplanarPoint(normal, coPoint);
            let pl5 = new THREE.Plane();
            normal.set(0,0,1).applyQuaternion( box.children[0].quaternion);
            coPoint.copy( box.children[0].position);
            pl5.set(normal, this.boxSize/2);

            let pl1 = new THREE.Plane();
            normal.set(0,0,-1).applyQuaternion( box.children[1].quaternion);
            coPoint.copy( box.children[1].position);
            pl1.setFromNormalAndCoplanarPoint(normal, coPoint);

            let pl2 = new THREE.Plane();
            normal.set(0,0,1).applyQuaternion( box.children[2].quaternion);
            coPoint.copy( box.children[2].position);
            pl2.setFromNormalAndCoplanarPoint(normal, coPoint);

            let pl3 = new THREE.Plane();
            normal.set(0,0,1).applyQuaternion( box.children[3].quaternion);
            coPoint.copy( box.children[3].position);
            pl3.setFromNormalAndCoplanarPoint(normal, coPoint);

            let pl4 = new THREE.Plane();
            normal.set(0,0,-1).applyQuaternion( box.children[4].quaternion);
            coPoint.copy( box.children[4].position);
            pl4.setFromNormalAndCoplanarPoint(normal, coPoint);
            return [box, [pl0, pl1, pl2, pl3, pl4, pl5]];
        }
    }
}