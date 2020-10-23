class RLottieModule {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext("2d");
    this.lottieHandle = new Module.RlottieWasm();
    this.totalFrame = this.lottieHandle.frames();
    this.curFrame = 0;
  }

  render(speed) {
    if(this.canvas.width == 0 || this.canvas.height == 0) return;
    var buffer = this.lottieHandle.render(this.curFrame, this.canvas.width, this.canvas.height);
    this.curFrame = Number(this.curFrame) + speed;
    var result = Uint8ClampedArray.from(buffer);
    var imageData = new ImageData(result, this.canvas.width, this.canvas.height);
    this.context.putImageData(imageData, 0, 0);
  }
}