// written by Inho

// space bar controller
// document.addEventListener("keypress", (event) => {
//   event.preventDefault();
//   if (event.code == "Space") {
//     if (RLottieModule.playing) {
//       RLottieModule.pause();
//     } else {
//       RLottieModule.play();
//     }
//   }
// });

// change Background
function resetBackGround() {
  var board = document.getElementById("content");
  board.removeAttribute("style");
}
function onChangeBackGround(e) {
  console.log(e.target.files);
  const file = e.target.files[0];
  var board = document.getElementById("content");
  board.setAttribute(
    "style",
    `background-image: url(${URL.createObjectURL(file)})`
  );

  // this.imgUrl = URL.createObjectURL(file);
}
