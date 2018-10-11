var whosmove;
var squares = [ $("#sq0"), $("#sq1"), $("#sq2"), $("#sq3"), $("#sq4"), $("#sq5"), $("#sq6"), $("#sq7"), $("#sq8") ];

// handle click and add class
$("#play").on("click", function(){
	$("#buttons").hide();
  $(".square").removeClass("X"); 
  $(".square").removeClass("O");

	var coin = coinFlip();
  $("#status").text("The coin flip was " + (coin ? "heads" : "tails") +". " + (coin ? "I" : "You") + " go first." );
  whosmove = coin ? 1 : 2;
  if (whosmove === 1){
  	setTimeout(pcmove,1500);
  }
});

$(".square").on("click", clickHandler);

function clickHandler(e){
	console.log(whosmove);
  
  if (whosmove !== 2)
  	return;
  if ($(this).hasClass("O") || $(this).hasClass("X"))
  	return;
  var move = this.id.substring(2,3);
	recordMove(false, move);
}

function coinFlip() {
    return Math.floor(Math.random() * 2);
}

function isBoardOpen() {
	return ($(".X").length + $(".O").length) === 0;
}
function isBoardFull() {
		return ($(".X").length + $(".O").length) === 9;
}

function pickRandom(numbers){
	return numbers[Math.floor(Math.random() * numbers.length)];
}

function recordMove(isX, square){
	squares[square].addClass(isX ? "X" : "O")	;
  if (checkForWin(isX, getBoard())){
  	whosmove = 0;
    if (isX){
    	$("#status").text("I Win!")
    }
    else
    {
        	$("#status").text("You Win!")
    }
    $("#buttons").find("button").text("Play Again");
    $("#buttons").show();
  }
  if (isBoardFull()){
    	whosmove = 0;
      	$("#status").text("Tie Game!");
      $("#buttons").find("button").text("Play Again");
    $("#buttons").show();
}
	if (whosmove == 1)
  	whosmove = 2;
  else if (whosmove == 2){
  	whosmove = 1;
  	setTimeout(pcmove, 1500);
  }
}

function pcmove() {
	var move = findPcMove();
  recordMove(true, move);
}

function isSquareOpen(square) {
	return squares[square].hasClass("O") || squares[square].hasClass("X");
}

function findPcMove(){
	if (isBoardOpen())
 		 return pickRandom([0, 2, 6, 8]);
  if (($(".X").length + $(".O").length) === 1){
  	if (squares[4].hasClass("O"))
    	 		 return pickRandom([0, 2, 6, 8]);
		if (squares[0].hasClass("O"))
    	return 8;
		if (squares[2].hasClass("O"))
    	return 6;
		if (squares[6].hasClass("O"))
    	return 2;
		if (squares[8].hasClass("O"))
    	return 0;
    return 4;
  }
	
  var board = getBoard();
  
  // does any move win for pc
  for(var i = 0; i < 9; i++) {
  	if (board[i] == 0){
    	if (isWinningMove(true, i)){
      	return i;    
      }
    }
  }
  
  // need to block to stop win
  for(var i = 0; i < 9; i++) {
  	if (board[i] == 0){
    	if (isWinningMove(false, i))
      return i;
    }
  }
  
  // are opposite corners available
  if (board[0] == 1 && board[8] == 0)
  	return 8;
  if (board[2] == 1 && board[6] == 0)
  	return 6;
  if (board[6] == 1 && board[2] == 0)
  	return 2;
  if (board[8] == 1 && board[0] == 0)
  	return 0;
    
  // are adjacent corner available
  if (board[0] == 1 && board[2] == 0)
  	return 2;
  if (board[0] == 1 && board[6] == 0)
  	return 6;
  if (board[2] == 1 && board[0] == 0)
  	return 0;
  if (board[2] == 1 && board[8] == 0)
    return 8;
  if (board[8] == 1 && board[2] == 0)
  	return 2;
  if (board[8] == 1 && board[6] == 0)
    return 6;
  if (board[6] == 1 && board[8] == 0)
  	return 8;
  if (board[6] == 1 && board[0] == 0)
  	return 0;
  
	for (var i = 0; i < 9; i++){
  	if (board[i] == 0)
    	return i;
  }
	
}

function isWinningMove(isX, square){
  var board = getBoard();
  board[square] = (isX ? 1 : 2);
  return checkForWin(isX, board);  
}

function getBoard(){
  return $.map(squares, function(square) { return square.hasClass("X") ? 1 : square.hasClass("O") ? 2 : 0 });
}

function checkForWin(isX, board){
  var spots = $.map(board, function(b) { return b === (isX ? 1 : 2); });
  return (
  	(spots[0] && spots[1] && spots[2]) ||
  	(spots[3] && spots[4] && spots[5]) ||
  	(spots[6] && spots[7] && spots[8]) ||
		(spots[0] && spots[3] && spots[6]) ||
  	(spots[1] && spots[4] && spots[7]) ||
  	(spots[2] && spots[5] && spots[8]) ||
  	(spots[0] && spots[4] && spots[8]) ||
  	(spots[2] && spots[4] && spots[6]));
}
