$(document).ready(function() {

    $(".playersChoice").click(function() {

        let playerPick = $(this).attr("id")

        $('#player-pick').html(playerPick)

        $('#winner').html('')
        compare(playerPick);
    })

    function compare(pick) {

        const moves = ["Paper", "Rock", "Scissors"];

        let cpuPick = moves[Math.floor(Math.random() * moves.length)];

        $('#cpu-pick').html(cpuPick)
    
        if (pick == cpuPick) {
            $('#winner').html("<h1>Tie!</h1>")
            return
        }

        if (pick == "Rock") {
            if (cpuPick == "Scissors") {
                $('#winner').html("<h1>You Win!</h1>")
            } 
            else {
                $('#winner').html("<h1>CPU Wins</h1>")
            }
        }
        if (pick == "Paper") {
            if (cpuPick == "Rock") {
                $('#winner').html("<h1>You Win!</h1>")
            } 
            else {
                $('#winner').html("<h1>CPU Wins</h1>")
            }
        }
        if (pick == "Scissors") {
            if (cpuPick == "Paper") {
                $('#winner').html("<h1>You Win!</h1>")
            }
            else {
                $('#winner').html("<h1>CPU Wins</h1>")
            }
        }
    }
})