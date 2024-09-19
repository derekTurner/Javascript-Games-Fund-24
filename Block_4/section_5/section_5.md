# Element 4

Element 4 from the Elements dropdown menu.
This shows a collision between the character mesh and a sphere being counted and displayed as a score on a gui button.  The score increments on each collision.  The reset button will clear the score.  The page should be reloaded to test its operation again.


<iframe 
    height="1100" 
    width="100%" 
    scrolling="no" 
    title="frame animaations" 
    src="Block_4/demo/public/index.html" 
    frameborder="no" 
    loading="lazy" 
    allowtransparency="true" 
    allowfullscreen="true">
</iframe>

The scene sits on the web page elements3.html witin a div with id = canvasElement.

**element4.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Example Scene 4</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://cdn.babylonjs.com/babylon.js"></script>
  <script src="https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js"></script>
  <script src="https://cdn.babylonjs.com/gui/babylon.gui.js"></script>
  <script src="JS/element4.js"></script>
</head>
<body>

  <div class="container-fluid p-5 bg-primary text-white text-center">
    <h1>JavaScript Games: Programming Fundamentals</h1>
    <p>Example highlighting the layout of Elements!</p> 
  </div>
  
  <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Element 1</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="collapsibleNavbar">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" href="index.html">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="team.html">Team</a>
            </li>  
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">Elements</a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="element1.html">Element 1</a></li>
                <li><a class="dropdown-item" href="element2.html">Element 2</a></li>
                <li><a class="dropdown-item" href="element3.html">Element 3</a></li>
                <li><a class="dropdown-item" href="element4.html">Element 4</a></li>
                <li><a class="dropdown-item" href="element5.html">Element 5</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>

  <div id="canvasElement">
    <canvas id="renderCanvas" style="width:1000px; height:600px; display: block; margin-left: auto; margin-right: auto; margin-top: 50px;"></canvas>
    <script>
      const canvas = document.getElementById("renderCanvas");
      const engine = new BABYLON.Engine(canvas, true);
      const scene = createScene();
      engine.runRenderLoop(function() {
        scene.render();
      });
      window.addEventListener("resize", function() {
        engine.resize();
      });
    </script>
  </div>

</body>
</html>
```
The keydown and score variables have global scope and are used as before to enable keyboard events to cause character movement and also to allow the state of the score to be placed where it can be accessed by the button.

```javascript
var keyDownMap = [];
let score = 0;
```
The ground is similar to earlier examples, the uScale has been ajusted to match the size of the scene.

```javascript
function createGround(scene) {
  const groundMaterial = new BABYLON.StandardMaterial("groundMaterial");
  groundMaterial.diffuseTexture = new BABYLON.Texture(
    "assets/textures/wood.jpg"
  );
  groundMaterial.diffuseTexture.uScale = 5.0; //Repeat 5 times on the Vertical Axes
  groundMaterial.diffuseTexture.vScale = 5.0; //Repeat 5 times on the Horizontal Axes
  groundMaterial.diffuseTexture.hasAlpha = true;
  //groundMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);
  groundMaterial.backFaceCulling = false;
  let ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 15, height: 15 },
    scene
  );

  ground.material = groundMaterial;
  return ground;
}
```
The background uses a prepared backgroundMaterial within a generated skybox.  Experimentation with different textures and settings is encouraged.

```javascript
function diffuseBox(scene) {
  var backgroundMaterial = new BABYLON.BackgroundMaterial(
    "backgroundMaterial",
    scene
  );
  backgroundMaterial.useRGBColor = false;
  backgroundMaterial.primaryColor = BABYLON.Color3.Teal();
  backgroundMaterial.diffuseTexture = new BABYLON.Texture(
    "assets/textures/reflectivity.png",
    scene
  );
  backgroundMaterial.diffuseTexture.uScale = 10.0; //Repeat 5 times on the Vertical Axes
  backgroundMaterial.diffuseTexture.vScale = 10.0; //Repeat 5 times on the Horizontal Axes
  backgroundMaterial.shadowLevel = 0.4;
  //backgroundMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/reflectivity.png", scene);
  // backgroundMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

  var skybox = BABYLON.Mesh.CreateBox(
    "BackgroundSkybox",
    500,
    scene,
    undefined,
    BABYLON.Mesh.BACKSIDE
  );
  skybox.material = backgroundMaterial;
}
```
Light and camera functions are similar to previous examples.

```javascript
function createLight(scene) {
  scene.ambientColor = new BABYLON.Color3(0.8, 0.3, 0.8);
  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(2, 1, 0), // move x pos to direct shadows
    scene
  );
  light.intensity = 0.7;
  light.diffuse = new BABYLON.Color3(1, 1, 1);
  light.specular = new BABYLON.Color3(1, 0.8, 0.8);
  light.groundColor = new BABYLON.Color3(0, 0.2, 0.7);
  return light;
}

