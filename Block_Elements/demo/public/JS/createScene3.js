var keyDownMap =[];

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

export default function createStartScene(engine) {
    let that = {};
    let scene = (that.scene = new BABYLON.Scene(engine));
   
    //scene.debugLayer.show();
    //scene.ambientColor = new BABYLON.Color3(1, 1, 1);
  
    createGround(scene);
    createSky(scene);
    createLight(scene);
    createArcRotateCamera(scene);
    importMeshA(scene, 0, 0);
    actionManager(scene);
    return that;
  };