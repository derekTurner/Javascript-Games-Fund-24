# Element 1

Select Element 1 from the Elements dropdown menu.

This demonstrates a range of shapes in a geometric arrangement with planes separating quadrants.

<iframe 
    height="1100" 
    width="100%" 
    scrolling="no" 
    title="frame animaations" 
    src="Block_4/demo/public/index.html" 
    frameborder="no" 
    loading="lazy" 
    allowtransparency="true" 
    allowfullscreen="true">
</iframe>

The scene sits on the web page elements1.html witin a div wit id = canvasElement.

**element1.html**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>JSPF - Example Scene 1</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://cdn.babylonjs.com/babylon.js"></script>
  <script src="JS/element1.js"></script>
</head>
<body>

<div class="container-fluid p-5 bg-primary text-white text-center">
  <h1>JavaScript Games: Programming Fundamentals</h1>
  <p>Example highlighting the layout of Elements!</p> 
</div>

<nav class="navbar navbar-expand-sm bg-dark navbar-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Element 1</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="collapsibleNavbar">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" href="index.html">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="team.html">Team</a>
          </li>  
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">Elements</a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="element1.html">Element 1</a></li>
              <li><a class="dropdown-item" href="element2.html">Element 2</a></li>
              <li><a class="dropdown-item" href="element3.html">Element 3</a></li>
              <li><a class="dropdown-item" href="element4.html">Element 4</a></li>
              <li><a class="dropdown-item" href="element5.html">Element 5</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <div id="canvasElement">
    <canvas id="renderCanvas" style="width:1000px; height:600px; display: block; margin-left: auto; margin-right: auto; margin-top: 50px;"></canvas>
    <script>
      const canvas = document.getElementById("renderCanvas");
      const engine = new BABYLON.Engine(canvas, true);
      const scene = createScene();
      engine.runRenderLoop(function() {
        scene.render();
      });
      window.addEventListener("resize", function() {
        engine.resize();
      });
    </script>
  </div>

</body>
</html>

```

The source file is linked as JS/element1.js.  I like to gather the creation of items into small functions, passing the scene as a parameter.  That makes the code easier to reproduce and adapt.  Writing in small sections makes debugging easier.

**JS/element1.js**

```javascript
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
```

Ground, Sphere, Box, and Cylinder are all standard mesh shapes.  Each shape is positioned.  The appearence can be modified by options expressed as a {JSON object list}.

The Cone and the triangle are both based on the Cylinder and show what variation can be achieved with simple options.

```javascript
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
```

A capsule mesh here is embillished by adding a texture.  The texture is created, in this case based on standard material, and then its ambientTexture and diffuseColor properties are set.

The texture is then applied to the capsule material.

```javascript
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
```

A torus function is added with a similar material.

```javascript
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
```

When a tube is created care must be taken over the DOUBLESIDE option.

```javascript
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
```
To create an extrusion, define a shape using vector points and a path along which this will be extruded.  Take care again over the DOUBLESIDE option.

```javascript
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
```
A range of shapes can be created using the Polyhedron builder, controlling the type option.

```javascript
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
```
A couple of intersecting planes can be created, taking care of position and rotation.  The planes need the DOUBLESIDE option so that they can be viewed from both sides.  Yuu may have noticed already that ground is by default transparent looking from below.

```javascript
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
```

Light and camera will be reproduced in some way on most scenes.  You can take care of the colour properties of the light.

So far no scene has been created.  Each of these create functions needs to be called to add the items to the scene.

```javascript
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
```

The use of ```that = {};``` is not strictly necessary at this stage, but it will become more useful as scenes become more detailed and there is a need to access created elements to manipulate at a later stage.

For now the createScene function assembles all the elements into the scene.  This is called from within the html file **element1.html**

```html
<script>
      const canvas = document.getElementById("renderCanvas");
      const engine = new BABYLON.Engine(canvas, true);
      const scene = createScene();
      engine.runRenderLoop(function() {
        scene.render();
      });
      window.addEventListener("resize", function() {
        engine.resize();
      });
    </script>
```