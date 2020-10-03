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
