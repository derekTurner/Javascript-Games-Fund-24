# Importing and animating a mesh

A mesh can be added to a scene using the BABYLON.SceneLoader.ImportMesh(meshNames, rootUrl, sceneFilename, scene, onSuccess, onProgress, onError, message: , pluginExtension))

* meshesNames is a filter, so, " " loads all meshes 
* rootUrl indicates the folder where the assets are held
* filename is the data file (or data: and strinfified object)
* onSuccess a callback function when import succeeds
* on Progress a callback function with progress event for each file being loaded.
* onError a callback function to handle errors
* pluginExtension extension uysed to determine the plugin
The function returns a scene loader plugin.

The parameters are all optional so in this function only the first five are used.

The imported mesh is of .glb type.

The success function acts on the meshes of the plugin object and the first mesh is modified to position, scale and rotate the object.

In this example the x and y position are passed as arguments.  The rotation around x, y and z axes is indicated by a Vector3 with numbers in radians.

Finally the function returns the plugin with it's orientation set.

```javascript
function importMeshA(scene, x, y) {
    let item = BABYLON.SceneLoader.ImportMesh("", "assets/models/", "low_poly_building.glb", scene, function(meshes) {
        const building = meshes[0];
        building.position.x = x;
        building.position.y = y;
        building.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
        building.rotation = new BABYLON.Vector3(0, 1.5, 0);
    });
    return item
}    
```
To light and view the scene functions to create the standard Hemispheric light and arc rotate camera are added.

```javascript
function createLight(scene) {
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);
    light.intensity = 0.7;
    return light;
}

function createArcRotateCamera(scene) {
    let camAlpha = -Math.PI / 2;
    let camBeta = Math.PI / 2.5;
    let camDist = 15;
    let camTarget = new BABYLON.Vector3(0, 0, 0);
    let camera = new BABYLON.ArcRotateCamera("camera1", camAlpha, camBeta, camDist, camTarget, scene);
    camera.attachControl(true);
    return camera;
}
```

The **createScene1.js** module exports a function which can be called to create an object containing scene elements.

Four independant plugins are returned into variables mesh1 .. mesh4.  The x, y positions place these in a 2 x 2 grid.

The light and camera are added before the object "that" is returned.

```javascript
export default function createStartScene(engine) {
    let that = {};
    let scene = (that.scene = new BABYLON.Scene(engine));
    //scene.debugLayer.show();

    let mesh1 = (that.mesh1 = importMeshA(scene, 2.5,  1.5));// x y pos
    let mesh2 = (that.mesh2 = importMeshA(scene,-2.5,  1.5));// x y pos
    let mesh3 = (that.mesh1 = importMeshA(scene, 2.5, -3.5));// x y pos
    let mesh4 = (that.mesh2 = importMeshA(scene,-2.5, -3.5));// x y pos


    let light = (that.light = createLight(scene));
    let camera = (that.camera = createArcRotateCamera(scene));

    
    return that;
}
```

## multiple scenes

Multiple scenes are provided by having named buttons in **index.html**

```html
<div>
            <button id="s1">1</button>
            <button id="s2">2</button> 
            <button id="s3">3</button>
            <button id="s4">4</button>
            <button id="s5">5</button>
        </div>
```

The html file includes a script link at the end.

```html
<script src="JS/index.js" type="module"></script>
```

The file **index.html** then imports the alternavive scene files.

```javascript
import createScene1 from "./createScene1.js";
import createScene2 from "./createScene2.js";
import createScene3 from "./createScene3.js";
import createScene4 from "./createScene4.js";
import createScene5 from "./createScene5.js";
```

A canvas is added to the html DOM with a name which matches the css file.

```javascript
const CanvasName = "renderCanvas";

let canvas = document.createElement("canvas");
canvas.id = CanvasName;

canvas.classList.add("renderCanvas");
document.body.appendChild(canvas);
```

Two variables are defined as an index counter and an array which will hold the various scenes.

```javascript
var sceneIndex = 0;
var scenes_arr = [];
```

