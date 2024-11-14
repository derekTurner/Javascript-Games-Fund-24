## Baked in animations

The dummy mesh which is being imported has a set of animations which were baked into the model.   These include a walking animation which can be used when the player moves.

All the changes needed can be added to the `importMesh()` function.  The 'onSucess' function will now need to include arguments: newMeshes, particleSystems and skeletons.  The particle systems are not being used, but because the argument order is important, the function will not recognise skeletons unless the particleSystems are included.



```javascript
function importMesh(scene, x, y) {
    let tempItem = { flag: false }
    let item = BABYLON.SceneLoader.ImportMesh("", "./assets/models/", "dummy3.babylon", scene, function(newMeshes, particleSystems ,skeletons) {
```

Now a variable is added to use skeletons[0].

The animation properties baked into the model can be modified by controlling the properties of a new `AnimationProperties`

```javascript
        let mesh = newMeshes[0];
        let skeleton = skeletons[0];
        skeleton.animationPropertiesOverride = new BABYLON.AnimationPropertiesOverride();
        skeleton.animationPropertiesOverride.enableBlending = true;
        skeleton.animationPropertiesOverride.blendingSpeed = 0.05;
        skeleton.animationPropertiesOverride.loopMode = 1;
```

Read the animation ranges in from the skeleton.  I am using the "Ybot_Walk", there are others available which I have commented out which may be useful later.

```javascript
        var walkRange = skeleton.getAnimationRange("YBot_Walk");
        // var runRange = skeleton.getAnimationRange("YBot_Run");
        // var leftRange = skeleton.getAnimationRange("YBot_LeftStrafeWalk");
        // var rightRange = skeleton.getAnimationRange("YBot_RightStrafeWalk");
        //var idleRange = skeleton.getAnimationRange("YBot_Idle");
```
If the bot is not animating the animation must be begun when the bot moves, however if the bot is in continuous movement the animation should not be restarted on each frame.  To contol this an animating variable os added.

```javascript
      var animating = false;
```

Now the `onBeforeRenderObservable` added function proceeds to set the x y motion on the basis of keypresses.  If a valid key is detected the keydown variable is set true.

```javascript
       scene.onBeforeRenderObservable.add(()=> {
            var keydown = false;
            if (keyDownMap["w"] || keyDownMap["ArrowUp"]) {
                mesh.position.z += 0.1;
                mesh.rotation.y = 0;
                keydown=true;
            }
            if (keyDownMap["a"] || keyDownMap["ArrowLeft"]) {
                mesh.position.x -= 0.1;
                mesh.rotation.y = 3 * Math.PI / 2;
                keydown=true;
            }
            if (keyDownMap["s"] || keyDownMap["ArrowDown"]) {
                mesh.position.z -= 0.1;
                mesh.rotation.y = 2 * Math.PI / 2;
                keydown=true;
            }
            if (keyDownMap["d"] || keyDownMap["ArrowRight"]) {
                mesh.position.x += 0.1;
                mesh.rotation.y = Math.PI / 2;
                keydown=true;
            }
```

If the bot is moving at this point keydown will be true and this is used to start the animation, providing it is not already running.



```javascript
           if(keydown){
                if(!animating){
                    animating = true;
                    scene.beginAnimation(skeleton, walkRange.from, walkRange.to, true);
                }
            }else{
                animating = false;
                scene.stopAnimation(skeleton)
            }
        });
```

The rest of the file is unchanged.

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

The full listing of **createScene3.js** is now:

