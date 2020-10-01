function setup() {
  var head = document.head;
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "rlottie-wasm.js";
  head.appendChild(script);

  script.onload = (_) => {
    Module.onRuntimeInitialized = (_) => {
      RLottieModule.init();
    };
  };
}
setup();

// Create a LottieView Module responsible of rendering a lottie file
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
  obj.reverse = false;

  obj.keyPathTree = {};

  obj.init = function () {
    var input = document.getElementById("fileSelector");
    input.addEventListener("change", fileSelectionChanged);
    window.addEventListener("dragover", handleDragOver, false);
    window.addEventListener("drop", handleFileSelect, false);
    window.addEventListener("resize", windowResize);
    relayoutCanvas();
    obj.canvas = document.getElementById("myCanvas");
    obj.context = obj.canvas.getContext("2d");

    obj.lottieHandle = new Module.RlottieWasm();
    obj.frameCount = obj.lottieHandle.frames();
    // hook to the main loop
    mainLoop();
    frameList.init();
  };

  // animation logic
  obj.render = function () {
    if (obj.canvas.width == 0 || obj.canvas.height == 0) return;
    var buffer = obj.lottieHandle.render(
      // obj.curFrame++,
      (obj.curFrame += obj.reverse ? -1 : 1),
      // obj.curFrame--,
      obj.canvas.width,
      obj.canvas.height
    );
    var result = Uint8ClampedArray.from(buffer);
    var imageData = new ImageData(result, obj.canvas.width, obj.canvas.height);
    obj.context.putImageData(imageData, 0, 0);
    if (obj.reverse) {
      if (obj.curFrame <= 0) obj.curFrame = obj.frameCount;
    } else {
      if (obj.curFrame >= obj.frameCount) obj.curFrame = 0;
    }
  };

  obj.reload = function (jsString) {
    var len = obj.lottieHandle.load(jsString);
    obj.layerList = JSON.parse(jsString).layers
    document.getElementById("layerlist").innerHTML = ""
    getAllLayers(obj.layerList, document.getElementById("layerlist"), "")
    obj.frameCount = obj.lottieHandle.frames();
    obj.curFrame = 0;
    obj.frameRate = 0;
    obj.rafId = {};
    obj.resizeId = {};
    obj.playing = true;
    obj.wasPlaying = false;

    var frameList = {};
    frameList.canvas = {};
    frameList.context = {};
    frameList.list = {};

    //add custom by lee frameList
    frameList.init = function () {
      console.log(imageData);
      frameList.list = document.getElementById("frameList");

      for (var i = 0; i < obj.frameCount; i++) {
        var canvas = document.createElement("canvas");
        canvas.setAttribute("id", "frame" + i);
        frameList.list.appendChild(canvas);

        frameList.canvas = document.getElementById("frame" + i);
        frameList.context = frameList.canvas.getContext("2d");

        var buffer = obj.lottieHandle.render(i, 100, 100);
        var result = Uint8ClampedArray.from(buffer);
        var imageData = new ImageData(result, 100, 100);

        frameList.context.putImageData(imageData, 0, 0);
      }
    };

    //layer list by yoon
    obj.layerList = [];

    // force a render in pause state
    sliderReset();
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

  obj.seek = function (value) {
    obj.curFrame = value;
    window.requestAnimationFrame(obj.render);
  };


  obj.setFillColor = function (keyPath, r, g, b) {
    obj.lottieHandle.setFillColor(keyPath, r, g, b);
  };

  obj.setFillOpacity = function (keyPath, opacity) {
    obj.lottieHandle.setFillOpacity(keyPath, opacity);
  };

  obj.setStrokeColor = function (keyPath, r, g, b) {
    obj.lottieHandle.setStrokeColor(keyPath, r, g, b);
  };

  obj.setStrokeOpacity = function (keyPath, opacity) {
    obj.lottieHandle.setStrokeOpacity(keyPath, opacity);
  };

  obj.setStrokeWidth = function (keyPath, width) {
    obj.lottieHandle.setStrokeWidth(keyPath, width);
  };

  obj.setTrAnchor = function (keyPath, x, y) {
    obj.lottieHandle.setTrAnchor(keyPath, x, y);
  };

  obj.setTrPosition = function (keyPath, x, y) {
    obj.lottieHandle.setTrPosition(keyPath, x, y);
  };

  obj.setTrScale = function (keyPath, w, h) {
    obj.lottieHandle.setTrScale(keyPath, w, h);
  };

  obj.setTrRotation = function (keyPath, degree) {
    obj.lottieHandle.setTrRotation(keyPath, degree);
  };

  obj.setTrOpacity = function (keyPath, opacity) {
    obj.lottieHandle.setTrOpacity(keyPath, opacity);
  };

  function mainLoop() {
    obj.rafId = window.requestAnimationFrame(mainLoop);
    obj.render();
    document.getElementById("slider").max = obj.frameCount;
    document.getElementById("slider").value = obj.curFrame;
  }


  // resize canvas
  function relayoutCanvas() {
    var width = document.getElementById("content").clientWidth;
    var height = document.getElementById("content").clientHeight;
    var size = width;
    if (width < height) size = width;
    else size = height;
    size = size - 8;

    document.getElementById("myCanvas").width = size;
    document.getElementById("myCanvas").height = size;
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

  // ssafysr project
  // Get all layers with recursive methods
  function getAllLayers(list, par, name) {
    for (var i in list) {
      var layer = document.createElement("li")
      if (list[i].nm != null) {
        layer.innerHTML = list[i].nm
        layer.setAttribute("data-value", name + list[i].nm + ".")
        layer.addEventListener("click", function(e) { 
          e.stopPropagation()
          document.getElementById("customize-keypath").value=this.getAttribute("data-value") + "**"
        })
      }
      for (var j in list[i]) {
        if (Array.isArray(list[i][j])) {
          var sublayer = document.createElement("ul")
          getAllLayers(list[i][j], sublayer, layer.getAttribute("data-value"))
          layer.appendChild(sublayer)
        }
      }
      par.appendChild(layer)
    }
  }
  return obj;
})();

