document.getElementById("check").onclick=function(){
	  var randomNum=Math.random();
	   var randomNum2=Math.random();
	  randomNum=randomNum*10;
	  
	  randomNum=Math.floor(randomNum);
	  randomNum2=randomNum2*10;
	  randomNum2=Math.floor(randomNum2);
	  
	  
	  if(document.getElementById("num").value==randomNum && document.getElementById("num2").value==randomNum2){
	 
		  alert("you win");
	  }
	  else{
		  alert("I am afraid, it is not. It is " + randomNum +" and "+randomNum2);
	  }
  }
