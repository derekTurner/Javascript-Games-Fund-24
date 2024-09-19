var sValue = 0;

function createArcRotateCamera(scene) {
  let camAlpha = -Math.PI / 2,
    camBeta = Math.PI / 2.5,
    camDist = 10,
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

function createLight(scene) {
  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  light.intensity = 0.7;
  light.diffuse = new BABYLON.Color3(1, 0, 0);
  light.specular = new BABYLON.Color3(0, 1, 0);
  light.groundColor = new BABYLON.Color3(0, 1, 0);
  return light;
}

function createGround(scene) {
  let ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 6, height: 6 },
    scene
  );
  return ground;
}

function createPointLight(scene) {
  var light = new BABYLON.PointLight(
    "Omni",
    new BABYLON.Vector3(20, 20, 100),
    scene
  );
  return light;
}

function createSphere(scene) {
  let sphere = BABYLON.MeshBuilder.CreateSphere(
    "sphere",
    { diameter: 0.75, segments: 32 },
    scene
  );
  sphere.position.x = 0;
  sphere.position.y = 1.825;
  sphere.position.z = 0;
  return sphere;
}

function createSkull(scene, camera) {
  var skull;
  var skullMaterial = new BABYLON.StandardMaterial("skullmat", scene);
  // The first parameter can be used to specify which mesh to import. Here we import all meshes
  let item = BABYLON.SceneLoader.ImportMesh(
    "",
    "assets/scenes/",
    "skull.babylon",
    scene,
    function (newMeshes) {
      // Set the target of the camera to the first imported mesh
      camera.target = newMeshes[0];
      skull = newMeshes[0];
      skull.material = skullMaterial;
      scene.onBeforeRenderObservable.add(()=> {
        if (sValue != 0) {
            skull.rotation.y = sValue;
        }

    }
  );

   
});
  
}

function aimLight(scene, camera, light) {
  // Move the light with the camera
  scene.registerBeforeRender(function () {
    light.position = camera.position;
  });
}

function myGui(scene) {
  // Load in a full screen GUI from the snippet server
  let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
    "GUI",
    true,
    scene
  );
  //let loadedGUI = await advancedTexture.parseFromSnippetAsync("D04P4Z");
  var panel = new BABYLON.GUI.StackPanel();
  panel.width = "220px";
  panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
  advancedTexture.addControl(panel);

  var header = new BABYLON.GUI.TextBlock();
  header.text = "Y-rotation: 0 deg";
  header.height = "30px";
  header.color = "white";
  panel.addControl(header);

  var sliderY = new BABYLON.GUI.Slider();
  sliderY.minimum = 0;
  sliderY.maximum = 2 * Math.PI;
  sliderY.value = 0;
  sliderY.height = "20px";
  sliderY.width = "200px";
  sliderY.onValueChangedObservable.add(function (value) {
    header.text =
      "Y-rotation: " + (BABYLON.Tools.ToDegrees(value) | 0) + " deg";
    sValue = sliderY.value;
  });
  
  panel.addControl(sliderY);



  return panel;
}

export default function createStartScene(engine) {
  let that = {};
  let scene = (that.scene = new BABYLON.Scene(engine));
  var soundsReady = 0;
  const soundReady = () => {
    soundsReady++;
    if (soundsReady === 3) {
      music1.play();
      music2.play();
      music3.play();
    }
  };

  const music1 = new BABYLON.Sound(
    "Violons11",
    "assets/audio/violons11.wav",
    scene,
    soundReady,
    { loop: true }
  );
  const music2 = new BABYLON.Sound(
    "Violons18",
    "assets/audio/violons18.wav",
    scene,
    soundReady,
    { loop: true }
  );
  const music3 = new BABYLON.Sound(
    "Cellolong",
    "assets/audio/cellolong.wav",
    scene,
    soundReady,
    { loop: true }
  );

  that.scene.clearColor = new BABYLON.Color3.Blue();

  let sphere = (that.sphere = createSphere(scene));
  let camera = createArcRotateCamera(scene);
  let light = (that.light = createLight(scene));
  let pl = createPointLight(scene);
  aimLight(scene, camera, pl);
  let ground = (that.ground = createGround(scene));
  createSkull(scene, camera);
  let panel = myGui(scene);
  return that;
}