function createArcRotateCamera(scene) {
  let camAlpha = -Math.PI / 2,
    camBeta = Math.PI / 2.5,
    camDist = 15,
    camTarget = new BABYLON.Vector3(0, 0, 0);
  let camera = new BABYLON.ArcRotateCamera(
    "camera1",
    camAlpha,
    camBeta,
    camDist,
    camTarget,
    scene
  );
  camera.lowerRadiusLimit = 9;
  camera.upperRadiusLimit = 25;
  camera.lowerAlphaLimit = 0;
  camera.upperAlphaLimit = Math.PI * 2;
  camera.lowerBetaLimit = 0;
  camera.upperBetaLimit = Math.PI / 2.02;

  camera.attachControl(true);
  return camera;
}
```
The sphere and button to be used in the interaction with the mesh are passed as parameters into the importMeshA function.

The mesh loading and animations are similar to those listed on the previous example.

At the bottom of the onBeforeRenderObservable section is a conditional statement which moves the sphere and alters the score on the button in response to a mesh intersection.

There is a possibility of adding an audio file to play, but I have commented this out!

```javascript
function importMeshA(scene, x, y, sphere, button1) {
  let item = BABYLON.SceneLoader.ImportMesh("", "assets/models/women/",
  "Formal.gltf", scene, function(meshes) {
      const character = meshes[0];
      character.position.x = x;
      character.position.y = y;
      character.scaling = new BABYLON.Vector3(1, 1, 1);
      character.rotation = new BABYLON.Vector3(0, 1.5, 0);

      const deathAnim = scene.getAnimationGroupByName("Death");//x
      const gun_ShootAnim = scene.getAnimationGroupByName("Gun_Shoot");//T
      const hitRecieveAnim = scene.getAnimationGroupByName("HitRecieve");//Y
      const hitRecieve_2Anim = scene.getAnimationGroupByName("HitRecieve_2");//U
      const idleAnim = scene.getAnimationGroupByName("Idle");//I
      const idle_GunAnim = scene.getAnimationGroupByName("Idle_Gun");//O
      const idle_Gun_PointingAnim = scene.getAnimationGroupByName("Idle_Gun_Pointing");//R
      const idle_Gun_ShootAnim = scene.getAnimationGroupByName("Idle_Gun_Shoot");//F
      const idle_NeutralAnim = scene.getAnimationGroupByName("Idle_Neutral");//G
      const idle_SwordAnim = scene.getAnimationGroupByName("Idle_Sword");//H
      const interactAnim = scene.getAnimationGroupByName("Interact");//I
      const kick_LeftAnim = scene.getAnimationGroupByName("Kick_Left");//k
      const kick_RightAnim = scene.getAnimationGroupByName("Kick_Right");//K
      const punch_LeftAnim = scene.getAnimationGroupByName("Punch_Left");//p
      const punch_RightAnim = scene.getAnimationGroupByName("Punch_Right");//P
      const rollAnim = scene.getAnimationGroupByName("Roll");//J
      const runAnim = scene.getAnimationGroupByName("Run");//
      const run_BackAnim = scene.getAnimationGroupByName("Run_Back");//
      const run_LeftAnim = scene.getAnimationGroupByName("Run_Left");//
      const run_RightAnim = scene.getAnimationGroupByName("Run_Right");//
      const run_ShootAnim = scene.getAnimationGroupByName("Run_Shoot");//
      const sword_SlashAnim = scene.getAnimationGroupByName("Sword_Slash");//;
      const walkAnim = scene.getAnimationGroupByName("Walk");//wasd
      const waveAnim = scene.getAnimationGroupByName("Wave");//'
      
  var animating = false;
  
  
  function stopMe(){
      deathAnim.stop();
      idleAnim.stop();
      walkAnim.stop();
  }

  stopMe();
  idleAnim.start(true, 1.0, idleAnim.from, idleAnim.to, false);

  scene.onBeforeRenderObservable.add(()=> {
      //control movement
      var keydown = false;
      if (keyDownMap["w"] || keyDownMap["ArrowUp"]) {
          character.position.x -= 0.1;
          character.rotation.y = 3 * Math.PI / 2;
          keydown = true;
      }
      if (keyDownMap["a"] || keyDownMap["ArrowLeft"]) {
          character.position.z -= 0.1;
          character.rotation.y = 2 * Math.PI / 2;
          keydown = true;
      }
      if (keyDownMap["s"] || keyDownMap["ArrowDown"]) {
          character.position.x += 0.1;
          character.rotation.y = 1 * Math.PI / 2;
          keydown = true;
      }
      if (keyDownMap["d"] || keyDownMap["ArrowRight"]) {
          character.position.z += 0.1;
          character.rotation.y = 0* Math.PI / 2;
          keydown = true;
      }

      if(keydown){
          if(!animating){
              animating = true;              
              walkAnim.start(true, 1.0, walkAnim.from, walkAnim.to, false);
          }
      }else{
          animating = false;
          walkAnim.stop();
          idleAnim.start(true, 1.0, idleAnim.from, idleAnim.to, false);

      }

      //trigger non- looping animations from keyboard for testing
      if (keyDownMap["x"] || keyDownMap["X"]) {
          stopMe();
          deathAnim.start(false, 1.0, deathAnim.from, deathAnim.to, false);
      }
      if (keyDownMap["t"] || keyDownMap["T"]) {
          gun_ShootAnim.start(false, 1.0, gun_ShootAnim.from, gun_ShootAnim.to, false);
      }
      if (keyDownMap["y"] || keyDownMap["Y"]) {
          hitRecieveAnim.start(false, 1.0, hitRecieveAnim.from, hitRecieveAnim.to, false);
      }
      if (keyDownMap["o"] || keyDownMap["O"]) {
          idle_GunAnim.start(false, 1.0, idle_GunAnim.from, idle_GunAnim.to, false);
      }
      if (keyDownMap["r"] || keyDownMap["R"]) {
          idle_GunAnim.start(false, 1.0, idle_GunAnim.from, idle_GunAnim.to, false);
          idle_Gun_PointingAnim.start(false, 1.0, idle_Gun_PointingAnim.from, idle_Gun_PointingAnim.to, false);
      }
      if (character.intersectsMesh(sphere)) {
        //console.log("they have collided");
         sphere.position.x -= 3;
              score += 1;
              console.log(score); 
          button1.textBlock.text = "Score: "+ score;
        //sphere.setEnabled(false);
      }

  });
})
  //AUDIO
  //    const music = new BABYLON.Sound("bgmusic", "./assets/audio/arcade-kid.mp3", scene, null, {
  //        autoplay: false
  //   });
}

