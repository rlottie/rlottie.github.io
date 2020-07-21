function setup() {
    var head = document.head;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'rlottie-wasm.js';
    head.appendChild(script);

    script.onload = _ => {
      Module.onRuntimeInitialized = _ => {
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
    obj.context = {};
    obj.lottieHandle = 0;
    obj.frameCount = 0;
    obj.curFrame = 0;
    obj.frameRate = 0;
    obj.rafId = {};
    obj.resizeId = {};
    obj.playing = true;
    obj.wasPlaying = false;

    obj.init = function () {
        var input = document.getElementById('fileSelector');
        input.addEventListener('change', fileSelectionChanged);
        window.addEventListener('dragover', handleDragOver, false);
        window.addEventListener('drop', handleFileSelect, false);
        window.addEventListener('resize',windowResize);
        relayoutCanvas();
        obj.canvas = document.getElementById("myCanvas");
        obj.context = obj.canvas.getContext('2d');

        obj.lottieHandle = new Module.RlottieWasm();
        obj.frameCount = obj.lottieHandle.frames();
        // hook to the main loop
        mainLoop();
    }

    obj.render = function () {
        if (obj.canvas.width == 0  || obj.canvas.height == 0) return;

        var buffer = obj.lottieHandle.render(obj.curFrame++, obj.canvas.width, obj.canvas.height);
        var result = Uint8ClampedArray.from(buffer);
        var imageData = new ImageData(result, obj.canvas.width, obj.canvas.height);

        obj.context.putImageData(imageData, 0, 0);

        if (obj.curFrame >=  obj.frameCount) obj.curFrame = 0;
    }

    obj.reload = function (jsString) {
      var len  = obj.lottieHandle.load(jsString);
      obj.frameCount = obj.lottieHandle.frames();
      obj.curFrame = 0;
      // force a render in pause state
      sliderReset();
      obj.update();
    }

    obj.update = function () {
      if (!obj.playing)
        window.requestAnimationFrame( obj.render);
    }

     obj.pause = function () {
        window.cancelAnimationFrame( obj.rafId);
        obj.playing = false;
     }

     obj.play = function () {
        obj.playing = true;
        mainLoop();
     }
     obj.isPlaying = function ()  {
         return obj.playing;
     }

     obj.seek = function (value) {
        obj.curFrame = value;
        window.requestAnimationFrame( obj.render);
     }

     function mainLoop() {
        obj.rafId = window.requestAnimationFrame( mainLoop );
        obj.render();
        document.getElementById("slider").max = obj.frameCount;
        document.getElementById("slider").value = obj.curFrame;
     }

    function relayoutCanvas() {
      var width = document.getElementById("content").clientWidth;
      var height = document.getElementById("content").clientHeight;
      var size = width;
      if (width < height)
        size = width;
      else
        size = height;
      size = size-8;

      document.getElementById("myCanvas").width  = size;
      document.getElementById("myCanvas").height  = size;
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
}());


function buttonClicked() {
    if (RLottieModule.isPlaying()) {
        document.getElementById("playButton").innerText = "Play";
        RLottieModule.pause();
    } else {
        document.getElementById("playButton").innerText = "Pause";
        RLottieModule.play();
    }
}

function onSliderDrag(value) {
    RLottieModule.seek(value);
}

function sliderReset() {
    document.getElementById("slider").max = RLottieModule.frameCount;
    document.getElementById("slider").value = RLottieModule.curFrame;
}

function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    handleFiles(evt.dataTransfer.files);
}

function handleFiles(files) {
    for (var i = 0, f; f = files[i]; i++) {
      if (f.type.includes('json')) {
        var read = new FileReader();
        read.readAsText(f);
        read.onloadend = function(){
            RLottieModule.reload(read.result);
        }
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
    var input = document.getElementById('fileSelector');
    handleFiles(input.files);
}

function onResizeSliderDrag(value) {
  var width = document.getElementById("content").clientWidth;
  var height = document.getElementById("content").clientHeight;
  var size = width;
  if (width < height)
    size = width;
  else
    size = height;
  size = size-8;
  size = size * (value / 100);

  if (size < 10 )
    size = 10;
  size = size | 0;
  document.getElementById("myCanvas").width  = size;
  document.getElementById("myCanvas").height  = size;
  RLottieModule.update();
}