# Colliding a mesh with physics

In this section physics is added to the scene.  The mesh is moved by the player and collides with boxes in the environment.  

I have developed this code in a folder called "collision03"  the starting point is a copy of the code for motion03.

# Using Havok

BabylonJS offers a range of physics engines but the primary one is [havok](https://www.havok.com/havok-physics/).  The instructions to use this in the context of code are available online at the [babylonjs havok](https://doc.babylonjs.com/features/featuresDeepDive/physics/usingPhysicsEngine)documentation.

There are two locations for node modules in the file structure.  The first is the folder near the root and in this you can find havok inside @babylonjs.

When a project is run from the babylonproj directory the compiler expects to find the node module in the local node modules folder, but havok is not there.

The solution is to add a vite.config.ts file to the babylonproj directory which enables vite to locate the havok modules in the node modules of the parent directory.

**vite.config,ts**
```javascript
// vite.config.js
export default {
    // config options
    server: {
        fs: {
          // Allow serving files outside of the root
          allow: [
            "../.."
          ]
        }
      },
    optimizeDeps: { exclude: ["@babylonjs/havok"] }
}
 

// https://forum.babylonjs.com/t/importing-and-implementing-havok-in-vite-react-ts-project-fails/48441/4
```

This will allow files referencig havok to be developed and built.

## Creating a scene

The full listing of **createScene3.js** includes the creation of two boxes and is now:

```javascript
import { SceneData } from "./interfaces ";

import {
  Scene,
  ArcRotateCamera,
  Vector3,
  MeshBuilder,
  StandardMaterial,
  HemisphericLight,
  Color3,
  Engine,
  Texture,
  SceneLoader,
  AbstractMesh,
  ISceneLoaderAsyncResult,
  Sound,
  AnimationPropertiesOverride
} from "@babylonjs/core";

function backgroundMusic(scene: Scene): Sound{
  let music = new Sound("music", "./assets/audio/arcade-kid.mp3", scene,  null ,
   {
      loop: true,
      autoplay: true
  });

  Engine.audioEngine!.useCustomUnlockedButton = true;

  // Unlock audio on first user interaction.
  window.addEventListener('click', () => {
    if(!Engine.audioEngine!.unlocked){
        Engine.audioEngine!.unlock();
    }
}, { once: true });
  return music;
}

function createGround(scene: Scene) {
  const groundMaterial = new StandardMaterial("groundMaterial");
  const groundTexture = new Texture("./assets/textures/wood.jpg");
  groundTexture.uScale  = 4.0; //Repeat 5 times on the Vertical Axes
  groundTexture.vScale  = 4.0; //Repeat 5 times on the Horizontal Axes
  groundMaterial.diffuseTexture = groundTexture;
 // groundMaterial.diffuseTexture = new Texture("./assets/textures/wood.jpg");
  groundMaterial.diffuseTexture.hasAlpha = true;

  groundMaterial.backFaceCulling = false;
  let ground = MeshBuilder.CreateGround(
    "ground",
    { width: 15, height: 15, subdivisions: 4 },
    scene
  );

  ground.material = groundMaterial;
  return ground;
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

function createBox1(scene: Scene) {
  let box = MeshBuilder.CreateBox("box", { width: 1, height: 1 }, scene);
  box.position.x = -1;
  box.position.y = 4;
  box.position.z = 1;

  var texture = new StandardMaterial("reflective", scene);
  texture.ambientTexture = new Texture(
    "./assets/textures/reflectivity.png",
    scene
  );
  texture.diffuseColor = new Color3(1, 1, 1);
  box.material = texture;
  return box;
}

function createBox2(scene: Scene) {
  let box = MeshBuilder.CreateBox("box", { width: 1, height: 1 }, scene);
  box.position.x = -0.7;
  box.position.y = 8;
  box.position.z = 1;

  var texture = new StandardMaterial("reflective", scene);
  texture.ambientTexture = new Texture(
    "./assets/textures/reflectivity.png",
    scene
  );
  texture.diffuseColor = new Color3(1, 1, 1);
  box.material = texture;
  return box;
}


function importMeshA(scene: Scene, x: number, y: number) {
  let item: Promise<void | ISceneLoaderAsyncResult> =
    SceneLoader.ImportMeshAsync(
      "",
      "./assets/models/men/",
      "dummy3.babylon",
      scene
    );

  item.then((result) => {
    let character: AbstractMesh = result!.meshes[0];
    character.position.x = x;
    character.position.y = y + 0.1;
    character.scaling = new Vector3(1, 1, 1);
    character.rotation = new Vector3(0, 1.5, 0);
  });
  return item;
}

export default function createStartScene(engine: Engine) {
  let scene = new Scene(engine);
  let audio = backgroundMusic(scene);
  let lightHemispheric = createHemisphericLight(scene);
  let camera = createArcRotateCamera(scene);
  let box1 = createBox1(scene);
  let box2 = createBox2(scene);
  let player = importMeshA(scene, 0, 0);
  let ground = createGround(scene);

  let that: SceneData = {
    scene,
    audio,
    lightHemispheric,
    camera,
    box1,
    box2,
    player,
    ground,
  };
  return that;
}
```

The collisions will be added in through a separate file called **collisionDeclaration.ts**.
The first step is to import the required resources.  These will include the havok physics engine and associated plugins.

**collisionDeclaration.ts (extract)**
```javascript
import { SceneData } from "./interfaces ";
import HavokPhysics, { HavokPhysicsWithBindings } from "@babylonjs/havok";
import { AbstractMesh, HavokPlugin, ISceneLoaderAsyncResult, PhysicsAggregate, PhysicsShapeType, Vector3 } from "@babylonjs/core";
import "@babylonjs/loaders";

// https://doc.babylonjs.com/typedoc/classes/BABYLON.HavokPlugin
let initializedHavok: any;

HavokPhysics().then((havok) => {
  initializedHavok = havok;
});

const havokInstance: HavokPhysicsWithBindings = await HavokPhysics();
const hk: HavokPlugin = new HavokPlugin(true, havokInstance);
```
This code crates a new HavokPhysics instance and then creates a HavokPlugin instance according to the method described in the [Havok Physics](https://doc.babylonjs.com/features/featuresDeepDive/physics/havokPlugin) documentation.

For debugging purposes a function collideCB() is added to the file. This function is added as a collision observable to the hk plugin so that it will be called when a collision occurs and the collision data is logged to the console.

**collisionDeclaration.ts (extract)**
```javascript
    var collideCB = function (collision: {
        // log collisions
        collider: { transformNode: { name: any } };
        point: any;
        distance: any;
        impulse: any;
        normal: any;
      }) {
        console.log(
          "collideCB",
          collision.collider.transformNode.name,
          collision.point,
          collision.distance,
          collision.impulse,
          collision.normal
        );
      };
      hk.onCollisionObservable.add(collideCB);
```
Physics must be enabled for the scene and the direction and strength of gravity must be set.

**collisionDeclaration.ts (extract)**
```javascript
runScene.scene.enablePhysics(new Vector3(0, -9.8, 0), hk);
```

Now PhysicsAggregates are created for the ground and the two boxes.  

Physics aggregates consist of a mesh, a shape type, a mass, restitution and friction.  For both ground and body the sshape type is set to box.  

Note that the ground is given a mass of 0 so that it will not move.  The restitutionvalue controlls how much energy is lost when a collision occurs.  The friction controls how much friction is applied to the object.

The collision callback is enabled for the ground and the two boxes.

**collisionDeclaration.ts (extract)**
```javascript
    const groundAggregate = new PhysicsAggregate(
        runScene.ground,
        PhysicsShapeType.BOX,
        { mass: 0, restitution: 0.2, friction: 0.7 },
        runScene.scene
      );
      groundAggregate.body.setCollisionCallbackEnabled(true);
    
      const boxAggregate = new PhysicsAggregate(
        runScene.box1,
        PhysicsShapeType.BOX,
        { mass: 1, restitution: 0.3, friction: 0.7 },
        runScene.scene
      );
      boxAggregate.body.setCollisionCallbackEnabled(true);
    
      const boxAggregate2 = new PhysicsAggregate(
        runScene.box2,
        PhysicsShapeType.BOX,
        { mass: 0.5, restitution: 0.3, friction: 0.7 },
        runScene.scene
      );
      boxAggregate2.body.setCollisionCallbackEnabled(true);
```

Next the player must be have a Physics Aggregate created for it.  The mesh is set to the player mesh and the shape type is set to capsule.  

As an extra feature the player mesh will be spinning when the scene loads.

**collisionDeclaration.ts (extract)**
```javascript
        const playerAggregate = new PhysicsAggregate(
          character,
          PhysicsShapeType.CAPSULE,
          { mass: 0.1, restitution: 1, friction: 1 },
          runScene.scene
        );
        playerAggregate.body.setMassProperties({
          inertia: new Vector3(0, 0.0, 0.0), 
        });
        playerAggregate.body.setAngularVelocity(new Vector3(0, 12, 0));
        
        playerAggregate.body.applyImpulse (new Vector3(0, 0, 0),character.position);

        playerAggregate.body.disablePreStep = false;
        playerAggregate.body.setCollisionCallbackEnabled(true);
        
      });
}
```
The full listing of collisionDeclaration.ts is now:

**collisionDeclaration.ts (full listing)** 
```javascript
import { SceneData } from "./interfaces ";
import HavokPhysics, { HavokPhysicsWithBindings } from "@babylonjs/havok";
import { AbstractMesh, HavokPlugin, ISceneLoaderAsyncResult, PhysicsAggregate, PhysicsShapeType, Vector3 } from "@babylonjs/core";
import "@babylonjs/loaders";

// https://doc.babylonjs.com/typedoc/classes/BABYLON.HavokPlugin
let initializedHavok: any;

HavokPhysics().then((havok) => {
  initializedHavok = havok;
});

const havokInstance: HavokPhysicsWithBindings = await HavokPhysics();
const hk: HavokPlugin = new HavokPlugin(true, havokInstance);


export function collisionDeclaration(runScene : SceneData){

    var collideCB = function (collision: {
        // log collisions
        collider: { transformNode: { name: any } };
        point: any;
        distance: any;
        impulse: any;
        normal: any;
      }) {
        console.log(
          "collideCB",
          collision.collider.transformNode.name,
          collision.point,
          collision.distance,
          collision.impulse,
          collision.normal
        );
      };
      hk.onCollisionObservable.add(collideCB);
    
      runScene.scene.enablePhysics(new Vector3(0, -9.8, 0), hk);
    
    // let playerAggregate: PhysicsAggregate;
      
    //collisions
    
      const groundAggregate = new PhysicsAggregate(
        runScene.ground,
        PhysicsShapeType.BOX,
        { mass: 0, restitution: 0.2, friction: 0.7 },
        runScene.scene
      );
      groundAggregate.body.setCollisionCallbackEnabled(true);
    
      const boxAggregate = new PhysicsAggregate(
        runScene.box1,
        PhysicsShapeType.BOX,
        { mass: 1, restitution: 0.3, friction: 0.7 },
        runScene.scene
      );
      boxAggregate.body.setCollisionCallbackEnabled(true);
    
      const boxAggregate2 = new PhysicsAggregate(
        runScene.box2,
        PhysicsShapeType.BOX,
        { mass: 0.5, restitution: 0.3, friction: 0.7 },
        runScene.scene
      );
      boxAggregate2.body.setCollisionCallbackEnabled(true);
    
      runScene.player!.then((result: void | ISceneLoaderAsyncResult) => {
        let character: AbstractMesh = result!.meshes[0];
        character.rotation = new Vector3(0, 0.5, 0);
    
        const playerAggregate = new PhysicsAggregate(
          character,
          PhysicsShapeType.CAPSULE,
          { mass: 0.1, restitution: 1, friction: 1 },
          runScene.scene
        );
        playerAggregate.body.setMassProperties({
          inertia: new Vector3(0, 0.0, 0.0), 
        });
        playerAggregate.body.setAngularVelocity(new Vector3(0, 12, 0));
        
        playerAggregate.body.applyImpulse (new Vector3(0, 0, 0),character.position);

        playerAggregate.body.disablePreStep = false;
        playerAggregate.body.setCollisionCallbackEnabled(true);
        
      });
}
```

The collision declaration must now be imported into the createRunScene.ts file after the existing import statements.

**createRunScene.ts (extract)**
```javascript
// havok physics collisions
import { collisionDeclaration } from "./collisionDeclaration";
```

The collisionDeclaration function is then called in the createRunScene function.

**createRunScene.ts (extract)**
```javascript
export default function createRunScene(runScene: SceneData) {

  collisionDeclaration(runScene);
```
The full listing of **createRunScene.ts** is now:

**createRunScene.ts (full listing)**
```javascript
import {
  AbstractMesh,
  ActionManager,
  CubeTexture,
  Mesh,
  Skeleton,
  _ENVTextureLoader,
} from "@babylonjs/core";

import { SceneData } from "./interfaces ";

import {
  keyActionManager,
  keyDownMap,
  keyDownHeld,
  getKeyDown,
} from "./keyActionManager";

import { characterActionManager } from "./characterActionManager";

import {
  bakedAnimations,
  walk,
  idle,
  getAnimating,
  toggleAnimating,
} from "./bakedAnimations";

import "@babylonjs/core/Materials/Textures/Loaders/envTextureLoader";
import "@babylonjs/core/Helpers/sceneHelpers";

// havok physics collisions
import { collisionDeclaration } from "./collisionDeclaration";

export default function createRunScene(runScene: SceneData) {
  
  collisionDeclaration(runScene);
  runScene.scene.actionManager = new ActionManager(runScene.scene);
  keyActionManager(runScene.scene);

  const environmentTexture = new CubeTexture(
    "assets/textures/industrialSky.env",
    runScene.scene
  );
  const skybox = runScene.scene.createDefaultSkybox(
    environmentTexture,
    true,
    10000,
    0.1
  );
  runScene.audio.stop();

  // add baked in animations to player
  runScene.player.then((result) => {
    let skeleton: Skeleton = result!.skeletons[0];
    bakedAnimations(runScene.scene, skeleton);
  });

  runScene.scene.onBeforeRenderObservable.add(() => {
    // check and respond to keypad presses

    if (getKeyDown() == 1 && (keyDownMap["m"] || keyDownMap["M"])) {
      keyDownHeld();
      if (runScene.audio.isPlaying) {
        runScene.audio.stop();
      } else {
        runScene.audio.play();
      }
    }

    runScene.player.then((result) => {
      let characterMoving: Boolean = false;
      let character: AbstractMesh = result!.meshes[0];
      if (keyDownMap["w"] || keyDownMap["ArrowUp"]) {
        character.position.x -= 0.1;
        character.rotation.y = (3 * Math.PI) / 2;
        characterMoving = true;
      }
      if (keyDownMap["a"] || keyDownMap["ArrowLeft"]) {
        character.position.z -= 0.1;
        character.rotation.y = (2 * Math.PI) / 2;
        characterMoving = true;
      }
      if (keyDownMap["s"] || keyDownMap["ArrowDown"]) {
        character.position.x += 0.1;
        character.rotation.y = (1 * Math.PI) / 2;
        characterMoving = true;
      }
      if (keyDownMap["d"] || keyDownMap["ArrowRight"]) {
        character.position.z += 0.1;
        character.rotation.y = (0 * Math.PI) / 2;
        characterMoving = true;
      }

      if (getKeyDown() && characterMoving) {
        if (!getAnimating()) {
          walk();
          toggleAnimating();
        }
      } else {
        if (getAnimating()) {
          idle();
          toggleAnimating();
        }
      }
    });
  });

  // add incremental action to player
  runScene.player.then((result) => {
    let characterMesh = result!.meshes[0];
    characterActionManager(runScene.scene, characterMesh as Mesh);
  });

  runScene.scene.onAfterRenderObservable.add(() => {});
}
```
Other files are unchanged.



This code is ready to run but not to build yet because the code uses top level await and this needs changes to the configuration to target only compatible browsers.


