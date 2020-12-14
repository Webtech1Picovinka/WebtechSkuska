//webkomponent 3-urovnove menu
class MyComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <ul class="top-level-menu">
            <li>
            <a href="html/tim.html">Tím</a>
            <ul class="second-level-menu">
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
        `;
    }
}
customElements.define('menu-menu', MyComponent);



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

    //toto ani srnka netusi naco to tu je, ale asi nejaky konstruktor
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
            customName = this.shadowRoot.querySelector('#customName');


        //nacitanie xml suboru s meninami cez fetch()
        fetch("resources/meniny.xml")
            .then(function(resp) {
                return resp.text();
            })
            //
            .then(function(data) {
                // Toto je elektro ty omezený ko-kot-ko, najlepší hip hop festival tu robí jo-po-po
                var parser = new DOMParser();
                // nacitanie xml suboru do premennej xmlDoc
                var xmlDoc = parser.parseFromString(data, "text/xml");
                var i = 0,
                    day, today = new Date(),
                    todayDay = today.getDate(), //vrati den v mesiaci
                    todayMonth = today.getMonth() + 1; // getMonth() vracia mesiace od 0-januar po 11-december, preto + 1

                //prehladavanie celeho suboru, strasne neefektivne, lepsie by bolo dat to do pola a ptm porovnavat s polom, ale neoplati sa s tym trapit, body za to nestrhnu hadam
                while (i < xmlDoc.getElementsByTagName("zaznam").length) {

                    day = xmlDoc.getElementsByTagName("den")[i];
                    // ak sa dnesny datum zhoduje s datumom v tagu <den> v xml subore, vypise ho aj s meninami
                    if (day.innerHTML === "" + todayMonth + todayDay) {

                        todayName.innerText = "Dnes " + todayDay + "." + todayMonth + "." + " má meniny " + day.nextElementSibling.innerHTML;
                    }
                    i++;
                }

                // to iste ako vyssie, len to berie custom datum, nie dnesny datum
                // pridanie addeventlisteneru, ak sa datum v inpute zmeni, treba prehladat subor a najst nove meno
                customDate.addEventListener('change', () => {
                    // spracovanie udajov zo vstupu
                    var i = 0,
                        dayXML,
                        regex = new RegExp("^\\d{1,2}[.]\\d{1,2}[.]$", "g"),//prepusti len platny datum bez roku oddeleny bodkami
                        customDateVal = customDate.value,
                        correctDate = regex.test(customDate.value), // true ak splna podmienky regexu, inak false
                        splitstring = customDate.value.split('.');//rozdeli vstupny string do pola, oddelovac je bodka
                
                    // uprava dna a mesiaca z vstupu
                    if (splitstring[0] && splitstring[0].length == 1){// ak uzivatel zada napr 1.1. tak to zmeni na 01.1. aby to ptm vedel najst v xml
                        
                        splitstring[0] ="0" + splitstring[0];
                    }
                    if (splitstring[1] && splitstring[1].length == 1){// ak uzivatel zada napr 1.1. tak to zmeni na 1.01. aby to ptm vedel najst v xml
                        
                        splitstring[1] ="0" + splitstring[1];
                    }

                    // ak je datum spravny, prehladava sa xml
                    if(correctDate == true  &&  (splitstring[0] <= 31 && splitstring[0] > 0)   &&  (splitstring[1] <= 12 && splitstring[1] > 0)) {
                        
                        invalidDate.style.display = 'none'; // ak je datum spravny, napoveda sa skryje

                        while (i < xmlDoc.getElementsByTagName("zaznam").length) {//pokial je i mensie ako pocet tagov <zaznam> v xml

                            dayXML = xmlDoc.getElementsByTagName("den")[i];//do dayXML sa vlozi datum aktualneho tagu v xml
                            if (dayXML.innerHTML === ("" + splitstring[1] + splitstring[0])) {
                                customDateTag.style.visibility = 'visible';
                                customDateTag.innerText = splitstring[0] + "." + splitstring[1] + ". má meniny " + dayXML.nextElementSibling.innerHTML;
                                break;
                            }
                            i++;
                        }
                    }
                    else{
                        //ak je datum nespravne zadany, zobrazi sa napoveda
                        invalidDate.style.display = 'block';
                    }
                });

                //zase to iste co vyssie, ale tu hlada podla menin a vypisuje den kedy ma ten šupák meniny
                customName.addEventListener('change', () => {
                    var inputName = customName.value;
                    var inputNameCapital = inputName[0].toUpperCase() + inputName.slice(1);
                    var i = 0,
                        nameXML, dateXML;
                    
                    //maximalne ide len pocetDniKedyMaNiektoMeniny-krat, lebo nie kazdy den ma niekto meniny - napr 1.1.
                    while (i < xmlDoc.getElementsByTagName("SK").length) { //pokial je i mensie ako pocet tagov <SK> v xml (tag <SK> = meniny na SVK)
                        nameXML = xmlDoc.getElementsByTagName("SK")[i];
                        //previousElementSibling zobrazi predchadzajuceho surodenca tagu <SK> v xml subore
                        dateXML = nameXML.previousElementSibling.innerHTML;
                        if (nameXML.innerHTML.includes(inputNameCapital)) { // ak meno obsahuje substring ktory sme zadali, vypise
                            customNameTag.style.visibility = 'visible';
                            customNameTag.innerText = nameXML.innerHTML + " má meniny " + dateXML.slice(2, 4) + "." + dateXML.slice(0, 2) + ".";
                                                                                                //slice(start, end) orezava dany string
                            break;
                        }
                        i++;
                    }
                });
            })
    }
}
//pridanie do html
window.customElements.define('name-day', NameDay);

// Funkcionalita počítania návštev užívatela (cookies) + webkomponent
// Dano to len ujebal z netu ale ticho
let numberOfAccess = 1;

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
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

class countVisits  extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(templateForCounter.content.cloneNode(true));
    }

    // Toto je elektro ty omezený ko-kot-ko,
    // najlepší hip hop festival tu robí jo-po-po,
    // jak hovorí Rosaldo Rytmus je king po po-po-po,
    // big mikiny, šiltovky, kapsáče dovi dopo yeau,
    // každý dávno pochopil, že já udávam štýýl,
    // ja chcem robiť párty za love a to je re-re-real,
    // nikdy som sa žádnému gadžovi neprosiil,
    // tak si pusti Wu-Tang keď si to nepochopiil,
    // myslite si že to budem robiť podla vás,
    // hateri sú v piči já zarabámm ešte váááác,
    // popritom si spievam iba také nananáá,
    // s týmto textom mi pomáhala moja mamááááá.

    connectedCallback() {
      document.addEventListener("DOMContentLoaded", ()=>{
        var accessCookie = getCookie("accessCookie");
        if (accessCookie != "") {
          let tmp = parseInt(accessCookie);
          tmp = tmp+1;
          setCookie("accessCookie",tmp,365);
            
        } else {
          setCookie("accessCookie", numberOfAccess, 365);
            
        }
        
        
        let text = this.shadowRoot.querySelector('#visit')
        text.innerText = "Našu stránku ste za posledný rok navštívili " + getCookie("accessCookie")  +"-krát";
        
      
      });
      

    }
}
window.customElements.define('count-visit', countVisits);
