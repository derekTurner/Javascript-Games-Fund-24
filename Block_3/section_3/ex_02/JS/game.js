// https://playground.babylonjs.com/#NGS9AU
// gui 
var createScene = function () {
    var scene = new BABYLON.Scene(engine);

    var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0, 100, 100), scene);
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 100, new BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {}, scene);

    var unitVec = new BABYLON.Vector3(1, 1, 1);
    sphere.scaling = unitVec.scale(5);

    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
    
    var slider = new BABYLON.GUI.Slider();
    slider.minimum = 0.1;
    slider.maximum = 20;
    slider.value = 5;
    slider.height = "20px";
    slider.width = "150px";
    slider.color = "#003399";
    slider.background = "grey";
    slider.left = "120px";
    slider.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    slider.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    slider.onValueChangedObservable.add(function (value) {
        sphere.scaling = unitVec.scale(value);
    });


    advancedTexture.addControl(slider);
    return scene;
}