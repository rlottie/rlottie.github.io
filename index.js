var rlottieHandler;
var thumbnailHandler;
var mainRLottieModule;
var layerNodeSize = 0;

function setup() {
    var head = document.head;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'rlottie-wasm.js';
    head.appendChild(script);

    script.onload = _ => {
        Module.onRuntimeInitialized = _ => {
            rlottieHandler = new RLottieHandler(4);
            setTimeout(() => {
                thumbnailHandler = new ThumbnailHandler(getRModule(0).layerTree.child, rlottieHandler.jsString);
            }, 500);
            addListener();
            window.requestAnimationFrame(updater);

        };
    };
}

setup();

function updater() {
    rlottieHandler.rafId = window.requestAnimationFrame(updater);
    rlottieHandler.render();
    if(typeof (thumbnailHandler) !== "undefined") thumbnailHandler.render();
}

function play() {
    document.getElementById("playButton").innerHTML = "<em class='fas fa-pause'></em>";
    rlottieHandler.play();
}

function playDisable() {
    document.getElementById("playButton").innerHTML = "<em class='fas fa-pause' style='color:#979797'></em>";
    rlottieHandler.play();
}

function pause() {
    document.getElementById("playButton").innerHTML = "<em class='fas fa-play'></em>";
    rlottieHandler.pause();
}

function pauseDisable() {
    document.getElementById("playButton").innerHTML = "<em class='fas fa-play' style='color:#979797'></em>";
    rlottieHandler.pause();
}

function getRModule(canvasId) {
    return rlottieHandler.rlotties[canvasId];
}

function canvasResize(width, height) {
    rlottieHandler.rlotties.forEach(rm => {
        rm.canvas.style.width = width + "px";
        rm.canvas.style.height = height + "px";
    });
}

function windowResizeDone() {
    rlottieHandler.relayoutCanvas();
    if(rlottieHandler.wasPlaying) {
        rlottieHandler.wasPlaying = false;
        rlottieHandler.play();
    } 
    else {
        rlottieHandler.update();
    }
}

function windowResize() {
    if(rlottieHandler.playing){
        rlottieHandler.wasPlaying = true;
        rlottieHandler.pause();
    }

    clearTimeout(rlottieHandler.resizeId);
    rlottieHandler.resizeId = setTimeout(windowResizeDone, 150);
}

function buttonClicked() {
    if(rlottieHandler.isHover) return;
    if (rlottieHandler.playing) pause();
    else play();
}

function onSliderDrag(value) {
    rlottieHandler.seek(value);
}

function addListener() {
    var input = document.getElementById("fileSelector");
    input.addEventListener("change", fileSelectionChanged);
    window.addEventListener("dragover", handleDragOver, false);
    window.addEventListener("drop", handleFileSelect, false);
    window.addEventListener("resize", windowResize);
}

function fileSelectionChanged() {
    var input = document.getElementById("fileSelector");
    var contentName = document.getElementById('contentName')
    contentName.innerText = input.files[0].name
    contentName.title = input.files[0].name
    handleFiles(input.files);
}

function handleFiles(files) {
    for (let i = 0, f; f = files[i]; i++) {
        if (f.type.includes("json")) {
            var read = new FileReader();
            read.readAsText(f);
            read.onloadend = function () {
                layerNodeSize = 0;
                rlottieHandler.reload(read.result);
            }
            break;
        }
    }
}

function handleDragOver(event) {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
}

function handleFileSelect(event) {
    event.stopPropagation();
    event.preventDefault();
    var contentName = document.getElementById('contentName')
    contentName.innerText = event.dataTransfer.files[0].name
    contentName.title = event.dataTransfer.files[0].name
    handleFiles(event.dataTransfer.files);
}

function setLayerColor(node, r, g, b, canvasid) {
    var keypath = node.keypath + ".**";
    if(node.type == "Fill") getRModule(canvasid).lottieHandle.setFillColor(keypath, r, g, b);
    else if(node.type == "Stroke") getRModule(canvasid).lottieHandle.setStrokeColor(keypath, r, g, b);
    propertiesCascading(node, [{ name: "color",  value: node.color }]);
}

