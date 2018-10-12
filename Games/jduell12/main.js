document.addEventListener("DOMContentLoaded", function () {
    //getting the locations from index into variables
    let topLeft = document.getElementById("tl");
    let topMiddle = document.getElementById("tm");
    // let bottom = document.querySelectorAll(".botton");
    // let right = document.querySelectorAll(".right");
    // let left = document.querySelectorAll(".left");
    // let center = document.getElementById("center");
    
   
       

    //declaring which player is X and which is O
    let player1 = "X";
    let player2 = "O";


    //checks to see when the cell is clicked
    topLeft.addEventListener("click", cellClicked);
    topMiddle.addEventListener("click", cellClicked);
    // bottom.addEventListener("click", cellClicked);
    // right.addEventListener("click", cellClicked);
    // left.addEventListener("click", cellClicked);
    // center.addEventListener("click", cellClicked);

    //function for when a cell is clicked 
    function cellClicked(e){
        document.getElementById("tl").innerText = "X";
        
    }
   
    
    
})