Event listeners are added to each button to identify a click handler named showScene.  All buttons have the same handler.  When the button is clicked an event is passed to the handler which can be interrogated to find the id of the source element.  This can then be used in a switch statement to draw the selected scene from an array.

```javascript
function showScene(evt) {
    console.log(evt.srcElement.id);
    switch (evt.srcElement.id) {
        case "s1":
            scene = scenes_arr[0].scene;
            break;
        case "s2":
            scene = scenes_arr[1].scene;
            break;
        case "s3":
            scene = scenes_arr[2].scene;
            break;
        case "s4":
            scene = scenes_arr[3].scene;
            break;
        case "s5":
            scene = scenes_arr[4].scene;
            break;
    }
}

document.getElementById("s1").addEventListener("click", showScene, { passive: true });
document.getElementById("s2").addEventListener("click", showScene, { passive: true });
document.getElementById("s3").addEventListener("click", showScene, { passive: true });
document.getElementById("s4").addEventListener("click", showScene, { passive: true });
document.getElementById("s5").addEventListener("click", showScene, { passive: true });
```

Once an instance of the game engine has been loaded into a variable named "eng" the individual creatScene functions can be called and the returned scene elements pushed into the scenes array.

```javascript
let eng = new BABYLON.Engine(canvas, true, null, true);
scenes_arr.push(createScene1(eng));
scenes_arr.push(createScene2(eng));
scenes_arr.push(createScene3(eng));
scenes_arr.push(createScene4(eng));
scenes_arr.push(createScene5(eng));
```

The first scene is selected and this is then rendered in the engines render loop.

```javascript
let scene = scenes_arr[0].scene;
eng.runRenderLoop(() => {
    scene.render();
});
```

Button 1 illustrates the loaded meshes statically placed.

<iframe 
    height="460" 
    width="100%" 
    scrolling="no" 
    title="Mesh animation" 
    src="Block_3/section_7/ex_01_import_mesh/index.html" 
    frameborder="no" 
    loading="lazy" 
    allowtransparency="true" 
    allowfullscreen="true">
</iframe>

## Animating a mesh

This example **createScene2** illustrates animation using rotation around the y axis, but position, scaling and rotation could be done with a similar pattern.

Animations are generally added to a mesh after it is loaded so it is preferred to use an asynchronous scene loader.  Otherwise, since code runs fast, the animations may be added before loading is complete and the result is a missed animation.

A framerate has been sef for animation before the importMeshA function.  Rather than returning a mesh this returns a promise.

A promise is an object with three states, pending, fulfilled and rejected.  When the promise is fulfilled the associated "then" functions will run on the value of the promise, which in this example is a plugin.

The positioning worked in the previous example without an asynchronous call, but it is needed in this example because the rotation animation is going to be added later in the code.


```javascript
const frameRate = 30;

function importMeshA(scene, x, y) {
    const item = BABYLON.SceneLoader.ImportMeshAsync("", "assets/models/", "low_poly_building.glb", scene);
    item.then(
        function(value) { //console.log(value) ;
            const mesh = value.meshes[0];
            mesh.position.x = x;
            mesh.position.y = y;
            mesh.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
            mesh.rotation = new BABYLON.Vector3(0, 1.5, 0);
        },
        function(error) { /* code if some error */ }
      );
      return item;
} 
```

A function is provide which will create a looping rotation measured in radians around the y axis.  Key frames are added and set in the animation object.

This is similar to previous examples.

```javascript
function createYRotate(frameRate) {
    const yRotation = new BABYLON.Animation(
        "yRotation",
        "rotation.y",
        frameRate,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );

    const keyFramesRY = [];
    keyFramesRY.push({ frame: 0, value: 0 });
    keyFramesRY.push({ frame: frameRate, value: Math.PI });
    keyFramesRY.push({ frame: 2 * frameRate, value: Math.PI * 2 });

    yRotation.setKeys(keyFramesRY);

    return yRotation;
}
```

The light and camera functions are also added as before.

The createStartScene function imports promises into the variables mesh1 .. mesh4 asynchronously.  Note that to access the actual meshes the value of the promise must be accessed.

So that this can be done for each of the meshes with efficient coding a function addYRotate is provided which will take a promise as an argument and add a rotation to it.

