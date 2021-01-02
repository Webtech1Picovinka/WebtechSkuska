//funkcia ktora odstrani specialne slovenske znaky a nahradi ich normalnymi
function removeDiacritics(str) {
    var map = {
        'a' : 'á|ä',
        'c' : 'č',
        'd' : 'ď',
        'e' : 'é',
        'i' : 'í',
        'l' : 'ĺ|ľ',
        'n' : 'ň',
        'o' : 'ó|ô',
        's' : 'š',
        't' : 'ť',
        'u' : 'ú',
        'y' : 'ý',
        'z' : 'ž',
        'A' : 'Á',
        'C' : 'Č',
        'D' : 'Ď',
        'E' : 'É',
        'I' : 'Í',
        'L' : 'Ĺ|Ľ',
        'N' : 'Ň',
        'O' : 'Ó|Ô',
        'S' : 'Š',
        'T' : 'Ť',
        'U' : 'Ú',
        'Y' : 'Ý',
        'Z' : 'Ž',
    };

    for (var pattern in map) {
        str = str.replace(new RegExp(map[pattern], 'g'), pattern);
    };
    return str;
};


//webkomponent 3-urovnove menu
class MyComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <ul class="top-level-menu">
            <li>
            <a href="html/tim.html">Tím</a>
            <ul class="second-level-menu" id="second-level-menu">
                <li><a>Daniel Nošík</a>
                    <ul class="third-level-menu">
                        <li><a href="html/gameDano.html">Hra</a></li>
                        <li><a href="html/aboutDano.html">Životopis</a></li>
                    </ul>
                </li>
                <li><a>Jakub Petrík</a>
                    <ul class="third-level-menu">
                        <li><a href="html/gameKubo.html">Hra</a></li>
                        <li><a href="html/aboutKubo.html">Životopis</a></li>
                    </ul>
                </li>
                <li><a>Martin Žofčík</a>
                    <ul class="third-level-menu">
                        <li><a href="html/gameMartin.html">Hra</a></li>
                        <li><a href="html/aboutMartin.html">Životopis</a></li>
                    </ul>
                </li>
                <li><a>Miroslav Kopecký</a>
                    <ul class="third-level-menu">
                        <li><a href="html/gameMiro.html">Hra</a></li>
                        <li><a href="html/aboutMiro.html">Životopis</a></li>
                    </ul>
                </li>
            </ul>
        </ul>
        <a href="javascript:void(0);" class="d-md-none d-sm-block d-xs-block" onclick="myFunction()">
            <i class="fa fa-bars"></i>
        </a>
        `;
    }
}
customElements.define('menu-menu', MyComponent);

function myFunction() {
    var x = document.getElementById("second-level-menu");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
}



// Webkomponent na zobrazenie dnešných menín; vyhľadávanie menín podľa dátumu a mena
const template = document.createElement('template');

//definovanie sablony
template.innerHTML =
    `   <div>
        
        <!-- vypis dnesnych menin aj s datumom -->
        <h3 id="nameday"></h3><br>

        <!-- zadanie custom datumu pre ktory chceme meniny -->
        <div class="form-group">
            <label for="customDate">Vyberte dátum</label>
            <input type="text" id="customDate" class="form-control col-6"  name="customDate" placeholder="Zadajte dátum -> dd.mm.">
            <small id="invalidDate">Nesprávny dátum! (dd.mm.)</small>

        </div>

        <!-- vypis menin vybraneho dna aj s datumom -->
        <h3 id="customDateTag">aaa</h3><br>

        <!-- zadanie mena pre ktore chceme zistit datum -->
        <div class="form-group">
            <label for="customName">Napíšte meno</label>
            <input type="text" id="customName" class="form-control col-6" name="customName" placeholder="Zadajte meno">
            <small id="invalidName">Nesprávne meno!</small>
        </div>

        <!-- vypis dna kedy ma vybrane meno meniny aj s menom -->
        <h3 id="customNameTag">aaa</h3>

        <!-- import bootstrapu do custom elementu -->
        <style>
            @import url('https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css');

            #invalidDate,
            #invalidName{
                color: red;
                display: none;
            }

            #customDateTag,
            #customNameTag{
                visibility: hidden;
            }

        </style>
    </div> 
