/*
  game.js source
*/

gameStarted = false;
dialogIsShowing = true;
tooFarDialogShown = false;
justFoundStage = false;
justClicked = false;
foundStages = [false, false, false, false];

var fullscreenWrapper = document.getElementById("fullscreen-wrapper");
var overlayDialog = document.getElementById("overlay-dialog");

var suspiciousRock = document.getElementById("suspicious-rock");
var suspiciousRockFlipped = false;
var fire = document.getElementById("fire");


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

function calcDistance(elem1, elem2) {
  e1Pos = elem1.getAttribute("position");
  if (typeof elem2 == "number") {
    var a = e1Pos.x + 2.75;
    var b = e1Pos.y;
    var c = e1Pos.z - 4.5;
  } else {
    e2Pos = elem2.getAttribute("position");
    var a = e1Pos.x - e2Pos.x;
    var b = e1Pos.y - e2Pos.y;
    var c = e1Pos.z - e2Pos.z;
  }
  return Math.sqrt(a*a + b*b + c*c);
}

function getCoords(stageFound) {
  return  "<span class=\"coords\">" +
            "N 39 XX." +
            (stageFound==1 || stageFound==0 ? "<b>x</b>" : "_") +
            (stageFound==3 || stageFound==0 ? "<b>xx</b>" : "__") +
            " W 084 XX."+
            (stageFound==2 || stageFound==0  ? "<b>x</b>" : "_") +
            (stageFound==4 || stageFound==0  ? "<b>xx</b>" : "__") +
          "</span>";
}

function loaded() {
  console.log("loaded");
  document.getElementById("loader-wrapper").style.display = "none";
}

// remove loader when assets load or after 3 seconds, whichever comes first
setTimeout(function() {
  loaded();
}, 3000);
document.querySelector('a-assets').addEventListener('loaded', function () {
  loaded();
});

suspiciousRock.addEventListener('click', function (evt) {
  if (!suspiciousRockFlipped) {
    suspiciousRock.emit("flip-rock");
    suspiciousRockFlipped = true;
  } else {
    suspiciousRock.emit("flip-back");
    suspiciousRockFlipped = false;
  }
});

fire.addEventListener('click', function (evt) {
  showDialog("Ahhhhhh...", "It feels nice and warm by the fire.");
});

// update compass rotation based on camera's rotation on Y axis
fullscreenWrapper.addEventListener('mousemove', e => {
  var cam = document.getElementById("camera");
  var compass = document.getElementById("compass");
  var rot = cam.getAttribute('rotation').y;

  compass.style.transform = 'rotate(' + rot + 'deg)';
  compass.style.webkitTransform = 'rotate(' + rot + 'deg)';
  compass.style.mozTransform = 'rotate(' + rot + 'deg)';
  compass.style.msTransform = 'rotate(' + rot + 'deg)';
  compass.style.oTransform = 'rotate(' + rot + 'deg)';
});

fullscreenWrapper.addEventListener('click', e => {
  if (!justClicked) {
    if(!isFullscreen()) {
      openFullscreen();
    }
    if(!gameStarted) {
      document.getElementById("overlay-intro").style.display = "none";
      var fireSound = document.querySelector('[sound]');
      console.log(fireSound);
      if (fireSound.components.sound) {
        fireSound.components.sound.playSound();
      } else {
        console.log("fire sound not found");
      }
      gameStarted = true;
    }
    if (dialogIsShowing) {
      overlayDialog.style.display = "none";
      if (justFoundStage) {
        if (suspiciousRockFlipped) {
          suspiciousRock.emit("flip-back");
          suspiciousRockFlipped = false;
        }
        justFoundStage = false;
      }
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
  if (!tooFarDialogShown && calcDistance(document.getElementById("rig"), 0) > 25) {
    showDialog("Hmmm...", "It's probably best not to stray too far from the fire. You don't want to get lost in this fog!");
    tooFarDialogShown = true;
  } else if (calcDistance(document.getElementById("rig"), 0) < 23) {
    tooFarDialogShown = false;
  }
});

stages = [document.getElementById("s1"), document.getElementById("s2"), document.getElementById("s3"), document.getElementById("s4")];

for(var i=0; i<4; i++) {
  stages[i].addEventListener('click', function(evt) {
    var distance = calcDistance(document.getElementById("rig"), this);
    console.log(distance);
    if (distance<3) { // if player is withing 2.5 feet of the stage, show them a clue

      stageFound = parseInt(this.id.substring(1));
      justFoundStage = true;
      foundStages[stageFound-1] = true;

      const hasBeenFound = (stageHasBeenFound) => stageHasBeenFound == true;
      if (foundStages.every(hasBeenFound)) {
          showDialog("Congratulations!", "<span>You have found stage&nbsp;"+stageFound+"!</span><br><br><span>You have found all the stages!</span><br><br>Here are the final coordinates:<br>"+getCoords(0));
      } else {
        showDialog("Congratulations!", "<span>You have found stage&nbsp;"+stageFound+"!</span><br><br>Here's a piece of the final coordinates:<br>"+getCoords(stageFound));
      }
    } else {
      showDialog("Almost...", "It's out of your reach. Try getting closer.");
    }
  });
}
