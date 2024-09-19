import createScene1  from "./createScene1.js";


const CanvasName = "renderCanvas";

let canvas = document.createElement("canvas");
canvas.id = CanvasName;

canvas.classList.add("renderCanvas");
document.body.appendChild(canvas);

var sceneIndex = 0;
var scenes_arr = [];


// Start engine and render
let engine = new BABYLON.Engine(canvas, true, null, true);
let scene1 = createScene1(engine);

engine.runRenderLoop(() => {
    scene1.scene.render();
});
