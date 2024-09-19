# Shapes


This demonstrates a range of shapes in a geometric arrangement with planes separating quadrants.

Create a folder shapes01 and copy the template files from a previous scene as a starter.

I like to gather the creation of items into small functions, passing the scene as a parameter.  That makes the code easier to reproduce and adapt.  Writing in small sections and small files makes debugging easier.

Import the required resources into createStartScene.ts and gather the file assets from github to add to the assets/texture folder.

 * lavatile.jpg
 * reflectivity.jpg
 * wood.jpg

**createStartScene.ts**
```javascript
import { SceneData } from "./interfaces ";

import {
  Scene,
  ArcRotateCamera,
  Vector3,
  MeshBuilder,
  Mesh,
  StandardMaterial,
  HemisphericLight,
  Color3,
  Engine,
  Texture,
} from "@babylonjs/core";

//Assets from https://github.com/BabylonJS/Assets/blob/master/Assets.md

```
Now define functions for the elements to be placed in the scene



```javascript
function createGround(scene: Scene) {
  let ground = MeshBuilder.CreateGround(
    "ground",
    { width: 3, height: 3 },
    scene
  );
  var groundMaterial = new StandardMaterial("groundMaterial", scene);
  groundMaterial.backFaceCulling = false;
  ground.material = groundMaterial;
  groundMaterial.diffuseColor = new Color3(0.1, 1, 0.5);
  return ground;
}

```
Add a ground material to the ground and set backFaceCulling to false so that the ground will be solid and visible from below.

Add color to the material.

This is then a general pattern for meshes to add.

```javascript

function createSphere(scene: Scene) {
  let sphere = MeshBuilder.CreateSphere(
    "sphere",
    { diameter: 1, segments: 32 },
    scene
  );
  sphere.position.y = 0;
  var texture = new StandardMaterial("grass1", scene);
  texture.emissiveTexture = new Texture("./src/assets/textures/lavatile.jpg", scene);
  sphere.material = texture;
  return sphere;
}

function createBox(scene: Scene) {
  let box = MeshBuilder.CreateBox(
    "box",
    { width: 1, height: 1 },
    scene
  );
  box.position.x = -1;
  box.position.y = 1;
  box.position.z = 1;

  var texture = new StandardMaterial("reflective", scene);
  texture.ambientTexture = new Texture("./src/assets/textures/reflectivity.jpg", scene);
  texture.diffuseColor = new Color3(1, 1, 1);
  box.material = texture;
  return box;
}

function createCylinder(scene: Scene) {
  let cylinder = MeshBuilder.CreateCylinder(
    "cylinder",
    { height: 1, diameter: 0.7 },
    scene
  );
  cylinder.position.x = 1;
  cylinder.position.y = 1;
  cylinder.position.z = 1;

  var texture = new StandardMaterial("reflective", scene);
  texture.ambientTexture = new Texture("./src/assets/textures/reflectivity.jpg", scene);
  texture.diffuseColor = new Color3(1, 1, 1);
  cylinder.material = texture;
  return cylinder;
}

function createCone(scene: Scene) {
  let cone = MeshBuilder.CreateCylinder(
    "cone",
    { height: 1, diameterBottom: 0.7, diameterTop: 0 },
    scene
  );
  cone.position.x = 1;
  cone.position.y = 1;
  cone.position.z = -1;

  var texture = new StandardMaterial("reflective", scene);
  texture.ambientTexture = new Texture("./src/assets/textures/reflectivity.jpg", scene);
  texture.diffuseColor = new Color3(1, 1, 1);
  cone.material = texture;
  return cone;
}

function createTriangle(scene: Scene) {
  let triangle = MeshBuilder.CreateCylinder(
    "triangle",
    { height: 1, diameter: 0.7, tessellation: 3 },
    scene
  );
  triangle.position.x = -1;
  triangle.position.y = 1;
  triangle.position.z = -1;

  var texture = new StandardMaterial("reflective", scene);
  texture.ambientTexture = new Texture("./src/assets/textures/reflectivity.jpg", scene);
  texture.diffuseColor = new Color3(1, 1, 1);
  triangle.material = texture;
  return triangle;
}
```

Sphere, Box, and Cylinder are all standard mesh shapes.  Each shape is positioned.  The appearence can be modified by options expressed as a {JSON object list}.

The Cone and the triangle are both based on the Cylinder and show what variation can be achieved with simple options.

