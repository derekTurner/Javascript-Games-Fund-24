# Simple Gui

In this section a simple GUI is created is created which could be a starter for element4.

## Starting structure

The **index.html** file is created with only the title modified asthe following code:

**index.html**
```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Gui Basic Example</title>
    </head>
    <body> </body>
</html>
<script type="module" src="./src/index.ts"></script>
```

This calls **src/index.ts** which is the entry point of the application and this must now be modified to add the code to create a gui scene over the standard scene.

CreateGuiScene is imported from **createGUI.ts** and the function is called with the startScene as a parameter.

**index.ts**
```javascript
import { Engine} from "@babylonjs/core";
import createStartScene from "./createStartScene";
import createRunScene from "./createRunScene";
import createGUIScene from "./createGUI";
import "./main.css";
import { SceneData } from "./interfaces";

const CanvasName = "renderCanvas";

let canvas = document.createElement("canvas");
canvas.id = CanvasName;

canvas.classList.add("background-canvas");
document.body.appendChild(canvas);

let eng = new Engine(canvas, true, {}, true);
let startScene:SceneData = createStartScene(eng);
createGUIScene(startScene);
createRunScene(startScene);

eng.runRenderLoop(() => {
  startScene.scene.render();
});
```

A fild named **createGUIScene.ts** is created in **src/createGUI.ts** and the function is created as follows:

The required resources ar imported and these include a Button gui element and an AdvancedDynamicTexture.

**createGUI.ts (extract)**
```javascript
import { Scene, Sound } from "@babylonjs/core";
import { SceneData } from "./interfaces";
import { Button, AdvancedDynamicTexture } from "@babylonjs/gui/2D";
```

A function "createSceneButton()" is created which will contain the button design.

**createGUI.ts (extract)**
```javascript
function createSceneButton(
  scene: Scene,
  name: string,
  index: string,
  x: string,
  y: string,
  advtex: { addControl: (arg0: Button) => void }
) {
  var button: Button = Button.CreateSimpleButton(name, index);
  button.left = x;
  button.top = y;
  button.width = "180px";
  button.height = "35px";
  button.color = "white";
  button.cornerRadius = 20;
  button.background = "green";
  const buttonClick: Sound = new Sound(
    "MenuClickSFX",
    "./assets/audio/menu-click.wav",
    scene,
    null,
    {
      loop: false,
      autoplay: false,
    }
  );
```

To add interactivity to the button an onPointerUpObserver is added.  This will simply activate an alert box when the button is clicked.

**createGUI.ts (extract)**
```javascript
  button.onPointerUpObservable.add(function () {
    buttonClick.play();
    alert("you did it!");
  });
 ```

 The text to add to the button was passed as a parameter and this is added to the button.

 **createGUI.ts (extract)**
```javascript
   advtex.addControl(button);
  return button;
}
```
The module default function is createGUIscene().  This creates an advanced textture with the text for display on the button and then calls the createSceneButton() function with an appropriate parameter list.

**createGUI.ts (extract)**
```javascript
export default function createGUIScene(runScene: SceneData) {
  //GUI elements
  let advancedTexture: AdvancedDynamicTexture =
    AdvancedDynamicTexture.CreateFullscreenUI("myUI", true);
  let button1: Button = createSceneButton(
    runScene.scene,
    "but1",
    "Click Here",
    "0px",
    "120px",
    advancedTexture
  );
  
 

  runScene.scene.onAfterRenderObservable.add(() => {});
}
```

The complete list of the **createGUI.ts** file is as follows:
**createGUI.ts (full listing)**
```javascript
import { Scene, Sound } from "@babylonjs/core";
import { SceneData } from "./interfaces";
import { Button, AdvancedDynamicTexture } from "@babylonjs/gui/2D";

function createSceneButton(
  scene: Scene,
  name: string,
  index: string,
  x: string,
  y: string,
  advtex: { addControl: (arg0: Button) => void }
) {
  var button: Button = Button.CreateSimpleButton(name, index);
  button.left = x;
  button.top = y;
  button.width = "180px";
  button.height = "35px";
  button.color = "white";
  button.cornerRadius = 20;
  button.background = "green";
  const buttonClick: Sound = new Sound(
    "MenuClickSFX",
    "./assets/audio/menu-click.wav",
    scene,
    null,
    {
      loop: false,
      autoplay: false,
    }
  );
  button.onPointerUpObservable.add(function () {
    buttonClick.play();
    alert("you did it!");
  });
  advtex.addControl(button);
  return button;
}

export default function createGUIScene(runScene: SceneData) {
  //GUI elements
  let advancedTexture: AdvancedDynamicTexture =
    AdvancedDynamicTexture.CreateFullscreenUI("myUI", true);
  let button1: Button = createSceneButton(
    runScene.scene,
    "but1",
    "Click Here",
    "0px",
    "120px",
    advancedTexture
  );
  
  runScene.scene.onAfterRenderObservable.add(() => {});
}
```