A nominal error handler is also made available in case the mesh fails to load.

```javascript
    const addYRotate = function(value) { //console.log(value) ;
        const mesh = value.meshes[0];
        console.log(mesh);
        mesh.animations.push(createYRotate(frameRate));
        that.scene.beginAnimation(mesh, 0, 2 * frameRate, true);
    }

    const errorHandler = function(error) { /* code if some error */ }
```

Now for mesh1 only the success and error functiions are added to the .then function of the promise.  These will not be applied until the loading is finished and the promise is either fulfilled or rejected.

Note that the then function can be called on a promise at several different points within the code.

```javascript
    mesh1.then( addYRotate, errorHandler);
    
    let light = (that.light = createLight(scene));
    let camera = (that.camera = createArcRotateCamera(scene));
    
    
    return that;
```

The rotation of a single mesh can be seen on button 2 of the canvas.

## mesh instances

To show that the mesh instances are all independent objects rotations have been added to each in turn and you can see the effect under buttons 3,4 and 5.

Adding extra rotation animations is simple because the functions have been loaded into constants.

```javascript
    mesh1.then( addYRotate, errorHandler);
    mesh2.then( addYRotate, errorHandler);
    mesh3.then( addYRotate, errorHandler);
    mesh4.then( addYRotate, errorHandler);
```    

You could experiment with a variety of different animations and confitm that position and scaling can be animated.

## full listings

The full listing of the index.html, index.js and createScene5.js are included here.  You might improve these by further refactoring. 

**index.html**
```html
<!DOCTYPE html>
<html>
    <head>
        <title>Import meshes</title>
        <!--External CSS file-->
        <link rel="stylesheet" href="CSS/main.css" />
        <!--BabylonJS Libraries-->
        <!-- <script src="https://cdn.babylonjs.com/babylon.js"></script> 
        <script src="https://cdn.babylonjs.com/materialsLibrary/babylonjs.materials.min.js"></script>
        <script src="https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js"></script> -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.6.2/dat.gui.min.js"></script>
        <script src="https://assets.babylonjs.com/generated/Assets.js"></script>
        <script src="https://preview.babylonjs.com/ammo.js"></script>
        <script src="https://preview.babylonjs.com/cannon.js"></script>
        <script src="https://preview.babylonjs.com/Oimo.js"></script>
        <script src="https://preview.babylonjs.com/earcut.min.js"></script>
        <script src="https://preview.babylonjs.com/babylon.js"></script>
        <script src="https://preview.babylonjs.com/materialsLibrary/babylonjs.materials.min.js"></script>
        <script src="https://preview.babylonjs.com/proceduralTexturesLibrary/babylonjs.proceduralTextures.min.js"></script>
        <script src="https://preview.babylonjs.com/postProcessesLibrary/babylonjs.postProcess.min.js"></script>
        <script src="https://preview.babylonjs.com/loaders/babylonjs.loaders.js"></script>
        <script src="https://preview.babylonjs.com/serializers/babylonjs.serializers.min.js"></script>
        <script src="https://preview.babylonjs.com/gui/babylon.gui.min.js"></script>
        <script src="https://preview.babylonjs.com/inspector/babylon.inspector.bundle.js"></script>
        <!--External Files-->
        <script type="text/javascript" src="JS/index.js" type="module"></script>
    </head>

    <body>
        <div>
            <button id="s1">1</button>
            <button id="s2">2</button> 
            <button id="s3">3</button>
            <button id="s4">4</button>
            <button id="s5">5</button>
        </div>
    </body>
</html>

<script src="JS/index.js" type="module"></script>
```

