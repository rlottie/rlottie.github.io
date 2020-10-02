
var apiList = null;

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