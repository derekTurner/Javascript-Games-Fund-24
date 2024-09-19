var keyDownMap =[];

export function compassKey(keyID, status){
    keyDownMap[keyID] = status; 
}

export function compass(root){

    // setup rotation quaternions for physics root
    const q1 = BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Y,0);
    const q2 = BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Y, 1 * Math.PI / 4);
    const q3 = BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Y, 2 * Math.PI / 4);
    const q4 = BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Y, 3 * Math.PI / 4);
    const q5 = BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Y, 4 * Math.PI / 4);
    const q6 = BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Y, 5 * Math.PI / 4);
    const q7 = BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Y, 6 * Math.PI / 4);
    const q8 = BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Y, 7 * Math.PI / 4);

    
    let keydown = false;
    // check 2 keys
    if (keyDownMap["w"] & keyDownMap["d"]) {
        root.position.x += 0.1;
        root.position.z += 0.1;
        root.rotationQuaternion = q2;
        keydown=true;
    }
    if (keyDownMap["s"] & keyDownMap["d"] ) {
        root.position.x += 0.1;
        root.position.z -= 0.1;
        root.rotationQuaternion = q4;
        keydown=true;
    }
    if (keyDownMap["s"] & keyDownMap["a"]  ) {
        root.position.x -= 0.1;
        root.position.z -= 0.1;
        root.rotationQuaternion = q6;
        keydown=true;
    }
    if (keyDownMap["a"] & keyDownMap["w"]  ) {
        root.position.x -= 0.1;
        root.position.z += 0.1;
        root.rotationQuaternion = q8;
        keydown=true;
    }
    // check 1 key
    if  (keydown == false) {
        if (keyDownMap["w"] ) {
            root.position.z += 0.1;
            root.rotationQuaternion = q1;
            keydown=true;
        }
        if (keyDownMap["d"] ) {
            root.position.x += 0.1;
            root.rotationQuaternion = q3;
            keydown=true;
        }
        if (keyDownMap["s"] ) {
            root.position.z -= 0.1;
            root.rotationQuaternion = q5;
            keydown=true;
        }
        if (keyDownMap["a"] ) {
            root.position.x -= 0.1;
            root.rotationQuaternion = q7;
            keydown=true;
        }
    }
    return keydown;
}