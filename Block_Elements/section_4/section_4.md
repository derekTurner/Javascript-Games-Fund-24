# Element 3

Select Element 3 from the Elements dropdown menu.
The character moves on WASD and animations are triggered by X, T, Y, O and R.
This demonstrates the movement and animation of a mesh. 



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

**element3**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Example Scene 3</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://cdn.babylonjs.com/babylon.js"></script>
  <script src="https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js"></script>
  <script src="JS/element3.js"></script>
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

The scene uses a downloaded gltf model 
([spacesuit](../demo/public/assets/models/men/Spacesuit.gltf)) which is generated through blender.  You should be able to use other model assets.

At the top of the file is a global variable array.  This will be used to hold the state of keypresses which are monitored by an action manager.  The values will be read before the character mesh is rendered and an appropriate motion or animation will be actioned.

```javascript
var keyDownMap =[];
```
The functions to create ground and sky are similar to previous examples.

```javascript
function createGround(scene) {
    const groundMaterial = new BABYLON.StandardMaterial("groundMaterial");
    groundMaterial.diffuseTexture = new BABYLON.Texture(
      "assets/textures/wood.jpg"
    );
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

  function createSky(scene) {
    const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 150 }, scene);
    const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
      "assets/textures/skybox/skybox4",
      scene
    );
    skyboxMaterial.reflectionTexture.coordinatesMode =
      BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
  }
```

Details of the lighting and camera are also similar.

```javascript
  function createLight(scene) {
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

The function to import the mesh needs to know the x,y position to place it.

The scene.getAnimationGroupByName is used to load animation ranges into constants.  

The animations available are determined by the model designer, in this case available animations are: Death
Gun_Shoot
HitRecieve
HitRecieve_2
Idle
Idle_Gun
Idle_Gun_Pointing
Idle_Gun_Shoot
Idle_Neutral
Idle_Sword
Interact
Kick_Left
Kick_Right
Punch_Left
Punch_Right
Roll
Run
Run_Back
Run_Left
Run_Right
Run_Shoot
Sword_Slash
Walk
Wave

The [babylon sandbox](https://sandbox.babylonjs.com/) is useful.  If you have a model you can drag it into the sandbox to view and this will present a drop down list of the available animation names.

The variable animating has scope through the whole or the importMeshA function and any nested functions.  This is used so that once an animation is looping it is not repeatedly asked to start on each further keyboard event.

The stopMe function is to prevent the character from moving in the initial stage.  I found without this that the character dies repeatedly in a loop.  The need for this function will vary according to the animations baked into the model.
The  **scene.onBeforeRenderObservable.add(()=> {})** section adds a function which will be run each time the mesh is about to be rendered.  This function will check the state of keypresses and trigger appropriate actions.


```javascript
  function importMeshA(scene, x, y) {
    let item = BABYLON.SceneLoader.ImportMesh("", "assets/models/men/", "Spacesuit.gltf", scene, function(meshes) {
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

    //deathAnim.stop();
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

    });
})}
```
The action manager monitors events and two events are registered to it to respond to a key down and a key up.

On key down, an entry in the array indexed by the key which was pressed is set to true, and on key up this is set back to false.

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
Finally the createScene function calls all the other functions in an appropriate order to create the scene.

```javascript
const createScene = () => {
    let that = {};
    let scene = new BABYLON.Scene(engine);
    //scene.debugLayer.show();
    //scene.ambientColor = new BABYLON.Color3(1, 1, 1);
  
    createGround(scene);
    createSky(scene);
    createLight(scene);
    createArcRotateCamera(scene);
    importMeshA(scene, 0, 0);
    actionManager(scene);
    return scene;
  };
```
This is called from within the html file **element3.html**

```html
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



