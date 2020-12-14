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
        <h3 id="nameday"></h3>

        <!-- zadanie custom datumu pre ktory chceme meniny -->
        <div class="form-group">
            <label for="customDate">Vyberte dátum</label>
            <input type="date" id="customDate" class="form-control col-6"  name="customDate" placeholder="Zadajte dátum -> dd.mm.">
        </div>

        <!-- vypis menin vybraneho dna aj s datumom -->
        <h3 id="customdaytag"></h3>

        <!-- zadanie mena pre ktore chceme zistit datum -->
        <div class="form-group">
            <label for="customName">Napíšte meno</label>
            <input type="text" id="customName" class="form-control col-6" name="customName" placeholder="Zadajte meno">
        </div>

        <!-- vypis dna kedy ma vybrane meno meniny aj s menom -->
        <h3 id="customnametag"></h3>

        <!-- import bootstrapu do custom elementu -->
        <style>
            @import url('https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css')

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
        var todayName = this.shadowRoot.querySelector('#nameday');

        var customDayTag = this.shadowRoot.querySelector('#customdaytag');
        var customDate = this.shadowRoot.querySelector('#customDate');

        var customNameTag = this.shadowRoot.querySelector('#customnametag');
        var customName = this.shadowRoot.querySelector('#customName');

        //nacitanie xml suboru s meninami cez fetch()
        fetch("resources/meniny.xml")
            .then(function(resp) {
                return resp.text();
            })
            //
            .then(function(data) {
                // Toto je elektro ty omezený ko-kot-ko, najlepší hip hop festival tu robí jo-po-po,
                var parser = new DOMParser();
                // nacitanie xml suboru do premennej xmlDoc
                var xmlDoc = parser.parseFromString(data, "text/xml");
                var i = 0,
                    day, today = new Date(),
                    todayDay = today.getDate(), //vrati den v mesiaci
                    todayMonth = today.getMonth() + 1; // getMonth() vracia mesiace od 0-januar po 11-december, preto + 1

                //prehladavanie celeho suboru, strasne neefektivne lebo sa to robi spolu 3x, lepsie by bolo dat to do pola a ptm porovnavt s polom, ale neoplati sa s tym trapit, body za to nestrhnu hadam
                while (i < xmlDoc.getElementsByTagName("zaznam").length) {
                    day = xmlDoc.getElementsByTagName("den")[i];
                    // ak sa dnesny datum zhoduje s datumom v tagu <den> v xml subore, vypise ho aj s meninami
                    if (day.innerHTML === "" + todayMonth + todayDay) {
                        todayName.innerText = "Kto sa dnes " + todayDay + "." + todayMonth + "." + " nachňápe jak riť?  --> " + day.nextElementSibling.innerHTML;
                    }
                    i++;
                }

                // to iste ako vyssie, len to berie custom datum, nie dnesny datum
                // pridanie addeventlisteneru, ak sa datum v inpute zmeni, treba prehladat subor a najst nove meno
                customDate.addEventListener('change', () => {
                    // spracovanie udajov zo vstupu, datum musi byt v presnom formate, trebalo by prerobit podla zadania
                    var customMonth = customDate.value.slice(5, 7), //slice(start, end) orezava dany string
                        customDay = customDate.value.slice(8, 10),
                        customDateString = String(customMonth + customDay),
                        i = 0,
                        dayXML;

                    //pokus spravit validaciu datumu cez regex, ak sa o to niekto pokusa tak treba v template zmenit <input id="customDate">
                                                    // z typu date na text, aby sa dal zadat custom datum ako text nie len vyberat z kalendara
                    // customDate = customDate.value;
                    // var regex = new RegExp("^([0-3])?[0-9][.]([0-1])?[0-12][.]$");
                    // if(regex.test(customDate)){

                    //prehladavanie suboru, dokym nenajde meno v dany datum
                    while (i < xmlDoc.getElementsByTagName("zaznam").length) {
                        dayXML = xmlDoc.getElementsByTagName("den")[i];
                        if (dayXML.innerHTML === customDateString) {
                            customDayTag.innerText = customDay + "." + customMonth + ". sa dobľuje " + dayXML.nextElementSibling.innerHTML;
                            break;
                        }
                        i++;
                    }
                    // }
                });

                //zase to iste co vyssie, ale tu hlada podla menin a vypisuje den kedy ma ten šupák meniny
                customName.addEventListener('change', () => {
                    var inputName = customName.value;
                    var inputNameCapital = inputName[0].toUpperCase() + inputName.slice(1);
                    var i = 0,
                        nameXML, dateXML;
                    
                    //maximalne ide len pocetDniKedyMaNiektoMeniny-krat, lebo nie kazdy den ma niekto meniny - napr 1.1.
                    while (i < xmlDoc.getElementsByTagName("SK").length) {
                        nameXML = xmlDoc.getElementsByTagName("SK")[i];
                        //previousElementSibling zobrazi predchadzajuceho surodenca tagu v xml subore
                        dateXML = nameXML.previousElementSibling.innerHTML;
                        if (nameXML.innerHTML.includes(inputNameCapital)) { // ak meno obsahuje substring ktory sme zadali, vypise
                            customNameTag.innerText = nameXML.innerHTML + " sa zruší " + dateXML.slice(2, 4) + "." + dateXML.slice(0, 2) + ".";
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
