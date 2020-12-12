class MyComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <ul class="top-level-menu">
            <li>
            <a href="#">Tím</a>
            <ul class="second-level-menu">
                <li><a href="#">Daniel Nošík</a>
                    <ul class="third-level-menu">
                        <li><a href="#">Hra</a></li>
                        <li><a href="#">Životopis</a></li>
                    </ul>
                </li>
                <li><a href="#">Jakub Petrík</a>
                    <ul class="third-level-menu">
                        <li><a href="#">Hra</a></li>
                        <li><a href="#">Životopis</a></li>
                    </ul>
                </li>
                <li><a href="#">Martin Žofčík</a>
                    <ul class="third-level-menu">
                        <li><a href="#">Hra</a></li>
                        <li><a href="#">Životopis</a></li>
                    </ul>
                </li>
                <li><a href="#">Miroslav Kopecký</a>
                    <ul class="third-level-menu">
                        <li><a href="#">Hra</a></li>
                        <li><a href="#">Životopis</a></li>
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
template.innerHTML =
    `   <div>
        <h2 id="nameday"></h2>

        <input type="date" id="customDate"></input>

        <h2 id="customdaytag"></h2>

        <input type="text" id="customName"></input>

        <h2 id="customnametag"></h2>


        <style></style>
    </div> 
`;


class NameDay extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        var todayName = this.shadowRoot.querySelector('#nameday');

        var customDayTag = this.shadowRoot.querySelector('#customdaytag');
        var customDate = this.shadowRoot.querySelector('#customDate');

        var customNameTag = this.shadowRoot.querySelector('#customnametag');
        var customName = this.shadowRoot.querySelector('#customName');

        fetch("resources/meniny.xml")
            .then(function(resp) {
                return resp.text();
            })
            .then(function(data) {

                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(data, "text/xml");
                var i = 0,
                    day, today = new Date(),
                    todayMonth = today.getMonth() + 1,
                    todayDay = today.getDate();

                var todayMonth = today.getMonth() + 1;
                while (i < xmlDoc.getElementsByTagName("zaznam").length) {
                    day = xmlDoc.getElementsByTagName("den")[i];
                    if (day.innerHTML === "" + todayMonth + todayDay) {
                        todayName.innerText = "Kto sa dnes " + todayDay + "." + todayMonth + "." + " nachňápe jak Rus?  --> " + day.nextElementSibling.innerHTML;
                    }
                    i++;
                }

                customDate.addEventListener('change', () => {
                    var customMonth = customDate.value.slice(5, 7);
                    var customDay = customDate.value.slice(8, 10);
                    var customDateString = String(customMonth + customDay);
                    var i = 0,
                        dayXML;
                    while (i < xmlDoc.getElementsByTagName("zaznam").length) {
                        dayXML = xmlDoc.getElementsByTagName("den")[i];
                        if (dayXML.innerHTML === customDateString) {
                            customDayTag.innerText = customDay + "." + customMonth + ". sa dobľuje " + dayXML.nextElementSibling.innerHTML;
                            break;
                        }
                        i++;
                    }
                });

                customName.addEventListener('change', () => {
                    var inputName = customName.value;
                    var inputNameCapital = inputName[0].toUpperCase() + inputName.slice(1);
                    var i = 0,
                        nameXML, dateXML;
                    while (i < xmlDoc.getElementsByTagName("SK").length) {
                        nameXML = xmlDoc.getElementsByTagName("SK")[i];
                        dateXML = nameXML.previousElementSibling.innerHTML;
                        if (nameXML.innerHTML.includes(inputNameCapital)) {

                            customNameTag.innerText = nameXML.innerHTML + " sa zruší " + dateXML.slice(2, 4) + "." + dateXML.slice(0, 2) + ".";
                            break;
                        }
                        i++;
                    }
                });
            })
    }
}
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
        text.innerText = "Našu stránku ste za poseldný rok navštívili " + getCookie("accessCookie")  +"-krát";
        
      
      });
      

    }
}
window.customElements.define('count-visit', countVisits);
