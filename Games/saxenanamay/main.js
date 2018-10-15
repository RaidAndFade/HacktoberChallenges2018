
var numSquares = 6;
var colors= generateColors(numSquares);
var squares= document.querySelectorAll(".square");
var picked= colors[pickedColor()];
var displayTargetColor= document.querySelector("#goal");
var stat= document.querySelector("#status");
var h1= document.querySelector("h1");
var btn= document.querySelector("#rst");
var ez= document.querySelector("#ez");
var hard= document.querySelector("#hard");
var head= document.querySelector("#head");
ez.addEventListener("click",function(){
    ez.classList.add("selected");
    hard.classList.remove("selected");
    stat.textContent= "";
    numSquares = 3;
    colors= generateColors(numSquares);
    picked= colors[pickedColor()];
    btn.textContent= "New Colors";
    for(var i= 0; i<squares.length; i++){
        if(colors[i])
        squares[i].style.backgroundColor=colors[i];
        else
        squares[i].style.display= "none";
    }
    displayTargetColor.textContent = picked;
    head.style.background = "steelblue";
});
hard.addEventListener("click",function(){
    hard.classList.add("selected");
    ez.classList.remove("selected");
    stat.textContent= "";
    numSquares = 6;
    colors= generateColors(numSquares);
    picked= colors[pickedColor()];
    btn.textContent= "New Colors";
    for(var i= 0; i<squares.length; i++){
        squares[i].style.backgroundColor=colors[i];
        squares[i].style.display= "block";
    }
    displayTargetColor.textContent = picked;
    head.style.background = "steelblue";
});
for(var i= 0; i<squares.length; i++){
    squares[i].style.backgroundColor=colors[i];
    squares[i].addEventListener("click",function(){
        if(this.style.backgroundColor===picked){
            btn.textContent = "Play Again?";
            stat.textContent = "Correct";
            
            success();
        }
        else{
            this.style.backgroundColor = "#232323";
            stat.textContent = "Try Again";
        }
    })
}
displayTargetColor.textContent = picked;
function success(){
    for(var i= 0; i< squares.length; i++){
        squares[i].style.backgroundColor= picked;
    }
    h1.style.backgroundColor= picked; 
}
function pickedColor(){
    return Math.floor(Math.random()* colors.length);
}
function generateColors(a){
    var colors = [];
    for(var i= 0; i< a; i++){
        colors[i] = "rgb("
        red = Math.floor(Math.random()* 256);
        green = Math.floor(Math.random()* 256);
        blue = Math.floor(Math.random()* 256);
        colors[i]+=red;
        colors[i]+=", ";
        colors[i]+=green;
        colors[i]+=", ";
        colors[i]+=blue;
        colors[i]+=")";
    }
    return colors;
}
btn.addEventListener("click",function(){
    stat.textContent= "";
    colors= generateColors(numSquares);
    picked= colors[pickedColor()];
    for(var i= 0; i<squares.length; i++){
        squares[i].style.backgroundColor=colors[i];
    }
    this.textContent= "New Colors";
    displayTargetColor.textContent = picked;
    head.style.backgroundColor = "steelblue";
 
});

