import * as THREE from 'three';


let canvas;
let renderer;
let camera;
let scene;

function setUpWebGL() {
  // Retrieve <canvas> element
  canvas = document.querySelector('#c');
  renderer = new THREE.WebGLRenderer({antialias: true, canvas});
}

let shapes = []
let ring;
function setUpScene() {
  const fov = 75;
  const aspect = 2;
  const near = 0.1;
  const far = 10;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 4;
  camera.position.y = 2;
  camera.rotation.x = -.5
  
  scene = new THREE.Scene();

  const textureLoader = new THREE.TextureLoader();
  const woodTexture = textureLoader.load('resources/scratched_wood.jpg')
  woodTexture.colorSpace = THREE.SRGBColorSpace;
  woodTexture.wrapS = THREE.RepeatWrapping;
  woodTexture.wrapT = THREE.RepeatWrapping;
  woodTexture.repeat.set(1, 4);

  // Create stick
  const boxWidth = .2;
  const boxHeight = 1.2;
  const boxDepth = .2;
  const stickGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  const torusGeometry = new THREE.TorusGeometry(1, 0.1, 11, 40, Math.PI * 2);
  const planeGeometry = new THREE.PlaneGeometry(1,1);
  shapes = [
    instantiateShape(stickGeometry, woodTexture, null, [0,0,0], [0,0,0]),
    instantiateShape(torusGeometry, null, 0x687ca9, [0,2,0],[Math.PI/2,0,0]),
    instantiateShape(planeGeometry, woodTexture, null, [0,-.5,0], [-Math.PI/2,0,0])
  ];
  ring = {
    shape: shapes[1],
    donePos: [0,-.8,0],
    traveled: 0,
    done: false
  }
  instantiateLight(0xEEEEFF, 4, [0,1, 2])
}


function main() {

  setUpWebGL();
  setUpScene();

  requestAnimationFrame(update);
}

let dt = 0;
let lastTimeStamp = 0;

function update(timestamp) {
  // used reference https://github.com/llopisdon/webgl-pong/blob/master/main.js
  const t = timestamp / 1000;
  dt = t - lastTimeStamp;
  lastTimeStamp = t;

  shapes.forEach((shape, ndx) => {
    shape.rotateOnWorldAxis(THREE.Object3D.DEFAULT_UP, dt);
  });

  if (!ring.done) {
    if (ring.traveled <= 10) ring.traveled += dt;
    ring.shape.position.y -= ring.traveled/20 ;
    if (ring.shape.position.y <= ring.donePos[1]) ring.shape.position.y = 2;
  }


  renderer.render(scene, camera);

  requestAnimationFrame(update);
}

function instantiateShape(geometry, texture, color, position, rotation) {
  let material;
  if (color == null) {
    material = new THREE.MeshPhongMaterial({
      map: texture
    });
  } else {
    material = new THREE.MeshPhongMaterial({color});
  }
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  cube.position.set(position[0],position[1],position[2]);
  cube.rotation.set(rotation[0],rotation[1],rotation[2]);
  return cube;

}

function instantiateLight(color, intensity, position, rotation) {
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(position[0], position[1], position[2]);
  scene.add(light);
}

main();
