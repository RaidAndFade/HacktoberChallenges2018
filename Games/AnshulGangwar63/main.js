var scores,currentScore,activeplayer,gameplaying,winer;
winer = parseInt(prompt('Enter the winning score'));

init();

function init()
{
     scores = [0,0];
    currentScore = 0;
    activeplayer = 0;
    gameplaying = true;
     document.getElementById('dice-image').style.display="none";
     document.getElementById('dice-image1').style.display="none";
    document.getElementById('score-0').textContent= '0';
    document.getElementById('score-1').textContent= '0';
    document.getElementById('current-0').textContent= '0';
    document.getElementById('current-0').textContent= '0';
    document.getElementById('name-0').textContent= 'Player 1';
    document.getElementById('name-1').textContent= 'Player 2';
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.add('active');
    
}

document.getElementById('new-game').addEventListener('click',init);

document.getElementById('roll-dice').addEventListener('click',function(){
   if(gameplaying)
       {
         var d = Math.floor(Math.random() * 6 +1);
         var s = Math.floor(Math.random() * 6 +1);
           var k;
         document.getElementById('dice-image').src = "img/dice-" +d+ ".png";
         document.getElementById('dice-image1').src = "img/dice-" +s+ ".png";
         document.getElementById('dice-image').style.display="block";
         document.getElementById('dice-image1').style.display="block";
        if( d !== 1 && s !== 1 )
            {
                k = d + s;
                currentScore += k;
                document.getElementById('current-' + activeplayer).textContent = currentScore;
            }
        else
        {

            changePlayer();
        }
     }
});


document.getElementById('hold').addEventListener('click',function(){
   if(gameplaying)
       {
        scores[activeplayer] += currentScore;
        document.getElementById('score-' + activeplayer).textContent = scores[activeplayer]; 
        console.log(currentScore);

        if(scores[activeplayer] >= winer)
            {
                document.getElementById('name-'+activeplayer).innerHTML='Winner';
                 document.getElementById('dice-image').style.display="none";
                 document.getElementById('dice-image1').style.display="none";
                 document.querySelector(".player-"+activeplayer+"-panel").classList.add('winner')
                 document.querySelector(".player-"+activeplayer+"-panel").classList.remove('active');
                gameplaying = false;
            }
        else
            {
                changePlayer();
            }
       }
});

function changePlayer()
{
    activeplayer === 0 ? activeplayer = 1:activeplayer = 0;
        document.getElementById('dice-image').style.display="none";
        document.getElementById('dice-image1').style.display="none";
        currentScore =0;
        document.getElementById("current-0").textContent='0';
        document.getElementById("current-1").textContent='0';
        document.querySelector(".player-0-panel").classList.toggle("active");
        document.querySelector(".player-1-panel").classList.toggle("active");
}