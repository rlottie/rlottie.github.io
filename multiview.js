function setup() {
    var head = document.head;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'rlottie-wasm.js';
    head.appendChild(script);
    
    script.onload = _ => {
      Module.onRuntimeInitialized = _ => {
        entry = new MainEntry();
        var updater = function() {
            entry.render();
            window.requestAnimationFrame( updater );  // for subsequent frames
        };
        window.requestAnimationFrame( updater );         
      };
    };
}


setup();

class RLottieApi
{
  constructor() {
    this.create = Module.cwrap('wasm_lottie_create', '', []);
    this.destroy = Module.cwrap('wasm_lottie_destroy', '', ['number']);
    this.resize = Module.cwrap('wasm_lottie_resize', '', ['number', 'number', 'number']);
    this.buffer = Module.cwrap('wasm_lottie_buffer_get', 'number', ['number']);
    this.frameCount = Module.cwrap('wasm_lottie_frame_count_get', 'number', ['number']);
    this.render = Module.cwrap('wasm_lottie_render', '', ['number', 'number']);
    this.loadFromData = Module.cwrap('wasm_lottie_load_from_data', 'number', ['number', 'number']);
  }
}

class RLottieView {
  constructor(lottiApiObj, canvasId) {
    this.Api = lottiApiObj;
    this.canvasId = canvasId;
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext('2d');
    
    this.lottieHandle = this.Api.create();
    this.Api.resize(this.lottieHandle, 100, 100);
    this.frameCount = this.Api.frameCount(this.lottieHandle);
    this.curFrame = 0;
    this.render();  
  }

  render() {
      if (this.canvas.width == 0  || this.canvas.height == 0) return;

      if (this.curFrame >= this.frameCount) this.curFrame = 0;
      this.Api.resize(this.lottieHandle, 100, 100);
      this.Api.render(this.lottieHandle, this.curFrame);
      var bufferPointer = this.Api.buffer(this.lottieHandle);
      var result = new Uint8ClampedArray(Module.HEAP8.buffer, bufferPointer, 100 * 100 * 4);
      var imageData = new ImageData(result, 100, 100);

      this.context.putImageData(imageData, 0, 0);
      this.curFrame = this.curFrame + 1;
  }  
}

class MainEntry {
  render() {
    this.lottieView1.render();
    this.lottieView2.render();
    this.lottieView3.render();
    this.lottieView4.render();
    this.lottieView5.render();
  }

  constructor() {
    this.lottieApiObj = new RLottieApi()
    this.lottieView1 = new RLottieView(this.lottieApiObj, "myCanvas");
    this.lottieView2 = new RLottieView(this.lottieApiObj, "myCanvas1");
    this.lottieView3 = new RLottieView(this.lottieApiObj, "myCanvas2");
    this.lottieView4 = new RLottieView(this.lottieApiObj, "myCanvas3");
    this.lottieView5 = new RLottieView(this.lottieApiObj, "myCanvas4");   
  }
}