// play, pause lottie
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

// upload JSON file
function handleFiles(files) {
  for (var i = 0, f; (f = files[i]); i++) {
    if (f.type.includes("json")) {
      var read = new FileReader();
      read.readAsText(f);
      read.onloadend = function () {
        const lottie = JSON.parse(read.result);
        RLottieModule.keyPathTree = getKeyPathTree(lottie);
        RLottieModule.reload(read.result);
      };
      break;
    } else {
      alert("please upload JSON file :)");
    }
  }
}

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = "copy";
}

// JSON file change
function fileSelectionChanged() {
  var input = document.getElementById("fileSelector");
  handleFiles(input.files);
}

function onResizeSliderDrag(value) {
  var width = document.getElementById("content").clientWidth;
  var height = document.getElementById("content").clientHeight;
  var size = width;
  if (width < height) size = width;
  else size = height;
  size = size - 8;
  size = size * (value / 100);

  if (size < 10) size = 10;
  size = size | 0;
  document.getElementById("myCanvas").width = size;
  document.getElementById("myCanvas").height = size;
  RLottieModule.update();
}

// play reverse
function playReverse() {
  RLottieModule.reverse = !RLottieModule.reverse;
  var status = "역방향";
  if (RLottieModule.reverse) {
    var status = "정방향";
  }
  document.getElementById("playReverse").innerText = status;
}

//get rlottie by url -write by lee
function getByUrl(){
  var url=document.getElementById("urlInput").value;
  if(url===""){
    alert("url을 입력해주세요")
    return;
  }
  axios.get(url).then((res) => {
    var read=res.data;
    console.log(read);
    RLottieModule.reload(JSON.stringify(read));
  })
  .catch((err) => {
    console.log(err);
  });

  console.log(url);
}

function setFillColor(keyPath, r, g, b) {
  RLottieModule.setFillColor(keyPath, r, g, b);
}

