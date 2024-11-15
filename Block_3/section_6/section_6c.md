## Baked in animations

Copy the code from the previous section into a new folder named "motion03" to provide a starting point to continue with the next section.

The dummy mesh which is being imported has a set of animations which were baked into the model.   These include a walking animation which can be used when the player moves.

No changes are needed in the createStartScene.ts file.

In the createRunScene.ts file, the skeleton is added to the scene and the animation is started.  The imports must be modified to include the skeleton and the functions imported from the file bakedAnimations.ts which will be created below.

**createRunScene.ts** (extract)
```javascript
import {
  AbstractMesh,
  ActionManager,
  CubeTexture,
  Mesh,
  Skeleton
} from "@babylonjs/core";
import { SceneData } from "./interfaces";
import {
  keyActionManager,
  keyDownMap,
  keyDownHeld,
  getKeyDown,
} from "./keyActionManager";
import { characterActionManager } from "./characterActionManager";
import { bakedAnimations, walk, run, left, right, idle, stopAnimation, getAnimating, toggleAnimating } from "./bakedAnimations";
```
Further down the file, the baked animations are added to the player skeleton..

**createRunScene.ts** (extract)
```javascript
  runScene.audio.stop();

  // add baked in animations to player
  runScene.player.then((result) => {
    let skeleton: Skeleton = result!.skeletons[0];
    bakedAnimations(runScene.scene, skeleton);
  });
```

A flag is added to track when the character is moving.  This is set in response to key presses.

**createRunScene.ts** (extract)
```javascript
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
```
The animation is switched between walking and idle depending on whether the character is moving.

**createRunScene.ts** (extract)
```javascript
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
```

The complete listing of **createRunScene.ts** then becomes:

**createRunScene.ts** (complete)
```javascript
import {
  AbstractMesh,
  ActionManager,
  CubeTexture,
  Mesh,
  Skeleton
} from "@babylonjs/core";
import { SceneData } from "./interfaces";
import {
  keyActionManager,
  keyDownMap,
  keyDownHeld,
  getKeyDown,
} from "./keyActionManager";
import { characterActionManager } from "./characterActionManager";
import { bakedAnimations, walk, run, left, right, idle, stopAnimation, getAnimating, toggleAnimating } from "./bakedAnimations";

export default function createRunScene(runScene: SceneData) {
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

  runScene.scene.onAfterRenderObservable.add(() => { });
}
```

The detail of the baked animations is in the file **bakedAnimations.ts**.  The function bakedAnimations() is called from the **createRunScene.ts** file.  The function takes two arguments: the scene and the skeleton.  The skeleton is used to get the animation ranges.  The ranges are used to define functions to activate the animations.

Create a ew file **bakedAnimations.ts** and inport the required resources.

**bakedAnimations.ts**
```javascript
import { Scene } from "@babylonjs/core/scene";
import { AnimationPropertiesOverride, AnimationRange, Nullable, Skeleton } from "@babylonjs/core";
```
Next declare some variable to hold the animation ranges whiich  will  be global within this module. Note that these are declared using ```var``` and not ```let``` The animation ranges are between the frame positions which define the start and end of each animation.

**bakedAnimations.ts** 
```javascript
var animating:Boolean = false;
var walkRange:Nullable<AnimationRange>;
var runRange:Nullable<AnimationRange>;
var leftRange:Nullable<AnimationRange>;
var rightRange:Nullable<AnimationRange>;
var idleRange:Nullable<AnimationRange>;
var animScene:Scene;
var animSkeleton:Skeleton;
```
The function bakedAnimations() is now defined.  The function takes two arguments: the scene and the skeleton.  The skeleton is used to get the animation ranges.  The ranges are used to define functions to activate the animations.

**bakedAnimations.ts**
```javascript
export function bakedAnimations(myscene: Scene, skeleton: Skeleton){
  
   // use baked in animations
   animScene = myscene;
   animSkeleton = skeleton;
   skeleton.animationPropertiesOverride = new AnimationPropertiesOverride();
   skeleton.animationPropertiesOverride.enableBlending = true;
   skeleton.animationPropertiesOverride.blendingSpeed = 0.05;
   skeleton.animationPropertiesOverride.loopMode = 1;

   walkRange = skeleton.getAnimationRange("YBot_Walk");
   runRange = skeleton.getAnimationRange("YBot_Run");
   leftRange = skeleton.getAnimationRange("YBot_LeftStrafeWalk");
   rightRange = skeleton.getAnimationRange("YBot_RightStrafeWalk");
   idleRange = skeleton.getAnimationRange("YBot_Idle");
   console.log(idleRange);
   
}
```
Each of the functions to activate the animations are defined.  The functions are called from the **createRunScene.ts** file.  There are more animations available in the model than have been used here.  The animations are defined in the model file.