`;


class NameDay extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        //vytiahnutie ideciek z html, podobne ako getElementById() ale v custom elemente
        var todayName = this.shadowRoot.querySelector('#nameday'),

            customDateTag = this.shadowRoot.querySelector('#customDateTag'),
            customDate = this.shadowRoot.querySelector('#customDate'),

            customNameTag = this.shadowRoot.querySelector('#customNameTag'),
            customName = this.shadowRoot.querySelector('#customName'),

            invalidDate = this.shadowRoot.querySelector('#invalidDate'),
            invalidName = this.shadowRoot.querySelector('#invalidName');


        //nacitanie xml suboru s meninami
        fetch("resources/meniny.xml")
            .then(function(resp) {
                return resp.text();
            })
            
            .then(function(data) {
                var parser = new DOMParser();
                // nacitanie xml suboru do premennej xmlDoc
                var xmlDoc = parser.parseFromString(data, "text/xml");
                var i = 0,
                    day, today = new Date(),
                    todayDay = today.getDate(), //vrati den v mesiaci
                    todayMonth = today.getMonth() + 1; // getMonth() vracia mesiace od 0-januar po 11-december, preto + 1

                if (todayDay < 10){
                    todayDay = "0" + todayDay;
                }
                if (todayMonth < 10){
                    todayMonth = "0" + todayMonth;
                }
                //prehladavanie celeho suboru
                while (i < xmlDoc.getElementsByTagName("zaznam").length) {

                    day = xmlDoc.getElementsByTagName("den")[i];
                    // ak sa dnesny datum zhoduje s datumom v tagu <den> v xml subore, vypise ho aj s meninami
                    if (day.innerHTML === "" + todayMonth + todayDay) {

                        todayName.innerText = "Dnes " + todayDay + "." + todayMonth + "." + " má meniny " + day.nextElementSibling.innerHTML; //vytvori tex ktory sa vypise na obrazovku
                    }
                    i++;
                }



                // to iste ako vyssie, len to berie custom datum, nie dnesny datum
                // pridanie addeventlisteneru, ak sa datum v inpute zmeni, treba prehladat subor a najst nove meno
                customDate.addEventListener('change', () => {
                    // spracovanie udajov zo vstupu
                    var i = 0,
                        dayXML,
                        regex = new RegExp("^\\d{1,2}[.]\\d{1,2}[.]$", "g"), //prepusti len platny datum bez roku oddeleny bodkami
                        correctDate = regex.test(customDate.value), // true ak vstup splna podmienky regexu, inak false
                        splitstring = customDate.value.split('.'); //rozdeli vstupny string do pola, oddelovac je bodka

                    // uprava dna a mesiaca z vstupu
                    if (splitstring[0] && splitstring[0].length == 1) { // ak uzivatel zada napr 1.1. tak to zmeni na 01.1. aby to ptm vedel najst v xml

                        splitstring[0] = "0" + splitstring[0];
                    }
                    if (splitstring[1] && splitstring[1].length == 1) { // ak uzivatel zada napr 1.1. tak to zmeni na 1.01. aby to ptm vedel najst v xml

                        splitstring[1] = "0" + splitstring[1];
                    }

                    // ak je datum spravny, prehladava sa xml
                    if (correctDate == true && (splitstring[0] <= 31 && splitstring[0] > 0) && (splitstring[1] <= 12 && splitstring[1] > 0)) {
                        invalidDate.style.display = 'none'; // ak je datum spravny, napoveda sa skryje

                        while (i < xmlDoc.getElementsByTagName("zaznam").length) { //pokial je i mensie ako pocet tagov <zaznam> v xml
                            dayXML = xmlDoc.getElementsByTagName("den")[i]; //do dayXML sa vlozi datum aktualneho tagu v xml

                            if (dayXML.innerHTML === ("" + splitstring[1] + splitstring[0])) {

                                customDateTag.style.visibility = 'visible'; //ak je tag skryty, zobrazi ho
                                customDateTag.innerText = splitstring[0] + "." + splitstring[1] + ". má meniny " + dayXML.nextElementSibling.innerHTML; //vytvori tex ktory sa vypise na obrazovku
                                break;
                            }
                            i++;
                        }
                    } else {
                        //ak je datum nespravne zadany, zobrazi sa napoveda
                        invalidDate.style.display = 'block';
                    }
                });



                //zase to iste co vyssie, ale tu hlada podla mena a vypisuje den
                customName.addEventListener('change', () => {
                    var i = 0,
                        nameXML,
                        arrayOfNamesXML,
                        nameXMLWithoutDiacritics,
                        arrayOfNamesWithoutDiacriticXML,
                        array0Equals,
                        array1Equals,
                        dateXML,
                        inputNameCapital = customName.value[0].toUpperCase() + customName.value.slice(1), //ak uzivatel zada meno s malym pismenom na zaciatku, da ho na velke
                        regex = new RegExp("^[^0-9]{1,}$"), //prepusti len pismena, cisla nie
                        correctName = regex.test(customName.value), // true ak vstup splna podmienky regexu, inak false
                        inputNameCapitalWithoutDiacritics = removeDiacritics(inputNameCapital);

                    if (correctName == true) {
                        invalidName.style.display = 'none'; // ak je meno spravne, upozornenie sa skryje

                        //maximalne ide len pocetDniKedyMaNiektoMeniny-krat, lebo nie kazdy den ma niekto meniny - napr 1.1.
                        while (i < xmlDoc.getElementsByTagName("SK").length) { //pokial je i mensie ako pocet tagov <SK> v xml (tag <SK> = meniny na SVK)
                            nameXML = xmlDoc.getElementsByTagName("SK")[i];
                            dateXML = nameXML.previousElementSibling.innerHTML; //previousElementSibling zobrazi predchadzajuceho surodenca tagu <SK> v xml subore
                            nameXMLWithoutDiacritics = removeDiacritics(nameXML.innerHTML); //odstranenie diakritiky zo stringu z xml
                            arrayOfNamesWithoutDiacriticXML = nameXMLWithoutDiacritics.split(','); //rozdelenie stringu do pola, rozdelovac ciarka

                            if (arrayOfNamesWithoutDiacriticXML[1]) { //ak su v dany den 2 meniny-->arrayOfNamesWithoutDiacriticXML[1] bude existovat, inak nie

                                //ak sa prve meno z xml rovna vstupu
                                if (arrayOfNamesWithoutDiacriticXML[0] === inputNameCapitalWithoutDiacritics) {
                                    customNameTag.style.visibility = 'visible'; //zobrazi sa tag kam sa ma vpisovat meno
                                    customNameTag.innerText = nameXML.innerHTML + " má meniny " + dateXML.slice(2, 4) + "." + dateXML.slice(0, 2) + "."; //vytvori tex ktory sa vypise na obrazovku
                                }

                                //ak sa druhe meno z xml rovna vstupu
                                if (arrayOfNamesWithoutDiacriticXML[1].trim() === inputNameCapitalWithoutDiacritics) { //trim() oreze medzery zo zaciatku a konca
                                    customNameTag.style.visibility = 'visible';
                                    customNameTag.innerText = nameXML.innerHTML + " má meniny " + dateXML.slice(2, 4) + "." + dateXML.slice(0, 2) + "."; //vytvori tex ktory sa vypise na obrazovku
                                }

                            } else { //ak je v dany den len jedno meno
                                if (arrayOfNamesWithoutDiacriticXML[0] === inputNameCapitalWithoutDiacritics) {
                                    customNameTag.style.visibility = 'visible';
                                    customNameTag.innerText = nameXML.innerHTML + " má meniny " + dateXML.slice(2, 4) + "." + dateXML.slice(0, 2) + "."; //vytvori tex ktory sa vypise na obrazovku
                                }
                            }
                            i++;
                        }
                    } else {
                        //ak je meno nespravne zadane, zobrazi sa upozornenie
                        invalidName.style.display = 'block';
                    }
                });
            })
    }
}
//pridanie do html
window.customElements.define('name-day', NameDay);




// Funkcionalita počítania návštev užívatela (cookies) + webkomponent
let numberOfAccess = 1;

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


const templateForCounter = document.createElement('template');
templateForCounter.innerHTML =
    `<div>
  <p id="visit"></p>
</div>
`;

class countVisits extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(templateForCounter.content.cloneNode(true));
    }

    connectedCallback() {
        document.addEventListener("DOMContentLoaded", () => {
            var accessCookie = getCookie("accessCookie");
            if (accessCookie != "") {
                let tmp = parseInt(accessCookie);
                tmp = tmp + 1;
                setCookie("accessCookie", tmp, 365);

            } else {
                setCookie("accessCookie", numberOfAccess, 365);

            }


            let text = this.shadowRoot.querySelector('#visit')
            text.innerText = "Našu stránku ste za posledný rok navštívili " + getCookie("accessCookie") + "-krát";


        });


    }
}
window.customElements.define('count-visit', countVisits);