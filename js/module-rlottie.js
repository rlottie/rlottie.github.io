function setup() {
  var head = document.head;
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = './js/rlottie-wasm.js';
  head.appendChild(script);

  script.onload = (_) => {
    Module.onRuntimeInitialized = (_) => {
      RLottieModule.init();
    };
  };
}

setup();

// Create a LottieView Module responsible of rendering a lotti file
var RLottieModule = (function () {
  // create a object;
  var obj = {};

  obj.canvas = {};
  obj.preview = {};
  obj.context = {};
  obj.contextPre = {};
  obj.lottieHandle = 0;
  obj.frameCount = 0;
  obj.curFrame = 0;
  obj.rafId = {};
  obj.resizeId = {};
  obj.playing = true;
  obj.wasPlaying = false;
  obj.keypath = '';
  obj.isSelectAll = true;
  obj.fileName = 'anubis.json';

  obj.init = function () {
    var input = document.getElementById('file-selector');
    input.addEventListener('change', fileSelectionChanged);
    window.addEventListener('dragover', handleDragOver, false);
    window.addEventListener('drop', handleFileSelect, false);
    window.addEventListener('resize', windowResize);
    relayoutCanvas();

    obj.canvas = document.getElementById('myCanvas');
    obj.context = obj.canvas.getContext('2d');
    obj.preview = document.getElementById('pre-view');
    obj.contextPre = obj.preview.getContext('2d');

    obj.lottieHandle = new Module.RlottieWasm();
    obj.frameCount = obj.lottieHandle.frames();

    // Create rlottie layers management object
    obj.layers = new Layers(this, obj.lottieHandle.getBasicResource());
    store.commit('setLayers', obj.layers);
    store.commit('setFrameCount', obj.frameCount);
    store.commit('setFileName', obj.fileName);

    mainLoop();
  };

  obj.render = function () {
    if (obj.canvas.width == 0 || obj.canvas.height == 0) return;

    obj.curFrame = obj.curFrame + store.getters.frameRate; // "frameRate" : Speed and Direction
    if (obj.curFrame > obj.frameCount) obj.curFrame = 0;
    if (obj.curFrame < 0) obj.curFrame = obj.frameCount;

    var buffer = obj.lottieHandle.render(obj.curFrame, obj.canvas.width, obj.canvas.height);
    var result = Uint8ClampedArray.from(buffer);
    var imageData = new ImageData(result, obj.canvas.width, obj.canvas.height);

    obj.context.putImageData(imageData, 0, 0);
    store.commit('setCurFrame', obj.curFrame);
  };

  // Get specific frame snapshot
  obj.renderSnapShot = function (frame) {
    if (obj.preview.width == 0 || obj.preview.height == 0) return;

    var buffer = obj.lottieHandle.render(frame, obj.preview.width, obj.preview.height);
    var result = Uint8ClampedArray.from(buffer);
    var imageData = new ImageData(result, obj.preview.width, obj.preview.height);

    obj.contextPre.putImageData(imageData, 0, 0);
  };

  obj.reload = function (jsString) {
    var len = obj.lottieHandle.load(jsString);
    obj.frameCount = obj.lottieHandle.frames();
    store.commit('setFrameCount', obj.frameCount);
    obj.curFrame = 0;
    // force a render in pause state
    obj.update();
  };

  obj.update = function () {
    if (!obj.playing) window.requestAnimationFrame(obj.render);
  };

  obj.pause = function () {
    window.cancelAnimationFrame(obj.rafId);
    obj.playing = false;
  };

  obj.play = function () {
    obj.playing = true;
    mainLoop();
  };
  obj.isPlaying = function () {
    return obj.playing;
  };

  // Set property
  obj.fillColors = function (keypath, r, g, b, opacity) {
    obj.lottieHandle.setFillColor(keypath, r, g, b);
    obj.lottieHandle.setFillOpacity(keypath, opacity);
  };

  obj.strokeColors = function (keypath, r, g, b, opacity) {
    obj.lottieHandle.setStrokeColor(keypath, r, g, b);
    obj.lottieHandle.setStrokeOpacity(keypath, opacity);
  };

  obj.strokeWidth = function (keypath, width) {
    obj.lottieHandle.setStrokeWidth(keypath, width);
  };

  obj.trAnchor = function (keypath, x, y) {
    obj.lottieHandle.setTrAnchor(keypath, x, y);
  };

  obj.trPosition = function (keypath, x, y) {
    obj.lottieHandle.setTrPosition(keypath, x, y);
  };

  obj.trScale = function (keypath, w, h) {
    obj.lottieHandle.setTrScale(keypath, w, h);
  };

  obj.trRotation = function (keypath, degree) {
    obj.lottieHandle.setTrRotation(keypath, degree);
  };

  obj.trOpacity = function (keypath, opacity) {
    obj.lottieHandle.setTrOpacity(keypath, opacity);
  };

  obj.seek = function (value) {
    obj.curFrame = value;
    window.requestAnimationFrame(obj.render);
  };

  function mainLoop() {
    obj.rafId = window.requestAnimationFrame(mainLoop);
    obj.render();
  }

  function relayoutCanvas() {
    var width = document.getElementById('content').clientWidth;
    var height = document.getElementById('content').clientHeight;
    var size = width;
    if (width < height) size = width;
    else size = height;
    size = size - 8;

    document.getElementById('myCanvas').width = size;
    document.getElementById('myCanvas').height = size;
  }

  function windowResizeDone() {
    relayoutCanvas();
    if (obj.wasPlaying) {
      obj.wasPlaying = false;
      obj.play();
    } else {
      obj.update();
    }
  }

  function windowResize() {
    if (obj.isPlaying()) {
      obj.wasPlaying = true;
      obj.pause();
    }
    clearTimeout(obj.resizeId);
    obj.resizeId = setTimeout(windowResizeDone, 150);
  }
  return obj;
})();

function buttonClicked() {
  if (RLottieModule.isPlaying()) {
    RLottieModule.playing = false;
    RLottieModule.pause();
  } else {
    RLottieModule.playing = true;
    RLottieModule.play();
  }
}

function onSliderDrag(value) {
  RLottieModule.seek(value);
}

function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  handleFiles(evt.dataTransfer.files);
}

function handleFiles(files) {
  for (var i = 0, f; (f = files[i]); i++) {
    if (f.type.includes('json')) {
      var read = new FileReader();
      read.fileName = f.name;

      read.onload = function (e) {
        RLottieModule.fileName = e.target.fileName;
        store.commit('setFileName', RLottieModule.fileName);
      };

      read.readAsText(f);
      read.onloadend = function (e) {
        var jsString = read.result;
        RLottieModule.reload(jsString);
        RLottieModule.layers = new Layers(RLottieModule, jsString);
        store.commit('setLayers', RLottieModule.layers);
      };
      break;
    }
  }
}

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy';
}

function fileSelectionChanged() {
  var input = document.getElementById('file-selector');
  handleFiles(input.files);
}

function onResizeSliderDrag(value) {
  var width = document.getElementById('content').clientWidth;
  var height = document.getElementById('content').clientHeight;
  var size = width;
  if (width < height) size = width;
  else size = height;
  size = size - 8;
  size = size * (value / 100);

  if (size < 10) size = 10;
  size = size | 0;
  document.getElementById('myCanvas').width = size;
  document.getElementById('myCanvas').height = size;
  RLottieModule.update();
}
