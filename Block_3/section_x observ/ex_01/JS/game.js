const createScene = () => {
    const scene = new BABYLON.Scene(engine);

    //Add a camera
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new BABYLON.Vector3(0, 0, 0));
    //camera.attachControl(canvas, true);// This line adds arrow key control to camera

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));


    const box = BABYLON.MeshBuilder.CreateBox("box", {});
    box.position.x = 2


    scene.onKeyboardObservable.add((kbInfo) => {
        switch (kbInfo.type) {
            case BABYLON.KeyboardEventTypes.KEYDOWN:
                switch (kbInfo.event.key) {
                    case "a":
                    case "A":
                    case "ArrowLeft":    
                        box.position.x -= 0.1;
                        break;
                    case "d":
                    case "D":
                    case "ArrowRight":     
                        box.position.x += 0.1;
                        break;
                    case "s":
                    case "S":
                    case "ArrowDown":     
                        box.position.y -= 0.1;
                        break;
                    case "w":
                    case "W":
                    case "ArrowUp": 
                        box.position.y += 0.1;
                        break;
                }
                break;
        }
    })

    return scene;
}




