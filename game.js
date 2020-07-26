gameStarted = false;

var fullscreenWrapper = document.getElementById("fullscreen-wrapper");

fullscreenWrapper.onmousedown = mouseDown;


function mouseDown() {
  if(!gameStarted) {
    startGame();
    gameStarted = true;
  }
}

function startGame() {
  openFullscreen();

  overlay = document.getElementById("overlay-dialog");
  overlay.style.display = "none";

  gameStarted = true;
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
