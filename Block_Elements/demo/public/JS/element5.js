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

 
  


const createScene = () => {
    let that = {};
    let scene = new BABYLON.Scene(engine);
    //scene.debugLayer.show();
    //scene.ambientColor = new BABYLON.Color3(1, 1, 1);
  
    createGround(scene);
    createSky(scene);
    createLight(scene);
    createArcRotateCamera(scene);

    return scene;
  };