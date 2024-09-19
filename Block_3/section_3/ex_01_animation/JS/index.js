import createScene1 from "./createScene1.js";
import createScene2 from "./createScene2.js";
import createScene3 from "./createScene3.js";
import createScene4 from "./createScene4.js";
import createScene5 from "./createScene5.js";

const CanvasName = "renderCanvas";

let canvas = document.createElement("canvas");
canvas.id = CanvasName;

canvas.classList.add("renderCanvas");
document.body.appendChild(canvas);

var sceneIndex = 0;
var scenes_arr = [];

console.log("ex_01");

// Simple HTML gui

function showScene(evt) {
    //scene = scenes_arr[index].scene;
    //scene = scenes_arr[0].scene;
    console.log(evt.srcElement.id);
    switch (evt.srcElement.id) {
        case "s1":
            scene = scenes_arr[0].scene;
            break;
        case "s2":
            scene = scenes_arr[1].scene;
            break;
        case "s3":
            scene = scenes_arr[2].scene;
            break;
        case "s4":
            scene = scenes_arr[3].scene;
            break;
        case "s5":
            scene = scenes_arr[4].scene;
            break;
    }
}

document.getElementById("s1").addEventListener("click", showScene, { passive: true });
document.getElementById("s2").addEventListener("click", showScene, { passive: true });
document.getElementById("s3").addEventListener("click", showScene, { passive: true });
document.getElementById("s4").addEventListener("click", showScene, { passive: true });
document.getElementById("s5").addEventListener("click", showScene, { passive: true });

// Start engine and render
let eng = new BABYLON.Engine(canvas, true, null, true);
scenes_arr.push(createScene1(eng));
scenes_arr.push(createScene2(eng));
scenes_arr.push(createScene3(eng));
scenes_arr.push(createScene4(eng));
scenes_arr.push(createScene5(eng));

let scene = scenes_arr[0].scene;
eng.runRenderLoop(() => {
    scene.render();
});