**index.js**
```javascript
import createScene1 from "./createScene1.js";
import createScene2 from "./createScene2.js";
import createScene3 from "./createScene3.js";
import createScene4 from "./createScene4.js";
import createScene5 from "./createScene5.js";


const CanvasName = "renderCanvas";

let canvas = document.createElement("canvas");
canvas.id = CanvasName;

canvas.classList.add("renderCanvas");
document.body.appendChild(canvas);

var sceneIndex = 0;
var scenes_arr = [];

console.log("ex_01_importmesh");

// Simple HTML gui

function showScene(evt) {
    console.log(evt.srcElement.id);
    switch (evt.srcElement.id) {
        case "s1":
            scene = scenes_arr[0].scene;
            break;
        case "s2":
            scene = scenes_arr[1].scene;
            break;
        case "s3":
            scene = scenes_arr[2].scene;
            break;
        case "s4":
            scene = scenes_arr[3].scene;
            break;
        case "s5":
            scene = scenes_arr[4].scene;
            break;
    }
}

document.getElementById("s1").addEventListener("click", showScene, { passive: true });
document.getElementById("s2").addEventListener("click", showScene, { passive: true });
document.getElementById("s3").addEventListener("click", showScene, { passive: true });
document.getElementById("s4").addEventListener("click", showScene, { passive: true });
document.getElementById("s5").addEventListener("click", showScene, { passive: true });


// Start engine and render
let eng = new BABYLON.Engine(canvas, true, null, true);
scenes_arr.push(createScene1(eng));
scenes_arr.push(createScene2(eng));
scenes_arr.push(createScene3(eng));
scenes_arr.push(createScene4(eng));
scenes_arr.push(createScene5(eng));


let scene = scenes_arr[0].scene;
eng.runRenderLoop(() => {
    scene.render();
});
```

**createScene5.js**
```javascript
const frameRate = 30;

function importMeshA(scene, x, y) {
    const item = BABYLON.SceneLoader.ImportMeshAsync("", "assets/models/", "low_poly_building.glb", scene);
    item.then(
        function(value) { //console.log(value) ;
            const mesh = value.meshes[0];
            mesh.position.x = x;
            mesh.position.y = y;
            mesh.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
            mesh.rotation = new BABYLON.Vector3(0, 1.5, 0);
        },
        function(error) { /* code if some error */ }
      );
      return item;
}    

    
function createYRotate(frameRate) {
    const yRotation = new BABYLON.Animation(
        "yRotation",
        "rotation.y",
        frameRate,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );

    const keyFramesRY = [];
    keyFramesRY.push({ frame: 0, value: 0 });
    keyFramesRY.push({ frame: frameRate, value: Math.PI });
    keyFramesRY.push({ frame: 2 * frameRate, value: Math.PI * 2 });

    yRotation.setKeys(keyFramesRY);

    return yRotation;
}

function createLight(scene) {
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);
    light.intensity = 0.7;
    return light;
}

function createArcRotateCamera(scene) {
    let camAlpha = -Math.PI / 2;
    let camBeta = Math.PI / 2.5;
    let camDist = 15;
    let camTarget = new BABYLON.Vector3(0, 0, 0);
    let camera = new BABYLON.ArcRotateCamera("camera1", camAlpha, camBeta, camDist, camTarget, scene);
    camera.attachControl(true);
    return camera;
}

export default function createStartScene(engine) {
    let that = {};
    let scene = (that.scene = new BABYLON.Scene(engine));
    //scene.debugLayer.show();

    let mesh1 = (that.mesh1 = importMeshA(scene,-2.5,  1.5));// x y pos
    let mesh2 = (that.mesh2 = importMeshA(scene, 2.5,  1.5));// x y pos
    let mesh3 = (that.mesh1 = importMeshA(scene,-2.5, -3.5));// x y pos
    let mesh4 = (that.mesh2 = importMeshA(scene, 2.5, -3.5));// x y pos

    const addYRotate = function(value) { //console.log(value) ;
        const mesh = value.meshes[0];
        console.log(mesh);
        mesh.animations.push(createYRotate(frameRate));
        that.scene.beginAnimation(mesh, 0, 2 * frameRate, true);
    }

    const errorHandler = function(error) { /* code if some error */ }
    
    mesh1.then( addYRotate, errorHandler);
    mesh2.then( addYRotate, errorHandler);
    mesh3.then( addYRotate, errorHandler);
    mesh4.then( addYRotate, errorHandler);
    
    let light = (that.light = createLight(scene));
    let camera = (that.camera = createArcRotateCamera(scene));
    
    
    return that;
}
```
