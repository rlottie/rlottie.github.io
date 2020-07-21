
var RLottieModule = (function () {
    // create a object;
    var obj = {};

    // object content.
    obj.canvas = {};
    obj.context = {};
    obj.frameCount = 0;
    obj.curFrame = 0;
    obj.frameRate = 0;
    obj.rafId = {};
    obj.resizeId = {};
    obj.playing = true;
    obj.imageData = {};
    obj.pendingFrame = false;

    obj.setAttribute = function (frameCount) {
      console.log(`set Attribute called ${frameCount}`);
      obj.frameCount = frameCount;
      console.log(obj.frameCount);
    }
    obj.result = function (width, height, data) {
      if (width == obj.canvas.width &&
          height == obj.canvas.height) {
          var result = new Uint8ClampedArray(data);
          obj.imageData = new ImageData(data, width, height);
          obj.pendingFrame = true;
      }
    }
    obj.init = function () {
        window.addEventListener('dragover', handleDragOver, false);
        window.addEventListener('drop', handleFileSelect, false);
        window.addEventListener('resize',windowResize);
        relayoutCanvas();
        obj.canvas = document.getElementById("myCanvas");
        obj.context = obj.canvas.getContext('2d');

        mainLoop();
    }
    obj.renderRequest = function () {
         //console.log(obj.curFrame);
         obj.pendingFrame = false;
         rlottie_worker.sendQuery('render', obj.curFrame, obj.canvas.width, obj.canvas.height);
    }
    obj.render = function () {
        if (obj.canvas.width == 0  || obj.canvas.height == 0) return;

        if (obj.canvas.width != obj.imageData.width || obj.canvas.height != obj.imageData.height) return;

        obj.context.putImageData(obj.imageData, 0, 0);

        obj.curFrame++;
        if (obj.curFrame >=  obj.frameCount) obj.curFrame = 0;
    }

    obj.reload = function (jsString) {
      rlottie_worker.sendQuery('reload', jsString);
      obj.curFrame = 0;
      obj.renderRequest();
      // force a render in pause state
      sliderReset();
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
        if (obj.pendingFrame) {
          obj.render();
          document.getElementById("slider").max = obj.frameCount;
          document.getElementById("slider").value = obj.curFrame;
        }
        obj.renderRequest();
     }

    function relayoutCanvas() {
      var width = document.getElementById("content").clientWidth;
      var height = document.getElementById("content").clientHeight;
      var size = width;
      if (width < height)
        size = width;
      else
        size = height;
      document.getElementById("myCanvas").width  = size;
      document.getElementById("myCanvas").height  = size;
    }

     function windowResizeDone() {
        relayoutCanvas();
        obj.play();
     }

     function windowResize() {
          if (obj.isPlaying()) obj.pause();
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

    var files = evt.dataTransfer.files; // FileList object.

    var output = [];
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



function QueryableWorker(url, defaultListener, onError) {
    var instance = this,
    worker = new Worker(url),
    listeners = {};

    this.defaultListener = defaultListener || function() {};

    if (onError) {worker.onerror = onError;}

    this.postMessage = function(message) {
      worker.postMessage(message);
    }

    this.terminate = function() {
      worker.terminate();
    }

    this.addListener = function(name, listener) {
      listeners[name] = listener;
    }

    this.removeListener = function(name) {
      delete listeners[name];
    }

    /*
      This functions takes at least one argument, the method name we want to query.
      Then we can pass in the arguments that the method needs.
    */
    this.sendQuery = function() {
      if (arguments.length < 1) {
        throw new TypeError('QueryableWorker.sendQuery takes at least one argument');
        return;
      }
      worker.postMessage({
        'queryMethod': arguments[0],
        'queryMethodArguments': Array.prototype.slice.call(arguments, 1)
      });
    }

    worker.onmessage = function(event) {
      if (event.data instanceof Object &&
        event.data.hasOwnProperty('queryMethodListener') &&
        event.data.hasOwnProperty('queryMethodArguments')) {
        listeners[event.data.queryMethodListener].apply(instance, event.data.queryMethodArguments);
      } else {
        this.defaultListener.call(instance, event.data);
      }
    }
}

var rlottie_worker = new QueryableWorker('rlottie-worker.js');

rlottie_worker.addListener('ready', function () {
  console.log("worker is ready");
  RLottieModule.init();
});

rlottie_worker.addListener('info', RLottieModule.setAttribute);

rlottie_worker.addListener('result', RLottieModule.result);
