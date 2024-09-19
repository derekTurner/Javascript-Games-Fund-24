## Swapping Scenes.

To work through examples and to follow tutorials in stages it will be useful to set up a range of scenes which can be switched in response to a button click.  

At a later stage it will be useful to change scenes in response to the state of a game or application.

Working locally (not on Docker) a simple way to switch from one scene to another is presented.  This uses HTML buttons which are outside the canvas.  In a subsequent section gui elements will be introduced into the canvas which can have the same effect.

I start with **index.html** which holds the code to reference the Babylon cdn libries.  Ther may be more references than are needed, but these can be shaken down later.

```html
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

        <title>Babylon.js sample code</title>

        <!-- Babylon.js -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.6.2/dat.gui.min.js"></script>
        <script src="https://assets.babylonjs.com/generated/Assets.js"></script>
        <script src="https://cdn.babylonjs.com/ammo.js"></script>
        <script src="https://cdn.babylonjs.com/cannon.js"></script>
        <script src="https://cdn.babylonjs.com/Oimo.js"></script>
        <script src="https://cdn.babylonjs.com/earcut.min.js"></script>
        <script src="https://cdn.babylonjs.com/babylon.js"></script>
        <script src="https://cdn.babylonjs.com/materialsLibrary/babylonjs.materials.min.js"></script>
        <script src="https://cdn.babylonjs.com/proceduralTexturesLibrary/babylonjs.proceduralTextures.min.js"></script>
        <script src="https://cdn.babylonjs.com/postProcessesLibrary/babylonjs.postProcess.min.js"></script>
        <script src="https://cdn.babylonjs.com/loaders/babylonjs.loaders.js"></script>
        <script src="https://cdn.babylonjs.com/serializers/babylonjs.serializers.min.js"></script>
        <script src="https://cdn.babylonjs.com/gui/babylon.gui.min.js"></script>
        <script src="https://cdn.babylonjs.com/inspector/babylon.inspector.bundle.js"></script>

        <style>
            html,
            body {
                overflow: hidden;
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
            }

            #index-canvas {
                width: 100%;
                height: 100%;
                touch-action: none;
            }
        </style>
    </head>
```
The style is added as usual, but this could also be taken into an external file.

In the body two buttons are defined outside the canvas with left/right identifiers.  These do nothing yet but will be used to switch scenes.

```html
    <body>
        <button id="left">Left</button>
        <button id="right">Right</button>
    </body>
```
Finally the script link to js/index.js is left till after the `<html>` tag to ensure that the DOM is loaded before it is written to by javascript.

```html

</html>

<script src="js/index.js" type="module"></script>
```

Two very similar scene files, createScene1.js and createScene2.js  will be used, simply reversing the vertical ordering of the spere and the cube.

**createScene1.js** is unchanged as:
```javascript


function createBox(scene){
    let box = BABYLON.MeshBuilder.CreateBox("box", scene);
    box.position.y = 1;
    return box;
}
    
function createLight(scene){
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0),scene);
    light.intensity = 0.7;
    return light;
}
   
function createSphere(scene){
    let sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);
    sphere.position.y = 3;
    return sphere;
}
   
function createGround(scene){
    let ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
    return ground;
}
  
function createArcRotateCamera(scene){
    let camAlpha = -Math.PI / 2,
    camBeta  =  Math.PI / 2.5,
    camDist  =  10,
    camTarget = new BABYLON.Vector3(0, 0, 0); 
    let camera = new BABYLON.ArcRotateCamera("camera1", camAlpha, camBeta, camDist, camTarget, scene);
    camera.attachControl(true);
    return camera;
}

export default function createStartScene(engine) {
    let that = {};
    let scene = that.scene = new BABYLON.Scene(engine);
    //scene.debugLayer.show();

    let box = that.starbox = createBox(scene);
    let light = that.light = createLight(scene);
    let sphere = that.sphere = createSphere(scene);
    let ground = that.ground = createGround(scene);
    let camera = that.camera = createArcRotateCamera(scene);

    return that;
}
```

By contrast in **createScene2.js** the shpere and the box are the other way round on viertical position.

```javascript
function createBox(scene){
    let box = BABYLON.MeshBuilder.CreateBox("box", scene);
    box.position.y = 3;
    return box;
}
   
function createSphere(scene){
    let sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);
    sphere.position.y = 1;
    return sphere;
}
```

The scene switching is controlled from **index.js**.

The createScene1&2 modules are imported into the index html

```javascript
import createScene1 from "./createScene1.js";
import createScene2 from "./createScene2.js";

const CanvasName = "index-canvas";

let canvas = document.createElement("canvas");
canvas.id = CanvasName;

canvas.classList.add("renderCanvas");
document.body.appendChild(canvas);

var sceneIndex = 0;
var scenes_arr = [];

console.log("ex_01");
```
Next functions loadLeft() and loadRight() are added to **index.js** which will allow a scene display to be called when a button is pressed.

```javascript
// Simple HTML gui
function loadLeft(){

    scene = scenes_arr[0].scene;
    console.log("Left");
  }
  
  function loadRight(){
      
    scene = scenes_arr[1].scene;
      console.log("Right");
  }
```

  Event listeners are added to the two buttons which will call load left and load right() functions on button click over an object.

```javascript
  document.getElementById("left").addEventListener('click', loadLeft, {passive: true});
  document.getElementById("right").addEventListener('click', loadRight, {passive: true});
```
The engine is instantiated so that it is ready to be passed to the createScene functions.  The objects returned from these functions ar pushed into an array of scene objects.

The firs scene is displayed by the render loop.

```javascript

// Start engine and render
let eng = new BABYLON.Engine(canvas, true, null, true);
scenes_arr.push(createScene1(eng));
scenes_arr.push(createScene2(eng));
let scene = scenes_arr[0].scene;
eng.runRenderLoop(() => {
    scene.render();
});
```
The result is swapable scenes.

<iframe 
    height="600" 
    width="100%" 
    scrolling="no" 
    title="Swapable Scenes" 
    src="Block_3/section_4/ex_01/index.html" 
    frameborder="no" 
    loading="lazy" 
    allowtransparency="true" 
    allowfullscreen="true">
</iframe>

