function createGround(scene) {
  const groundMaterial = new BABYLON.StandardMaterial("groundMaterial");
  groundMaterial.diffuseTexture = new BABYLON.Texture(
    "assets/environments/valleygrass.png"
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

function createTerrain(scene) {
  const largeGroundMat = new BABYLON.StandardMaterial("largeGroundMat");
  largeGroundMat.diffuseTexture = new BABYLON.Texture(
    "assets/environments/valleygrass.png"
  );

  const largeGround = BABYLON.MeshBuilder.CreateGroundFromHeightMap(
    "largeGround",
    "assets/environments/villageheightmap.png",
    {
      width: 150,
      height: 150,
      subdivisions: 20,
      minHeight: 0,
      maxHeight: 10,
      scene,
    }
  );
  largeGround.material = largeGroundMat;
  largeGround.position.y = -0.01;
}

function createSky(scene) {
  const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 150 }, scene);
  const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
    "assets/textures/skybox/skybox",
    scene
  );
  skyboxMaterial.reflectionTexture.coordinatesMode =
    BABYLON.Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  skybox.material = skyboxMaterial;
}

function createHouses(scene, style) {
  //Start by locating one each of the two house types then add others

  if (style == 1) {
    // show 1 small house
    createHouse(scene, 1);
  }
  if (style == 2) {
    // show 1 large house
    createHouse(scene, 2);
  }
  if (style == 3) {
    // show estate
    const houses = [];
    const places = []; //each entry is an array [house type, rotation, x, z]
    places.push([1, 0, 0, 1]); // small house
    places.push([2, 0, 2, 1]); // semi  house
    places.push([1, 0, 0, -1]);
    places.push([2, 0, -2, -1]);
    places.push([2, Math.PI / 2, -2.5, 1]);
    places.push([2, -Math.PI / 2, +2.5, -1]);
    places.push([1, Math.PI / 2, -2.5, 3]);
    places.push([1, -Math.PI / 2, +2.5, -3]);

    houses[0] = createHouse(scene, 1);
    houses[1] = createHouse(scene, 2);

    houses[0].rotation.y = places[0][1];
    houses[0].position.x = places[0][2];
    houses[0].position.z = places[0][3];

    houses[1].rotation.y = places[1][1];
    houses[1].position.x = places[1][2];
    houses[1].position.z = places[1][3];

    for (let i = 2; i < places.length; i++) {
      if (places[i][0] === 1) {
        houses[i] = houses[0].createInstance("house" + i);
      } else {
        houses[i] = houses[1].createInstance("house" + i);
      }
      houses[i].rotation.y = places[i][1];
      houses[i].position.x = places[i][2];
      houses[i].position.z = places[i][3];
    }
  }
}

function createHouse(scene, style) {
  //style 1 small style 2 semi detatched
  const boxMat = new BABYLON.StandardMaterial("boxMat");
  const faceUV = []; // faces for small house
  if (style == 1) {
    boxMat.diffuseTexture = new BABYLON.Texture(
      "assets/textures/cubehouse.png"
    );
    faceUV[0] = new BABYLON.Vector4(0.5, 0.0, 0.75, 1.0); //rear face
    faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.25, 1.0); //front face
    faceUV[2] = new BABYLON.Vector4(0.25, 0, 0.5, 1.0); //right side
    faceUV[3] = new BABYLON.Vector4(0.75, 0, 1.0, 1.0); //left side
    // faceUV[4] would be for bottom but not used
    // faceUV[5] would be for top but not used
  } else {
    boxMat.diffuseTexture = new BABYLON.Texture(
      "assets/textures/semihouse.png"
    );
    faceUV[0] = new BABYLON.Vector4(0.6, 0.0, 1.0, 1.0); //rear face
    faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.4, 1.0); //front face
    faceUV[2] = new BABYLON.Vector4(0.4, 0, 0.6, 1.0); //right side
    faceUV[3] = new BABYLON.Vector4(0.4, 0, 0.6, 1.0); //left side
    // faceUV[4] would be for bottom but not used
    // faceUV[5] would be for top but not used
  }

  const box = BABYLON.MeshBuilder.CreateBox(
    "box",
    { width: style, height: 1, faceUV: faceUV, wrap: true },
    scene
  );
  box.position = new BABYLON.Vector3(0, 0.5, 0);
  box.scaling = new BABYLON.Vector3(1, 1, 1);

  box.material = boxMat;

  const roof = BABYLON.MeshBuilder.CreateCylinder("roof", {
    diameter: 1.3,
    height: 1.2,
    tessellation: 3,
  });
  roof.scaling.x = 0.75;
  roof.scaling.y = style * 0.85;
  roof.rotation.z = Math.PI / 2;
  roof.position.y = 1.22;
  const roofMat = new BABYLON.StandardMaterial("roofMat");
  roofMat.diffuseTexture = new BABYLON.Texture(
    "assets/textures/roof.jpg",
    scene
  );
  roof.material = roofMat;

  const house = BABYLON.Mesh.MergeMeshes(
    [box, roof],
    true,
    false,
    null,
    false,
    true
  );
  // last true allows combined mesh to use multiple materials

  return house;
}

function createTrees(scene){
  const spriteManagerTrees = new BABYLON.SpriteManager("treesManager", "assets/sprites/tree.png", 2000, {width: 512, height: 1024}, scene);

  //We create trees at random positions
  for (let i = 0; i < 500; i++) {
      const tree = new BABYLON.Sprite("tree", spriteManagerTrees);
      tree.position.x = Math.random() * (-30);
      tree.position.z = Math.random() * 20 + 8;
      tree.position.y = 0.2;
  }

  for (let i = 0; i < 500; i++) {
      const tree = new BABYLON.Sprite("tree", spriteManagerTrees);
      tree.position.x = Math.random() * (25) + 7;
      tree.position.z = Math.random() * -35  + 8;
      tree.position.y = 0.2;
  }

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
    camDist = 25,
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
  createHouses(scene, 3); // 1 small house 2 large house 3 estate
  createTrees(scene);
  createTerrain(scene);
  createArcRotateCamera(scene);
  return scene;
};
