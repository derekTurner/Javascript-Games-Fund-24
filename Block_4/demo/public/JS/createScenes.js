import createScene1  from "./createScene1.js";
import createScene2  from "./createScene2.js";
import createScene3  from "./createScene3.js";
import createScene4  from "./createScene4.js";

const canvas = document.getElementById("renderCanvas");

export let scene;

export let engine = new BABYLON.Engine(canvas, true, null, true);

let scenes = [];

scenes[0] = createScene1(engine);
scenes[1] = createScene2(engine);
scenes[2] = createScene3(engine);
scenes[3] = createScene4(engine);
scene = scenes[0].scene;

export function setSceneIndex(i){
    scene = scenes[i].scene;
}