import {setSceneIndex}        from "./createScenes.js";

function createSceneButton(name, index, x,y, advtex){
    var button = BABYLON.GUI.Button.CreateSimpleButton(name, index);
        button.left = x;
        button.top  =  y;
        button.width = "80px"
        button.height = "30px";
        button.color = "white";
        button.cornerRadius = 20;
        button.background = "green";
        button.onPointerUpObservable.add(function() {
            setSceneIndex(index - 1);
        });
        advtex.addControl(button); 
        return button;
}

export default function guiScene(engine) {
    var guiScene = new BABYLON.Scene(engine);

    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 100, BABYLON.Vector3.Zero(), guiScene);

    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("myUI",true);

    var button1 = createSceneButton("but1", 1,"-100px", "120px", advancedTexture);
    var button2 = createSceneButton("but2", 2,"000px", "120px", advancedTexture);
    var button3 = createSceneButton("but3", 3,"100px", "120px", advancedTexture);
     
    //guiScene.debugLayer.show();
    return guiScene;
}    