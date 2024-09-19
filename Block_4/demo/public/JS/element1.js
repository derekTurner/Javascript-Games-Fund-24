function createGround(scene) {
  let ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 3, height: 3 },
    scene
  );
  var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
  groundMaterial.backFaceCulling = false;
  ground.material = groundMaterial;
  return ground;
}

function createSphere(scene) {
  let sphere = BABYLON.MeshBuilder.CreateSphere(
    "sphere",
    { diameter: 1, segments: 32 },
    scene
  );
  sphere.position.y = 0;
  var texture = new BABYLON.StandardMaterial("grass1", scene);
  texture.emissiveTexture = new BABYLON.Texture("assets/textures/lavatile.jpg", scene);
  sphere.material = texture;
  return sphere;
}

function createBox(scene) {
  let box = BABYLON.MeshBuilder.CreateBox(
    "box",
    { width: 1, height: 1 },
    scene
  );
  box.position.x = -1;
  box.position.y = 1;
  box.position.z = 1;
  return box;
}

function createCylinder(scene) {
  let cylinder = BABYLON.MeshBuilder.CreateCylinder(
    "cylinder",
    { height: 1, diameter: 0.7 },
    scene
  );
  cylinder.position.x = 1;
  cylinder.position.y = 1;
  cylinder.position.z = 1;
  return cylinder;
}

function createCone(scene) {
  let cone = BABYLON.MeshBuilder.CreateCylinder(
    "cone",
    { height: 1, diameterBottom: 0.7, diameterTop: 0 },
    scene
  );
  cone.position.x = 1;
  cone.position.y = 1;
  cone.position.z = -1;
  return cone;
}

function createTriangle(scene) {
  let triangle = BABYLON.MeshBuilder.CreateCylinder(
    "triangle",
    { height: 1, diameter: 0.7, tessellation: 3 },
    scene
  );
  triangle.position.x = -1;
  triangle.position.y = 1;
  triangle.position.z = -1;
  return triangle;
}

function createCapsule(scene) {
  let capsule = BABYLON.MeshBuilder.CreateCapsule(
    "capsule",
    { radius: 0.35, height: 1, radiusTop: 0.1 },
    scene
  );
  capsule.position.x = -1;
  capsule.position.y = -1;
  capsule.position.z = -1;

  var texture = new BABYLON.StandardMaterial("reflective", scene);
  texture.ambientTexture = new BABYLON.Texture("assets/textures/reflectivity.png", scene);
  texture.diffuseColor = new BABYLON.Color3(1, 0.6, 0.6);
  capsule.material = texture;

  return capsule;
}

function createTorus(scene) {
  let torus = BABYLON.MeshBuilder.CreateTorus(
    "torus",
    { diameter: 0.7, thickness: 0.7, tessellation: 5 },
    scene
  );
  torus.position.x = -1;
  torus.position.y = -1;
  torus.position.z = 1;

  var texture = new BABYLON.StandardMaterial("reflective", scene);
  texture.ambientTexture = new BABYLON.Texture("assets/textures/reflectivity.png", scene);
  texture.diffuseColor = new BABYLON.Color3(0.6, 0.6, 1);
  torus.material = texture;

  return torus;
}

function createTube(scene) {
  const myPath = [
    new BABYLON.Vector3(0.85, -0.85, 0.85),
    new BABYLON.Vector3(0.35, -0.35, 0.35),
  ];

  const tube = BABYLON.MeshBuilder.CreateTube(
    "tube",
    { path: myPath, radius: 0.4, sideOrientation: BABYLON.Mesh.DOUBLESIDE },
    scene
  );
  return tube;
}

function createExtrusion(scene) {
  const myShape = [
    new BABYLON.Vector3(0, 0.7, 0),
    new BABYLON.Vector3(0.2, 0.2, 0),
    new BABYLON.Vector3(0.7, 0, 0),
    new BABYLON.Vector3(0.2, -0.2, 0),
    new BABYLON.Vector3(0, -0.7, 0),
    new BABYLON.Vector3(-0.2, -0.2, 0),
    new BABYLON.Vector3(-0.7, 0, 0),
    new BABYLON.Vector3(-0.2, 0.2, 0),
  ];

  const myPath = [
    new BABYLON.Vector3(0.75, -0.75, -0.2),
    new BABYLON.Vector3(0.75, -0.75, -1.2),
  ];

  const extrusion = BABYLON.MeshBuilder.ExtrudeShape(
    "star",
    {
      shape: myShape,
      closeShape: true,
      path: myPath,
      sideOrientation: BABYLON.Mesh.DOUBLESIDE,
    },
    scene
  );
  return extrusion;
}

function createOctahedron(scene) {
  let octahedron = BABYLON.MeshBuilder.CreatePolyhedron(
    "oct",
    { type: 1, size: 0.35 },
    scene
  );
  octahedron.position.x = 0;
  octahedron.position.y = 2.5;
  octahedron.position.z = 0;
  return octahedron;
}

function createPlane(scene) {
  let plane = BABYLON.MeshBuilder.CreatePlane(
    "plane",
    { size: 3, sideOrientation: BABYLON.Mesh.DOUBLESIDE },
    scene
  );
  plane.position.y = 0;
  return plane;
}

function createPlane2(scene) {
  let plane = BABYLON.MeshBuilder.CreatePlane(
    "plane",
    { size: 3, sideOrientation: BABYLON.Mesh.DOUBLESIDE },
    scene
  );
  plane.position.y = 0;
  plane.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
  return plane;
}

function createLight(scene) {
  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  light.intensity = 0.7;
  light.diffuse = new BABYLON.Color3(1, 0.1 , 0);
  light.specular = new BABYLON.Color3(0, 1, 0.4);
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
  camera.attachControl(true);
  return camera;
}

const createScene = () => {
  let that = {};
  let scene = new BABYLON.Scene(engine);
  //scene.debugLayer.show();
  scene.ambientColor = new BABYLON.Color3(1, 1, 1);

  createGround(scene);
  createSphere(scene);
  createBox(scene);
  createCylinder(scene);
  createCone(scene);
  createTriangle(scene);
  createCapsule(scene);
  createTorus(scene);
  createPlane(scene);
  createTube(scene);
  createExtrusion(scene);
  createOctahedron(scene);
  createPlane2(scene);
  createLight(scene);
  createArcRotateCamera(scene);
  return scene;
};
