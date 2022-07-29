var libData = {};

function saveCalendar () {
    /*! ics.js Wed Sept 14 2017 */
    var ics=function(e,t){"use strict";{if(!(navigator.userAgent.indexOf("MSIE")>-1&&-1==navigator.userAgent.indexOf("MSIE 10"))){void 0===e&&(e="default"),void 0===t&&(t="Calendar");var r=-1!==navigator.appVersion.indexOf("Win")?"\r\n":"\n",n=[],i=["BEGIN:VCALENDAR","PRODID:"+t,"VERSION:2.0"].join(r),o=r+"END:VCALENDAR",a=["SU","MO","TU","WE","TH","FR","SA"];return{events:function(){return n},calendar:function(){return i+r+n.join(r)+o},addEvent:function(t,i,o,l,u,s){if(void 0===t||void 0===i||void 0===o||void 0===l||void 0===u)return!1;if(s&&!s.rrule){if("YEARLY"!==s.freq&&"MONTHLY"!==s.freq&&"WEEKLY"!==s.freq&&"DAILY"!==s.freq)throw"Recurrence rrule frequency must be provided and be one of the following: 'YEARLY', 'MONTHLY', 'WEEKLY', or 'DAILY'";if(s.until&&isNaN(Date.parse(s.until)))throw"Recurrence rrule 'until' must be a valid date string";if(s.interval&&isNaN(parseInt(s.interval)))throw"Recurrence rrule 'interval' must be an integer";if(s.count&&isNaN(parseInt(s.count)))throw"Recurrence rrule 'count' must be an integer";if(void 0!==s.byday){if("[object Array]"!==Object.prototype.toString.call(s.byday))throw"Recurrence rrule 'byday' must be an array";if(s.byday.length>7)throw"Recurrence rrule 'byday' array must not be longer than the 7 days in a week";s.byday=s.byday.filter(function(e,t){return s.byday.indexOf(e)==t});for(var c in s.byday)if(a.indexOf(s.byday[c])<0)throw"Recurrence rrule 'byday' values must include only the following: 'SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'"}}var g=new Date(l),d=new Date(u),f=new Date,S=("0000"+g.getFullYear().toString()).slice(-4),E=("00"+(g.getMonth()+1).toString()).slice(-2),v=("00"+g.getDate().toString()).slice(-2),y=("00"+g.getHours().toString()).slice(-2),A=("00"+g.getMinutes().toString()).slice(-2),T=("00"+g.getSeconds().toString()).slice(-2),b=("0000"+d.getFullYear().toString()).slice(-4),D=("00"+(d.getMonth()+1).toString()).slice(-2),N=("00"+d.getDate().toString()).slice(-2),h=("00"+d.getHours().toString()).slice(-2),I=("00"+d.getMinutes().toString()).slice(-2),R=("00"+d.getMinutes().toString()).slice(-2),M=("0000"+f.getFullYear().toString()).slice(-4),w=("00"+(f.getMonth()+1).toString()).slice(-2),L=("00"+f.getDate().toString()).slice(-2),O=("00"+f.getHours().toString()).slice(-2),p=("00"+f.getMinutes().toString()).slice(-2),Y=("00"+f.getMinutes().toString()).slice(-2),U="",V="";y+A+T+h+I+R!=0&&(U="T"+y+A+T,V="T"+h+I+R);var B,C=S+E+v+U,j=b+D+N+V,m=M+w+L+("T"+O+p+Y);if(s)if(s.rrule)B=s.rrule;else{if(B="rrule:FREQ="+s.freq,s.until){var x=new Date(Date.parse(s.until)).toISOString();B+=";UNTIL="+x.substring(0,x.length-13).replace(/[-]/g,"")+"000000Z"}s.interval&&(B+=";INTERVAL="+s.interval),s.count&&(B+=";COUNT="+s.count),s.byday&&s.byday.length>0&&(B+=";BYDAY="+s.byday.join(","))}(new Date).toISOString();var H=["BEGIN:VEVENT","UID:"+n.length+"@"+e,"CLASS:PUBLIC","DESCRIPTION:"+i,"DTSTAMP;VALUE=DATE-TIME:"+m,"DTSTART;VALUE=DATE-TIME:"+C,"DTEND;VALUE=DATE-TIME:"+j,"LOCATION:"+o,"SUMMARY;LANGUAGE=en-us:"+t,"TRANSP:TRANSPARENT","END:VEVENT"];return B&&H.splice(4,0,B),H=H.join(r),n.push(H),H},download:function(e,t){if(n.length<1)return!1;t=void 0!==t?t:".ics",e=void 0!==e?e:"calendar";var a,l=i+r+n.join(r)+o;if(-1===navigator.userAgent.indexOf("MSIE 10"))a=new Blob([l]);else{var u=new BlobBuilder;u.append(l),a=u.getBlob("text/x-vCalendar;charset="+document.characterSet)}return saveAs(a,e+t),l},build:function(){return!(n.length<1)&&i+r+n.join(r)+o}}}console.log("Unsupported Browser")}};

    let form = document.getElementById("calendar-selection");
    

    // var cal = ics();
    // cal.addEvent(subject, description, location, begin, end);
    // cal.addEvent(subject, description, location, begin, end);
    // cal.download(filename);
}

