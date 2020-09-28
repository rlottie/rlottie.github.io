// written by Inho

// space bar controller
document.addEventListener("keypress", (event) => {
  event.preventDefault();
  if (event.code == "Space") {
    if (RLottieModule.playing) {
      RLottieModule.pause();
    } else {
      RLottieModule.play();
    }
  }
});
