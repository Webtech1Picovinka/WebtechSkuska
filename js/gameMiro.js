var ba = false;
var tt = false;
var tn = false;
var nr = false;
var za = false;
var bb = false;
var po = false;
var ke = false;

$(document).ready(function() {
    $('#ba').draggable();
    $('#placeBA').droppable({
        drop: function(event, ui) {
            if (ui.draggable[0].id != "ba") {
                return;
            }
            $('#ba').animate({
                top: "-7.38vw",
                left: "-39.2vw"
            });
            ba = true;
            end();
        }
    });

    $('#tt').draggable();
    $('#placeTT').droppable({
        drop: function(event, ui) {
            if (ui.draggable[0].id != "tt") {
                return;
            }
            $('#tt').animate({
                top: "6.68vw",
                left: "-56vw"
            });
            tt = true;
            end();
        }
    });

    $('#tn').draggable();
    $('#placeTN').droppable({
        drop: function(event, ui) {
            if (ui.draggable[0].id != "tn") {
                return;
            }
            $('#tn').animate({
                top: "-16.15vw",
                left: "-41.5vw"
            });
            tn = true;
            end();
        }
    });

    $('#nr').draggable();
    $('#placeNR').droppable({
        drop: function(event, ui) {
            if (ui.draggable[0].id != "nr") {
                return;
            }
            $('#nr').animate({
                top: "-12.6vw",
                left: "-54.15vw"
            });
            nr = true;
            end();
        }
    });

    $('#za').draggable();
    $('#placeZA').droppable({
        drop: function(event, ui) {
            if (ui.draggable[0].id != "za") {
                return;
            }
            $('#za').animate({
                top: "-29.2vw",
                left: "-17.5vw"
            });
            za = true;
            end();
        }
    });

    $('#bb').draggable();
    $('#placeBB').droppable({
        drop: function(event, ui) {
            if (ui.draggable[0].id != "bb") {
                return;
            }
            $('#bb').animate({
                top: "10.38vw",
                left: "-54.3vw"
            });
            bb = true;
            end();
        }
    });

    $('#po').draggable();
    $('#placePO').droppable({
        drop: function(event, ui) {
            if (ui.draggable[0].id != "po") {
                return;
            }
            $('#po').animate({
                top: "-12.95vw",
                left: "-35.45vw"
            });
            po = true;
            end();
        }
    });

    $('#ke').draggable();
    $('#placeKE').droppable({
        drop: function(event, ui) {
            if (ui.draggable[0].id != "ke") {
                return;
            }
            $('#ke').animate({
                top: "-20.45vw",
                left: "25.2vw"
            });
            ke = true;
            end();
        }
    });
});

var sekunda = 0;

function rataj() {
    sekunda++;
    document.getElementById("sekunda").innerHTML = sekunda;
}

var cas = 0;

function start() {
    document.getElementById("topOverlay").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    cas = 0;
    cas = setInterval(rataj, 1000);
}

function demo() {
    document.getElementById("topOverlay").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function end() {
    if (ba == true && tt == true && tn == true && nr == true && za == true && bb == true && po == true && ke == true) {
        clearInterval(cas);
        document.getElementById("topOverlay").style.display = "block";
        document.getElementById("overlay").style.display = "block";
        document.getElementById("end").style.display = "block";
        document.getElementById("restart").style.display = "block";
        document.getElementById("start").style.display = "none";
        document.getElementById("demo").style.display = "none";
        document.getElementById("cislo").innerHTML = sekunda;
    }
}

function restart() {
    location.reload();
}