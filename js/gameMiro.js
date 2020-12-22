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
                top: "38.25%",
                left: "0.8%"
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
                top: "30.7%",
                left: "2%"
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
                top: "18.3%",
                left: "6.45%"
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
                top: "37.3%",
                left: "8.8%"
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
                top: "10.8%",
                left: "17.45%"
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
                top: "32.5%",
                left: "17.6%"
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
                top: "18.1%",
                left: "32.55%"
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
                top: "31.8%",
                left: "35.1%"
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
        document.getElementById("start").style.display = "none";
        document.getElementById("demo").style.display = "none";
        document.getElementById("note").style.display = "none";
        document.getElementById("cislo").innerHTML = sekunda;
    }
}