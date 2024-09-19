# Multiple scene gui selector

In previous sections, html buttons sitting outside the canvas have been used to select scenes in the canvas.  While tis works, it is not a convenient as having gui elements on the canvas which control the scenes.

This example allows selection between three scenes using gui buttons, but extension to more scenes is straightforward.

The three scenes presented are contained in **createScene1.js, createScene2.js and createScene3.js** These show three aspects of the motion control of a mesh.

These scenes have already been described in a previous section and mo modification of the scene is required to use them in this multiscene display.

* Scene 1: mesh is moved by WASM
* Scene 2: mesh is rotated by mouse click and stopped by mouse long click.
* Scene 3: waliing animation is enabled.

The canvas will be hosted in the **index.html** page.  The page must include a link to the babylon gui but otherwise there is nothing new here.

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Motion with animations</title>
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
    </head>

    <body>
        <div></div>
    </body>
</html>

<script type="module" src="JS/index.js"></script>

```

The **index.html** file is linked to **index.js** which is an aggregator page to draw the scenes and gui together and render them.

This imports the scene related elements from other modules.
Note that **guiscene.js** contains a single default export of "guiScene, and that can be imported simply.  However createScenes.js has several export statements on various elements so the import line must list each of these required within {} braces.

The setSceneIndex(0) function call chooses the initial screen to display.

The gui scene is then returned by guiScene(engine) and both the main scene and the gui scene are included in the render loop with the gui scene appearing over the top of the main scene.

```javascript
import guiScene  from "./guiScene.js";
import {scenes, scene, engine, setSceneIndex}  from "./createScenes.js";

setSceneIndex(0);

let gui = guiScene(engine);
gui.autoClear = false;
engine.runRenderLoop(() => {
    scene.render();
    gui.render();
});
```

The **createScenes.js** file imports the selected scenes and establishes the canvas and engine.

The imported createScene functions are used to populate an array of scenes and to set the initial scene.

The `setSceneIndex()` function is exported to provide a way for code in other modules to alter the private variables within this module and thereby alter the scene which is being rendered.

```javascript
import createScene1  from "./createScene1.js";
import createScene2  from "./createScene2.js";
import createScene3  from "./createScene3.js";

const CanvasName = "renderCanvas";

let canvas = document.createElement("canvas");
canvas.id = CanvasName;

canvas.classList.add("renderCanvas");
document.body.appendChild(canvas);

export let scene
export let scenes = [];

export let engine = new BABYLON.Engine(canvas, true, null, true);

scenes[0] = createScene1(engine);
scenes[1] = createScene2(engine);
scenes[2] = createScene3(engine);
scene = scenes[0].scene;

export function setSceneIndex(i){
    scene = scenes[i].scene;
}
```

The gui scene itself is set up in **guiScene.js**.  This is relatively simple comprising only three buttons.

The code to create a button has been taken into a `createSceneButton()` function to cut down on code repetition.  This uses the `BABYLON.GUI.Button.CreateSimpleButton()` function to create a button and then the `onPointerUpObservable` property has a function added to it which will use the imported `setSceneIndex()` function to update the scene.

In order for the gui to cover the whole screen a `BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI()` function is used and the resulting advanced texture is passed as a parameter to the `createSceneButton()` function so that buttons will appear on this texture.

Because the gui scene is quite separate to the main scene it needs its own camera to make the buttons visible.  This is a static camera so does not need controls added.

As the gui scene is made up buttons are added with labels 1,2,3, but the call to the scenes array is adjested to use index 0,1,2.

Fhe full listing of **guiScene.js** is:

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

    var button1 = createSceneButton("but1", 1,"-100px", "120px", advancedTexture);
    var button2 = createSceneButton("but2", 2,"000px", "120px", advancedTexture);
    var button3 = createSceneButton("but3", 3,"100px", "120px", advancedTexture);
     
    //guiScene.debugLayer.show();
    return guiScene;
}    
```

This will appear on the browser as:

The result is that the character can be moved by the usual keys.  Try pressing "w" and "a" for diagonal motion.

<iframe 
    height="350" 
    width="100%" 
    scrolling="no" 
    title="Gui scenes selector" 
    src="Block_3/section_10/ex_01_gui_scenes/index.html" 
    frameborder="no" 
    loading="lazy" 
    allowtransparency="true" 
    allowfullscreen="true">
</iframe>

