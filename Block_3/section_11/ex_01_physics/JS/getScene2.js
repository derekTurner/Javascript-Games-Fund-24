import createScene2  from "./createScene2.js";


const CanvasName = "renderCanvas";

let canvas = document.createElement("canvas");
canvas.id = CanvasName;

canvas.classList.add("renderCanvas");
document.body.appendChild(canvas);

var sceneIndex = 0;
var scenes_arr = [];


// Start engine and render
let engine = new BABYLON.Engine(canvas, true, null, true);
let scene2 = createScene2(engine);

engine.runRenderLoop(() => {
    scene2.scene.render();
});
