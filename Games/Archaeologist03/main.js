
function init() {

    // DOM SELECTION
    const header = document.querySelector(".header");
    const container = document.querySelector(".container");
    const boxes = document.querySelectorAll(".box");
    const p = document.querySelector(".tips");
    const restart = document.querySelector(".btn");


    //assigning random box with batmen
    function assignBox() {
        const batmen = document.createElement("div");
        batmen.style.border = "33px solid black";
        batmen.style.borderRadius = "45%";
        batmen.style.opacity = "0";

        let randomNum = Math.ceil(Math.random() * boxes.length);
        boxes[randomNum - 1].appendChild(batmen);
    }
    assignBox();




    // EVENTS

    // Reveals box if user clicks on right one
    boxes.forEach(box => box.addEventListener("click", revealBox));

    function revealBox() {
        // .... I was in hurry... be merceful..whoever checks this :)
        if (this.firstElementChild) {
            this.firstElementChild.style.opacity = "1";
            this.style.border = "5px solid blue";
            this.style.borderRadius = "20px";
            this.style.transition = "all .1s";
            header.textContent = "YOU GOT HIM!"
            p.textContent = "NICE!";
            // restart.classList.add("restart");
        } else {
            p.textContent = "Not quite yet, he might be hiding in box right next..";
            this.style.backgroundColor = "transparent";
        }
    }



    // // Restarting game btn
    // restart.addEventListener("click", restarting);

    // function restarting() {
    //     // Init();
    //     console.log("hmmm");
    // }




};

init();