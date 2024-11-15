## Incremental Motion

The code from the previous example can be copied into a separate project can be copied into a new folder "motion02" as a starting point for the next stage, which is the addition of incremental motion causing the player character to spin when the mouse is clicked over it, and to stop when the mouse is held for a long click over the player.

In the last example motion was added to the scene `onBeforeRenderObservable`.  In this example additonal rotational motion is added via an `IncrementalValueAction`.

The scene content is unchanged so no change to **createSceneStartScene.ts** is needed.
 
The main changes will be in a separate module which will be called the characterAnimationManager, so the changes needed in **createRunScene.ts** are quite limitted to a few additional lines placed just prior to the onAfterRenderObservable line:

**createRunScene.ts** (extract)
```javascript
// add incremental action to player
  runScene.player.then((result) => {  
    let characterMesh = result!.meshes[0];
    console.log(characterMesh);
    characterActionManager(runScene.scene, characterMesh as Mesh);
  });

  runScene.scene.onAfterRenderObservable.add(() => {});
}
```

The player is a Promise so should be handled in a .then construct.  The characterMesh would normally be an AbstractMesh, but the `as` term type casts this to a Mesh which is necessary for the actions performed by the external module "characterActionManager".

The full listing of **createRunScene.ts** becomes:

```javascript
import { AbstractMesh, ActionManager, CubeTexture, Mesh, _ENVTextureLoader } from "@babylonjs/core";
import { SceneData } from "./interfaces ";
import {
  keyActionManager,
  keyDownMap,
  keyDownHeld,
  getKeyDown,
} from "./keyActionManager";
import { characterActionManager } from "./characterActionManager";

import "@babylonjs/core/Materials/Textures/Loaders/envTextureLoader";
import "@babylonjs/core/Helpers/sceneHelpers";
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
      let character: AbstractMesh = result!.meshes[0];
      if (keyDownMap["w"] || keyDownMap["ArrowUp"]) {
        character.position.x -= 0.1;
        character.rotation.y = (3 * Math.PI) / 2;
      }
      if (keyDownMap["a"] || keyDownMap["ArrowLeft"]) {
        character.position.z -= 0.1;
        character.rotation.y = (2 * Math.PI) / 2;
      }
      if (keyDownMap["s"] || keyDownMap["ArrowDown"]) {
        character.position.x += 0.1;
        character.rotation.y = (1 * Math.PI) / 2;
      }
      if (keyDownMap["d"] || keyDownMap["ArrowRight"]) {
        character.position.z += 0.1;
        character.rotation.y = (0 * Math.PI) / 2;
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

The spinning action is described in the module file **characterActionManager**

This script will use an `IncrementValueAction` to increase the `rotation.y` value in the `PredicateCondition` that a pick item `flag` is true.  The state of the flag will be set by a `character.actionManager`.

The required resources are imported to the module.

**characterActionManager.ts**
```javascript
import {
  IncrementValueAction,
  PredicateCondition,
  SetValueAction,
} from "@babylonjs/core/Actions";
import { ActionManager } from "@babylonjs/core/Actions/actionManager";
import { Scene } from "@babylonjs/core/scene";
import { Mesh } from "@babylonjs/core";
```

The character.actionManager is a separate entity to the scene action manager.  It is created and the flag to denote the character to be picked is defined with a starting value of false.

**characterActionManager.ts**
```javascript
export function characterActionManager(scene: Scene, character: Mesh) {
  character.actionManager = new ActionManager(scene);
  let pickItem = { flag: false };
```

The ``incrementalValueAction`` is registered to the ``scene.actionManager``.  The [constructor for the incrementalValueAction]https://doc.babylonjs.com/typedoc/classes/BABYLON.IncrementValueAction#constructor() takes the form:

 new IncrementValueAction(triggerOptions: any, target: any, propertyPath: string, value: any, condition?: Condition): IncrementValueAction

So in this case

* trigger option is every frame
* target is the character
* property to change is rotation.y
* value to change by is 0.1 (radians per frame)
* condition is defined by Predicate condition

The [constructor for the PredicateCondition](https://doc.babylonjs.com/typedoc/classes/BABYLON.PredicateCondition) takes the form:

new PredicateCondition(actionManager: ActionManager, predicate: (() => boolean)): PredicateCondition

So in this case

* actionManager is the character actionManager
* predicate is is the function which returns a boolean on the state of the pickItem.flag

**characterActionManager.ts** 
```javascript
  scene.actionManager.registerAction(
    new IncrementValueAction(
      ActionManager.OnEveryFrameTrigger,
      character,
      "rotation.y",
      0.1,
      new PredicateCondition(
        character.actionManager as ActionManager,
        function () {
          return pickItem.flag == true;
        }
      )
    )
  );
```

The state of the pickItem flag is controlled by a ``SetValueAction`` which is registered to the ``character.actionManager``.

The [constructor for the SetValueAction](https://doc.babylonjs.com/typedoc/classes/BABYLON.SetValueAction) takes the form:

new SetValueAction(triggerOptions: any, target: any, propertyPath: string, value: any, condition?: Condition): SetValueAction

So in this case

* triggerOptions is OnPickDownTrigger
* target is pickItem
* propertyPath is flag
* value is set to true
* condition (optional) not stated.

**characterActionManager.ts**
```javascript
  character.actionManager.registerAction(
    new SetValueAction(ActionManager.OnPickDownTrigger, 
    pickItem, 
    "flag", 
    true)
  );
```

An OnLongPress trigger is used to allow the pickItem flag to be set back to false and halt the spinning of the character.  This is a slow mouse click.

**characterActionManager.ts**
```javascript
  character.actionManager.registerAction(
    new SetValueAction(
      ActionManager.OnLongPressTrigger,
      pickItem,
      "flag",
      false
    )
  );
}
```

The full listing of **characterActionManager.ts** is:

```javascript
import {
  IncrementValueAction,
  PredicateCondition,
  SetValueAction,
} from "@babylonjs/core/Actions";
import { ActionManager } from "@babylonjs/core/Actions/actionManager";
import { Scene } from "@babylonjs/core/scene";
import { Mesh } from "@babylonjs/core";

export function characterActionManager(scene: Scene, character: Mesh) {
  character.actionManager = new ActionManager(scene);
  let pickItem = { flag: false };

  scene.actionManager.registerAction(
    new IncrementValueAction(
      ActionManager.OnEveryFrameTrigger,
      character,
      "rotation.y",
      0.1,
      new PredicateCondition(
        character.actionManager as ActionManager,
        function () {
          return pickItem.flag == true;
        }
      )
    )
  );

  character.actionManager.registerAction(
    new SetValueAction(ActionManager.OnPickDownTrigger, pickItem, "flag", true)
  );

  character.actionManager.registerAction(
    new SetValueAction(
      ActionManager.OnLongPressTrigger,
      pickItem,
      "flag",
      false
    )
  );
}
```

All other files from the previous example are maintained.


The result is shown in the example below.  Note what happens to the rotation when the "wasd" keys are used.

<iframe 
    height="460" 
    width="100%" 
    scrolling="no" 
    title="Mesh wasd" 
    src="Block_3/section_6/distribution02/index.html" 
    frameborder="no" 
    loading="lazy" 
    allowtransparency="true" 
    allowfullscreen="true">
</iframe>


