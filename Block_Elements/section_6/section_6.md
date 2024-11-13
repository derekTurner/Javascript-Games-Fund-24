# Element 5

Select Element 5 from the Elements dropdown menu.
This shows the four scenes already developed being switched by gui buttons.

You could add a 5th scene which shows a combination of the elements presented so far or reflects further reading.

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

The scene sits on the web page element5.html witin a div with id = canvasElement.

**element5.html**
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Example Scene 5</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.babylonjs.com/babylon.js"></script>
    <script src="https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js"></script>
    <script src="https://cdn.babylonjs.com/gui/babylon.gui.js"></script>
  </head>
  <body>
    <div class="container-fluid p-5 bg-primary text-white text-center">
      <h1>JavaScript Games: Programming Fundamentals</h1>
      <p>Example highlighting the layout of Elements!</p>
    </div>

    <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Element 1</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapsibleNavbar"
        >
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
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                >Elements</a
              >
              <ul class="dropdown-menu">
                <li>
                  <a class="dropdown-item" href="element1.html">Element 1</a>
                </li>
                <li>
                  <a class="dropdown-item" href="element2.html">Element 2</a>
                </li>
                <li>
                  <a class="dropdown-item" href="element3.html">Element 3</a>
                </li>
                <li>
                  <a class="dropdown-item" href="element4.html">Element 4</a>
                </li>
                <li>
                  <a class="dropdown-item" href="element5.html">Element 5</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div id="canvasElement">
      <canvas id="renderCanvas" style="width:1000px; height:600px; display: block; margin-left: auto; margin-right: auto; margin-top: 50px;"></canvas>
    </div>
  </body>
</html>
<script type="module" src="JS/index.js"></script>

```

The scene switching depends on the separation of roles into a number of javascript files.

Index.js runs the selected scene, Create scenes imports each of the scenes from several javascript module files. 

The element1 - element 4 javascript files are copied to createScene1.js - createScene4.js and then modified to create files using the javascript module model.

In previous scene switching examples in this site I have injected the canvas into the web page using DOM manipulation.  Whilst this works, it results in Bootstrap creating a bounding box of width 300.  So I have modified (simplified) index.js.  Don't use a previous version in the bootstrap context.

There is only one guiScene in guiScene.js so this is imported without any brackets and will be exported from that file as default.

There are several items read from createScenes.js so these will be listed in {} and exported individually from createScenes.js

**index.js**
```javascript
import guiScene  from "./guiScene.js";
import {scene, engine, setSceneIndex}  from "./createScenes.js";

setSceneIndex(0);

let gui = guiScene(engine);
gui.autoClear = false;
engine.runRenderLoop(() => {
    scene.render();
    gui.render();
});
```
The gui in guiScene.js has 4 buttons so a createSceneButton function is added which can be called 4 times.  This includes the onPointerUpObservable which will allow the scene index to be changed by calling the function setSceneIndex which is imported from createScenes.js.

**guiScene.js**
```javascript
import {setSceneIndex}        from "./createScenes.js";

function createSceneButton(name, index, x,y, advtex){
    var button = BABYLON.GUI.Button.CreateSimpleButton(name, index);
        button.left = x;
        button.top  =  y;
        button.width = "80px"
        button.height = "30px";
        button.color = "white";
        button.cornerRadius = 20;
        button.background = "green";
        button.onPointerUpObservable.add(function() {
            setSceneIndex(index - 1);
        });
        advtex.addControl(button); 
        return button;
}

export default function guiScene(engine) {
    var guiScene = new BABYLON.Scene(engine);

    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 100, BABYLON.Vector3.Zero(), guiScene);

    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("myUI",true);
    
    var button1 = createSceneButton("but1", 1,"-150px", "120px", advancedTexture);
    var button2 = createSceneButton("but2", 2,"-50px", "120px", advancedTexture);
    var button3 = createSceneButton("but3", 3,"50px", "120px", advancedTexture);
    var button3 = createSceneButton("but4", 4,"150px", "120px", advancedTexture);
    //guiScene.debugLayer.show();
    return guiScene;
}    
```
The individual scenes are imported by createScenes and loaded into a scenes array.

**createScenes.js**
```javascript
import createScene1  from "./createScene1.js";
import createScene2  from "./createScene2.js";
import createScene3  from "./createScene3.js";
import createScene4  from "./createScene4.js";

const canvas = document.getElementById("renderCanvas");

export let scene;

export let engine = new BABYLON.Engine(canvas, true, null, true);

let scenes = [];

scenes[0] = createScene1(engine);
scenes[1] = createScene2(engine);
scenes[2] = createScene3(engine);
scenes[3] = createScene4(engine);
scene = scenes[0].scene;

export function setSceneIndex(i){
    scene = scenes[i].scene;
}
```

Each of the createScene1.js to createScene4.js files will need to be modified at the final function.  This will need to be renamed to createStartScene(engine).  The first few lines start the scene.  At the end the variable ```that``` is reterned rather than ```scene```.

For example, the end of element1.js

**element1.js**
```javascript
const createScene = () => {
  let that = {};
  let scene = new BABYLON.Scene(engine);
  //scene.debugLayer.show();
  scene.ambientColor = new BABYLON.Color3(1, 1, 1);

  createGround(scene);
  createSphere(scene);
  createBox(scene);
  createCylinder(scene);
  createCone(scene);
  createTriangle(scene);
  createCapsule(scene);
  createTorus(scene);
  createPlane(scene);
  createTube(scene);
  createExtrusion(scene);
  createOctahedron(scene);
  createPlane2(scene);
  createLight(scene);
  createArcRotateCamera(scene);
  return scene;
};
```
Will be modified in this way...

**createScene1.js**
```javascript
  export default function createStartScene(engine) {
    let that = {};
    let scene = (that.scene = new BABYLON.Scene(engine));
    //scene.debugLayer.show();
    scene.ambientColor = new BABYLON.Color3(1, 1, 1);
  
    createGround(scene);
    createSphere(scene);
    createBox(scene);
    createCylinder(scene);
    createCone(scene);
    createTriangle(scene);
    createCapsule(scene);
    createTorus(scene);
    createPlane(scene);
    createTube(scene);
    createExtrusion(scene);
    createOctahedron(scene);
    createPlane2(scene);
    createLight(scene);
    createArcRotateCamera(scene);
    
    return that;
  };
```
Other files follow a similar pattern

The canvas element is listed in element5.html and the call to index.js is at the bottom below the body.


**element5.html**
```html
    <div id="canvasElement">
      <canvas id="renderCanvas" style="width:1000px; height:600px; display: block; margin-left: auto; margin-right: auto; margin-top: 50px;"></canvas>
    </div>
  </body>
</html>
<script type="module" src="JS/index.js"></script>
```


