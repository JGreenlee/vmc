/*
  game.js | VMC #1 - Forest
*/

foundStages = [false, false, false, false];
tooFarDialogShown = false;
justFoundStage = false;

var suspiciousRock = document.getElementById("suspicious-rock");
var suspiciousRockFlipped = false;
var fire = document.getElementById("fire");

function getCoords(stageFound) {
  return  "<span class=\"coords\">" +
            "N XX XX." +
            (stageFound==1 || stageFound==0 ? "<b>x</b>" : "_") +
            (stageFound==3 || stageFound==0 ? "<b>xx</b>" : "__") +
            " W XXX XX."+
            (stageFound==2 || stageFound==0  ? "<b>x</b>" : "_") +
            (stageFound==4 || stageFound==0  ? "<b>xx</b>" : "__") +
          "</span>";
}

function vmcHandleOnClick() {
  if (justFoundStage) {
    if (suspiciousRockFlipped) {
      suspiciousRock.emit("flip-back");
      suspiciousRockFlipped = false;
    }
    justFoundStage = false;
  }
}

function vmcHandleKeypress() {
  var fireCoords = [2.75, 0, -4.5];
  if (!tooFarDialogShown && calcDistance(document.getElementById("rig"), fireCoords) > 25) {
    showDialog("Hmmm...", "It's probably best not to stray too far from the fire. You don't want to get lost in this fog!");
    tooFarDialogShown = true;
  } else if (calcDistance(document.getElementById("rig"), fireCoords) < 23) {
    tooFarDialogShown = false;
  }
}

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



stages = [document.getElementById("s1"), document.getElementById("s2"), document.getElementById("s3"), document.getElementById("s4")];

for(var i=0; i<4; i++) {
  stages[i].addEventListener('click', function(evt) {
    var distance = calcDistance(document.getElementById("rig"), this);
    if (distance < 3) { // if player is withing 3 feet of the stage, show them a clue

      stageFound = parseInt(this.id.substring(1));
      justFoundStage = true;
      foundStages[stageFound-1] = true;

      const hasBeenFound = (stageHasBeenFound) => stageHasBeenFound == true;
      if (foundStages.every(hasBeenFound)) {
        showDialog("Congratulations!", "<span>You have found stage&nbsp;"+stageFound+"!</span><br><br><span>You have found all the stages!</span><br><br>Here are the final coordinates:<br>"+getCoords(0)+"<br><br><span style='font-family: monospace'>[FINAL]<br>ZNTARGVP EVTUG FVQR</span>");
      } else {
        showDialog("Congratulations!", "<span>You have found stage&nbsp;"+stageFound+"!</span><br><br>Here's a piece of the final coordinates:<br>"+getCoords(stageFound));
      }
    } else {
      showDialog("Almost...", "It's out of your reach. Try getting closer.");
    }
  });
}