```javascript
// references https://www.babylonjs-playground.com/#15EY4F#15
var keyDownMap =[];

function importMesh(scene, x, y) {
    let tempItem = { flag: false }
    let item = BABYLON.SceneLoader.ImportMesh("", "./assets/models/", "dummy3.babylon", scene, function(newMeshes, particleSystems ,skeletons) {
        let mesh = newMeshes[0];
        let skeleton = skeletons[0];
        skeleton.animationPropertiesOverride = new BABYLON.AnimationPropertiesOverride();
        skeleton.animationPropertiesOverride.enableBlending = true;
        skeleton.animationPropertiesOverride.blendingSpeed = 0.05;
        skeleton.animationPropertiesOverride.loopMode = 1;
        
        var walkRange = skeleton.getAnimationRange("YBot_Walk");
        // var runRange = skeleton.getAnimationRange("YBot_Run");
        // var leftRange = skeleton.getAnimationRange("YBot_LeftStrafeWalk");
        // var rightRange = skeleton.getAnimationRange("YBot_RightStrafeWalk");
        //var idleRange = skeleton.getAnimationRange("YBot_Idle");
        var animating = false;

        scene.onBeforeRenderObservable.add(()=> {
            var keydown = false;
            if (keyDownMap["w"] || keyDownMap["ArrowUp"]) {
                mesh.position.z += 0.1;
                mesh.rotation.y = 0;
                keydown=true;
            }
            if (keyDownMap["a"] || keyDownMap["ArrowLeft"]) {
                mesh.position.x -= 0.1;
                mesh.rotation.y = 3 * Math.PI / 2;
                keydown=true;
            }
            if (keyDownMap["s"] || keyDownMap["ArrowDown"]) {
                mesh.position.z -= 0.1;
                mesh.rotation.y = 2 * Math.PI / 2;
                keydown=true;
            }
            if (keyDownMap["d"] || keyDownMap["ArrowRight"]) {
                mesh.position.x += 0.1;
                mesh.rotation.y = Math.PI / 2;
                keydown=true;
            }

            if(keydown){
                if(!animating){
                    animating = true;
                    scene.beginAnimation(skeleton, walkRange.from, walkRange.to, true);
                }
            }else{
                animating = false;
                scene.stopAnimation(skeleton)
            }
        });

        scene.actionManager.registerAction(
            new BABYLON.IncrementValueAction(
                BABYLON.ActionManager.OnEveryFrameTrigger,
                mesh,
                'rotation.y',
                0.1,
                new BABYLON.PredicateCondition(
                    mesh.actionManager,
                    function () {
                        return tempItem.flag == true
                    }
                )
            )
        ); 

        mesh.actionManager = new BABYLON.ActionManager(scene);
    
    
        mesh.actionManager.registerAction(
            new BABYLON.SetValueAction(
                BABYLON.ActionManager.OnPickDownTrigger,
                tempItem,
                'flag',
                true
            )
        );
        
        mesh.actionManager.registerAction(
            new BABYLON.SetValueAction(
                BABYLON.ActionManager.OnLongPressTrigger,
                tempItem,
                'flag',
                false
            )
        ); 

    });

    return item
}    
    
function actionManager(scene){
    scene.actionManager = new BABYLON.ActionManager(scene);

    scene.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
            {
            trigger: BABYLON.ActionManager.OnKeyDownTrigger,
            //parameters: 'w'      
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

function addRotation(target, scene){

 /*    */
} 

function backgroundMusic(scene){
    let music = new BABYLON.Sound("music", "./assets/audio/arcade-kid.mp3", scene, null, {
        loop: true,
        autoplay: true
    });
    return music;
}

function createGround(scene){
    const ground = BABYLON.MeshBuilder.CreateGround("ground", {height: 10, width: 10, subdivisions: 4});
    return ground;
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
    //camera.attachControl(true);
    return camera;
}

export default function createStartScene(engine) {
    let that = {};
    let scene = (that.scene = new BABYLON.Scene(engine));
    //scene.debugLayer.show();

    let light = (that.light = createLight(scene));
    let camera = (that.camera = createArcRotateCamera(scene));
    let ground = (that.ground = createGround(scene));
    
    let manager = (that.actionManager = actionManager(scene));
    let mesh1 = (that.mesh1 = importMesh(scene, 0, 0));
    addRotation(mesh1, scene);

    let bgMusic = (that.bgMusic = backgroundMusic(scene));
    
    
    return that;
}
```

