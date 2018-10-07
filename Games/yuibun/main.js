var choices = ["rock", "paper", "scissors"];

// play the game
function userChoice(userChoice) {
    // computer chooses rock paper or scissors
    var compChoice = Math.floor(Math.random() * 3);

    if (userChoice == compChoice) {
        document.getElementById("result").innerHTML = "You picked " + choices[userChoice] + ". Computer picked " + choices[compChoice] + ". It's a draw!";
    }
    else
        if (userChoice == 0 && compChoice == 2 ||
            userChoice == 1 && compChoice == 0 ||
            userChoice == 2 && compChoice == 1) {
            document.getElementById("result").innerHTML = "You picked " + choices[userChoice] + ". Computer picked " + choices[compChoice] + ". You win!";
        }
        else {
            document.getElementById("result").innerHTML = "You picked " + choices[userChoice] + ". Computer picked " + choices[compChoice] + ". You lose.";
        }
}