function setLayerOpacity(node, opacity, canvasid) {
    var keypath = node.keypath + ".**";
    node.beforeOpacity = node.opacity;
    if(node.type == "Fill") getRModule(canvasid).lottieHandle.setFillOpacity(keypath, opacity);
    else if(node.type == "Stroke") getRModule(canvasid).lottieHandle.setStrokeOpacity(keypath, opacity);
    else if(node.type == "both") {
        getRModule(canvasid).lottieHandle.setFillOpacity(keypath, opacity);
        getRModule(canvasid).lottieHandle.setStrokeOpacity(keypath, opacity);
    }
    propertiesCascading(node, [{ name: "opacity", value: opacity }]);
}

function setStrokeWidth(node, width, canvasid) {
    var keypath = node.keypath + ".**";
    getRModule(canvasid).lottieHandle.setStrokeWidth(keypath, width);
    propertiesCascading(node, [{ name: "strokeWidth", value: width}]);
}

function setPosition(node, x, y, canvasid) {
    var keypath = node.keypath + ".**";
    getRModule(canvasid).lottieHandle.setPosition(keypath, x, y);
    propertiesCascading(node, [{ name: "xPos", value: x }, { name: "yPos", value: y }]);
}

function setScale(node, width, height, canvasid) {
    var keypath = node.keypath + ".**";
    getRModule(canvasid).lottieHandle.setScale(keypath, width, height);
    propertiesCascading(node, [{ name: "scaleWidth", value: width }, { name: "scaleHeight", value: height }]);
}

function setRotation(node, degree, canvasid) {
    var keypath = node.keypath + ".**";
    getRModule(canvasid).lottieHandle.setRotation(keypath, degree);
    propertiesCascading(node, [{ name: "rotation", value: degree }]);
}

function moveFrame(frame) {
    rlottieHandler.rlotties.forEach(rm => {
        rm.curFrame = frame;
    });
}

function setPlaySpeed(speed) {
    if(speed == 0) return 0;
    if(speed < 0) rlottieHandler.playDir = false;
    else rlottieHandler.playDir = true;
    rlottieHandler.playSpeed = speed;
}

function propertiesCascading(node, properties) {
    properties.forEach(property => {
        node[property.name] = property.value;
    });
    for(let i = 0; i < node.child.length; i++) {
        propertiesCascading(node.child[i], properties);
    }
}

var isCtrl, isAlt, isShift;
document.onkeydown = function(e) {
    if (e.which == 16) isShift = true;
    if (e.which == 17) isCtrl = true;
    if (e.which == 18) isAlt = true;

    // shift + 1, 2, 3, 4: selectCanvas
    if (e.which == 49 && isShift) app.$root.selectCanvas(0);
    if (e.which == 50 && isShift) app.$root.selectCanvas(1);
    if (e.which == 51 && isShift) app.$root.selectCanvas(2);
    if (e.which == 52 && isShift) app.$root.selectCanvas(3);

    // shift + p: snapshot
    if (e.which == 80 && isShift) {
        if (app.$root.snapshotDialog === false) {
            app.$root.clickSnapShot();
            app.$root.snapshotDialog = true;
        } else {
            app.$root.clickSnapshotClose()
        }
    }

    // shift + space: play, pause
    if (e.which == 32 && isShift) {
        if (rlottieHandler.playing) {
            document.getElementById("playButton").innerHTML = "<em class='fas fa-play'></em>";
            rlottieHandler.pause()
        } else {
            document.getElementById("playButton").innerHTML = "<em class='fas fa-pause'></em>";
            rlottieHandler.play()
        }
    }

    // shift + v: multiview, singleview
    if (e.which == 86 && isShift) {
        if (app.$root.isMultiView) {
            app.$root.changeIsMultiView(false)
            windowResize();
        } else {
            app.$root.changeIsMultiView(true)
            windowResize();
        }
    }

    // shift + m: dark, light mode
    if (e.which == 77 && isShift) {
        app.$root.$vuetify.theme.dark = !app.$root.$vuetify.theme.dark
    }

    // shift + s: save gif
    if (e.which == 83 && isShift) {
        app.$root.exportdialog = !app.$root.exportdialog
    }

    // shift + c: shortcut
    if (e.which == 67 && isShift) {
        app.$root.shortcutdialog = !app.$root.shortcutdialog
    }
}

document.onkeyup = function(e) {
    if (e.which == 16) isShift = false;
    if (e.which == 17) isCtrl = false;
    if (e.which == 18) isAlt = false;
}