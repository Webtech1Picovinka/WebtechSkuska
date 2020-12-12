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
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        var todayName = this.shadowRoot.querySelector('#nameday');

        var customDayTag = this.shadowRoot.querySelector('#customdaytag');
        var customDate = this.shadowRoot.querySelector('#customDate');

        var customNameTag = this.shadowRoot.querySelector('#customnametag');
        var customName = this.shadowRoot.querySelector('#customName');

        fetch("resources/meniny.xml")
            .then(function(resp){
                return resp.text();
            })
            .then(function(data){

                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(data, "text/xml");
                var i = 0, day, today = new Date(), todayMonth = today.getMonth() + 1, todayDay = today.getDate();

                var todayMonth = today.getMonth() + 1;
                while(i < xmlDoc.getElementsByTagName("zaznam").length){
                    day = xmlDoc.getElementsByTagName("den")[i];
                    if(day.innerHTML === "" + todayMonth + todayDay){
                        todayName.innerText = "Dnes " + todayDay + "." + todayMonth + "." + " má meniny " + day.nextElementSibling.innerHTML;
                    }
                    i++;
                }

                customDate.addEventListener('change', () => {
                    var customMonth = customDate.value.slice(5,7);
                    var customDay = customDate.value.slice(8,10);
                    var customDateString = String(customMonth + customDay);
                    var i = 0, dayXML;
                    while(i < xmlDoc.getElementsByTagName("zaznam").length){
                        dayXML = xmlDoc.getElementsByTagName("den")[i];
                        if(dayXML.innerHTML === customDateString){
                            customDayTag.innerText = customDay + "." + customMonth + ". pije "  + dayXML.nextElementSibling.innerHTML;
                            break;
                        }
                        i++;
                    }                
                });

                customName.addEventListener('change', () => {
                    var inputName = customName.value;
                    var inputNameCapital = inputName[0].toUpperCase() + inputName.slice(1);
                    var i = 0, nameXML, dateXML;
                    while(i < xmlDoc.getElementsByTagName("SK").length){
                        nameXML = xmlDoc.getElementsByTagName("SK")[i];
                        dateXML = nameXML.previousElementSibling.innerHTML;
                        if(nameXML.innerHTML.includes(inputNameCapital)){

                            customNameTag.innerText = nameXML.innerHTML + " slope "  + dateXML.slice(2,4) + "." + dateXML.slice(0,2) + ".";
                            break;
                        }
                        i++;
                    }                
                });
            })
    }
}
window.customElements.define('name-day', NameDay);