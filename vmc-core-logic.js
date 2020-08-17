/*
  vmc-core-logic.js
*/

gameStarted = false;
dialogIsShowing = true;
justClicked = false;

var fullscreenWrapper = document.getElementById("fullscreen-wrapper");
var overlayDialog = document.getElementById("overlay-dialog");

function openFullscreen() {
  if (fullscreenWrapper.requestFullscreen) {
    fullscreenWrapper.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    fullscreenWrapper.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    fullscreenWrapper.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    fullscreenWrapper.msRequestFullscreen();
  }
}

function isFullscreen(){
  return 1 >= outerHeight - innerHeight;
}

function showDialog(title, text) {
  if (!dialogIsShowing) {
    document.getElementById("dialog-title").innerHTML = title;
    document.getElementById("dialog-text").innerHTML = text;

    overlayDialog.style.display = "table";
    dialogIsShowing = true;
  }
}

// calculates distance between 2 A-Frame elements
// if second argument passed is an array, it takes it as coordinates
function calcDistance(elem1, elem2) {
  e1Pos = elem1.getAttribute("position");
  if (typeof elem2 == "array") {
    var a = e1Pos.x + elem2[0];
    var b = e1Pos.y + elem2[1];
    var c = e1Pos.z + elem2[2]
  } else {
    e2Pos = elem2.getAttribute("position");
    var a = e1Pos.x - e2Pos.x;
    var b = e1Pos.y - e2Pos.y;
    var c = e1Pos.z - e2Pos.z;
  }
  return Math.sqrt(a*a + b*b + c*c);
}

function loaded() {
  document.getElementById("loader-wrapper").style.display = "none";
}

// remove loader when assets load or after 3 seconds, whichever comes first
setTimeout(function() {
  loaded();
}, 3000);
document.querySelector('a-assets').addEventListener('loaded', function () {
  loaded();
});

fullscreenWrapper.addEventListener('click', e => {
  if (!justClicked) {
    if(!isFullscreen()) {
      openFullscreen();
    }
    if(!gameStarted) {
      document.getElementById("overlay-intro").style.display = "none";
      var fireSound = document.querySelector('[sound]');
      if (fireSound.components.sound) {
        fireSound.components.sound.playSound();
      }
      gameStarted = true;
    }
    if (dialogIsShowing) {
      overlayDialog.style.display = "none";
      vmcHandleOnClick();
      setTimeout(function() {
        dialogIsShowing = false;
      }, 100);
    }
    // prevent double clicking from immediately closing dialogs
    justClicked = true;
    setTimeout(function() {
      justClicked = false;
    }, 300);
  }
});

fullscreenWrapper.addEventListener('keypress', e => {
  vmcHandleKeypress();
});
