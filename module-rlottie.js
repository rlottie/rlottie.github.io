function setup() {
  var head = document.head;
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "rlottie-wasm.js";
  head.appendChild(script);

  // >>> Import Inho module, don't remove it before MR >>>
  var Inhoscript = document.createElement("script");
  Inhoscript.type = "text/javascript";
  Inhoscript.src = "Inho_module.js";
  head.appendChild(Inhoscript);
  //  <<<< end of Inho module, will be deleted with MR <<<

  script.onload = (_) => {
    Module.onRuntimeInitialized = (_) => {
      RLottieModule.init();
    };
  };
}
setup();

var aa = 1239;

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

  //add custom by lee frameList
  var frameList = {};

  frameList.init = function () {
    frameList.canvas = {};
    frameList.context = {};
    frameList.list = document.getElementById("frameList");

    while (frameList.list.hasChildNodes()) {
      frameList.list.removeChild(frameList.list.firstChild);
    }
    var term = 1;
    if (obj.frameCount > 10) {
      var term = parseInt(obj.frameCount / 10);
    }
    for (var i = 0; i < obj.frameCount; i += term) {
      var canvas = document.createElement("canvas");
      canvas.setAttribute("id", "frame" + i);
      canvas.classList.add("cursor-pointer");
      (function (m) {
        canvas.addEventListener(
          "click",
          function () {
            obj.seek(m);
          },
          false
        );
      })(i);

      frameList.list.appendChild(canvas);

      frameList.canvas = document.getElementById("frame" + i);
      frameList.context = frameList.canvas.getContext("2d");

      var buffer = obj.lottieHandle.render(i, 150, 150);
      var result = Uint8ClampedArray.from(buffer);
      var imageData = new ImageData(result, 150, 150);

      frameList.context.putImageData(imageData, 0, 0);
    }
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
    obj.layerList = JSON.parse(jsString).layers;
    document.getElementById("layerlist").innerHTML = "";
    getAllLayers(obj.layerList, document.getElementById("layerlist"));
    obj.frameCount = obj.lottieHandle.frames();
    obj.curFrame = 0;
    obj.frameRate = 0;
    obj.rafId = {};
    obj.resizeId = {};
    obj.playing = true;
    obj.wasPlaying = false;

    //layer list by yoon
    obj.layerList = [];

    // force a render in pause state
    sliderReset();
    frameList.init();
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
    obj.curFrame = Number(value);
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

  obj.callAPI = function (name, argv) {
    try {
      obj.lottieHandle[name](...argv);
    } catch (e) {
      console.log(e);
    }
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

  function getAllLayers(list, par) {
    for (var i in list) {
      if (list[i].nm != null) {
        var layer = document.createElement("li");
        layer.innerHTML = list[i].nm;
      }
      for (var j in list[i]) {
        if (Array.isArray(list[i][j])) {
          var sublayer = document.createElement("ul");
          getAllLayers(list[i][j], sublayer);
          layer.appendChild(sublayer);
        }
      }
      par.appendChild(layer);
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

function callAPI(name) {
  var controller = document.getElementById(name);
  var inputs = controller.getElementsByTagName("input");
  var argv = [];

  for (var i = 0; i < inputs.length; i++) {
    var type = inputs[i].dataset.type;
    var required = inputs[i].dataset.required;
    var value = inputs[i].value;

    if (required == "true" && value == "") {
      throw new Error("empty value");
    }

    if (type == "float") {
      var value = parseFloat(value);
      if (value == NaN) {
        throw new Error("invalid value");
      }
    }

    argv.push(value);
  }

  RLottieModule.callAPI(name, argv);
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
function getByUrl() {
  var url = document.getElementById("urlInput").value;
  if (url === "") {
    alert("url을 입력해주세요");
    return;
  }
  axios
    .get(url)
    .then((res) => {
      var read = res.data;
      console.log(read);
      RLottieModule.reload(JSON.stringify(read));
    })
    .catch((err) => {
      console.log(err);
    });

  console.log(url);
}

function setFillColor(keyPath, r, g, b) {
  RLottieModule.setFillColor(keyPath, 256 - r, 256 - g, 256 - b);
}

function setFillOpacity(keyPath, opacity) {
  RLottieModule.setFillOpacity(keyPath, opacity);
}

function setStrokeColor(keyPath, r, g, b) {
  RLottieModule.setStrokeColor(keyPath, 256 - r, 256 - g, 256 - b);
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
function kkk() {
  console.log("asdf");
}

var apiList = null;

function loadApiList() {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.status == 200) {
      var data = xhr.responseText;
      apiList = JSON.parse(data);
    } else {
      console.log("Error!");
    }
  };

  xhr.open("GET", "CppAPI.json");
  xhr.send(null);
}

loadApiList();

function toggle(name) {
  var controller = document.getElementById(name);
  var inputs = controller.getElementsByClassName("d")[0];

  inputs.classList.toggle("hide");
}

function createApiController() {
  var section = document.getElementById("a");
  while (section.hasChildNodes()) {
    section.removeChild(section.lastChild);
  }

  for (var type in apiList) {
    var apis = apiList[type];
    var objType = document.createElement("div");
    var typeName = document.createElement("div");
    typeName.innerText = type;
    objType.appendChild(typeName);
    for (var i = 0; i < apis.length; i++) {
      var controller = document.createElement("div");
      controller.id = apis[i].name;

      var title = document.createElement("div");
      var name = document.createElement("div");
      name.innerText = apis[i].name;
      var button = document.createElement("button");
      button.type = "button";
      button.innerText = "hide/show";
      button.addEventListener(
        "click",
        (function (m) {
          return function () {
            toggle(m);
          };
        })(apis[i].name)
      );
      title.appendChild(name);
      title.appendChild(button);

      controller.appendChild(title);

      var inputs = document.createElement("div");
      inputs.classList.add("d");
      inputs.classList.add("hide");
      var argv = apis[i].argv;
      for (var j = 0; j < argv.length; j++) {
        var input = document.createElement("div");
        var desc = document.createElement("span");
        desc.innerText = argv[j].desc;
        var type = document.createElement("span");
        type.innerText = "(type: " + argv[j].type + ")";
        var value = document.createElement("input");
        if (argv[j].type == "string") {
          value.type = "text";
        } else if (argv[j].type == "float") {
          value.type = "number";
          value.step = "0.01";
          if (argv[j].min != undefined) {
            value.min = argv[j].min;
          }
          if (argv[j].max != undefined) {
            value.max = argv[j].max;
          }
        }
        value.dataset.type = argv[j].type;
        value.dataset.required = argv[j].required;

        input.appendChild(desc);
        input.appendChild(type);
        input.appendChild(value);

        inputs.appendChild(input);
      }
      var button = document.createElement("button");
      button.type = "button";
      button.innerText = "run";
      button.addEventListener(
        "click",
        (function (m) {
          return function () {
            callAPI(m);
          };
        })(apis[i].name)
      );
      inputs.append(button);

      controller.appendChild(inputs);
      objType.appendChild(controller);
    }

    section.appendChild(objType);
  }
}

function openApiCreator() {
  var ref = document.getElementById("api-creator-section");

  var apiCreator = document.getElementById("api-creator");
  var clone = document.importNode(apiCreator.content, true);

  ref.appendChild(clone);
}

function closeApiCreator() {
  var ref = document.getElementById("api-creator-section");

  while (ref.hasChildNodes()) {
    ref.removeChild(ref.lastChild);
  }
}

function addArgument(event) {
  var ref = event.target;
  var parent = ref.parentNode;

  var argument = document.getElementById("argument");
  var clone = document.importNode(argument.content, true);

  parent.insertBefore(clone, ref);
}

function deleteArgument(event) {
  var ref = event.target;
  ref.parentNode.parentNode.removeChild(ref.parentNode);
}

function onTypeChange(event) {
  var ref = event.target;
  var parent = ref.parentNode;

  var limit = parent.getElementsByClassName("arg-limit")[0];
  if (ref.value == "string") {
    if (limit.checked) {
      limit.click();
    }
    limit.disabled = true;
  } else if ((ref.value = "float")) {
    limit.disabled = false;
  }
}

function onLimitChange(event) {
  var ref = event.target;
  var parent = ref.parentNode;

  var max = parent.getElementsByClassName("limit-max")[0];
  var min = parent.getElementsByClassName("limit-min")[0];

  if (ref.checked) {
    max.disabled = false;
    min.disabled = false;
  } else {
    max.value = "";
    max.disabled = true;
    min.value = "";
    min.disabled = true;
  }
}

function addAPI(event) {
  var apiCreator = event.target.parentNode;

  var targetObject = apiCreator.getElementsByClassName("target-object")[0]
    .value;
  var name = apiCreator.getElementsByClassName("api-name")[0].value;

  var arguments = apiCreator.getElementsByClassName("argument");
  var argc = arguments.length;
  var argv = [];

  for (var i = 0; i < argc; i++) {
    var argument = {};
    argument.id = i;
    argument.desc = arguments[i].getElementsByClassName("arg-desc")[0].value;
    argument.type = arguments[i].getElementsByClassName("arg-type")[0].value;
    argument.required = "true";
    if (arguments[i].getElementsByClassName("arg-limit")[0].checked) {
      argument.max = arguments[i].getElementsByClassName("limit-max")[0].value;
      argument.min = arguments[i].getElementsByClassName("limit-min")[0].value;
    }
    argv.push(argument);
  }

  var newApi = { name, argc, argv };

  if (apiList[targetObject]) {
    apiList[targetObject].push(newApi);
  } else {
    apiList[targetObject] = [newApi];
  }

  closeApiCreator();
}