function setFillOpacity(keyPath, opacity) {
  RLottieModule.setFillOpacity(keyPath, opacity);
}

function setStrokeColor(keyPath, r, g, b) {
  RLottieModule.setStrokeColor(keyPath, r, g, b);
}

function setStrokeOpacity(keyPath, opacity) {
  RLottieModule.setStrokeOpacity(keyPath, opacity);
}

function setStrokeWidth(keyPath, width) {
  RLottieModule.setStrokeWidth(keyPath, width);
}

function setTrAnchor(keyPath, x, y) {
  RLottieModule.setTrAnchor(keyPath, x, y);
}

function setTrPosition(keyPath, x, y) {
  RLottieModule.setTrPosition(keyPath, x, y);
}

function setTrScale(keyPath, w, h) {
  RLottieModule.setTrScale(keyPath, w, h);
}

function setTrRotation(keyPath, degree) {
  RLottieModule.setTrRotation(keyPath, degree);
}

function setTrOpacity(keyPath, opacity) {
  RLottieModule.setTrOpacity(keyPath, opacity);
}

function getKeyPathTree(obj, depth = 0) {
  const node = {
    depth: depth,
    name: obj.nm,
    type: obj.ty,
    child: [],
  };
  for (const prop in obj) {
    if (obj[prop].map) {
      node.child = node.child.concat(
        obj[prop].map((v) => getKeyPathTree(v, depth + 1))
      );
    }
  }
  return node;
}

// ssafysr project
function typeChange(val) {
  document.getElementById('customize-keypath').value=''
  var custominput = document.getElementById('customize-value')
  custominput.innerHTML = ''
  switch (val) {
    case "0":
    case "2":
      var color = document.createElement("input")
      color.setAttribute("type", "color")
      custominput.appendChild(color)
      break;
    case "1":
    case "3":
    case "9":
      var opacity = document.createElement("input")
      opacity.setAttribute("type", "range")
      custominput.appendChild(opacity)
      break;
    case "4":
    case "8":
      var width = document.createElement("input")
      width.setAttribute("type", "number")
      custominput.appendChild(width)
      break;
    case "5":
    case "6":
    case "7":
      var x = document.createElement("input")
      var y = document.createElement("input")
      x.setAttribute("type", "number")
      y.setAttribute("type", "number")
      custominput.appendChild(x)
      custominput.appendChild(y)
      break;
  }
}

// ssafysr project
function customizeLottie() {
  var type = document.getElementById("customize-type").value
  var keypath = document.getElementById("customize-keypath").value
  var val = document.getElementById("customize-value").firstChild.value
  switch(type) {
    case "0":
      setFillColor(keypath, 256 - parseInt("0x" + val.slice(1, 3)), 256 - parseInt("0x" + val.slice(3, 5)), 256 - parseInt("0x" + val.slice(5)))
      break;
    case "1":
      setFillOpacity(keypath, parseFloat(val))
      break;
    case "2":
      setStrokeColor(keypath, 256 - parseInt("0x" + val.slice(1, 3)), 256 - parseInt("0x" + val.slice(3, 5)), 256 - parseInt("0x" + val.slice(5)))
      break;
    case "3":
      setStrokeOpacity(keypath, parseFloat(val))
      break;
    case "4":
      setStrokeWidth(keypath, parseFloat(val))
      break;
    case "5":
      var val2 = document.getElementById("customize-value").lastChild.value
      setTrAnchor(keypath, parseFloat(val), parseFloat(val2))
      break;
    case "6":
      var val2 = document.getElementById("customize-value").lastChild.value
      setTrPosition(keypath, parseFloat(val), parseFloat(val2))
      break;
    case "7":
      var val2 = document.getElementById("customize-value").lastChild.value
      setTrScale(keypath, parseFloat(val), parseFloat(val2))
      break;
    case "8":
      setTrRotation(keypath, parseFloat(val))
      break;
    case "9":
      setTrOpacity(keypath, parseFloat(val))
      break;
  }
}