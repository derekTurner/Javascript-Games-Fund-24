import createScene1 from "./createScene1.js";
import createScene2 from "./createScene2.js";

const CanvasName = "index-canvas";

let canvas = document.createElement("canvas");
canvas.id = CanvasName;

canvas.classList.add("renderCanvas");
document.body.appendChild(canvas);

var sceneIndex = 0;
var scenes_arr = [];

console.log("ex_01");


// Simple HTML gui
function loadLeft(){

    scene = scenes_arr[0].scene;
    console.log("Left");
  }
  
  function loadRight(){
      
    scene = scenes_arr[1].scene;
      console.log("Right");
  }
  
  document.getElementById("left").addEventListener('click', loadLeft, {passive: true});
  document.getElementById("right").addEventListener('click', loadRight, {passive: true});

// Start engine and render
let eng = new BABYLON.Engine(canvas, true, null, true);
scenes_arr.push(createScene1(eng));
scenes_arr.push(createScene2(eng));
let scene = scenes_arr[0].scene;
eng.runRenderLoop(() => {
    scene.render();
});

