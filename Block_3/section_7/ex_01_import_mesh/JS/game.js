const createScene = function () {
    const scene = new BABYLON.Scene(engine);

    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 20, new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));

    /* const player = BABYLON.SceneLoader.Append("./assets/models/", "low_poly_humanoid_robot.glb", scene, function (meshes) {
        scene.createDefaultCameraOrLight(true, true, true);
    }); */
    
    BABYLON.SceneLoader.ImportMesh("", "assets/models/", "low_poly_building.glb", scene, function(meshes) {
        const building = meshes[0];
        building.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
        building.rotation = new BABYLON.Vector3(0, 1.5, 0);
    });
    
    BABYLON.SceneLoader.ImportMesh("", "assets/models/", "low_poly_building.glb", scene, function(meshes) {
        const building = meshes[0];
        building.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
        building.position.x = -5;
        building.rotation = new BABYLON.Vector3(0, 1.5, 0);
    });

    /* const box = BABYLON.MeshBuilder.CreateBox("box", {});
    box.position.x = 2;

    const frameRate = 10;

    const xSlide = new BABYLON.Animation("xSlide", "position.x", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    const ySlide = new BABYLON.Animation("ySlide", "position.y", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    const xRotate = new BABYLON.Animation("xRotate", "rotation.x", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    const yRotate = new BABYLON.Animation("yRotate", "rotation.y", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    const xScaling = new BABYLON.Animation("xScaling", "scaling.x", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    const yScaling = new BABYLON.Animation("yScaling", "scaling.y", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    const zScaling = new BABYLON.Animation("zScaling", "scaling.z", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    const keyFrames = [];
    keyFrames.push({
        frame: 0,
        value: 2
    });
    keyFrames.push({
        frame: frameRate,
        value: -2
    });
    keyFrames.push({
        frame: 2 * frameRate,
        value: 2
    });

    const keyFrames2 = [];
    keyFrames2.push({
        frame: 0,
        value: 2
    });
    keyFrames2.push({
        frame: frameRate,
        value: -2
    });
    keyFrames2.push({
        frame: 2 * frameRate,
        value: 2
    });

    const rotateXKeyFrames = [];
    rotateXKeyFrames.push({
        frame: 0,
        value: 0
    });
    rotateXKeyFrames.push({
        frame: frameRate,
        value: Math.PI
    });
    rotateXKeyFrames.push({
        frame: 2 * frameRate,
        value: Math.PI * 2
    });

    const rotateYKeyFrames = [];
    rotateYKeyFrames.push({
        frame: 0,
        value: Math.PI * 2
    });
    rotateYKeyFrames.push({
        frame: frameRate,
        value: Math.PI
    });
    rotateYKeyFrames.push({
        frame: 2 * frameRate,
        value: 0
    });

    const scaleKeyFrames = [];
    scaleKeyFrames.push({
        frame: 0,
        value: 0
    });
    scaleKeyFrames.push({
        frame: frameRate,
        value: 5
    });
    scaleKeyFrames.push({
        frame: 2 * frameRate,
        value: 10
    });

    xSlide.setKeys(keyFrames);
    ySlide.setKeys(keyFrames2);
    xRotate.setKeys(rotateXKeyFrames);
    yRotate.setKeys(rotateYKeyFrames);
    xScaling.setKeys(scaleKeyFrames);
    yScaling.setKeys(scaleKeyFrames);
    zScaling.setKeys(scaleKeyFrames);
    box.animations.push(xSlide);
    box.animations.push(ySlide);
    box.animations.push(xRotate);
    box.animations.push(yRotate);
    box.animations.push(xScaling);
    box.animations.push(yScaling);
    box.animations.push(zScaling);
    scene.beginAnimation(box, 0, 2 * frameRate, true );*/

    return scene;
}