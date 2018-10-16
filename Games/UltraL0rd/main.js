//Should probably turn these into objects and turn this into a decent game :D
let mainStage = document.getElementById("now-what");
let player1 = document.getElementById("player1");
let player2 = document.getElementById("player2");
let fireball = document.getElementById("fireball"); //offscreen, spawn multiple
let gameOver = false;
let winningCombo = [38, 38, 40, 40, 37, 39, 37, 39];
let currentCombo = [];
function startGame(){
  //Clear the stage
  mainStage.className = "";
  mainStage.classList.add("stage1");
  mainStage.classList.add("title");
}

function startFight(){
  //Trigger the death timer
  //38 38 40   40   37   39    37   39 ( don't look at my code) WORK IT OUT!
  document.body.onkeyup = function(e){
    currentCombo.push(e.keyCode);
    console.log(currentCombo);
    if (currentCombo.length == 8){
      if(compare(currentCombo, winningCombo)){
        if (!gameOver){
            shootFireball(player1, player2);
        }
      }
      currentCombo = [];
    }
  }
  setTimeout(function(){
      shootFireball(player2, player1);
  }, 5000); //5secs, all you have
}

function shootFireball(agent, target){
  if (gameOver) return;

  var duplicateFireball = fireball.cloneNode(true);
  duplicateFireball.id = "fireball_"+new Date().valueOf()+"_clone";
  duplicateFireball.classList.add("clone");
  duplicateFireball.classList.remove("original");
  mainStage.appendChild(duplicateFireball);

  var startingPostion = getPos(agent);
  var endPosition = getPos(target);
  //just working on the x plane for now..
  var pace = (startingPostion.x > endPosition.x)?-1:1;
  var distance = 0;
  duplicateFireball.style.top = startingPostion.y + "px";
  duplicateFireball.style.left = startingPostion.x + "px";
  var maxDistance = Math.abs(startingPostion.x - endPosition.x);

  //I like to move it move it!
  var fireballInt = setInterval(function(){
      distance+=pace;
      duplicateFireball.style.left = (startingPostion.x + distance) + "px";
      if (maxDistance < Math.abs(distance)){
          targetHit(target);
          //clean up
          duplicateFireball.parentNode.removeChild(duplicateFireball);
          clearInterval(fireballInt);
      }
  }, 2);

}

function targetHit(target){
    if (!gameOver){
        target.classList.add("dead");
        setTimeout(function(){
          mainStage.classList.add("stage1");
          mainStage.classList.add("end");
          if (target.classList.contains("computer")){
              mainStage.classList.add("won");
          }else{
              mainStage.classList.add("lost");
          }
        }, 1500)
    }
}


mainStage.onclick = function(e){
  e.preventDefault();
  if(mainStage.classList.contains("title")){
      mainStage.classList.remove("title");
      mainStage.classList.add("begin");
      setTimeout(function(){
          mainStage.classList.remove("begin");
          mainStage.classList.remove("stage1");
          mainStage.classList.add("stage2");
          startFight();
      }, 1000)
  }
  if(mainStage.classList.contains("end")){
      startGame();
  }

}

startGame();

//utils
function compare(arr1, arr2){
  //small array check for the game code, no need to get serious
  var match = true; //assume correct, unless there is an error
  for (var i = 0; i<arr1.length; i++){
      if (arr1[i] != arr2[i]){
        match = false;
      }
  }
  return match;
}

function getPos(el) {
    for (var lx=0, ly=0;
         el != null;
         lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
    return {x: lx,y: ly};
}
