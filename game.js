gameStarted = false;

document.onmousedown = startGame;

var fullscreenWrapper = document.getElementById("fullscreen-wrapper");

function mouseDown() {
  if(!gameStarted) {
    startGame();
    gameStarted = true;
  }
}

function startGame() {
  console.log("ready");
  // var vrbutton = document.getElementsByClassName("a-enter-vr-button")[0];
  // var canvas = document.getElementsByTagName("UL")[0];
  // console.log(vrbutton);
  // vrbutton.click();
  openFullscreen();

  overlay = document.querySelector("#overlay");
  overlay.setAttribute("visible", "false");
}

/* When the openFullscreen() function is executed, open the video in fullscreen.
Note that we must include prefixes for different browsers, as they don't support the requestFullscreen method yet */
function openFullscreen() {
  if (fullscreenWrapper.requestFullscreen) {
    fullscreenWrapper.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    fullscreenWrapper.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    fullscreenWrapper.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    fullscreenWrapper.msRequestFullscreen();
  }
}

var ammoCan = document.querySelector("#suspicious-rock");
ammoCan.addEventListener('click', function (evt) {
  ammoCan.emit("flip-rock");
});
