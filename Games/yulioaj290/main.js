var points = [
    "North",
    "North Northeast",
    "Northeast",
    "East Northeast",
    "East",
    "East Southeast",
    "Southeast",
    "South Southeast",
    "South",
    "South Southwest",
    "Southwest",
    "West Southwest",
    "West",
    "West Northwest",
    "Northwest",
    "North Northwest"
];

function reset(){
    document.getElementById('target').innerHTML = points[getRandomInt(0,15)];
    document.getElementById('action-container').setAttribute("class", "action");
}

function locate(coord){
    var current = document.getElementById('target').innerHTML;
    if(current === points[coord]){
        document.getElementById('action-container').setAttribute("class", "action right");
    } else {
        document.getElementById('action-container').setAttribute("class", "action wrong");
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
} 
