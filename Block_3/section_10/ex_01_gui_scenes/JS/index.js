import guiScene  from "./guiScene.js";
import {scenes, scene, engine, setSceneIndex}  from "./createScenes.js";

setSceneIndex(0);

let gui = guiScene(engine);
gui.autoClear = false;
engine.runRenderLoop(() => {
    scene.render();
    gui.render();
});