```
The actionmanage code is the same as the previous example, monitoring key up and down events.

```javascript
function actionManager(scene){
  scene.actionManager = new BABYLON.ActionManager(scene);

  scene.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
          {
          trigger: BABYLON.ActionManager.OnKeyDownTrigger,    
          },
          function(evt) {keyDownMap[evt.sourceEvent.key] = true; }
      )
  );
  scene.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
          {
          trigger: BABYLON.ActionManager.OnKeyUpTrigger
          
          },
          function(evt) {keyDownMap[evt.sourceEvent.key] = false; }
      )
  );
  return scene.actionManager;
}  
```
The gui function adds two buttons.  The first is for display only and its text will be written outside this function so button 1 needs to be returned and passed on.  Button 1 does not respond to pressing.

Button 2 has an onPointerUPObservable which triggers the resetting of the score.

```javascript
function gui(sphere) {
    const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    const button1 = BABYLON.GUI.Button.CreateSimpleButton("btn", "");
    button1.textBlock.text = "Score: " + score;
    button1.width = "150px";
    button1.height = "40px";
    button1.color = "black";
    button1.left = "100px";
    button1.top = "40px";
    button1.background = "orange";
    button1.cornerRadius = 15;
    button1.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    button1.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    advancedTexture.addControl(button1);

    const button2 = BABYLON.GUI.Button.CreateSimpleButton("btn", "Reset");
    button2.width = "150px";
    button2.height = "40px";
    button2.color = "black";
    button2.left = "100px";
    button2.top = "100px";
    button2.background = "green";
    button2.cornerRadius = 15;
    button2.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    button2.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    advancedTexture.addControl(button2);

    button2.onPointerUpObservable.add(function () {
        //any actions we want to happen here
        score = 0;
        button1.textBlock.text = "Score: " + score;
        sphere.position.y += 0.5;
        sphere.position.x = 5;
    });
    return button1;
}
```
The sphere is very basic in this example.

```javascript
function createSphere(scene) {
    const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {}, scene);
    sphere.position.y += 0.5;
    sphere.position.x = 5;
    return sphere;
}
```
In setting up the scene it is important that the sphere is created before the button and then the mesh so that created elements can be passed as parameters.

```javascript
const createScene = () => {
    let that = {};
    let scene = new BABYLON.Scene(engine);
    //scene.debugLayer.show();
    //scene.ambientColor = new BABYLON.Color3(1, 1, 1);

    createGround(scene);
    diffuseBox(scene);
    createLight(scene);
    createArcRotateCamera(scene);
    sphere = createSphere(scene);
    button1 = gui(sphere);
    importMeshA(scene, 0, 0, sphere, button1); // pass what mesh interacts with
    actionManager(scene);

    return scene;
};
```

The createScene function is called from within **Element4.html**

```html
  <div id="canvasElement">
    <canvas id="renderCanvas" style="width:1000px; height:600px; display: block; margin-left: auto; margin-right: auto; margin-top: 50px;"></canvas>
    <script>
      const canvas = document.getElementById("renderCanvas");
      const engine = new BABYLON.Engine(canvas, true);
      const scene = createScene();
      engine.runRenderLoop(function() {
        scene.render();
      });
      window.addEventListener("resize", function() {
        engine.resize();
      });
    </script>
```