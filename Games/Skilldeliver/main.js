var numSqu = 6
var colors = genRandColors(numSqu);
console.log(colors);
var squares = document.querySelectorAll(".square");
var color_picked = colors[pickColor()];
console.log(color_picked);
var color_disp = document.getElementById("colorCase");
var message_disp = document.querySelector("#message");
var h1 = document.getElementsByTagName("h1")[0];
var res_btn = document.querySelector("#res");
// var modeButtons = document.querySelectorAll(".mode");
var easy_btn = document.querySelector("#easy-btn");
var hard_btn = document.querySelector("#hard-btn");

color_disp.textContent = color_picked;

easy_btn.addEventListener("click", function(){
	hard_btn.classList.remove("selected");
	easy_btn.classList.add("selected");

	numSqu = 3
	colors = genRandColors(numSqu);
	color_picked = colors[pickColor()];
	color_disp.textContent = color_picked;
	console.log(colors);
	for (var i = 0; i < squares.length; i++){
		if (colors[i]){
			squares[i].style.backgroundColor = colors[i];
		}
		else{
			squares[i].style.display = "none";
		}
	}
	h1.style.backgroundColor = "steelblue";
	message_disp.textContent = "";
})

hard_btn.addEventListener("click", function(){
	hard_btn.classList.add("selected");
	easy_btn.classList.remove("selected");

	numSqu = 6;
	colors = genRandColors(numSqu);
	color_picked = colors[pickColor()];
	color_disp.textContent = color_picked;
	for (var i = 0; i < squares.length; i++){
		squares[i].style.backgroundColor = colors[i];
		squares[i].style.display = "block";
	}
	h1.style.backgroundColor = "steelblue";
	message_disp.textContent = "";
})

res_btn.addEventListener("click", function(){
	colors = genRandColors(numSqu);
	console.log(colors);
	color_picked = colors[pickColor()];
	console.log(color_picked);
	color_disp.textContent = color_picked;
	for (var i = 0; i < squares.length; i++){
	squares[i].style.backgroundColor = colors[i];
	}
	message_disp.textContent = "";
	res_btn.textContent = "New Colors";
	h1.style.backgroundColor = "steelblue";
	message_disp.textContent = "";
})

for (var i = 0; i < squares.length; i++){
	squares[i].style.backgroundColor = colors[i];

	squares[i].addEventListener("click", function(){
		var color_clicked = this.style.backgroundColor;
		console.log(color_picked, color_clicked)

		if (color_clicked === color_picked){
			message_disp.textContent = "Correct";
			h1.style.backgroundColor = color_clicked;
			res_btn.textContent = "Play Again?";
			changeColor(color_clicked);
		}
		else {
			this.style.backgroundColor = "#232323";
			message_disp.textContent = "Try again";
			}
	})
}

function reset(){
	colors = genRandColors(numSqu);
	color_disp.textContent = color_picked;
	message_disp.textContent = "";
	res_btn.textContent = "New Colors";

	for (var i = 0; i < squares.length; i++){
		if (colors[i]){
			squares[i].style.display = "block";
			squares[i].style.backgroundColor = colors[i];
		}
		else {
			squares[i].style.display = "none";
		}
	}
	h1.style.backgroundColor = "steelblue";


}
function pickColor(){
	var rannum = Math.floor(Math.random() * colors.length)
	return rannum;
}

function changeColor(color){
	for (var i = 0; i < squares.length; i++){
		squares[i].style.backgroundColor = color;
	}
}

function genRandColors(range){
	colors_list = []
	for (var i = 1; i <= range; i++){
		colors_list.push("rgb(" + randColor() + ", " + randColor() + ", " + randColor() + ")");
	}
	return colors_list
}

function randColor(){
	return Math.floor(Math.random() * 256) 
}
