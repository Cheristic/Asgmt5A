// ## WEBGL VARIABLES ##
let canvas, hud, renderer;
// ##################

// ## SCENE VARIABLES ##
let w_Camera, w_Scene, gameManager, audioManager;
// ##################

let THREE;
let TextGeometry;
let FontLoader;
let GUI;
let SimplifyModifier;
let OBJLoader;
let MTLLoader
let TWEEN;

let boxVertex;
let boxFragment;


function main(three, textgeo, fontload, bVert, bFrag, simp, obj, mtl, tween) {
  THREE = three;
  TextGeometry = textgeo;
  FontLoader = fontload;
  GUI = lil.GUI;
  boxVertex = bVert;
  boxFragment = bFrag;
  SimplifyModifier = simp;
  OBJLoader = obj;
  MTLLoader = mtl;
  TWEEN = tween;
  setUpWebGL();
  setUpScene();
  
  requestAnimationFrame(update);

}

function setUpWebGL() {
  canvas = document.querySelector('#c');
  renderer = new THREE.WebGLRenderer({antialias: true, canvas});
  renderer.physicallyCorrectLights = true;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setClearColor(0x000000);
  renderer.setSize(canvas.width, canvas.height);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.localClippingEnabled = true;
}

function setUpScene() {
  w_Camera = new THREE.PerspectiveCamera(75, canvas.width/canvas.height, .001, 3000);

  w_Scene = new THREE.Scene();

  gameManager = new GameManager();
  gameManager.buildScreens();

  audioManager = new AudioManager();

  hud = new HUDManager();

  gameManager.startScene();
}

let g_dt = 0;
let g_lastTimeStamp = 0;
function update(timestamp) {
  const t = timestamp / 1000;
  g_dt = t - g_lastTimeStamp;
  g_lastTimeStamp = t;

  gameManager.update();
  hud.update();

  renderer.render(w_Scene, w_Camera);
  requestAnimationFrame(update);
}
