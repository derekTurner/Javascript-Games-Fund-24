## A-Frame

[A frame](https://aframe.io/) is a framework which allows 3D and VR content to be created in a browser using HTML. It is interesting to see what can be achieved in this way.

The first example from the getting started section is reproduced here.

```html
<html>
    <head>
        <script src="https://aframe.io/releases/1.3.0/aframe.min.js"></script>
    </head>
    <body>
        <a-scene>
            <a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9"></a-box>
            <a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E"></a-sphere>
            <a-cylinder position="1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D"></a-cylinder>
            <a-plane position="0 0 -4" rotation="-90 0 0" width="4" height="4" color="#7BC8A4"></a-plane>
            <a-sky color="#ECECEC"></a-sky>
        </a-scene>
    </body>
</html>
```

This produces a 3D scene. CTRL + ALT + i will open an editor which allows you to alter the scene. The changes you make when you select an entity will cause highlighting on the right hand side of the editor view. You can then cut and paste from this view back into your code to make the edits permenant.

<iframe 
    height="600" 
    width="80%" 
    scrolling="no" 
    title="aframe.html" 
    src="Block_1/section_5/public_aframe/index.html" 
    frameborder="no" 
    loading="lazy" 
    allowtransparency="true" 
    allowfullscreen="true">
</iframe>

## 360 views

As a demonstration of what can be done relatively simply, I have included here a 360 tour of a boat.

The head of the HTML document contains a link to load aframe and also to add the aframe-look-at-componentt feature.  

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>Scouting Venture 360</title>
        <script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
        <script src="https://unpkg.com/aframe-look-at-component@1.0.0/dist/aframe-look-at-component.min.js"></script>
```

Next, within the head two AFRAME components are registered.  These have attributes which are a name and a json object.

The first is **spot**  which which features a schema and a function named init.  

```javascript
            AFRAME.registerComponent("spot", {
                schema: {
                    linkto: { type: "string", default: "" },
                    spotgroup: { type: "string", default: "" },
                },


```

The schema defines **linkto** and **spotgroup** so that the spot component can be added to an image and the values of the component properties can be set in the spot attribute in the html body

```html
<a-image spot="linkto:#boat3;spotgroup:group-boat3" position="2 0 -8"></a-image>
```
The image associated with the spot will be defined in the init function by #hotspot.

```javascript
                init: function () {
                    //add image source of hotspot icon
                    this.el.setAttribute("src", "#hotspot");
```

 This is defined in the asset list in the document body.

```html
<a-assets>
                    <img id="hotspot" src="./images/hotspot.png" alt="hotspot" />
</a-assets>
```

The init function also causes the direction of the image "hotspot" to face the camera in the scene.


```javascript
                    //make the icon look at the camera all the time
                    this.el.setAttribute("look-at", "#cam");
```

This.data refers to the data defined by the schema so passing it to a variable makes available data.linkto and data.spotgroup.

```javascript
                    var data = this.data;
```

The component, "spot", has an event listener associated with it which responds when a click event is generated over the elememt.

There are several spots in the scene, but these are not active all the time. The spots visibility is tested to see if it is active and if so the 360 skybox image is swapped for the new skybox image being provided by the clicked spots data.linkto property.

```javascript
                    this.el.addEventListener("click", function () {
                        //set the skybox source to the new image as per the spot
                        if (this.parentElement.getAttribute("visible")) {
                            var sky = document.getElementById("skybox");
                            sky.setAttribute("src", data.linkto);

```

The a-frame entity "spots" defines a number of groups of spots.  At any moment one group of spots will be active and visible.  for the most part the spots are grouped in pairs to allow the view to move forward and backwards, but at the spots representing the end images of the subject only one spot will be active.

The first couple of spot groups are shown here, the others are defined in the HTML body.

```html
               <a-entity id="spots" hotspots>
                    <a-entity id="group-boat1" visible="true">
                        <a-image spot="linkto:#boat2;spotgroup:group-boat2" position="2.7  1 -8"></a-image>
                    </a-entity>

                    <a-entity id="group-boat2" visible="false">
                        <a-image spot="linkto:#boat3;spotgroup:group-boat3" position="2 0 -8"></a-image>
                        <a-image spot="linkto:#boat1;spotgroup:group-boat1" position="-1 0 8"></a-image>
                    </a-entity>
```

The element with id="spots" is the containing elements of the spot groups this is passed to the variable spotcomp.

This.parentElement represents the group containing the spot which has been clicked over.

Now the spotcomp object emits an event "reloadspots" which passes the next spotgroup in the progression and the current spotgroup to a function to update the active status of these spots.

```javascript
                            var spotcomp = document.getElementById("spots");
                            var currspots = this.parentElement.getAttribute("id");
                            spotcomp.emit("reloadspots", { newspots: data.spotgroup, currspots: currspots });
                        }
                    });
                },
            });
        </script>
    </head>
```
The eventListener for "reloadspots" is defined in the a-frame component "hotspots".  This scales the current spot group to be tiny so that there is no likelyhood of an accidental click event on these spots and sets their visibility to false.

```javascript
        <script>
            AFRAME.registerComponent("hotspots", {
                init: function () {
                    this.el.addEventListener("reloadspots", function (evt) {
                        //get the entire current spot group and scale it to 0
                        var currspotgroup = document.getElementById(evt.detail.currspots);
                        currspotgroup.setAttribute("scale", "0.001 0.001 0.001");
                        currspotgroup.setAttribute("visible", false);
                        //console.log(currspotgroup.id, currspotgroup.getAttribute("visible"));

```

The next spots are then scaled up and made visible so that navigation can continue towards the next and previous 360 degree images.

```javascript

                        //get the entire new spot group and scale it to 1
                        var newspotgroup = document.getElementById(evt.detail.newspots);
                        newspotgroup.setAttribute("scale", "1 1 1");
                        newspotgroup.setAttribute("visible", true);
                        //console.log(newspotgroup.id, newspotgroup.getAttribute("visible"));
                    });
                },
            });
```

The body of the html is mostly populated by a-frame elements, these include the assets which are the 360 views and the hotspot image.

```html
    <body>
        <h1>Scouting Venture</h1>
        <div width="650">
            <a-scene>
                <!-- embedded -->
                <a-assets>
                    <img id="boat1" src="./images/boat1.jpg" alt="boat1" />
                    <img id="boat2" src="./images/boat2.jpg" alt="boat1" />
                    <img id="boat3" src="./images/boat3.jpg" alt="boat1" />
                    <img id="boat4" src="./images/boat4.jpg" alt="boat1" />
                    <img id="boat5" src="./images/boat5.jpg" alt="boat1" />
                    <img id="hotspot" src="./images/hotspot.png" alt="hotspot" />
                </a-assets>
```

The first skybox source represents the starting image in the sequence.

```html
                <a-sky id="skybox" src="#boat1" rotation="0 -90 0"></a-sky>
```

The camera is positioned at the initial posiotion and a small cursor is associated with the direction of view.

```html
                <a-entity id="cam" camera position="0 1.6 0" look-controls>
                    <a-entity
                        cursor="fuse:true;fuseTimeout:2000"
                        geometry="primitive:ring;radiusInner:0.01;radiusOuter:0.02"
                        position="0 0 -1.8"
                        material="shader:flat;color:#ff0000"
                        animation__mouseenter="property:scale;to:3 3 3;startEvents:mouseenter;endEvents:mouseleave;dir:reverse;dur:2000;loop:1"
                    >
                    </a-entity>
                </a-entity>
```

The full list of spots is included next, noting that hotspots component is associated with the entity containing all the groups and their spots.

```html
                <a-entity id="spots" hotspots>
                    <a-entity id="group-boat1" visible="true">
                        <a-image spot="linkto:#boat2;spotgroup:group-boat2" position="2.7  1 -8"></a-image>
                    </a-entity>

                    <a-entity id="group-boat2" visible="false">
                        <a-image spot="linkto:#boat3;spotgroup:group-boat3" position="2 0 -8"></a-image>
                        <a-image spot="linkto:#boat1;spotgroup:group-boat1" position="-1 0 8"></a-image>
                    </a-entity>

                    <a-entity id="group-boat3" visible="false">
                        <a-image spot="linkto:#boat4;spotgroup:group-boat4" position="1 0 -8"></a-image>
                        <a-image spot="linkto:#boat2;spotgroup:group-boat2" position="-1 0 8"></a-image>
                    </a-entity>

                    <a-entity id="group-boat4" visible="false">
                        <a-image spot="linkto:#boat5;spotgroup:group-boat5" position="0 0 -8"></a-image>
                        <a-image spot="linkto:#boat3;spotgroup:group-boat3" position="-2 0 8"></a-image>
                    </a-entity>

                    <a-entity id="group-boat5" visible="false">
                        <a-image spot="linkto:#boat4;spotgroup:group-boat4" position="0 0 8"></a-image>
                    </a-entity>
                </a-entity>
            </a-scene>
        </div>
        <p>Click VR for full screen</p>
    </body>
</html>
```

The resulting view inside a canal boat is shown here and the complete code is listed below this.

### browser view

<iframe 
    height="600" 
    width="80%" 
    scrolling="no" 
    title="aframe.html" 
    src="Block_1/section_5/public_venture/venture.html" 
    frameborder="no" 
    loading="lazy" 
    allowtransparency="true" 
    allowfullscreen="true">
</iframe>

### Full listing

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>Scouting Venture 360</title>
        <script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
        <script src="https://unpkg.com/aframe-look-at-component@1.0.0/dist/aframe-look-at-component.min.js"></script>
        <script>
            AFRAME.registerComponent("spot", {
                schema: {
                    linkto: { type: "string", default: "" },
                    spotgroup: { type: "string", default: "" },
                },
                init: function () {
                    //add image source of hotspot icon
                    this.el.setAttribute("src", "#hotspot");
                    //make the icon look at the camera all the time
                    this.el.setAttribute("look-at", "#cam");

                    var data = this.data;

                    this.el.addEventListener("click", function () {
                        //set the skybox source to the new image as per the spot
                        if (this.parentElement.getAttribute("visible")) {
                            var sky = document.getElementById("skybox");
                            sky.setAttribute("src", data.linkto);

                            var spotcomp = document.getElementById("spots");
                            var currspots = this.parentElement.getAttribute("id");
                            spotcomp.emit("reloadspots", { newspots: data.spotgroup, currspots: currspots });
                        }
                    });
                },
            });
            AFRAME.registerComponent("hotspots", {
                init: function () {
                    this.el.addEventListener("reloadspots", function (evt) {
                        //get the entire current spot group and scale it to 0
                        var currspotgroup = document.getElementById(evt.detail.currspots);
                        currspotgroup.setAttribute("scale", "0.001 0.001 0.001");
                        currspotgroup.setAttribute("visible", false);
                        //console.log(currspotgroup.id, currspotgroup.getAttribute("visible"));

                        //get the entire new spot group and scale it to 1
                        var newspotgroup = document.getElementById(evt.detail.newspots);
                        newspotgroup.setAttribute("scale", "1 1 1");
                        newspotgroup.setAttribute("visible", true);
                        //console.log(newspotgroup.id, newspotgroup.getAttribute("visible"));
                    });
                },
            });
        </script>
    </head>

    <body>
        <h1>Scouting Venture</h1>
        <div width="650">
            <a-scene>
                <!-- embedded -->
                <a-assets>
                    <img id="boat1" src="./images/boat1.jpg" alt="boat1" />
                    <img id="boat2" src="./images/boat2.jpg" alt="boat1" />
                    <img id="boat3" src="./images/boat3.jpg" alt="boat1" />
                    <img id="boat4" src="./images/boat4.jpg" alt="boat1" />
                    <img id="boat5" src="./images/boat5.jpg" alt="boat1" />
                    <img id="hotspot" src="./images/hotspot.png" alt="hotspot" />
                </a-assets>

                <a-sky id="skybox" src="#boat1" rotation="0 -90 0"></a-sky>
                <a-entity id="cam" camera position="0 1.6 0" look-controls>
                    <a-entity
                        cursor="fuse:true;fuseTimeout:2000"
                        geometry="primitive:ring;radiusInner:0.01;radiusOuter:0.02"
                        position="0 0 -1.8"
                        material="shader:flat;color:#ff0000"
                        animation__mouseenter="property:scale;to:3 3 3;startEvents:mouseenter;endEvents:mouseleave;dir:reverse;dur:2000;loop:1"
                    >
                    </a-entity>
                </a-entity>

                <a-entity id="spots" hotspots>
                    <a-entity id="group-boat1" visible="true">
                        <a-image spot="linkto:#boat2;spotgroup:group-boat2" position="2.7  1 -8"></a-image>
                    </a-entity>

                    <a-entity id="group-boat2" visible="false">
                        <a-image spot="linkto:#boat3;spotgroup:group-boat3" position="2 0 -8"></a-image>
                        <a-image spot="linkto:#boat1;spotgroup:group-boat1" position="-1 0 8"></a-image>
                    </a-entity>

                    <a-entity id="group-boat3" visible="false">
                        <a-image spot="linkto:#boat4;spotgroup:group-boat4" position="1 0 -8"></a-image>
                        <a-image spot="linkto:#boat2;spotgroup:group-boat2" position="-1 0 8"></a-image>
                    </a-entity>

                    <a-entity id="group-boat4" visible="false">
                        <a-image spot="linkto:#boat5;spotgroup:group-boat5" position="0 0 -8"></a-image>
                        <a-image spot="linkto:#boat3;spotgroup:group-boat3" position="-2 0 8"></a-image>
                    </a-entity>

                    <a-entity id="group-boat5" visible="false">
                        <a-image spot="linkto:#boat4;spotgroup:group-boat4" position="0 0 8"></a-image>
                    </a-entity>
                </a-entity>
            </a-scene>
        </div>
        <p>Click VR for full screen</p>
    </body>
</html>
```