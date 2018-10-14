/* This is a javascript code to make a grid using makeGrid() function
   height and width are submitted by the user in the html form.
*/
//by muskan09
//pixel art maker
function makeGrid() {
    var height = document.getElementById("inputHeight").value;
    var width = document.getElementById("inputWeight").value;
    var table = document.getElementById("pixelCanvas");
    //for creation of table grid
    table.innerHTML = "";
    var tbody = document.createElement("tbody");
    for (var i = 0; i < height; i++) {
        var tr = document.createElement("tr");
        for (var j = 0; j < width; j++) {
            var td = document.createElement("td");
            td.appendChild(document.createTextNode(""));
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
}
//color changing of pixel when clicked with jQuery
$("body").on("click", "td", function() {
    var color = document.getElementById("colorPicker").value;
    $(this).css("background-color", color);
});
