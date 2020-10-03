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
  obj.json = {};

  obj.init = function () {
    var input = document.getElementById("fileSelector");
    input.addEventListener("change", fileSelectionChanged);
    window.addEventListener("dragover", handleDragOver, false);
    window.addEventListener("drop", handleFileSelect, false);
    window.addEventListener("resize", windowResize);
    relayoutCanvas();
    obj.canvas = document.getElementById("myCanvas");
    obj.context = obj.canvas.getContext("2d");

    obj.layerList = resource.layers;
    document.getElementById("layerlist").innerHTML = "";
    getAllLayers(obj.layerList, document.getElementById("layerlist"));
    new AccordionMenu(".lllist");
    obj.lottieHandle = new Module.RlottieWasm(JSON.stringify(resource));
    obj.json = JSON.stringify(resource);
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
      var term = parseInt(obj.frameCount / 4);
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

      var buffer = obj.lottieHandle.render(i, 110, 110);
      var result = Uint8ClampedArray.from(buffer);
      var imageData = new ImageData(result, 110, 110);

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
    obj.json = jsString;
    obj.layerList = JSON.parse(jsString).layers;
    document.getElementById("layerlist").innerHTML = "";
    getAllLayers(obj.layerList, document.getElementById("layerlist"));
    new AccordionMenu(".lllist");
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
    var layers = document.createElement("UL");
    for (var i in list) {
      if (list[i].nm != null) {
        var layer = document.createElement("LI");
        var textArea = document.createElement("SPAN");
        var tex = document.createElement("SPAN");
        tex.innerHTML = list[i].nm;
        tex.addEventListener("click", function (e) {
          e.stopPropagation();
          var t = document.createElement("textarea");
          var node = this;
          var text = "**";
          while (node.id != "layerlist") {
            if (node.tagName == "LI")
              text = node.innerText.split("\n")[0] + "." + text;
            node = node.parentNode;
          }
          t.value = text;
          document.body.appendChild(t);
          t.focus();
          t.select();
          document.execCommand("copy");
          document.body.removeChild(t);
          openSnackbar();
        });
        textArea.appendChild(tex);
        textArea.classList.add("cursor-pointer");
        layer.appendChild(textArea);
      } else {
        continue;
      }
      for (var j in list[i]) {
        if (Array.isArray(list[i][j])) {
          getAllLayers(list[i][j], layer);
        }
      }
      layers.appendChild(layer);
    }
    par.appendChild(layers);
  }
  return obj;
})();

// play, pause lottie
function buttonClicked() {
  if (RLottieModule.isPlaying()) {
    document.getElementById("playButton").innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="18px" height="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M8 5v14l11-7L8 5z"/></svg>';
    RLottieModule.pause();
  } else {
    document.getElementById("playButton").innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="18px" height="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
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

function onBackgroundSliderDrag(value) {
  var width = document.getElementById("content").clientWidth;
  var height = document.getElementById("content").clientHeight;
  var size = width;
  if (width < height) size = width;
  else size = height;
  size = size - 8;
  size = size * (value / 100);

  if (size < 10) size = 10;
  size = size | 0;
  // console.log(document.getElementById("content").style);
  document.getElementById("content").style.backgroundSize = size + "px";
  // document.getElementById("myCanvas").height = size;
  // RLottieModule.update();
}

// play reverse
function playReverse() {
  RLottieModule.reverse = !RLottieModule.reverse;
  var status =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="18px" height="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/></svg>';
  if (RLottieModule.reverse) {
    var status =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="18px" height="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/></svg>';
  }
  document.getElementById("playReverse").innerHTML = status;
}

//Get lottie file from url -write by lee
function getLottieFromUrl(input) {
  var url = input.trim();
  if (url == "" || !(url.startsWith("http://") || url.startsWith("https://"))) {
    alert("Enter correct URL starting with 'http://' or 'https://'");
    return;
  }

  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.status == 200) {
      var data = xhr.responseText;
      try {
        JSON.parse(data);
      } catch (error) {
        throw new Error("Response data is not JSON format");
      }
      RLottieModule.reload(data);
    } else {
      throw new Error("Request failed");
    }
  };

  xhr.open("GET", url);
  xhr.send(null);
}

function onExecClick(event) {
  var ref = event.target;
  var apiCard = ref.parentNode.parentNode;
  var apiName = apiCard.getElementsByClassName("api-name")[0];
  var name = apiName.innerText;

  var inputs = apiCard.getElementsByTagName("input");
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

function resetBackGround() {
  var board = document.getElementById("content");
  board.removeAttribute("style");
  document.getElementById("bg-color").value = "#FFFFFF";
  document.getElementById("bg-color").style.backgroundImage = "";
}
function backgroundChangeClick() {
  document.getElementById("background__input").click();
}

function onChangeBackGround(e) {
  const file = e.target.files[0];
  if (!!file) {
    document.getElementById(
      "content"
    ).style.backgroundImage = `url(${URL.createObjectURL(file)})`;
  }
}

function resetLottie() {
  RLottieModule.reload(RLottieModule.json);
}

function openURLprompt() {
  var input = prompt("enter lottie url from https://lottiefiles.com/featured");
  if (input) {
    getLottieFromUrl(input);
  }
}

//moved api_dom.js

var apiList = null;
var opneCreator=false;

(function loadApiList() {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.status == 200) {
      var data = xhr.responseText;
      apiList = JSON.parse(data);
      createApiController()
    } else {
      alert("Please check if there is a './CppAPI.json' file");
    }
  };

  xhr.open("GET", "CppAPI.json");
  xhr.send(null);
})();

function createApiController() {
  var section = document.getElementById("api-controller-section");
  while(section.hasChildNodes()) {
    section.removeChild(section.lastChild);
  }

  for(var type in apiList) {
    var apis = apiList[type];
    for(let i = 0; i < apis.length; i++) {
      var api = apis[i];
      var apiCard = document.getElementById("api-card");
      apiCard = document.importNode(apiCard.content, true);

      var apiName = apiCard.querySelectorAll(".api-name")[0];
      apiName.innerText = api.name;

      var apiBody = apiCard.querySelectorAll(".api-body")[0];
      var apiExec = apiBody.querySelectorAll(".api-exec")[0];
      for(let j = 0; j < api.argc; j++) {
        var arg = api.argv[j];
        var apiArg = document.getElementById("api-arg");
        apiArg = document.importNode(apiArg.content, true);

        var argDesc = apiArg.querySelectorAll(".arg-desc")[0];
        argDesc.innerText = arg.desc;
        var argType = apiArg.querySelectorAll(".arg-type")[0];
        argType.innerText = "(type: " + arg.type + ")";
        
        var argInput = apiArg.querySelectorAll(".arg-input")[0];
        if(arg.type == "string") {
          argInput.type = "text";
        } else if(arg.type == "float") {
          argInput.type = "number";
          argInput.step = "0.01";
          if(arg.min != undefined) {
            argInput.min = arg.min;
          }
          if(arg.max != undefined) {
            argInput.max = arg.max;
          }
        }
        argInput.dataset.type = arg.type;
        argInput.dataset.required = arg.required;

        apiBody.insertBefore(apiArg, apiExec);
      }
      
      section.appendChild(apiCard);
    }
  }
}

function onFoldClick(event) {
  var ref = event.target;
  var apiCard = ref.parentNode.parentNode;
  var apiBody = apiCard.getElementsByClassName("api-body")[0];

  apiBody.classList.toggle("hide");
}

function openApiCreator() { 
  //add
  if(this.opneCreator){
    alert("already open creator");
    return;
  }
  this.opneCreator=true;
  this.openApiCreatorModal();
  var ref = document.getElementById("api-creator-section");

  var apiCreator = document.getElementById("api-creator");
  var clone = document.importNode(apiCreator.content, true);

  ref.appendChild(clone);
}

function closeApiCreator() {
  var ref = document.getElementById("api-creator-section");
  this.opneCreator=false;
  var shadow = document.getElementById("shadow");
  shadow.style.display="none";
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
  //add 
  this.opneCreator=false;
  var apiCreator = event.target.parentNode;

  var targetObject = apiCreator.getElementsByClassName("target-object")[0].value;
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
  createApiController();
}

function downloadApiList() {
  var blob = new Blob([JSON.stringify(apiList, null, 2)], {type: 'application/json'});
  var url = URL.createObjectURL(blob);
  var link = document.createElement("a");

  link.setAttribute('href', url);
  link.setAttribute('download', 'CppAPI.json');
  link.click();
}


function openApiCreatorModal(){
  var modal=document.getElementById("api-creator-section");
  modal.style.display="block";

  var shadow = document.getElementById("shadow");
  shadow.style.display="block";

}



