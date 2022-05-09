var rlottieHandler;

function setup() {
  var head = document.head;
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "rlottie-wasm.js";
  head.appendChild(script);

  script.onload = _ => {
    Module.onRuntimeInitialized = _ => {
      rlottieHandler = new RLottieHandler(1);
      addListener();
      window.requestAnimationFrame(updater);
    }
  }
}

setup();

function updater() {
  rlottieHandler.rafId = window.requestAnimationFrame(updater);
  rlottieHandler.render();
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
  return rlottieHandler.rlottieModule[canvasId];
}

function windowResizeDone() {
  rlottieHandler.relayoutCanvas();
  if (rlottieHandler.wasPlaying) {
    rlottieHandler.wasPlaying = false;
    play();
  }
  else rlottieHandler.update();
}

function windowResize() {
  if (rlottieHandler.playing) {
    rlottieHandler.wasPlaying = true;
    pause();
  }

  clearTimeout(rlottieHandler.resizeId);
  rlottieHandler.resizeId = setTimeout(windowResizeDone, 150);
}

function buttonClicked() {
  if (rlottieHandler.playing) pause();
  else play();
}

function onSliderDrag(value) {
  rlottieHandler.seek(value);
}

function addListener() {
  window.addEventListener("dragover", handleDragOver, false);
  window.addEventListener("drop", handleFileSelect, false);
  window.addEventListener("resize", windowResize);
}

function addImportListener() {
  var input = document.getElementById("fileSelector");
  input.addEventListener("change", fileSelectionChanged);
}

function fileSelectionChanged() {
  var input = document.getElementById("fileSelector");
  var contentName = document.getElementById("contentName");
  contentName.innerText = input.files[0].name;
  contentName.title = input.files[0].name;
  handleFiles(input.files);
}

function handleFiles(files) {
  for (let i = 0, f; f = files[i]; i++) {
    if (f.type.includes("json")) {
      var read = new FileReader();
      read.readAsText(f);
      read.onloadend = function () {
        rlottieHandler.reload(read.result);
      }
      break;
    }
  }
}

function getLottieFromUrl(input) {
  var url = input.trim();
  if (url == "" || !(url.startsWith("http://") || url.startsWith("https://"))) {
    alert("Please enter correct URL that starts with 'http://' or 'https://'");
    return;
  }

  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.status == 200) {
      var data = xhr.responseText;
      try {
        JSON.parse(data);
      } catch (error) {
        throw new Error("The URL you entered is not in JSON format");
      }
      rlottieHandler.reload(data);
    } else {
      throw new Error("Your request failed. Please type in another URL.");
    }
  };
  xhr.open("GET", url);
  xhr.send(null);
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

function setLayerColor(keypath, r, g, b) {
  rlottieHandler.rlottieModule[0].lottieHandle.setFillColor(keypath, r, g, b);
  rlottieHandler.rlottieModule[0].lottieHandle.setStrokeColor(keypath, r, g, b);
}

function setLayerOpacity(keypath, opacity) {
  rlottieHandler.rlottieModule[0].lottieHandle.setFillOpacity(keypath, opacity);
  rlottieHandler.rlottieModule[0].lottieHandle.setStrokeOpacity(keypath, opacity);
}

function setStrokeWidth(keypath, width) {
  rlottieHandler.rlottieModule[0].lottieHandle.setStrokeWidth(keypath, width);
}

function setPosition(keypath, x, y) {
  rlottieHandler.rlottieModule[0].lottieHandle.setPosition(keypath, x, y);
}

function setScale(keypath, width, height) {
  rlottieHandler.rlottieModule[0].lottieHandle.setScale(keypath, width, height);
}

function setRotation(keypath, degree) {
  rlottieHandler.rlottieModule[0].lottieHandle.setRotation(keypath, degree);
}

function onResizeSliderDrag(value) {
  var width = document.getElementById("player").clientWidth;
  var height = document.getElementById("player").clientHeight;
  width = width / 4 * 3;
  height = height / 4 * 3;

  var size = width < height ? width : height;
  size = size * (value / 100);

  if (size < 20)
    size = 20;

  rlottieHandler.rlottieModule.forEach(rm => {
    rm.canvas.width = size;
    rm.canvas.height = size;
    rm.canvas.style.width = size + "px";
    rm.canvas.style.height = size + "px";
  });
  rlottieHandler.update();
}