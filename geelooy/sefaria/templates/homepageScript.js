//B"H

var navbar2 = document.getElementsByClassName("navbar-2 w-nav")[0];
if(navbar2)
navbar2.parentNode.removeChild(navbar2)
var parshaBtn = document.getElementById("w-tabs-0-data-w-tab-0");
var volumeBtn = document.getElementById("w-tabs-0-data-w-tab-1");

var volumeTab = document.getElementById("w-tabs-0-data-w-pane-1")
var parshaTab = document.getElementById("w-tabs-0-data-w-pane-0")
var onParshaPage = true;

var greenBar = parshaBtn.children[0];

volumeBtn.onclick = () => {
    if(onParshaPage) {
        volumeTab.classList.add("w--tab-active");
        parshaTab.classList.remove("w--tab-active")
        onParshaPage = false;
        parshaBtn.classList.remove("w--current")
        volumeBtn.classList.add("w--current")
        updateGreenBar(100);
        parshaTxt.style.color=""
        volTxt.style.color="rgb(0,0,0)"
    } 
}

parshaBtn.onclick = () => {
    if(!onParshaPage) {
        onParshaPage = true;
        volumeTab.classList.remove("w--tab-active")
        parshaTab.classList.add("w--tab-active")
        
        volumeBtn.classList.remove("w--current")
        parshaBtn.classList.add("w--current")
        updateGreenBar(0)
        
        volTxt.style.color=""
        parshaTxt.style.color="rgb(0,0,0)"
    }
}

function updateGreenBar(val) {
    greenBar.style.transform = `translate3d(${
        val
    }%, 0px, 0px)`+
    ` scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) `+
    `rotateZ(0deg) skew(0deg, 0deg)`;
}