To create a scene to sit behind the GUI th usual createStartScene() file is used.  In this case just has a background with a ground plane and basic ligting.  This can be developed as  required.

**createStartScene.ts (full listing)**
```javascript
import { SceneData } from "./interfaces";

import {
  Scene,
  ArcRotateCamera,
  Vector3,
  MeshBuilder,
  Mesh,
  StandardMaterial,
  HemisphericLight,
  Color3,
  Engine,
  Texture,
  CubeTexture,
  Sound,
  GroundMesh
} from "@babylonjs/core";





function createGround(scene: Scene) {
  const groundMaterial:StandardMaterial = new StandardMaterial("groundMaterial");
  groundMaterial.diffuseTexture = new Texture("./src/assets/textures/wood.jpg");
  groundMaterial.diffuseTexture.hasAlpha = true;
  groundMaterial.backFaceCulling = false;
  let ground: GroundMesh = MeshBuilder.CreateGround(
    "ground",
    { width: 15, height: 15, subdivisions:4 },
    scene
  );

  ground.material = groundMaterial;
  return ground;
}

function createSky(scene: Scene) {
  const skybox = MeshBuilder.CreateBox("skyBox", { size: 150 }, scene);
  const skyboxMaterial = new StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new CubeTexture(
    "./src/assets/textures/skybox/skybox4",
    scene
  );
  skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
  skyboxMaterial.specularColor = new Color3(0, 0, 0);
  skybox.material = skyboxMaterial;
  return skybox;
}

function createHemisphericLight(scene: Scene) {
  const light = new HemisphericLight(
    "light",
    new Vector3(2, 1, 0), // move x pos to direct shadows
    scene
  );
  light.intensity = 0.7;
  light.diffuse = new Color3(1, 1, 1);
  light.specular = new Color3(1, 0.8, 0.8);
  light.groundColor = new Color3(0, 0.2, 0.7);
  return light;
}

function createArcRotateCamera(scene: Scene) {
  let camAlpha = -Math.PI / 2,
    camBeta = Math.PI / 2.5,
    camDist = 15,
    camTarget = new Vector3(0, 0, 0);
  let camera = new ArcRotateCamera(
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

export default function createStartScene(engine: Engine) {
  let scene = new Scene(engine);
  let ground = createGround(scene);
  let sky = createSky(scene);
  let lightHemispheric = createHemisphericLight(scene);
  let camera = createArcRotateCamera(scene);
  
 
  let that: SceneData = {
    scene,
    ground,
    sky,
    lightHemispheric,
    camera,
  };
  return that;
}
```

To allow access from other sections of the code to the button the interfaces.d.ts file is updated to include the GUI layer in a separate interface as follows:

**interfaces.d.ts (full lisating)**
```javascript
import {
  Scene,
  Mesh,
  HemisphericLight,
  Camera,
  GroundMesh,
} from "@babylonjs/core";

import {Button }  from "@babylonjs/gui/2D";

export interface SceneData {
  scene: Scene;
  ground:GroundMesh;
  sky: Mesh;
  lightHemispheric: HemisphericLight;
  camera: Camera;
}

export interface GUIData {
  button1:Button;
}
```

The code for createRunScene() is not changed and is as follows:
**createRunScene.ts (full listing)**
```javascript
import {} from "@babylonjs/core";

import { SceneData } from "./interfaces";
import "@babylonjs/loaders";

export default function createRunScene(runScene: SceneData) {
  runScene.scene.onAfterRenderObservable.add(() => {});
}
```

