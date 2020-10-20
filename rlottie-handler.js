class RLottieHandler {
  constructor(count) {
    this.rafId = 0;
    this.resizeId = {};
    this.rlottieModule = [];
    this.curFrame = 0;
    this.playing = true;
    this.wasPlaying = false;
    this.playSpeed = 1;
    for(let i = 1; i <= count; i++) {
      this.rlottieModule.push(new RLottieModule("myCanvas" + i));
    }
    this.totalFrame = this.rlottieModule[0].totalFrame;

    this.relayoutCanvas();
    this.slider = document.getElementById("slider");
    this.frameCount = document.getElementById("frameCount");
    this.currentFrame = document.getElementById("currentFrame");

    this.frameCount.innerText = String(this.totalFrame - 1);
    this.slider.max = this.totalFrame - 1;
  }

  render() {
    for(let i = 0; i < this.rlottieModule.length; i++) {
      let rm = this.rlottieModule[i];
      rm.render(this.playSpeed);
      if(rm.curFrame >= rm.totalFrame) rm.curFrame = 0;
    }
    this.curFrame = this.rlottieModule[0].curFrame;
    this.currentFrame.innerText = String(Math.round(this.curFrame));
    this.slider.value = this.curFrame;
  }

  reload(jsString) {
    this.rlottieModule.forEach(rm => {
      rm.lottieHandle.load(jsString)
      rm.totalFrame = rm.lottieHandle.frames();
      rm.curFrame = 0;
    });

    this.jsString = jsString;
    this.totalFrame = this.rlottieModule[0].totalFrame;
    this.curFrame = 0;
    
    this.slider.max = this.totalFrame;
    this.slider.value = 0;
    this.frameCount.innerText = String(this.totalFrame - 1);

    document.getElementById("playButton").innerHTML = "<em class='fas fa-pause'></em>";
    this.play();
  }

  play() {
    if(this.playing) return;
    this.playing = true;
    this.rlottieModule.forEach(rm => rm.curFrame = this.curFrame);
    this.rafId = window.requestAnimationFrame(updater);
  }

  pause() {
    window.cancelAnimationFrame(this.rafId);
    this.playing = false;
  }

  update() {
    this.curFrame -= this.playSpeed;
    this.rlottieModule.forEach(rm => rm.curFrame = this.curFrame);
    this.render();
  }

  seek(value) {
    value = Number(value);
    this.curFrame = value;
    this.rlottieModule.forEach(rm => {
      rm.curFrame = value;
      rm.render(this.playSpeed);
    });
    this.currentFrame.innerText = String(Math.round(this.curFrame));
  }

  relayoutCanvas() {
    var width = document.getElementById("player").clientWidth;
    var height = document.getElementById("player").clientHeight;
    width = width / 4 * 3;
    height = height / 4 * 3;

    var size = width < height ? width : height;
    this.rlottieModule.forEach(rm => {
      rm.canvas.width = size;
      rm.canvas.height = size;
      rm.canvas.style.width = size + "px";
      rm.canvas.style.height = size + "px";
    });
  }
}