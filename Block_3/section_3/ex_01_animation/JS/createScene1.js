const frameRate = 30;

function createBox(scene) {
    const box = BABYLON.MeshBuilder.CreateBox("box", {});
    box.position.x = 2;
    return box;
}

function createxSlide(frameRate){
    const xSlide = new BABYLON.Animation(
        "xSlide",
        "position.x",
        frameRate,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );

    const keyFramesX = [];
    keyFramesX.push({ frame: 0, value: 2 });
    keyFramesX.push({ frame: frameRate, value: -2 });
    keyFramesX.push({ frame: (2 * frameRate)-1, value: (-2 + (4 * ( frameRate /2) / ((frameRate/2) -1))) });

    xSlide.setKeys(keyFramesX);

    return xSlide
}

function createLight(scene) {
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);
    light.intensity = 0.7;
    return light;
}

function createArcRotateCamera(scene) {
    let camAlpha = -Math.PI / 2;
    let camBeta = Math.PI / 2.5;
    let camDist = 10;
    let camTarget = new BABYLON.Vector3(0, 0, 0);
    let camera = new BABYLON.ArcRotateCamera("camera1", camAlpha, camBeta, camDist, camTarget, scene);
    camera.attachControl(true);
    return camera;
}

export default function createStartScene(engine) {
    let that = {};
    let scene = (that.scene = new BABYLON.Scene(engine));
    //scene.debugLayer.show();

    let box = (that.box = createBox(scene));
    box.animations.push(createxSlide(frameRate));

    let light = (that.light = createLight(scene));
    let camera = (that.camera = createArcRotateCamera(scene));

    that.scene.beginAnimation(box, 0, 2 * frameRate, true);
    return that;
}