function loadLibrary () {
    let libFile = new Blob(document.getElementById("libFile").files, {type:"application/json"});

    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        let libText = event.target.result;
        libData = JSON.parse(libText)
        console.log(libData);

        resetForm();
    });
    reader.readAsText(libFile);
}

function resetForm() {
    let form = document.getElementById("calendar-selection");
    let calendarMonth = form.elements["calMonth"].value;
    let calendarYear = form.elements["calYear"].value;
    form.reset();
    setMonth(calendarMonth, calendarYear);
    updateShortcutSelection();
    disableShortcut(false);
    activateCalendar();
}

function updateShortcutSelection() {
    let shortcutSelection = document.getElementById("shortcutSelection");
    let options = shortcutSelection.getElementsByTagName('option');

    while (options.length > 1) {
        shortcutSelection.removeChild(options[1]);
    }

    shortcutSelection.selectedIndex = 0;

    for (let short in libData) {
        var opt = document.createElement('option');
        opt.value = short;
        opt.innerHTML = short + " - " + libData[short]["subject"];
        shortcutSelection.appendChild(opt);
    }
}

function makeCalendar () {
    let form = document.getElementById("calendar-selection");
    let calendarMonth = form.elements["calMonth"].value;
    let calendarYear = form.elements["calYear"].value;

    var cellTemp = document.getElementById("cellTemp");
    var emptyTemp = document.getElementById("emptyTemp");

    var container = document.getElementById("container-calendar");

    var new_container = document.createElement("div");

    let daysPerWeek = 7;
    let daysPerMonth = daysInMonth(calendarMonth, calendarYear);
    let startIndex = weekdayOfMonth(calendarMonth, calendarYear);
    let weeksPerMonth = (startIndex + daysPerMonth) / daysPerWeek;

    for (let i = 0; i < weeksPerMonth; i++) {
        let row = document.createElement("div");
        row.classList.add("row", "mx-0");
        for (let j = 0; j < daysPerWeek; j++) {
            let dayCount = i * daysPerWeek + j + 1;
            let isDay = dayCount > startIndex && dayCount <= (startIndex + daysPerMonth);
            let node = isDay ?  cellTemp: emptyTemp;
            let cell = document.importNode(node.content, true);
            if (isDay) {
                cell.querySelectorAll("button")[0].addEventListener("click", function() { dayClick(this) });
                cell.querySelectorAll("label")[0].innerHTML = (dayCount - startIndex) + "." + calendarMonth + ".";
            }

            // cell.querySelectorAll("input")[0].disabled = true;
            row.appendChild(cell);
        }
        new_container.appendChild(row);
    }

    console.log(container.querySelectorAll("div"));

    container.replaceChild(new_container, container.querySelectorAll("div")[1]);
}

function activateCalendar () {
    let activate = document.getElementById("shortcutSelection").value;
    console.log(activate);
    let container = document.getElementById("container-calendar");
    container.style.pointerEvents = activate ? "all" : "none";
    container.style.opacity = activate ? 1 : .5;
    container.style.filter = activate ? "initial" : "blur(1px)";

}

function dayClick (btn) {
    console.log("You clicked me!");
    let textarea = btn.querySelectorAll("textarea")[0];
    let insertMode = document.getElementById("dayInsert").checked;

    if (insertMode) {

        let form = document.getElementById("calendar-selection");
        let shortcut = form.elements["shortcutSelection"].value;

        if (!shortcut) { return }

        console.log(textarea.value.split("\n"));

        if (textarea.value.split("\n").includes(shortcut)) { return }

        if (textarea.value) { textarea.value += "\n" }
        textarea.value += shortcut;
    } else {
        textarea.value = "";
    }
}

function daysInMonth (month, year) {
    return new Date(year, month, 0).getDate();
}

function weekdayOfMonth (month, year) {
    return new Date(year, month - 1, 1).getDay() - 1;
}

function setMonth (month, year) {
    let form = document.getElementById("calendar-selection");
    form.elements["calMonth"].value = month ? month : new Date().getMonth() + 1;
    form.elements["calYear"].value = year ? year : new Date().getFullYear();
}

function disableShortcut(disable) {
    document.getElementById("shortcutSelection").disabled = disable;
}