var resource = {
  v: "5.1.8",
  fr: 60,
  ip: 3,
  op: 140,
  w: 500,
  h: 500,
  nm: "ANUB",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "a",
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: { a: 0, k: -3.113, ix: 10 },
        p: { a: 0, k: [327.214, 315.758, 0], ix: 2 },
        a: { a: 0, k: [-17, 77, 0], ix: 1 },
        s: { a: 0, k: [-100, 100, 100], ix: 6 },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              ix: 1,
              ks: {
                a: 1,
                k: [
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: -20.2,
                    s: [
                      {
                        i: [
                          [-6.5, -2],
                          [-4.5, -15.5],
                        ],
                        o: [
                          [6.5, 2],
                          [3.209, 11.054],
                        ],
                        v: [
                          [-17, 75],
                          [18, 154],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-4.161, -1.28],
                          [50.642, -32.142],
                        ],
                        o: [
                          [4.161, 1.28],
                          [-33.86, 21.491],
                        ],
                        v: [
                          [-17, 75],
                          [1.858, 129.142],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: -13.001,
                    s: [
                      {
                        i: [
                          [-4.161, -1.28],
                          [50.642, -32.142],
                        ],
                        o: [
                          [4.161, 1.28],
                          [-33.86, 21.491],
                        ],
                        v: [
                          [-17, 75],
                          [1.858, 129.142],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [29.75, -14.5],
                        ],
                        o: [
                          [0, 0],
                          [-29.75, 14.5],
                        ],
                        v: [
                          [-17, 75],
                          [-56.25, 145.5],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: -3.399,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [29.75, -14.5],
                        ],
                        o: [
                          [0, 0],
                          [-29.75, 14.5],
                        ],
                        v: [
                          [-17, 75],
                          [-56.25, 145.5],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [29.75, -14.5],
                        ],
                        o: [
                          [0, 0],
                          [-29.75, 14.5],
                        ],
                        v: [
                          [-17, 75],
                          [-56.25, 145.5],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 2.999,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [29.75, -14.5],
                        ],
                        o: [
                          [0, 0],
                          [-29.75, 14.5],
                        ],
                        v: [
                          [-17, 75],
                          [-56.25, 145.5],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-4.161, -1.28],
                          [50.642, -32.142],
                        ],
                        o: [
                          [4.161, 1.28],
                          [-33.86, 21.491],
                        ],
                        v: [
                          [-17, 75],
                          [1.858, 129.142],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 13.4,
                    s: [
                      {
                        i: [
                          [-4.161, -1.28],
                          [50.642, -32.142],
                        ],
                        o: [
                          [4.161, 1.28],
                          [-33.86, 21.491],
                        ],
                        v: [
                          [-17, 75],
                          [1.858, 129.142],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-6.5, -2],
                          [-4.5, -15.5],
                        ],
                        o: [
                          [6.5, 2],
                          [3.209, 11.054],
                        ],
                        v: [
                          [-17, 75],
                          [18, 154],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 20.599,
                    s: [
                      {
                        i: [
                          [-6.5, -2],
                          [-4.5, -15.5],
                        ],
                        o: [
                          [6.5, 2],
                          [3.209, 11.054],
                        ],
                        v: [
                          [-17, 75],
                          [18, 154],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [-3.5, -4.5],
                        ],
                        o: [
                          [0, 0],
                          [3.5, 4.5],
                        ],
                        v: [
                          [-17, 75],
                          [-11.5, 164],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 32.599,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [-3.5, -4.5],
                        ],
                        o: [
                          [0, 0],
                          [3.5, 4.5],
                        ],
                        v: [
                          [-17, 75],
                          [-11.5, 164],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [-7.5, -34],
                        ],
                        o: [
                          [0, 0],
                          [7.5, 34],
                        ],
                        v: [
                          [-17, 75],
                          [-61, 161],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 42.2,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [-7.5, -34],
                        ],
                        o: [
                          [0, 0],
                          [7.5, 34],
                        ],
                        v: [
                          [-17, 75],
                          [-61, 161],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [29.75, -14.5],
                        ],
                        o: [
                          [0, 0],
                          [-29.75, 14.5],
                        ],
                        v: [
                          [-17, 75],
                          [-56.25, 145.5],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 49.999,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [29.75, -14.5],
                        ],
                        o: [
                          [0, 0],
                          [-29.75, 14.5],
                        ],
                        v: [
                          [-17, 75],
                          [-56.25, 145.5],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-4.161, -1.28],
                          [50.642, -32.142],
                        ],
                        o: [
                          [4.161, 1.28],
                          [-33.86, 21.491],
                        ],
                        v: [
                          [-17, 75],
                          [1.858, 129.142],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 58.999,
                    s: [
                      {
                        i: [
                          [-4.161, -1.28],
                          [50.642, -32.142],
                        ],
                        o: [
                          [4.161, 1.28],
                          [-33.86, 21.491],
                        ],
                        v: [
                          [-17, 75],
                          [1.858, 129.142],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-6.5, -2],
                          [-4.5, -15.5],
                        ],
                        o: [
                          [6.5, 2],
                          [3.209, 11.054],
                        ],
                        v: [
                          [-17, 75],
                          [18, 154],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 66.2,
                    s: [
                      {
                        i: [
                          [-6.5, -2],
                          [-4.5, -15.5],
                        ],
                        o: [
                          [6.5, 2],
                          [3.209, 11.054],
                        ],
                        v: [
                          [-17, 75],
                          [18, 154],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [-3.5, -4.5],
                        ],
                        o: [
                          [0, 0],
                          [3.5, 4.5],
                        ],
                        v: [
                          [-17, 75],
                          [-11.5, 164],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 78.2,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [-3.5, -4.5],
                        ],
                        o: [
                          [0, 0],
                          [3.5, 4.5],
                        ],
                        v: [
                          [-17, 75],
                          [-11.5, 164],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [-7.5, -34],
                        ],
                        o: [
                          [0, 0],
                          [7.5, 34],
                        ],
                        v: [
                          [-17, 75],
                          [-61, 161],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 87.8,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [-7.5, -34],
                        ],
                        o: [
                          [0, 0],
                          [7.5, 34],
                        ],
                        v: [
                          [-17, 75],
                          [-61, 161],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [29.75, -14.5],
                        ],
                        o: [
                          [0, 0],
                          [-29.75, 14.5],
                        ],
                        v: [
                          [-17, 75],
                          [-56.25, 145.5],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 94.999,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [29.75, -14.5],
                        ],
                        o: [
                          [0, 0],
                          [-29.75, 14.5],
                        ],
                        v: [
                          [-17, 75],
                          [-56.25, 145.5],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-4.161, -1.28],
                          [50.642, -32.142],
                        ],
                        o: [
                          [4.161, 1.28],
                          [-33.86, 21.491],
                        ],
                        v: [
                          [-17, 75],
                          [1.858, 129.142],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 104.599,
                    s: [
                      {
                        i: [
                          [-4.161, -1.28],
                          [50.642, -32.142],
                        ],
                        o: [
                          [4.161, 1.28],
                          [-33.86, 21.491],
                        ],
                        v: [
                          [-17, 75],
                          [1.858, 129.142],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-6.5, -2],
                          [-4.5, -15.5],
                        ],
                        o: [
                          [6.5, 2],
                          [3.209, 11.054],
                        ],
                        v: [
                          [-17, 75],
                          [18, 154],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 111.8,
                    s: [
                      {
                        i: [
                          [-6.5, -2],
                          [-4.5, -15.5],
                        ],
                        o: [
                          [6.5, 2],
                          [3.209, 11.054],
                        ],
                        v: [
                          [-17, 75],
                          [18, 154],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [-3.5, -4.5],
                        ],
                        o: [
                          [0, 0],
                          [3.5, 4.5],
                        ],
                        v: [
                          [-17, 75],
                          [-11.5, 164],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 123.8,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [-3.5, -4.5],
                        ],
                        o: [
                          [0, 0],
                          [3.5, 4.5],
                        ],
                        v: [
                          [-17, 75],
                          [-11.5, 164],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [-7.5, -34],
                        ],
                        o: [
                          [0, 0],
                          [7.5, 34],
                        ],
                        v: [
                          [-17, 75],
                          [-61, 161],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 133.999,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [-7.5, -34],
                        ],
                        o: [
                          [0, 0],
                          [7.5, 34],
                        ],
                        v: [
                          [-17, 75],
                          [-61, 161],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [29.75, -14.5],
                        ],
                        o: [
                          [0, 0],
                          [-29.75, 14.5],
                        ],
                        v: [
                          [-17, 75],
                          [-56.25, 145.5],
                        ],
                        c: false,
                      },
                    ],
                  },
                  { t: 138.99921875 },
                ],
                ix: 2,
              },
              nm: "Path 1",
              mn: "ADBE Vector Shape - Group",
              hd: false,
            },
            {
              ty: "st",
              c: {
                a: 0,
                k: [0.149019607843, 0.133333333333, 0.109803921569, 1],
                ix: 3,
              },
              o: { a: 0, k: 100, ix: 4 },
              w: { a: 0, k: 15, ix: 5 },
              lc: 2,
              lj: 1,
              ml: 4,
              nm: "Stroke 1",
              mn: "ADBE Vector Graphic - Stroke",
              hd: false,
            },
            {
              ty: "tr",
              p: { a: 0, k: [-22, 82], ix: 2 },
              a: { a: 0, k: [-22, 82], ix: 1 },
              s: { a: 0, k: [100, 100], ix: 3 },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Shape 1",
          np: 3,
          cix: 2,
          ix: 1,
          mn: "ADBE Vector Group",
          hd: false,
        },
      ],
      ip: -3,
      op: 289,
      st: -20.2,
      bm: 0,
    },
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "b",
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: { a: 0, k: -6, ix: 10 },
        p: { a: 0, k: [221.537, 318.968, 0], ix: 2 },
        a: { a: 0, k: [-17, 77, 0], ix: 1 },
        s: { a: 0, k: [100, 100, 100], ix: 6 },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              ix: 1,
              ks: {
                a: 1,
                k: [
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: -2.4,
                    s: [
                      {
                        i: [
                          [-6.5, -2],
                          [-4.5, -15.5],
                        ],
                        o: [
                          [6.5, 2],
                          [3.209, 11.054],
                        ],
                        v: [
                          [-17, 75],
                          [18, 154],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-4.161, -1.28],
                          [50.642, -32.142],
                        ],
                        o: [
                          [4.161, 1.28],
                          [-33.86, 21.491],
                        ],
                        v: [
                          [-17, 75],
                          [1.858, 129.142],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 3,
                    s: [
                      {
                        i: [
                          [-4.161, -1.28],
                          [50.642, -32.142],
                        ],
                        o: [
                          [4.161, 1.28],
                          [-33.86, 21.491],
                        ],
                        v: [
                          [-17, 75],
                          [1.858, 129.142],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [29.75, -14.5],
                        ],
                        o: [
                          [0, 0],
                          [-29.75, 14.5],
                        ],
                        v: [
                          [-17, 75],
                          [-56.25, 145.5],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 14.401,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [29.75, -14.5],
                        ],
                        o: [
                          [0, 0],
                          [-29.75, 14.5],
                        ],
                        v: [
                          [-17, 75],
                          [-56.25, 145.5],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [-7.5, -34],
                        ],
                        o: [
                          [0, 0],
                          [7.5, 34],
                        ],
                        v: [
                          [-17, 75],
                          [-61, 161],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 21.6,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [-7.5, -34],
                        ],
                        o: [
                          [0, 0],
                          [7.5, 34],
                        ],
                        v: [
                          [-17, 75],
                          [-61, 161],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [-3.5, -4.5],
                        ],
                        o: [
                          [0, 0],
                          [3.5, 4.5],
                        ],
                        v: [
                          [-17, 75],
                          [-11.5, 164],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 31.2,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [-3.5, -4.5],
                        ],
                        o: [
                          [0, 0],
                          [3.5, 4.5],
                        ],
                        v: [
                          [-17, 75],
                          [-11.5, 164],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-6.5, -2],
                          [-4.5, -15.5],
                        ],
                        o: [
                          [6.5, 2],
                          [3.209, 11.054],
                        ],
                        v: [
                          [-17, 75],
                          [18, 154],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 43.2,
                    s: [
                      {
                        i: [
                          [-6.5, -2],
                          [-4.5, -15.5],
                        ],
                        o: [
                          [6.5, 2],
                          [3.209, 11.054],
                        ],
                        v: [
                          [-17, 75],
                          [18, 154],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-4.161, -1.28],
                          [50.642, -32.142],
                        ],
                        o: [
                          [4.161, 1.28],
                          [-33.86, 21.491],
                        ],
                        v: [
                          [-17, 75],
                          [1.858, 129.142],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 50.401,
                    s: [
                      {
                        i: [
                          [-4.161, -1.28],
                          [50.642, -32.142],
                        ],
                        o: [
                          [4.161, 1.28],
                          [-33.86, 21.491],
                        ],
                        v: [
                          [-17, 75],
                          [1.858, 129.142],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [29.75, -14.5],
                        ],
                        o: [
                          [0, 0],
                          [-29.75, 14.5],
                        ],
                        v: [
                          [-17, 75],
                          [-56.25, 145.5],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 60,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [29.75, -14.5],
                        ],
                        o: [
                          [0, 0],
                          [-29.75, 14.5],
                        ],
                        v: [
                          [-17, 75],
                          [-56.25, 145.5],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [-7.5, -34],
                        ],
                        o: [
                          [0, 0],
                          [7.5, 34],
                        ],
                        v: [
                          [-17, 75],
                          [-61, 161],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 67.2,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [-7.5, -34],
                        ],
                        o: [
                          [0, 0],
                          [7.5, 34],
                        ],
                        v: [
                          [-17, 75],
                          [-61, 161],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [-3.5, -4.5],
                        ],
                        o: [
                          [0, 0],
                          [3.5, 4.5],
                        ],
                        v: [
                          [-17, 75],
                          [-11.5, 164],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 76.799,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [-3.5, -4.5],
                        ],
                        o: [
                          [0, 0],
                          [3.5, 4.5],
                        ],
                        v: [
                          [-17, 75],
                          [-11.5, 164],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-6.5, -2],
                          [-4.5, -15.5],
                        ],
                        o: [
                          [6.5, 2],
                          [3.209, 11.054],
                        ],
                        v: [
                          [-17, 75],
                          [18, 154],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 88.799,
                    s: [
                      {
                        i: [
                          [-6.5, -2],
                          [-4.5, -15.5],
                        ],
                        o: [
                          [6.5, 2],
                          [3.209, 11.054],
                        ],
                        v: [
                          [-17, 75],
                          [18, 154],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-4.161, -1.28],
                          [50.642, -32.142],
                        ],
                        o: [
                          [4.161, 1.28],
                          [-33.86, 21.491],
                        ],
                        v: [
                          [-17, 75],
                          [1.858, 129.142],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 96,
                    s: [
                      {
                        i: [
                          [-4.161, -1.28],
                          [50.642, -32.142],
                        ],
                        o: [
                          [4.161, 1.28],
                          [-33.86, 21.491],
                        ],
                        v: [
                          [-17, 75],
                          [1.858, 129.142],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [29.75, -14.5],
                        ],
                        o: [
                          [0, 0],
                          [-29.75, 14.5],
                        ],
                        v: [
                          [-17, 75],
                          [-56.25, 145.5],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 105.6,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [29.75, -14.5],
                        ],
                        o: [
                          [0, 0],
                          [-29.75, 14.5],
                        ],
                        v: [
                          [-17, 75],
                          [-56.25, 145.5],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [-7.5, -34],
                        ],
                        o: [
                          [0, 0],
                          [7.5, 34],
                        ],
                        v: [
                          [-17, 75],
                          [-61, 161],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 112.799,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [-7.5, -34],
                        ],
                        o: [
                          [0, 0],
                          [7.5, 34],
                        ],
                        v: [
                          [-17, 75],
                          [-61, 161],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [-3.5, -4.5],
                        ],
                        o: [
                          [0, 0],
                          [3.5, 4.5],
                        ],
                        v: [
                          [-17, 75],
                          [-11.5, 164],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 122.401,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [-3.5, -4.5],
                        ],
                        o: [
                          [0, 0],
                          [3.5, 4.5],
                        ],
                        v: [
                          [-17, 75],
                          [-11.5, 164],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-6.5, -2],
                          [-4.5, -15.5],
                        ],
                        o: [
                          [6.5, 2],
                          [3.209, 11.054],
                        ],
                        v: [
                          [-17, 75],
                          [18, 154],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 132,
                    s: [
                      {
                        i: [
                          [-6.5, -2],
                          [-4.5, -15.5],
                        ],
                        o: [
                          [6.5, 2],
                          [3.209, 11.054],
                        ],
                        v: [
                          [-17, 75],
                          [18, 154],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-4.161, -1.28],
                          [50.642, -32.142],
                        ],
                        o: [
                          [4.161, 1.28],
                          [-33.86, 21.491],
                        ],
                        v: [
                          [-17, 75],
                          [1.858, 129.142],
                        ],
                        c: false,
                      },
                    ],
                  },
                  { t: 139.000390625 },
                ],
                ix: 2,
              },
              nm: "Path 1",
              mn: "ADBE Vector Shape - Group",
              hd: false,
            },
            {
              ty: "st",
              c: {
                a: 0,
                k: [0.149019607843, 0.133333333333, 0.109803921569, 1],
                ix: 3,
              },
              o: { a: 0, k: 100, ix: 4 },
              w: { a: 0, k: 15, ix: 5 },
              lc: 2,
              lj: 1,
              ml: 4,
              nm: "Stroke 1",
              mn: "ADBE Vector Graphic - Stroke",
              hd: false,
            },
            {
              ty: "tr",
              p: { a: 0, k: [-22, 82], ix: 2 },
              a: { a: 0, k: [-22, 82], ix: 1 },
              s: { a: 0, k: [100, 100], ix: 3 },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Shape 1",
          np: 3,
          cix: 2,
          ix: 1,
          mn: "ADBE Vector Group",
          hd: false,
        },
      ],
      ip: 0,
      op: 288,
      st: -2.4,
      bm: 0,
    },
    {
      ddd: 0,
      ind: 3,
      ty: 4,
      nm: "c",
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: { a: 0, k: -3.113, ix: 10 },
        p: { a: 0, k: [361.652, 319.398, 0], ix: 2 },
        a: { a: 0, k: [-17, 77, 0], ix: 1 },
        s: { a: 0, k: [-100, 100, 100], ix: 6 },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              ix: 1,
              ks: {
                a: 1,
                k: [
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: -14.4,
                    s: [
                      {
                        i: [
                          [-6.5, -2],
                          [-4.5, -15.5],
                        ],
                        o: [
                          [6.5, 2],
                          [3.209, 11.054],
                        ],
                        v: [
                          [-17, 75],
                          [18, 154],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-4.161, -1.28],
                          [50.642, -32.142],
                        ],
                        o: [
                          [4.161, 1.28],
                          [-33.86, 21.491],
                        ],
                        v: [
                          [-17, 75],
                          [1.858, 129.142],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: -7.201,
                    s: [
                      {
                        i: [
                          [-4.161, -1.28],
                          [50.642, -32.142],
                        ],
                        o: [
                          [4.161, 1.28],
                          [-33.86, 21.491],
                        ],
                        v: [
                          [-17, 75],
                          [1.858, 129.142],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-6.5, -2],
                          [-4.5, -15.5],
                        ],
                        o: [
                          [6.5, 2],
                          [3.209, 11.054],
                        ],
                        v: [
                          [-17, 75],
                          [18, 154],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: -0.002,
                    s: [
                      {
                        i: [
                          [-6.5, -2],
                          [-4.5, -15.5],
                        ],
                        o: [
                          [6.5, 2],
                          [3.209, 11.054],
                        ],
                        v: [
                          [-17, 75],
                          [18, 154],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-3.791, -1.166],
                          [-4.083, -10.915],
                        ],
                        o: [
                          [3.791, 1.166],
                          [3.33, 8.322],
                        ],
                        v: [
                          [-17, 75],
                          [5.704, 158.168],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 3,
                    s: [
                      {
                        i: [
                          [-3.791, -1.166],
                          [-4.083, -10.915],
                        ],
                        o: [
                          [3.791, 1.166],
                          [3.33, 8.322],
                        ],
                        v: [
                          [-17, 75],
                          [5.704, 158.168],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [-3.5, -4.5],
                        ],
                        o: [
                          [0, 0],
                          [3.5, 4.5],
                        ],
                        v: [
                          [-17, 75],
                          [-11.5, 164],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 11.998,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [-3.5, -4.5],
                        ],
                        o: [
                          [0, 0],
                          [3.5, 4.5],
                        ],
                        v: [
                          [-17, 75],
                          [-11.5, 164],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [-7.5, -34],
                        ],
                        o: [
                          [0, 0],
                          [7.5, 34],
                        ],
                        v: [
                          [-17, 75],
                          [-61, 161],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 21.6,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [-7.5, -34],
                        ],
                        o: [
                          [0, 0],
                          [7.5, 34],
                        ],
                        v: [
                          [-17, 75],
                          [-61, 161],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [29.75, -14.5],
                        ],
                        o: [
                          [0, 0],
                          [-29.75, 14.5],
                        ],
                        v: [
                          [-17, 75],
                          [-56.25, 145.5],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 28.799,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [29.75, -14.5],
                        ],
                        o: [
                          [0, 0],
                          [-29.75, 14.5],
                        ],
                        v: [
                          [-17, 75],
                          [-56.25, 145.5],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-4.161, -1.28],
                          [50.642, -32.142],
                        ],
                        o: [
                          [4.161, 1.28],
                          [-33.86, 21.491],
                        ],
                        v: [
                          [-17, 75],
                          [1.858, 129.142],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 38.399,
                    s: [
                      {
                        i: [
                          [-4.161, -1.28],
                          [50.642, -32.142],
                        ],
                        o: [
                          [4.161, 1.28],
                          [-33.86, 21.491],
                        ],
                        v: [
                          [-17, 75],
                          [1.858, 129.142],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-6.5, -2],
                          [-4.5, -15.5],
                        ],
                        o: [
                          [6.5, 2],
                          [3.209, 11.054],
                        ],
                        v: [
                          [-17, 75],
                          [18, 154],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 45.6,
                    s: [
                      {
                        i: [
                          [-6.5, -2],
                          [-4.5, -15.5],
                        ],
                        o: [
                          [6.5, 2],
                          [3.209, 11.054],
                        ],
                        v: [
                          [-17, 75],
                          [18, 154],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [-3.5, -4.5],
                        ],
                        o: [
                          [0, 0],
                          [3.5, 4.5],
                        ],
                        v: [
                          [-17, 75],
                          [-11.5, 164],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 57.6,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [-3.5, -4.5],
                        ],
                        o: [
                          [0, 0],
                          [3.5, 4.5],
                        ],
                        v: [
                          [-17, 75],
                          [-11.5, 164],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [-7.5, -34],
                        ],
                        o: [
                          [0, 0],
                          [7.5, 34],
                        ],
                        v: [
                          [-17, 75],
                          [-61, 161],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 67.2,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [-7.5, -34],
                        ],
                        o: [
                          [0, 0],
                          [7.5, 34],
                        ],
                        v: [
                          [-17, 75],
                          [-61, 161],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [29.75, -14.5],
                        ],
                        o: [
                          [0, 0],
                          [-29.75, 14.5],
                        ],
                        v: [
                          [-17, 75],
                          [-56.25, 145.5],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 74.399,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [29.75, -14.5],
                        ],
                        o: [
                          [0, 0],
                          [-29.75, 14.5],
                        ],
                        v: [
                          [-17, 75],
                          [-56.25, 145.5],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-4.161, -1.28],
                          [50.642, -32.142],
                        ],
                        o: [
                          [4.161, 1.28],
                          [-33.86, 21.491],
                        ],
                        v: [
                          [-17, 75],
                          [1.858, 129.142],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 83.998,
                    s: [
                      {
                        i: [
                          [-4.161, -1.28],
                          [50.642, -32.142],
                        ],
                        o: [
                          [4.161, 1.28],
                          [-33.86, 21.491],
                        ],
                        v: [
                          [-17, 75],
                          [1.858, 129.142],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-6.5, -2],
                          [-4.5, -15.5],
                        ],
                        o: [
                          [6.5, 2],
                          [3.209, 11.054],
                        ],
                        v: [
                          [-17, 75],
                          [18, 154],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 91.2,
                    s: [
                      {
                        i: [
                          [-6.5, -2],
                          [-4.5, -15.5],
                        ],
                        o: [
                          [6.5, 2],
                          [3.209, 11.054],
                        ],
                        v: [
                          [-17, 75],
                          [18, 154],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [-3.5, -4.5],
                        ],
                        o: [
                          [0, 0],
                          [3.5, 4.5],
                        ],
                        v: [
                          [-17, 75],
                          [-11.5, 164],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 103.2,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [-3.5, -4.5],
                        ],
                        o: [
                          [0, 0],
                          [3.5, 4.5],
                        ],
                        v: [
                          [-17, 75],
                          [-11.5, 164],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [-7.5, -34],
                        ],
                        o: [
                          [0, 0],
                          [7.5, 34],
                        ],
                        v: [
                          [-17, 75],
                          [-61, 161],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 112.799,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [-7.5, -34],
                        ],
                        o: [
                          [0, 0],
                          [7.5, 34],
                        ],
                        v: [
                          [-17, 75],
                          [-61, 161],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [29.75, -14.5],
                        ],
                        o: [
                          [0, 0],
                          [-29.75, 14.5],
                        ],
                        v: [
                          [-17, 75],
                          [-56.25, 145.5],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 119.998,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [29.75, -14.5],
                        ],
                        o: [
                          [0, 0],
                          [-29.75, 14.5],
                        ],
                        v: [
                          [-17, 75],
                          [-56.25, 145.5],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-4.161, -1.28],
                          [50.642, -32.142],
                        ],
                        o: [
                          [4.161, 1.28],
                          [-33.86, 21.491],
                        ],
                        v: [
                          [-17, 75],
                          [1.858, 129.142],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 130,
                    s: [
                      {
                        i: [
                          [-4.161, -1.28],
                          [50.642, -32.142],
                        ],
                        o: [
                          [4.161, 1.28],
                          [-33.86, 21.491],
                        ],
                        v: [
                          [-17, 75],
                          [1.858, 129.142],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-3.791, -1.166],
                          [-4.083, -10.915],
                        ],
                        o: [
                          [3.791, 1.166],
                          [3.33, 8.322],
                        ],
                        v: [
                          [-17, 75],
                          [5.704, 158.168],
                        ],
                        c: false,
                      },
                    ],
                  },
                  { t: 139.000390625 },
                ],
                ix: 2,
              },
              nm: "Path 1",
              mn: "ADBE Vector Shape - Group",
              hd: false,
            },
            {
              ty: "st",
              c: {
                a: 0,
                k: [0.149019607843, 0.133333333333, 0.109803921569, 1],
                ix: 3,
              },
              o: { a: 0, k: 100, ix: 4 },
              w: { a: 0, k: 15, ix: 5 },
              lc: 2,
              lj: 1,
              ml: 4,
              nm: "Stroke 1",
              mn: "ADBE Vector Graphic - Stroke",
              hd: false,
            },
            {
              ty: "tr",
              p: { a: 0, k: [-22, 82], ix: 2 },
              a: { a: 0, k: [-22, 82], ix: 1 },
              s: { a: 0, k: [100, 100], ix: 3 },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Shape 1",
          np: 3,
          cix: 2,
          ix: 1,
          mn: "ADBE Vector Group",
          hd: false,
        },
      ],
      ip: -20,
      op: 279,
      st: -14.4,
      bm: 0,
    },
    {
      ddd: 0,
      ind: 4,
      ty: 4,
      nm: "d",
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: { a: 0, k: -6, ix: 10 },
        p: { a: 0, k: [254.302, 326.574, 0], ix: 2 },
        a: { a: 0, k: [-17, 77, 0], ix: 1 },
        s: { a: 0, k: [100, 100, 100], ix: 6 },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              ix: 1,
              ks: {
                a: 1,
                k: [
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: -28.8,
                    s: [
                      {
                        i: [
                          [-6.5, -2],
                          [-4.5, -15.5],
                        ],
                        o: [
                          [6.5, 2],
                          [3.209, 11.054],
                        ],
                        v: [
                          [-17, 75],
                          [18, 154],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-4.161, -1.28],
                          [50.642, -32.142],
                        ],
                        o: [
                          [4.161, 1.28],
                          [-33.86, 21.491],
                        ],
                        v: [
                          [-17, 75],
                          [1.858, 129.142],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: -21.601,
                    s: [
                      {
                        i: [
                          [-4.161, -1.28],
                          [50.642, -32.142],
                        ],
                        o: [
                          [4.161, 1.28],
                          [-33.86, 21.491],
                        ],
                        v: [
                          [-17, 75],
                          [1.858, 129.142],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [29.75, -14.5],
                        ],
                        o: [
                          [0, 0],
                          [-29.75, 14.5],
                        ],
                        v: [
                          [-17, 75],
                          [-56.25, 145.5],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: -11.999,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [29.75, -14.5],
                        ],
                        o: [
                          [0, 0],
                          [-29.75, 14.5],
                        ],
                        v: [
                          [-17, 75],
                          [-56.25, 145.5],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [-7.5, -34],
                        ],
                        o: [
                          [0, 0],
                          [7.5, 34],
                        ],
                        v: [
                          [-17, 75],
                          [-61, 161],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: -4.8,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [-7.5, -34],
                        ],
                        o: [
                          [0, 0],
                          [7.5, 34],
                        ],
                        v: [
                          [-17, 75],
                          [-61, 161],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [-3.5, -4.5],
                        ],
                        o: [
                          [0, 0],
                          [3.5, 4.5],
                        ],
                        v: [
                          [-17, 75],
                          [-11.5, 164],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 2.8,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [-3.5, -4.5],
                        ],
                        o: [
                          [0, 0],
                          [3.5, 4.5],
                        ],
                        v: [
                          [-17, 75],
                          [-11.5, 164],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-6.5, -2],
                          [-4.5, -15.5],
                        ],
                        o: [
                          [6.5, 2],
                          [3.209, 11.054],
                        ],
                        v: [
                          [-17, 75],
                          [18, 154],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 16.8,
                    s: [
                      {
                        i: [
                          [-6.5, -2],
                          [-4.5, -15.5],
                        ],
                        o: [
                          [6.5, 2],
                          [3.209, 11.054],
                        ],
                        v: [
                          [-17, 75],
                          [18, 154],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-4.161, -1.28],
                          [50.642, -32.142],
                        ],
                        o: [
                          [4.161, 1.28],
                          [-33.86, 21.491],
                        ],
                        v: [
                          [-17, 75],
                          [1.858, 129.142],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 24.001,
                    s: [
                      {
                        i: [
                          [-4.161, -1.28],
                          [50.642, -32.142],
                        ],
                        o: [
                          [4.161, 1.28],
                          [-33.86, 21.491],
                        ],
                        v: [
                          [-17, 75],
                          [1.858, 129.142],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [29.75, -14.5],
                        ],
                        o: [
                          [0, 0],
                          [-29.75, 14.5],
                        ],
                        v: [
                          [-17, 75],
                          [-56.25, 145.5],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 33.6,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [29.75, -14.5],
                        ],
                        o: [
                          [0, 0],
                          [-29.75, 14.5],
                        ],
                        v: [
                          [-17, 75],
                          [-56.25, 145.5],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [-7.5, -34],
                        ],
                        o: [
                          [0, 0],
                          [7.5, 34],
                        ],
                        v: [
                          [-17, 75],
                          [-61, 161],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 40.8,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [-7.5, -34],
                        ],
                        o: [
                          [0, 0],
                          [7.5, 34],
                        ],
                        v: [
                          [-17, 75],
                          [-61, 161],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [-3.5, -4.5],
                        ],
                        o: [
                          [0, 0],
                          [3.5, 4.5],
                        ],
                        v: [
                          [-17, 75],
                          [-11.5, 164],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 50.399,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [-3.5, -4.5],
                        ],
                        o: [
                          [0, 0],
                          [3.5, 4.5],
                        ],
                        v: [
                          [-17, 75],
                          [-11.5, 164],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-6.5, -2],
                          [-4.5, -15.5],
                        ],
                        o: [
                          [6.5, 2],
                          [3.209, 11.054],
                        ],
                        v: [
                          [-17, 75],
                          [18, 154],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 62.399,
                    s: [
                      {
                        i: [
                          [-6.5, -2],
                          [-4.5, -15.5],
                        ],
                        o: [
                          [6.5, 2],
                          [3.209, 11.054],
                        ],
                        v: [
                          [-17, 75],
                          [18, 154],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-4.161, -1.28],
                          [50.642, -32.142],
                        ],
                        o: [
                          [4.161, 1.28],
                          [-33.86, 21.491],
                        ],
                        v: [
                          [-17, 75],
                          [1.858, 129.142],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 69.6,
                    s: [
                      {
                        i: [
                          [-4.161, -1.28],
                          [50.642, -32.142],
                        ],
                        o: [
                          [4.161, 1.28],
                          [-33.86, 21.491],
                        ],
                        v: [
                          [-17, 75],
                          [1.858, 129.142],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [29.75, -14.5],
                        ],
                        o: [
                          [0, 0],
                          [-29.75, 14.5],
                        ],
                        v: [
                          [-17, 75],
                          [-56.25, 145.5],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 79.2,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [29.75, -14.5],
                        ],
                        o: [
                          [0, 0],
                          [-29.75, 14.5],
                        ],
                        v: [
                          [-17, 75],
                          [-56.25, 145.5],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [-7.5, -34],
                        ],
                        o: [
                          [0, 0],
                          [7.5, 34],
                        ],
                        v: [
                          [-17, 75],
                          [-61, 161],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 86.399,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [-7.5, -34],
                        ],
                        o: [
                          [0, 0],
                          [7.5, 34],
                        ],
                        v: [
                          [-17, 75],
                          [-61, 161],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [-3.5, -4.5],
                        ],
                        o: [
                          [0, 0],
                          [3.5, 4.5],
                        ],
                        v: [
                          [-17, 75],
                          [-11.5, 164],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 96.001,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [-3.5, -4.5],
                        ],
                        o: [
                          [0, 0],
                          [3.5, 4.5],
                        ],
                        v: [
                          [-17, 75],
                          [-11.5, 164],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-6.5, -2],
                          [-4.5, -15.5],
                        ],
                        o: [
                          [6.5, 2],
                          [3.209, 11.054],
                        ],
                        v: [
                          [-17, 75],
                          [18, 154],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 106.001,
                    s: [
                      {
                        i: [
                          [-6.5, -2],
                          [-4.5, -15.5],
                        ],
                        o: [
                          [6.5, 2],
                          [3.209, 11.054],
                        ],
                        v: [
                          [-17, 75],
                          [18, 154],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [-4.161, -1.28],
                          [50.642, -32.142],
                        ],
                        o: [
                          [4.161, 1.28],
                          [-33.86, 21.491],
                        ],
                        v: [
                          [-17, 75],
                          [1.858, 129.142],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 113.2,
                    s: [
                      {
                        i: [
                          [-4.161, -1.28],
                          [50.642, -32.142],
                        ],
                        o: [
                          [4.161, 1.28],
                          [-33.86, 21.491],
                        ],
                        v: [
                          [-17, 75],
                          [1.858, 129.142],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [29.75, -14.5],
                        ],
                        o: [
                          [0, 0],
                          [-29.75, 14.5],
                        ],
                        v: [
                          [-17, 75],
                          [-56.25, 145.5],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 121.001,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [29.75, -14.5],
                        ],
                        o: [
                          [0, 0],
                          [-29.75, 14.5],
                        ],
                        v: [
                          [-17, 75],
                          [-56.25, 145.5],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [-7.5, -34],
                        ],
                        o: [
                          [0, 0],
                          [7.5, 34],
                        ],
                        v: [
                          [-17, 75],
                          [-61, 161],
                        ],
                        c: false,
                      },
                    ],
                  },
                  {
                    i: { x: 0.833, y: 0.833 },
                    o: { x: 0.167, y: 0.167 },
                    n: "0p833_0p833_0p167_0p167",
                    t: 130.001,
                    s: [
                      {
                        i: [
                          [0, 0],
                          [-7.5, -34],
                        ],
                        o: [
                          [0, 0],
                          [7.5, 34],
                        ],
                        v: [
                          [-17, 75],
                          [-61, 161],
                        ],
                        c: false,
                      },
                    ],
                    e: [
                      {
                        i: [
                          [0, 0],
                          [-3.5, -4.5],
                        ],
                        o: [
                          [0, 0],
                          [3.5, 4.5],
                        ],
                        v: [
                          [-17, 75],
                          [-11.5, 164],
                        ],
                        c: false,
                      },
                    ],
                  },
                  { t: 139.00078125 },
                ],
                ix: 2,
              },
              nm: "Path 1",
              mn: "ADBE Vector Shape - Group",
              hd: false,
            },
            {
              ty: "st",
              c: {
                a: 0,
                k: [0.149019607843, 0.133333333333, 0.109803921569, 1],
                ix: 3,
              },
              o: { a: 0, k: 100, ix: 4 },
              w: { a: 0, k: 15, ix: 5 },
              lc: 2,
              lj: 1,
              ml: 4,
              nm: "Stroke 1",
              mn: "ADBE Vector Graphic - Stroke",
              hd: false,
            },
            {
              ty: "tr",
              p: { a: 0, k: [-22, 82], ix: 2 },
              a: { a: 0, k: [-22, 82], ix: 1 },
              s: { a: 0, k: [100, 100], ix: 3 },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Shape 1",
          np: 3,
          cix: 2,
          ix: 1,
          mn: "ADBE Vector Group",
          hd: false,
        },
      ],
      ip: 0,
      op: 266,
      st: -28.8,
      bm: 0,
    },
    {
      ddd: 0,
      ind: 5,
      ty: 4,
      nm: "b2",
      parent: 7,
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: {
          a: 1,
          k: [
            {
              i: { x: [0.25], y: [1] },
              o: { x: [0.75], y: [0] },
              n: ["0p25_1_0p75_0"],
              t: 0,
              s: [-81],
              e: [-97],
            },
            {
              i: { x: [0.25], y: [1] },
              o: { x: [0.75], y: [0] },
              n: ["0p25_1_0p75_0"],
              t: 67.199,
              s: [-97],
              e: [-81],
            },
            { t: 136.80078125 },
          ],
          ix: 10,
        },
        p: { a: 0, k: [-13.573, -61.514, 0], ix: 2 },
        a: { a: 0, k: [-6, 48, 0], ix: 1 },
        s: { a: 0, k: [73.171, 73.171, 100], ix: 6 },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [82, 82], ix: 2 },
              p: { a: 0, k: [0, 0], ix: 3 },
              nm: "Ellipse Path 1",
              mn: "ADBE Vector Shape - Ellipse",
              hd: false,
            },
            {
              ty: "fl",
              c: {
                a: 0,
                k: [0.149019607843, 0.132484795065, 0.111034221275, 1],
                ix: 4,
              },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              nm: "Fill 1",
              mn: "ADBE Vector Graphic - Fill",
              hd: false,
            },
            {
              ty: "tr",
              p: { a: 0, k: [-6, 48], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: { a: 0, k: [100, 100], ix: 3 },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Ellipse 1",
          np: 3,
          cix: 2,
          ix: 1,
          mn: "ADBE Vector Group",
          hd: false,
        },
      ],
      ip: 0,
      op: 141.6,
      st: 0,
      bm: 0,
    },
    {
      ddd: 0,
      ind: 6,
      ty: 4,
      nm: "b1",
      parent: 7,
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: { a: 0, k: -87, ix: 10 },
        p: { a: 0, k: [-27.177, 43.546, 0], ix: 2 },
        a: { a: 0, k: [-6, 48, 0], ix: 1 },
        s: { a: 0, k: [100, 100, 100], ix: 6 },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "fl",
              c: {
                a: 0,
                k: [0.149019607843, 0.132484795065, 0.111034221275, 1],
                ix: 4,
              },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              nm: "Fill 1",
              mn: "ADBE Vector Graphic - Fill",
              hd: false,
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: { a: 0, k: [100, 100], ix: 3 },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Shape 1",
          np: 2,
          cix: 2,
          ix: 1,
          mn: "ADBE Vector Group",
          hd: false,
        },
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [82, 82], ix: 2 },
              p: { a: 0, k: [0, 0], ix: 3 },
              nm: "Ellipse Path 1",
              mn: "ADBE Vector Shape - Ellipse",
              hd: false,
            },
            {
              ty: "fl",
              c: {
                a: 0,
                k: [0.149019607843, 0.132484795065, 0.111034221275, 1],
                ix: 4,
              },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              nm: "Fill 1",
              mn: "ADBE Vector Graphic - Fill",
              hd: false,
            },
            {
              ty: "tr",
              p: { a: 0, k: [-6, 48], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: { a: 0, k: [100, 100], ix: 3 },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Ellipse 1",
          np: 3,
          cix: 2,
          ix: 2,
          mn: "ADBE Vector Group",
          hd: false,
        },
      ],
      ip: 0,
      op: 141.6,
      st: 0,
      bm: 0,
    },
    {
      ddd: 0,
      ind: 7,
      ty: 4,
      nm: "b",
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: { a: 0, k: 83, ix: 10 },
        p: {
          a: 1,
          k: [
            {
              i: { x: 0.833, y: 0.833 },
              o: { x: 0.167, y: 0.167 },
              n: "0p833_0p833_0p167_0p167",
              t: 5,
              s: [355.857, 302.207, 0],
              e: [355.857, 308.207, 0],
              to: [0, 1, 0],
              ti: [0, 0, 0],
            },
            {
              i: { x: 0.833, y: 0.833 },
              o: { x: 0.167, y: 0.167 },
              n: "0p833_0p833_0p167_0p167",
              t: 16.801,
              s: [355.857, 308.207, 0],
              e: [355.857, 302.207, 0],
              to: [0, 0, 0],
              ti: [0, 0, 0],
            },
            {
              i: { x: 0.833, y: 0.833 },
              o: { x: 0.167, y: 0.167 },
              n: "0p833_0p833_0p167_0p167",
              t: 33.6,
              s: [355.857, 302.207, 0],
              e: [355.857, 308.207, 0],
              to: [0, 0, 0],
              ti: [0, 0, 0],
            },
            {
              i: { x: 0.833, y: 0.833 },
              o: { x: 0.167, y: 0.167 },
              n: "0p833_0p833_0p167_0p167",
              t: 50.4,
              s: [355.857, 308.207, 0],
              e: [355.857, 302.207, 0],
              to: [0, 0, 0],
              ti: [0, 0, 0],
            },
            {
              i: { x: 0.833, y: 0.833 },
              o: { x: 0.167, y: 0.167 },
              n: "0p833_0p833_0p167_0p167",
              t: 67.199,
              s: [355.857, 302.207, 0],
              e: [355.857, 308.207, 0],
              to: [0, 0, 0],
              ti: [0, 0, 0],
            },
            {
              i: { x: 0.833, y: 0.833 },
              o: { x: 0.167, y: 0.167 },
              n: "0p833_0p833_0p167_0p167",
              t: 84,
              s: [355.857, 308.207, 0],
              e: [355.857, 302.207, 0],
              to: [0, 0, 0],
              ti: [0, 0, 0],
            },
            {
              i: { x: 0.833, y: 0.833 },
              o: { x: 0.167, y: 0.167 },
              n: "0p833_0p833_0p167_0p167",
              t: 100.801,
              s: [355.857, 302.207, 0],
              e: [355.857, 308.207, 0],
              to: [0, 0, 0],
              ti: [0, 0, 0],
            },
            {
              i: { x: 0.833, y: 0.833 },
              o: { x: 0.167, y: 0.167 },
              n: "0p833_0p833_0p167_0p167",
              t: 120,
              s: [355.857, 308.207, 0],
              e: [355.857, 302.207, 0],
              to: [0, 0, 0],
              ti: [0, 1, 0],
            },
            {
              i: { x: 0.833, y: 0.833 },
              o: { x: 0.167, y: 0.167 },
              n: "0p833_0p833_0p167_0p167",
              t: 139,
              s: [355.857, 302.207, 0],
              e: [355.857, 302.207, 0],
              to: [0, 0, 0],
              ti: [0, 0, 0],
            },
            {
              i: { x: 0.833, y: 0.833 },
              o: { x: 0.167, y: 0.167 },
              n: "0p833_0p833_0p167_0p167",
              t: 180,
              s: [355.857, 302.207, 0],
              e: [355.857, 308.207, 0],
              to: [0, 1, 0],
              ti: [0, 0, 0],
            },
            {
              i: { x: 0.833, y: 0.833 },
              o: { x: 0.167, y: 0.167 },
              n: "0p833_0p833_0p167_0p167",
              t: 196.801,
              s: [355.857, 308.207, 0],
              e: [355.857, 302.207, 0],
              to: [0, 0, 0],
              ti: [0, 1, 0],
            },
            { t: 216 },
          ],
          ix: 2,
        },
        a: { a: 0, k: [-5.706, -66.449, 0], ix: 1 },
        s: { a: 0, k: [100, 100, 100], ix: 6 },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              ix: 1,
              ks: {
                a: 0,
                k: {
                  i: [
                    [5.021, 11.991],
                    [1.75, -16.75],
                    [3.593, -23.13],
                    [3.492, -8.369],
                    [0, 23.5],
                  ],
                  o: [
                    [-6.242, -14.906],
                    [-1.081, 10.349],
                    [-2.222, 14.305],
                    [-14.312, 34.299],
                    [0, -55.082],
                  ],
                  v: [
                    [14.5, -63],
                    [-40.44, -62.693],
                    [-44.148, -3.184],
                    [-56.34, 28.612],
                    [12.218, 41.438],
                  ],
                  c: true,
                },
                ix: 2,
              },
              nm: "Path 1",
              mn: "ADBE Vector Shape - Group",
              hd: false,
            },
            {
              ty: "fl",
              c: {
                a: 0,
                k: [0.149019607843, 0.132484795065, 0.111034221275, 1],
                ix: 4,
              },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              nm: "Fill 1",
              mn: "ADBE Vector Graphic - Fill",
              hd: false,
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: { a: 0, k: [100, 100], ix: 3 },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Shape 1",
          np: 3,
          cix: 2,
          ix: 1,
          mn: "ADBE Vector Group",
          hd: false,
        },
      ],
      ip: 0,
      op: 141.6,
      st: 0,
      bm: 0,
    },
    {
      ddd: 0,
      ind: 8,
      ty: 4,
      nm: "ne",
      parent: 6,
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: {
          a: 1,
          k: [
            {
              i: { x: [0.667], y: [1] },
              o: { x: [0.333], y: [0] },
              n: ["0p667_1_0p333_0"],
              t: 0,
              s: [0],
              e: [20],
            },
            {
              i: { x: [0.667], y: [1] },
              o: { x: [0.333], y: [0] },
              n: ["0p667_1_0p333_0"],
              t: 67.199,
              s: [20],
              e: [0],
            },
            { t: 134.400390625 },
          ],
          ix: 10,
        },
        p: { a: 0, k: [-12, 50, 0], ix: 2 },
        a: { a: 0, k: [-12, 50, 0], ix: 1 },
        s: { a: 0, k: [100, 100, 100], ix: 6 },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              ix: 1,
              ks: {
                a: 0,
                k: {
                  i: [
                    [0.59, 12.987],
                    [1.75, -16.75],
                    [-1.434, -15.164],
                    [4.955, 22.972],
                  ],
                  o: [
                    [-1, -22],
                    [-1.75, 16.75],
                    [3.5, 37],
                    [-11, -51],
                  ],
                  v: [
                    [3.5, -51.5],
                    [-31.25, -48.25],
                    [-45, 45],
                    [12, 36.5],
                  ],
                  c: true,
                },
                ix: 2,
              },
              nm: "Path 1",
              mn: "ADBE Vector Shape - Group",
              hd: false,
            },
            {
              ty: "fl",
              c: {
                a: 0,
                k: [0.149019607843, 0.132484795065, 0.111034221275, 1],
                ix: 4,
              },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              nm: "Fill 1",
              mn: "ADBE Vector Graphic - Fill",
              hd: false,
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: { a: 0, k: [100, 100], ix: 3 },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Shape 1",
          np: 3,
          cix: 2,
          ix: 1,
          mn: "ADBE Vector Group",
          hd: false,
        },
      ],
      ip: 0,
      op: 141.6,
      st: 0,
      bm: 0,
    },
    {
      ddd: 0,
      ind: 9,
      ty: 4,
      nm: "ta",
      parent: 5,
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: {
          a: 1,
          k: [
            {
              i: { x: [0.667], y: [1] },
              o: { x: [0.333], y: [0] },
              n: ["0p667_1_0p333_0"],
              t: 0,
              s: [7],
              e: [75],
            },
            {
              i: { x: [0.667], y: [1] },
              o: { x: [0.333], y: [0] },
              n: ["0p667_1_0p333_0"],
              t: 22.801,
              s: [75],
              e: [7],
            },
            {
              i: { x: [0.667], y: [1] },
              o: { x: [0.333], y: [0] },
              n: ["0p667_1_0p333_0"],
              t: 45.6,
              s: [7],
              e: [75],
            },
            {
              i: { x: [0.667], y: [1] },
              o: { x: [0.333], y: [0] },
              n: ["0p667_1_0p333_0"],
              t: 68.4,
              s: [75],
              e: [7],
            },
            {
              i: { x: [0.667], y: [1] },
              o: { x: [0.333], y: [0] },
              n: ["0p667_1_0p333_0"],
              t: 91.199,
              s: [7],
              e: [75],
            },
            {
              i: { x: [0.667], y: [1] },
              o: { x: [0.333], y: [0] },
              n: ["0p667_1_0p333_0"],
              t: 114,
              s: [75],
              e: [7],
            },
            { t: 136.80078125 },
          ],
          ix: 10,
        },
        p: { a: 0, k: [15.301, 27.13, 0], ix: 2 },
        a: { a: 0, k: [21.895, -104.814, 0], ix: 1 },
        s: { a: 0, k: [136.667, 136.667, 100], ix: 6 },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              ix: 1,
              ks: {
                a: 0,
                k: {
                  i: [
                    [-4.827, -5.636],
                    [1.374, -48.171],
                    [-2.647, 2.438],
                  ],
                  o: [
                    [33.061, 38.596],
                    [-0.068, 2.375],
                    [34.628, -76.569],
                  ],
                  v: [
                    [-18.205, -190.23],
                    [15.659, -106.249],
                    [25.25, -102.254],
                  ],
                  c: true,
                },
                ix: 2,
              },
              nm: "Path 1",
              mn: "ADBE Vector Shape - Group",
              hd: false,
            },
            {
              ty: "fl",
              c: {
                a: 0,
                k: [0.149019607843, 0.132484795065, 0.111034221275, 1],
                ix: 4,
              },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              nm: "Fill 1",
              mn: "ADBE Vector Graphic - Fill",
              hd: false,
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: { a: 0, k: [100, 100], ix: 3 },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Shape 1",
          np: 3,
          cix: 2,
          ix: 1,
          mn: "ADBE Vector Group",
          hd: false,
        },
      ],
      ip: 0,
      op: 141.6,
      st: 0,
      bm: 0,
    },
    {
      ddd: 0,
      ind: 10,
      ty: 4,
      nm: "el",
      parent: 11,
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: {
          a: 1,
          k: [
            {
              i: { x: [0.667], y: [1] },
              o: { x: [0.333], y: [0] },
              n: ["0p667_1_0p333_0"],
              t: 0,
              s: [-17],
              e: [41],
            },
            {
              i: { x: [0.667], y: [1] },
              o: { x: [0.333], y: [0] },
              n: ["0p667_1_0p333_0"],
              t: 62.4,
              s: [41],
              e: [-17],
            },
            { t: 129.599609375 },
          ],
          ix: 10,
        },
        p: { a: 0, k: [-90.831, 16.442, 0], ix: 2 },
        a: { a: 0, k: [16.5, -109.52, 0], ix: 1 },
        s: { a: 0, k: [140.26, 140.26, 100], ix: 6 },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              ix: 1,
              ks: {
                a: 0,
                k: {
                  i: [
                    [-0.618, -7.395],
                    [-2.323, -2.379],
                    [-2.647, 2.438],
                  ],
                  o: [
                    [6.75, 80.75],
                    [1.66, 1.7],
                    [38.998, -68.667],
                  ],
                  v: [
                    [-1.601, -210.907],
                    [11.871, -104.272],
                    [20.531, -99.66],
                  ],
                  c: true,
                },
                ix: 2,
              },
              nm: "Path 1",
              mn: "ADBE Vector Shape - Group",
              hd: false,
            },
            {
              ty: "fl",
              c: {
                a: 0,
                k: [0.149019607843, 0.132484795065, 0.111034221275, 1],
                ix: 4,
              },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              nm: "Fill 1",
              mn: "ADBE Vector Graphic - Fill",
              hd: false,
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: { a: 0, k: [100, 100], ix: 3 },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Shape 1",
          np: 3,
          cix: 2,
          ix: 1,
          mn: "ADBE Vector Group",
          hd: false,
        },
      ],
      ip: 0,
      op: 141.6,
      st: 0,
      bm: 0,
    },
    {
      ddd: 0,
      ind: 11,
      ty: 4,
      nm: "hea",
      parent: 8,
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: {
          a: 1,
          k: [
            {
              i: { x: [0.667], y: [1] },
              o: { x: [0.333], y: [0] },
              n: ["0p667_1_0p333_0"],
              t: 0,
              s: [-15],
              e: [8],
            },
            {
              i: { x: [0.667], y: [1] },
              o: { x: [0.333], y: [0] },
              n: ["0p667_1_0p333_0"],
              t: 67.199,
              s: [8],
              e: [-15],
            },
            { t: 134.400390625 },
          ],
          ix: 10,
        },
        p: { a: 0, k: [-7.5, -46.5, 0], ix: 2 },
        a: { a: 0, k: [-110.468, 94.987, 0], ix: 1 },
        s: { a: 0, k: [71.296, 71.296, 100], ix: 6 },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "fl",
              c: {
                a: 0,
                k: [0.149019607843, 0.132484795065, 0.111034221275, 1],
                ix: 4,
              },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              nm: "Fill 1",
              mn: "ADBE Vector Graphic - Fill",
              hd: false,
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: { a: 0, k: [100, 100], ix: 3 },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Shape 2",
          np: 2,
          cix: 2,
          ix: 1,
          mn: "ADBE Vector Group",
          hd: false,
        },
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [14.727, 19.286], ix: 2 },
              p: { a: 0, k: [0, 0], ix: 3 },
              nm: "Ellipse Path 1",
              mn: "ADBE Vector Shape - Ellipse",
              hd: false,
            },
            {
              ty: "fl",
              c: {
                a: 0,
                k: [0.149019607843, 0.132484795065, 0.111034221275, 1],
                ix: 4,
              },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              nm: "Fill 1",
              mn: "ADBE Vector Graphic - Fill",
              hd: false,
            },
            {
              ty: "tr",
              p: { a: 0, k: [-175.409, 43.844], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: { a: 0, k: [59.914, 100], ix: 3 },
              r: { a: 0, k: -168.452, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Ellipse 5",
          np: 3,
          cix: 2,
          ix: 2,
          mn: "ADBE Vector Group",
          hd: false,
        },
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [14.727, 19.286], ix: 2 },
              p: { a: 0, k: [0, 0], ix: 3 },
              nm: "Ellipse Path 1",
              mn: "ADBE Vector Shape - Ellipse",
              hd: false,
            },
            {
              ty: "fl",
              c: {
                a: 0,
                k: [0.149019607843, 0.132484795065, 0.111034221275, 1],
                ix: 4,
              },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              nm: "Fill 1",
              mn: "ADBE Vector Graphic - Fill",
              hd: false,
            },
            {
              ty: "tr",
              p: { a: 0, k: [-122.039, 45.221], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: { a: 0, k: [100, 100], ix: 3 },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Ellipse 3",
          np: 3,
          cix: 2,
          ix: 3,
          mn: "ADBE Vector Group",
          hd: false,
        },
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              ix: 1,
              ks: {
                a: 0,
                k: {
                  i: [
                    [-10.966, 2.431],
                    [-1.181, -4.133],
                    [1.601, -0.057],
                    [-0.599, 3.554],
                  ],
                  o: [
                    [1.746, -0.387],
                    [1.277, 4.469],
                    [-14.816, 0.529],
                    [0.406, -2.406],
                  ],
                  v: [
                    [-8.421, -5.275],
                    [2.908, 3.703],
                    [-0.161, 10.282],
                    [-18.683, 3.926],
                  ],
                  c: true,
                },
                ix: 2,
              },
              nm: "Path 1",
              mn: "ADBE Vector Shape - Group",
              hd: false,
            },
            {
              ty: "fl",
              c: {
                a: 0,
                k: [0.933333333333, 0.874509803922, 0.650980392157, 1],
                ix: 4,
              },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              nm: "eye1",
              mn: "ADBE Vector Graphic - Fill",
              hd: false,
            },
            {
              ty: "tr",
              p: { a: 0, k: [-181.299, 40.461], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: {
                a: 1,
                k: [
                  {
                    i: { x: [0.667, 0.667], y: [1, 1] },
                    o: { x: [0.333, 0.333], y: [0, 0] },
                    n: ["0p667_1_0p333_0", "0p667_1_0p333_0"],
                    t: 38.4,
                    s: [100, 92.381],
                    e: [100, -0.256],
                  },
                  {
                    i: { x: [0.667, 0.667], y: [1, 1] },
                    o: { x: [0.333, 0.333], y: [0, 0] },
                    n: ["0p667_1_0p333_0", "0p667_1_0p333_0"],
                    t: 55.199,
                    s: [100, -0.256],
                    e: [100, -0.256],
                  },
                  {
                    i: { x: [0.667, 0.667], y: [1, 1] },
                    o: { x: [0.333, 0.333], y: [0, 0] },
                    n: ["0p667_1_0p333_0", "0p667_1_0p333_0"],
                    t: 62.4,
                    s: [100, -0.256],
                    e: [100, 92.381],
                  },
                  { t: 79.19921875 },
                ],
                ix: 3,
              },
              r: { a: 0, k: -128.667, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Ellipse 6",
          np: 3,
          cix: 2,
          ix: 4,
          mn: "ADBE Vector Group",
          hd: false,
        },
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [40.675, 16.831], ix: 2 },
              p: { a: 0, k: [0, 0], ix: 3 },
              nm: "Ellipse Path 1",
              mn: "ADBE Vector Shape - Ellipse",
              hd: false,
            },
            {
              ty: "fl",
              c: {
                a: 0,
                k: [0.933333333333, 0.874509803922, 0.650980392157, 1],
                ix: 4,
              },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              nm: "eye2",
              mn: "ADBE Vector Graphic - Fill",
              hd: false,
            },
            {
              ty: "tr",
              p: { a: 0, k: [-123.091, 45.195], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: {
                a: 1,
                k: [
                  {
                    i: { x: [0.667, 0.667], y: [1, 1] },
                    o: { x: [0.333, 0.333], y: [0, 0] },
                    n: ["0p667_1_0p333_0", "0p667_1_0p333_0"],
                    t: 38.4,
                    s: [100, 92.381],
                    e: [100, -0.256],
                  },
                  {
                    i: { x: [0.667, 0.667], y: [1, 1] },
                    o: { x: [0.333, 0.333], y: [0, 0] },
                    n: ["0p667_1_0p333_0", "0p667_1_0p333_0"],
                    t: 55.199,
                    s: [100, -0.256],
                    e: [100, -0.256],
                  },
                  {
                    i: { x: [0.667, 0.667], y: [1, 1] },
                    o: { x: [0.333, 0.333], y: [0, 0] },
                    n: ["0p667_1_0p333_0", "0p667_1_0p333_0"],
                    t: 62.4,
                    s: [100, -0.256],
                    e: [100, 92.381],
                  },
                  { t: 79.19921875 },
                ],
                ix: 3,
              },
              r: { a: 0, k: -19.654, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Ellipse 2",
          np: 3,
          cix: 2,
          ix: 5,
          mn: "ADBE Vector Group",
          hd: false,
        },
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              ix: 1,
              ks: {
                a: 0,
                k: {
                  i: [
                    [0, 0],
                    [10.344, 0.175],
                    [-115.817, 6.255],
                  ],
                  o: [
                    [0, 0],
                    [-7.047, -0.119],
                    [34.894, -1.884],
                  ],
                  v: [
                    [-167.279, 58.669],
                    [-254.234, 57.818],
                    [-149.783, 98.993],
                  ],
                  c: true,
                },
                ix: 2,
              },
              nm: "Path 1",
              mn: "ADBE Vector Shape - Group",
              hd: false,
            },
            {
              ty: "fl",
              c: {
                a: 0,
                k: [0.149019607843, 0.132484795065, 0.111034221275, 1],
                ix: 4,
              },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              nm: "Fill 1",
              mn: "ADBE Vector Graphic - Fill",
              hd: false,
            },
            {
              ty: "tr",
              p: { a: 0, k: [-162, 72.234], ix: 2 },
              a: { a: 0, k: [-164.104, 75.74], ix: 1 },
              s: { a: 0, k: [100.434, 93.355], ix: 3 },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Shape 1",
          np: 3,
          cix: 2,
          ix: 6,
          mn: "ADBE Vector Group",
          hd: false,
        },
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [108, 108], ix: 2 },
              p: { a: 0, k: [0, 0], ix: 3 },
              nm: "Ellipse Path 1",
              mn: "ADBE Vector Shape - Ellipse",
              hd: false,
            },
            {
              ty: "fl",
              c: {
                a: 0,
                k: [0.149019607843, 0.132484795065, 0.111034221275, 1],
                ix: 4,
              },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              nm: "Fill 1",
              mn: "ADBE Vector Graphic - Fill",
              hd: false,
            },
            {
              ty: "tr",
              p: { a: 0, k: [-128, 48], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: { a: 0, k: [100, 100], ix: 3 },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Ellipse 1",
          np: 3,
          cix: 2,
          ix: 7,
          mn: "ADBE Vector Group",
          hd: false,
        },
      ],
      ip: 0,
      op: 141.6,
      st: 0,
      bm: 0,
    },
    {
      ddd: 0,
      ind: 12,
      ty: 4,
      nm: "er",
      parent: 11,
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: {
          a: 1,
          k: [
            {
              i: { x: [0.667], y: [1] },
              o: { x: [0.333], y: [0] },
              n: ["0p667_1_0p333_0"],
              t: 7.199,
              s: [-17],
              e: [41],
            },
            {
              i: { x: [0.667], y: [1] },
              o: { x: [0.333], y: [0] },
              n: ["0p667_1_0p333_0"],
              t: 67.199,
              s: [41],
              e: [-17],
            },
            { t: 134.400390625 },
          ],
          ix: 10,
        },
        p: { a: 0, k: [-151.699, 7.848, 0], ix: 2 },
        a: { a: 0, k: [16.5, -109.52, 0], ix: 1 },
        s: { a: 0, k: [131.332, 131.332, 100], ix: 6 },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              ix: 1,
              ks: {
                a: 0,
                k: {
                  i: [
                    [-0.618, -7.395],
                    [-2.323, -2.379],
                    [-2.647, 2.438],
                  ],
                  o: [
                    [6.75, 80.75],
                    [1.66, 1.7],
                    [26.148, -64.813],
                  ],
                  v: [
                    [-1.601, -210.907],
                    [9.521, -107.006],
                    [20.155, -104.319],
                  ],
                  c: true,
                },
                ix: 2,
              },
              nm: "Path 1",
              mn: "ADBE Vector Shape - Group",
              hd: false,
            },
            {
              ty: "fl",
              c: {
                a: 0,
                k: [0.149019607843, 0.132484795065, 0.111034221275, 1],
                ix: 4,
              },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              nm: "Fill 1",
              mn: "ADBE Vector Graphic - Fill",
              hd: false,
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: { a: 0, k: [100, 100], ix: 3 },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Shape 1",
          np: 3,
          cix: 2,
          ix: 1,
          mn: "ADBE Vector Group",
          hd: false,
        },
      ],
      ip: 0,
      op: 141.6,
      st: 0,
      bm: 0,
    },
  ],
  markers: [],
};
