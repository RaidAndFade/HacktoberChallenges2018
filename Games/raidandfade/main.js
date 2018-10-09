var count = 0
document.getElementById("x").onclick= function(e){
  count += 1
  document.getElementById("c").innerText = "Clicked "+count+" times!"
}
