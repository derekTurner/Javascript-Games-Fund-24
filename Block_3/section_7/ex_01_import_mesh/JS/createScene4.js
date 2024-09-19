const frameRate = 30;

function importMeshA(scene, x, y) {
    const item = BABYLON.SceneLoader.ImportMeshAsync("", "assets/models/", "low_poly_building.glb", scene);
    item.then(
        function(value) { //console.log(value) ;
            const mesh = value.meshes[0];
            mesh.position.x = x;
            mesh.position.y = y;
            mesh.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
            mesh.rotation = new BABYLON.Vector3(0, 1.5, 0);
        },
        function(error) { /* code if some error */ }
      );
      return item;
}    

    
function createYRotate(frameRate) {
    const yRotation = new BABYLON.Animation(
        "yRotation",
        "rotation.y",
        frameRate,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );

    const keyFramesRY = [];
    keyFramesRY.push({ frame: 0, value: 0 });
    keyFramesRY.push({ frame: frameRate, value: Math.PI });
    keyFramesRY.push({ frame: 2 * frameRate, value: Math.PI * 2 });

    yRotation.setKeys(keyFramesRY);

    return yRotation;
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
    camera.attachControl(true);
    return camera;
}

export default function createStartScene(engine) {
    let that = {};
    let scene = (that.scene = new BABYLON.Scene(engine));
    //scene.debugLayer.show();

    let mesh1 = (that.mesh1 = importMeshA(scene,-2.5,  1.5));// x y pos
    let mesh2 = (that.mesh2 = importMeshA(scene, 2.5,  1.5));// x y pos
    let mesh3 = (that.mesh1 = importMeshA(scene,-2.5, -3.5));// x y pos
    let mesh4 = (that.mesh2 = importMeshA(scene, 2.5, -3.5));// x y pos

    const addYRotate = function(value) { //console.log(value) ;
        const mesh = value.meshes[0];
        console.log(mesh);
        mesh.animations.push(createYRotate(frameRate));
        that.scene.beginAnimation(mesh, 0, 2 * frameRate, true);
    }

    const errorHandler = function(error) { /* code if some error */ }
    
    mesh1.then( addYRotate, errorHandler);
    mesh2.then( addYRotate, errorHandler);
    mesh3.then( addYRotate, errorHandler);
    
    let light = (that.light = createLight(scene));
    let camera = (that.camera = createArcRotateCamera(scene));
    
    
    return that;
}