```javascript
function createCapsule(scene: Scene) {
  let capsule = MeshBuilder.CreateCapsule(
    "capsule",
    { radius: 0.35, height: 1, radiusTop: 0.1 },
    scene
  );
  capsule.position.x = -1;
  capsule.position.y = -1;
  capsule.position.z = -1;

  var texture = new StandardMaterial("reflective", scene);
  texture.ambientTexture = new Texture("./src/assets/textures/reflectivity.jpg", scene);
  texture.diffuseColor = new Color3(1, 0.6, 0.6);
  capsule.material = texture;

  var texture = new StandardMaterial("reflective", scene);
  texture.ambientTexture = new Texture("./src/assets/textures/reflectivity.jpg", scene);
  texture.diffuseColor = new Color3(1, 1, 1);
  capsule.material = texture;
  return capsule;
}
```

A capsule mesh here is embillished by adding a texture.  The texture is created, in this case based on standard material, and then its ambientTexture and diffuseColor properties are set.

The texture is then applied to the capsule material.

```javascript
function createTorus(scene: Scene) {
  let torus = MeshBuilder.CreateTorus(
    "torus",
    { diameter: 0.7, thickness: 0.6, tessellation: 10 },
    scene
  );
  torus.position.x = -1;
  torus.position.y = -1;
  torus.position.z = 1;

  var texture = new StandardMaterial("reflective", scene);
  texture.ambientTexture = new Texture("./src/assets/textures/reflectivity.jpg", scene);
  texture.diffuseColor = new Color3(0.6, 0.6, 1);
  torus.material = texture;

  var texture = new StandardMaterial("reflective", scene);
  texture.ambientTexture = new Texture("./src/assets/textures/reflectivity.jpg", scene);
  texture.diffuseColor = new Color3(1, 1, 1);
  torus.material = texture;
  return torus;
}
```

A torus function is added with a similar material.

```javascript
function createTube(scene: Scene) {
  const myPath = [
    new Vector3(0.85, -0.85, 0.85),
    new Vector3(0.35, -0.35, 0.35),
  ];

  const tube = MeshBuilder.CreateTube(
    "tube",
    { path: myPath, radius: 0.4, sideOrientation: Mesh.DOUBLESIDE },
    scene
  );

  var texture = new StandardMaterial("reflective", scene);
  texture.ambientTexture = new Texture("./src/assets/textures/reflectivity.jpg", scene);
  texture.diffuseColor = new Color3(1, 1, 1);
  tube.material = texture;
  return tube;
}

```

When a tube is created care must be taken over the DOUBLESIDE option.

```javascript
function createExtrusion(scene: Scene) {
  const myShape = [
    new Vector3(0, 0.7, 0),
    new Vector3(0.2, 0.2, 0),
    new Vector3(0.7, 0, 0),
    new Vector3(0.2, -0.2, 0),
    new Vector3(0, -0.7, 0),
    new Vector3(-0.2, -0.2, 0),
    new Vector3(-0.7, 0, 0),
    new Vector3(-0.2, 0.2, 0),
  ];

  const myPath = [
    new Vector3(0.75, -0.75, -0.2),
    new Vector3(0.75, -0.75, -1.2),
  ];

  const extrusion = MeshBuilder.ExtrudeShape(
    "star",
    {
      shape: myShape,
      closeShape: true,
      path: myPath,
      sideOrientation: Mesh.DOUBLESIDE,
    },
    scene
  );

  var texture = new StandardMaterial("reflective", scene);
  texture.ambientTexture = new Texture("./src/assets/textures/reflectivity.jpg", scene);
  texture.diffuseColor = new Color3(1, 1, 1);
  extrusion.material = texture;
  return extrusion;
}
```
To create an extrusion, define a shape using vector points and a path along which this will be extruded.  Take care again over the DOUBLESIDE option.

```javascript
function createOctahedron(scene: Scene) {
  let octahedron = MeshBuilder.CreatePolyhedron(
    "oct",
    { type: 1, size: 0.35 },
    scene
  );
  octahedron.position.x = 0;
  octahedron.position.y = 2.5;
  octahedron.position.z = 0;

  var texture = new StandardMaterial("reflective", scene);
  texture.ambientTexture = new Texture("./src/assets/textures/reflectivity.jpg", scene);
  texture.diffuseColor = new Color3(1, 1, 1);
  octahedron.material = texture;
  return octahedron;
}
```
A range of shapes can be created using the Polyhedron builder, controlling the type option.