There are also functions to get the animation status and to stop the animation.

**bakedAnimations.ts**
```javascript
export function walk(){
  animScene.beginAnimation(animSkeleton, walkRange!.from, walkRange!.to, true);
}

export function run(){
  animScene.beginAnimation(animSkeleton, runRange!.from, runRange!.to, true);
}

export function left(){
  animScene.beginAnimation(animSkeleton, leftRange!.from, leftRange!.to, true);
}

export function right(){
  animScene.beginAnimation(animSkeleton, rightRange!.from, rightRange!.to, true);
}

export function idle(){
  animScene.beginAnimation(animSkeleton, idleRange!.from, idleRange!.to, true);
}

export function stopAnimation(){
  animScene.stopAnimation(animSkeleton);
}

export function getAnimating():Boolean{return animating};

export function toggleAnimating(){animating = !animating};

```

For debugging purposes the animation ranges may be logged to the console.

**bakedAnimations.ts**
```javascript
export function info(){
  console.log(idleRange!.from, idleRange!.to);
}
```

The complete listing of the **bakedAnimations.ts** file is shown below.

**bakedAnimations.ts** (complete)
```javascript
import { Scene } from "@babylonjs/core/scene";
import { AnimationPropertiesOverride, AnimationRange, Nullable, Skeleton } from "@babylonjs/core";

var animating:Boolean = false;
var walkRange:Nullable<AnimationRange>;
var runRange:Nullable<AnimationRange>;
var leftRange:Nullable<AnimationRange>;
var rightRange:Nullable<AnimationRange>;
var idleRange:Nullable<AnimationRange>;
var animScene:Scene;
var animSkeleton:Skeleton;




export function bakedAnimations(myscene: Scene, skeleton: Skeleton){
  
   // use baked in animations
   animScene = myscene;
   animSkeleton = skeleton;
   skeleton.animationPropertiesOverride = new AnimationPropertiesOverride();
   skeleton.animationPropertiesOverride.enableBlending = true;
   skeleton.animationPropertiesOverride.blendingSpeed = 0.05;
   skeleton.animationPropertiesOverride.loopMode = 1;

   walkRange = skeleton.getAnimationRange("YBot_Walk");
   runRange = skeleton.getAnimationRange("YBot_Run");
   leftRange = skeleton.getAnimationRange("YBot_LeftStrafeWalk");
   rightRange = skeleton.getAnimationRange("YBot_RightStrafeWalk");
   idleRange = skeleton.getAnimationRange("YBot_Idle");
   console.log(idleRange);
   
}

export function walk(){
  animScene.beginAnimation(animSkeleton, walkRange!.from, walkRange!.to, true);
}

export function run(){
  animScene.beginAnimation(animSkeleton, runRange!.from, runRange!.to, true);
}

export function left(){
  animScene.beginAnimation(animSkeleton, leftRange!.from, leftRange!.to, true);
}

export function right(){
  animScene.beginAnimation(animSkeleton, rightRange!.from, rightRange!.to, true);
}

export function idle(){
  animScene.beginAnimation(animSkeleton, idleRange!.from, idleRange!.to, true);
}

export function stopAnimation(){
  animScene.stopAnimation(animSkeleton);
}

export function getAnimating():Boolean{return animating};

export function toggleAnimating(){animating = !animating};

export function info(){
  console.log(idleRange!.from, idleRange!.to);
}
```

The **createScene3.js** file is now updated to use the **bakedAnimations.ts** file.  The **bakedAnimations.ts** file is imported and the **bakedAnimations()** function is called.


The scene now looks like this:

<iframe 
    height="460" 
    width="100%" 
    scrolling="no" 
    title="Mesh stride" 
    src="Block_3/section_6/distribution03/index.html" 
    frameborder="no" 
    loading="lazy" 
    allowtransparency="true" 
    allowfullscreen="true">
</iframe>

