// By TORRESDESIGN - https://github.com/TORRESDESIGN

var greeting = "Hello ";

var myName = prompt("Hello, whats your name?", "Frankenstein");
console.log(greeting + myName);
var myFav = prompt("Whats your favorite coding language?", "JavaScript");
switch(myFav) {
  case "JavaScript":
    console.log(myName + ", " + myFav + " is my favorite too!" + " Happy Halloween!");
    break;
  default:
    console.log(myFav + " is ok too.");
}
