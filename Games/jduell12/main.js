$(document).ready(function () {
    //getting the locations from index into variables
    let top = document.querySelectorAll(top);
    let middle = document.querySelectorAll(middle);
    let bottom = document.querySelectorAll(botton);
    let right = document.querySelectorAll(right);
    let left = document.querySelectorAll(left);
    let center = document.querySelectorAll(center);
       

    //declaring which player is X and which is O
    let player1 = "X";
    let player2 = "O";


    //checks to see when the cell is clicked
    top.addEventListener("click", cellClicked);
    middle.addEventListener("click", cellClicked);
    bottom.addEventListener("click", cellClicked);
    right.addEventListener("click", cellClicked);
    left.addEventListener("click", cellClicked);
    center.addEventListener("click", cellClicked);

    //function for when a cell is clicked 
    function cellClicked(e){
        
        
    }
   
    
    
})
