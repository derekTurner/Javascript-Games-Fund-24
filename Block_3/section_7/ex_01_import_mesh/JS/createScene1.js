const frameRate = 30;

function importMeshA(scene, x, y) {
    let item = BABYLON.SceneLoader.ImportMesh("", "assets/models/", "low_poly_building.glb", scene, function(meshes) {
        const building = meshes[0];
        building.position.x = x;
        building.position.y = y;
        building.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
        building.rotation = new BABYLON.Vector3(0, 1.5, 0);
    });
    return item
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

    let mesh1 = (that.mesh1 = importMeshA(scene, 2.5,  1.5));// x y pos
    let mesh2 = (that.mesh2 = importMeshA(scene,-2.5,  1.5));// x y pos
    let mesh3 = (that.mesh1 = importMeshA(scene, 2.5, -3.5));// x y pos
    let mesh4 = (that.mesh2 = importMeshA(scene,-2.5, -3.5));// x y pos


    let light = (that.light = createLight(scene));
    let camera = (that.camera = createArcRotateCamera(scene));

    
    return that;
}
