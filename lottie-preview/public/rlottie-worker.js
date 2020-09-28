importScripts('rlottie-wasm.js');

var RLottieWasm = (function () {
    // create a object;
    var obj = {};

    // object content.
    obj.Api = {};
    obj.lottieHandle = 0;

    // keep the api list
    function initApi() {
        obj.Api = {
            create: Module.cwrap('wasm_lottie_create', '', []),
            destroy: Module.cwrap('wasm_lottie_destroy', '', ['number']),
            resize: Module.cwrap('wasm_lottie_resize', '', ['number', 'number', 'number']),
            buffer: Module.cwrap('wasm_lottie_buffer_get', 'number', ['number']),
            bufferRelease: Module.cwrap('wasm_lottie_buffer_release', 'number', ['number']),
            frameCount: Module.cwrap('wasm_lottie_frame_count_get', 'number', ['number']),
            render: Module.cwrap('wasm_lottie_render', '', ['number', 'number']),
            loadFromData: Module.cwrap('wasm_lottie_load_from_data', 'number', ['number', 'number']),
        };
    }

    obj.init = function () {
        initApi();
        obj.lottieHandle = obj.Api.init();
        reply('ready');
        reply('info', obj.Api.frameCount(obj.lottieHandle));
    }

    obj.render = function (frameNo, width, height) {
        obj.Api.resize(obj.lottieHandle, width, height);
        obj.Api.render(obj.lottieHandle, frameNo);
        var bufferPointer = obj.Api.buffer(obj.lottieHandle);
        var result = new Uint8ClampedArray(Module.HEAP8.buffer, bufferPointer, width * height * 4);
        return result;
    }

    obj.reload = function (jsString) {
      var lengthBytes = lengthBytesUTF8(jsString)+1;
      var stringOnWasmHeap = _malloc(lengthBytes);
      stringToUTF8(jsString, stringOnWasmHeap, lengthBytes+1);
      var len  = obj.Api.loadFromData(obj.lottieHandle, stringOnWasmHeap);

    }
    obj.frameCount = function () {
      return obj.Api.frameCount(obj.lottieHandle);
    }
    return obj;
}());


Module.onRuntimeInitialized = _ => {
   RLottieWasm.init();
};

var queryableFunctions = {
  // example #1: get the difference between two numbers:
  reload: function(jsString) {
      RLottieWasm.reload(jsString);
      reply('info', RLottieWasm.frameCount());
  },
  // example #2: wait three seconds
  render: function(frameNo, width, height) {
      var data = RLottieWasm.render(frameNo, width, height);
      var buffer = new Uint8ClampedArray(width * height *4);
      buffer.set(data);
      reply('result', width, height, buffer, [buffer]);
  }
};

function defaultReply(message) {
  // your default PUBLIC function executed only when main page calls the queryableWorker.postMessage() method directly
  // do something
}

function reply() {
  if (arguments.length < 1) { throw new TypeError('reply - not enough arguments'); return; }
  postMessage({ 'queryMethodListener': arguments[0], 'queryMethodArguments': Array.prototype.slice.call(arguments, 1) });
}

onmessage = function(oEvent) {
  if (oEvent.data instanceof Object && oEvent.data.hasOwnProperty('queryMethod') && oEvent.data.hasOwnProperty('queryMethodArguments')) {
    queryableFunctions[oEvent.data.queryMethod].apply(self, oEvent.data.queryMethodArguments);
  } else {
    defaultReply(oEvent.data);
  }
};