```javascript
function createPlane(scene: Scene) {
  let plane = MeshBuilder.CreatePlane(
    "plane",
    { size: 3, sideOrientation: Mesh.DOUBLESIDE },
    scene
  );
  plane.position.y = 0;

  var texture = new StandardMaterial("reflective", scene);
  texture.ambientTexture = new Texture("./src/assets/textures/wood.jpg", scene);
  texture.diffuseColor = new Color3(1, 1, 1);
  plane.material = texture;
  return plane;
}

function createPlane2(scene: Scene) {
  let plane = MeshBuilder.CreatePlane(
    "plane",
    { size: 3, sideOrientation: Mesh.DOUBLESIDE },
    scene
  );
  plane.position.y = 0;
  plane.rotation = new Vector3(0, Math.PI / 2, 0);

  var texture = new StandardMaterial("reflective", scene);
  texture.ambientTexture = new Texture("./src/assets/textures/wood.jpg", scene);
  texture.diffuseColor = new Color3(1, 1, 1);
  plane.material = texture;
  return plane;
}
```
A couple of intersecting planes can be created, taking care of position and rotation.  The planes need the DOUBLESIDE option so that they can be viewed from both sides.  Yuu may have noticed already that ground is by default transparent looking from below.

```javascript
function createLight(scene: Scene) {
  const light = new HemisphericLight(
    "light",
    new Vector3(0, 1, 0),
    scene
  );
  light.intensity = 0.7;
  light.diffuse = new Color3(1, 0.6 , 0.6);
  light.specular = new Color3(0, 1, 0.4);
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
  camera.attachControl(true);
  return camera;
}

```

Light and camera will be reproduced in some way on most scenes.  You can take care of the colour properties of the light.

So far no scene has been created.  Each of these create functions needs to be called to add the items to the scene.

```javascript
export default function createStartScene(engine: Engine) {

  let scene = new Scene(engine);
  scene.ambientColor = new Color3(1, 1, 1);

  let ground = createGround(scene);
  let sphere = createSphere(scene);
  let box = createBox(scene);
  let cylinder = createCylinder(scene);
  let cone = createCone(scene);
  let triangle = createTriangle(scene);
  let capsule = createCapsule(scene);
  let torus = createTorus(scene);
  let plane = createPlane(scene);
  let tube = createTube(scene);
  let extrusion = createExtrusion(scene);
  let octahedron = createOctahedron(scene);
  let plane2 = createPlane2(scene);
  let lightHemispheric = createLight(scene);
  let camera =createArcRotateCamera(scene);

  let that: SceneData = {
    scene,
    ground,
    sphere,
    box,
    cylinder,
    cone,
    triangle,
    capsule,
    torus,
    plane,
    tube,
    extrusion,
    octahedron,
    plane2,
    lightHemispheric,
    camera
  };
  return that;
}
```

Ensure that the SceneData interface in interfaces.d.ts exactly matches the contents of the scene.

**interfaces.d.ts**
```javascript
import {
  Scene,
  Mesh,
  HemisphericLight,
  Camera,
} from "@babylonjs/core";

export interface SceneData {
  scene: Scene,
  ground: Mesh,
  sphere: Mesh,
  box: Mesh,
  cylinder: Mesh,
  cone: Mesh,
  triangle: Mesh,
  capsule: Mesh,
  torus: Mesh,
  plane: Mesh,
  tube: Mesh,
  extrusion: Mesh,
  octahedron: Mesh,
  plane2: Mesh,
  lightHemispheric: HemisphericLight,
  camera: Camera
}
```

This is a static site so the file CreateRunScene.ts is left with template code ready for actions to be added later.

**createRunScene.ts**
```javascript
import {  } from "@babylonjs/core";

import { SceneData } from "./interfaces ";


export default function createRunScene(runScene: SceneData) {
  runScene.scene.onAfterRenderObservable.add(() => {
  // No action, this is a static scene
  });
}

```
Now the file should run and show a static scene which illustrates a range of shapes.  

<iframe 
    height="600" 
    width="100%" 
    scrolling="no" 
    title="shapes" 
    src="Block_3/section_4/distribution/index.html" 
    frameborder="no" 
    loading="lazy" 
    allowtransparency="true" 
    allowfullscreen="true">
</iframe>