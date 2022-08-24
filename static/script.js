let data = {};

let date = new Date();
Object.defineProperty(data, "date", {
    set(newDate) {
        date = newDate;
        updateCalendar();
    },
    get() { return date; }
});

let library = {};
Object.defineProperty(data, "library", {
    set(newLibrary) {
        if (Object.keys(library).length === 0) {
            toggleNavOnInput();
            activateNode("calendar-shortcut");
        };
        library = newLibrary;
        updateShortcutSelection();
        updateShortcutCards();
        updateLocationList();
    },
    get() { return library; }
});

/* https://github.com/nwcell/FileSaver.js */
/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
var saveAs=saveAs||function(e){"use strict";if(typeof e==="undefined"||typeof navigator!=="undefined"&&/MSIE [1-9]\./.test(navigator.userAgent)){return}var t=e.document,n=function(){return e.URL||e.webkitURL||e},r=t.createElementNS("http://www.w3.org/1999/xhtml","a"),o="download"in r,a=function(e){var t=new MouseEvent("click");e.dispatchEvent(t)},i=/constructor/i.test(e.HTMLElement)||e.safari,f=/CriOS\/[\d]+/.test(navigator.userAgent),u=function(t){(e.setImmediate||e.setTimeout)(function(){throw t},0)},s="application/octet-stream",d=1e3*40,c=function(e){var t=function(){if(typeof e==="string"){n().revokeObjectURL(e)}else{e.remove()}};setTimeout(t,d)},l=function(e,t,n){t=[].concat(t);var r=t.length;while(r--){var o=e["on"+t[r]];if(typeof o==="function"){try{o.call(e,n||e)}catch(a){u(a)}}}},p=function(e){if(/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)){return new Blob([String.fromCharCode(65279),e],{type:e.type})}return e},v=function(t,u,d){if(!d){t=p(t)}var v=this,w=t.type,m=w===s,y,h=function(){l(v,"writestart progress write writeend".split(" "))},S=function(){if((f||m&&i)&&e.FileReader){var r=new FileReader;r.onloadend=function(){var t=f?r.result:r.result.replace(/^data:[^;]*;/,"data:attachment/file;");var n=e.open(t,"_blank");if(!n)e.location.href=t;t=undefined;v.readyState=v.DONE;h()};r.readAsDataURL(t);v.readyState=v.INIT;return}if(!y){y=n().createObjectURL(t)}if(m){e.location.href=y}else{var o=e.open(y,"_blank");if(!o){e.location.href=y}}v.readyState=v.DONE;h();c(y)};v.readyState=v.INIT;if(o){y=n().createObjectURL(t);setTimeout(function(){r.href=y;r.download=u;a(r);h();c(y);v.readyState=v.DONE});return}S()},w=v.prototype,m=function(e,t,n){return new v(e,t||e.name||"download",n)};if(typeof navigator!=="undefined"&&navigator.msSaveOrOpenBlob){return function(e,t,n){t=t||e.name||"download";if(!n){e=p(e)}return navigator.msSaveOrOpenBlob(e,t)}}w.abort=function(){};w.readyState=w.INIT=0;w.WRITING=1;w.DONE=2;w.error=w.onwritestart=w.onprogress=w.onwrite=w.onabort=w.onerror=w.onwriteend=null;return m}(typeof self!=="undefined"&&self||typeof window!=="undefined"&&window||this.content);if(typeof module!=="undefined"&&module.exports){module.exports.saveAs=saveAs}else if(typeof define!=="undefined"&&define!==null&&define.amd!==null){define("FileSaver.js",function(){return saveAs})};

function saveCalendar () {
    let filenameInput = document.getElementById("calendar-filename-input");
    if (!checkForm(filenameInput.form)) { return };
    filenameInput.form.classList.remove("was-validated");
    let filename = filenameInput.value;

    /* https://github.com/nwcell/ics.js */
    /*! ics.js Wed Aug 20 2014 17:23:02 */
    var ics=function(e,t){"use strict";{if(!(navigator.userAgent.indexOf("MSIE")>-1&&-1==navigator.userAgent.indexOf("MSIE 10"))){void 0===e&&(e="default"),void 0===t&&(t="Calendar");var r=-1!==navigator.appVersion.indexOf("Win")?"\r\n":"\n",n=[],i=["BEGIN:VCALENDAR","PRODID:"+t,"VERSION:2.0"].join(r),o=r+"END:VCALENDAR",a=["SU","MO","TU","WE","TH","FR","SA"];return{events:function(){return n},calendar:function(){return i+r+n.join(r)+o},addEvent:function(t,i,o,l,u,s){if(void 0===t||void 0===i||void 0===o||void 0===l||void 0===u)return!1;if(s&&!s.rrule){if("YEARLY"!==s.freq&&"MONTHLY"!==s.freq&&"WEEKLY"!==s.freq&&"DAILY"!==s.freq)throw"Recurrence rrule frequency must be provided and be one of the following: 'YEARLY', 'MONTHLY', 'WEEKLY', or 'DAILY'";if(s.until&&isNaN(Date.parse(s.until)))throw"Recurrence rrule 'until' must be a valid date string";if(s.interval&&isNaN(parseInt(s.interval)))throw"Recurrence rrule 'interval' must be an integer";if(s.count&&isNaN(parseInt(s.count)))throw"Recurrence rrule 'count' must be an integer";if(void 0!==s.byday){if("[object Array]"!==Object.prototype.toString.call(s.byday))throw"Recurrence rrule 'byday' must be an array";if(s.byday.length>7)throw"Recurrence rrule 'byday' array must not be longer than the 7 days in a week";s.byday=s.byday.filter(function(e,t){return s.byday.indexOf(e)==t});for(var c in s.byday)if(a.indexOf(s.byday[c])<0)throw"Recurrence rrule 'byday' values must include only the following: 'SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'"}}var g=new Date(l),d=new Date(u),f=new Date,S=("0000"+g.getFullYear().toString()).slice(-4),E=("00"+(g.getMonth()+1).toString()).slice(-2),v=("00"+g.getDate().toString()).slice(-2),y=("00"+g.getHours().toString()).slice(-2),A=("00"+g.getMinutes().toString()).slice(-2),T=("00"+g.getSeconds().toString()).slice(-2),b=("0000"+d.getFullYear().toString()).slice(-4),D=("00"+(d.getMonth()+1).toString()).slice(-2),N=("00"+d.getDate().toString()).slice(-2),h=("00"+d.getHours().toString()).slice(-2),I=("00"+d.getMinutes().toString()).slice(-2),R=("00"+d.getMinutes().toString()).slice(-2),M=("0000"+f.getFullYear().toString()).slice(-4),w=("00"+(f.getMonth()+1).toString()).slice(-2),L=("00"+f.getDate().toString()).slice(-2),O=("00"+f.getHours().toString()).slice(-2),p=("00"+f.getMinutes().toString()).slice(-2),Y=("00"+f.getMinutes().toString()).slice(-2),U="",V="";y+A+T+h+I+R!=0&&(U="T"+y+A+T,V="T"+h+I+R);var B,C=S+E+v+U,j=b+D+N+V,m=M+w+L+("T"+O+p+Y);if(s)if(s.rrule)B=s.rrule;else{if(B="rrule:FREQ="+s.freq,s.until){var x=new Date(Date.parse(s.until)).toISOString();B+=";UNTIL="+x.substring(0,x.length-13).replace(/[-]/g,"")+"000000Z"}s.interval&&(B+=";INTERVAL="+s.interval),s.count&&(B+=";COUNT="+s.count),s.byday&&s.byday.length>0&&(B+=";BYDAY="+s.byday.join(","))}(new Date).toISOString();var H=["BEGIN:VEVENT","UID:"+n.length+"@"+e,"CLASS:PUBLIC","DESCRIPTION:"+i,"DTSTAMP;VALUE=DATE-TIME:"+m,"DTSTART;VALUE=DATE-TIME:"+C,"DTEND;VALUE=DATE-TIME:"+j,"LOCATION:"+o,"SUMMARY;LANGUAGE=en-us:"+t,"TRANSP:TRANSPARENT","END:VEVENT"];return B&&H.splice(4,0,B),H=H.join(r),n.push(H),H},download:function(e,t){if(n.length<1)return!1;t=void 0!==t?t:".ics",e=void 0!==e?e:"calendar";var a,l=i+r+n.join(r)+o;if(-1===navigator.userAgent.indexOf("MSIE 10"))a=new Blob([l]);else{var u=new BlobBuilder;u.append(l),a=u.getBlob("text/x-vCalendar;charset="+document.characterSet)}return saveAs(a,e+t),l},build:function(){return!(n.length<1)&&i+r+n.join(r)+o}}}console.log("Unsupported Browser")}};

    var cal = ics();
    
    let [month, year] = [data.date.getMonth(), data.date.getFullYear()];
    let input = document.getElementById("calendar-input").querySelectorAll("textarea");

    for (let i = 0; i < input.length; i++) {
        let textarea = input[i];

        let shortcuts = textarea.value.split("\n");
        let day = i + 1;

        if (shortcuts[0]) {
            for (let j = 0; j < shortcuts.length; j++) {
                let element = library[shortcuts[j]];

                let subject = element["subject"];
                let description = element["description"];
                let location = element["location"];
                let [begin, end] = getTimeString(year, month, day, element["time"]);

                cal.addEvent(subject, description, location, begin, end);
            };
        };
    };
    cal.download(filename);
}

function saveLibrary () {
    let filenameInput = document.getElementById("library-filename-input");
    if (!checkForm(filenameInput.form)) { return };
    if (Object.keys(library).length === 0) { return };

    let filename = filenameInput.value + ".ucal";

    var blob = new Blob([JSON.stringify(data.library)], {type: "text/plain;charset=utf-8"});
    saveAs(blob, filename);
}

function loadLibrary () {
    let libraryFile = new Blob(document.getElementById("library-file-input").files, {type:"application/json"});
    let libraryFilename = document.getElementById("library-file-input").value.split("/").pop().split("\\").pop().split(".")[0];

    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        document.getElementById("library-filename-input").value = libraryFilename;
        data.library = JSON.parse(event.target.result);
    });
    reader.readAsText(libraryFile);
}

function addShortcut () {
    let form = document.getElementById("shortcut-form");
    if (!checkForm(form)) { return }

    var formData = {};

    formData["subject"] = form.elements["shortcut-subject"].value;

    if (form.elements["toggle-time"].checked) {
        formData["time"] = "all-day";
    } else {
        formData["time"] = correctTime(form.elements["shortcut-begin"].value)+"-"+correctTime(form.elements["shortcut-end"].value);
    };

    formData["location"] = form.elements["shortcut-location"].value;

    formData["description"] = form.elements["shortcut-description"].value;

    copyLibrary = { ...library };
    copyLibrary[form.elements["shortcut-shortcut"].value] = formData;
    data.library = copyLibrary;

    resetLibraryForm(form);

    if (!document.getElementById("library-download-tooltip").hasAttribute("data-promt")) {
        document.getElementById("library-download-tooltip").setAttribute("data-promt", "show");
        setTimeout(() => {
            document.getElementById("library-download-tooltip").setAttribute("data-promt", "shown");
        }, 3000);
    }
}

function updateCalendar () {
    updateDateInput();

    let [month, year] = [data.date.getMonth(), data.date.getFullYear()];

    var dayTemp = document.querySelector("template#template-calendar-day");

    var container = document.getElementById("calendar-input");

    var new_container = document.createElement("div");

    let daysInWeek = 7;
    let daysInMonth = new Date(year, month+1, 0).getDate();
    let firstDay = new Date(year, month, 1).getDay() || 7;
    let weeksInMonth = (firstDay + daysInMonth - 1) / daysInWeek;

    for (let i = 0; i < weeksInMonth; i++) {
        let week = document.createElement("div");
        week.classList.add("row", "mx-auto", "row-cols-7");

        for (let j = 1; j <= daysInWeek; j++) {
            let numberDay = i * daysInWeek + j;
            let calendarDay = numberDay - firstDay + 1;
            let isDay = calendarDay >= 1 && calendarDay <= daysInMonth;
            let node = document.importNode(dayTemp.content, true);
            if (isDay) {
                node.querySelector("button").addEventListener("click", dayInput);
                node.querySelector("label").innerHTML = (calendarDay) + "." + (month+1) + ".";
                node.querySelector("label").setAttribute("for", "calendar-day-"+calendarDay+"-"+(month+1)+"-"+year);
                node.querySelector("textarea").id = "calendar-day-"+calendarDay+"-"+(month+1)+"-"+year;
            } else {
                node.children[0].disabled = true;
                node.children[0].innerHTML = "";
            };
            week.appendChild(node);
        };
        new_container.appendChild(week);
    };
    container.replaceChildren(...new_container.childNodes);

    document.getElementById("calendar-change-tooltip").setAttribute("data-promt", "none");
}

function updateDateInput () {
    document.getElementById("calendar-date-input").value = getFormattedStringFromDate(data.date);
}


function toggleNavInit (e) {
    let showMode = e.currentTarget.getAttribute("data-nav");

    document.getElementById("calendar").hidden = showMode === "calendar" ? false : true;
    document.getElementById("library").hidden = showMode === "library" ? false : true;

    document.getElementById("navinit-toggle-calendar").disabled = showMode === "calendar" ? true : false;
    document.getElementById("navinit-toggle-library").disabled = showMode === "library" ? true : false;
    document.getElementById("navinit-toggle-newlibrary").disabled = showMode === "library" ? true : false;

    if (showMode === "library") {
        document.getElementById("shortcut-shortcut").focus();
    }
}

function toggleNav (e) {
    let showMode = (typeof e) === "string" ? e : e.currentTarget.getAttribute("data-nav");
    let toggledMode = document.getElementById(showMode).hidden;

    document.getElementById("calendar").hidden = showMode === "calendar" ? false : true;
    document.getElementById("calendar-nav").disabled = showMode === "calendar" ? true : false;
    document.getElementById("calendar-filename-input").disabled = showMode === "calendar" ? false : true;
    document.getElementById("calendar-save").hidden = showMode === "calendar" ? false : true;
    document.getElementById("calendar-edit").hidden = showMode === "calendar" ? true : false;

    document.getElementById("library").hidden = showMode === "library" ? false : true;
    document.getElementById("library-nav").disabled = showMode === "library" ? true : false;
    document.getElementById("library-filename-input").disabled = showMode === "library" ? false : true;
    document.getElementById("library-save").hidden = showMode === "library" ? false : true;
    document.getElementById("library-edit").hidden = showMode === "library" ? true : false;

    if (showMode === "library" && toggledMode) {
        document.getElementById("shortcut-shortcut").focus();
    }
}

function toggleNavOnInput () {
    document.getElementById("nav-init").hidden = true;
    document.getElementById("nav-input").hidden = false;

    toggleNav(document.getElementById("calendar").hidden ? "library" : "calendar");
}

function toggleShortcut (e) {
    let toggleOn = e.currentTarget.getAttribute("data-toggle") === "add";
    e.currentTarget.parentNode.querySelector("input[type=radio]").checked = toggleOn;
    e.currentTarget.parentNode.querySelector("select").disabled = !toggleOn;
}

function toggleTime (e) {
    let toggleOn = e.currentTarget.getAttribute("data-toggle") === "allday";
    e.currentTarget.parentNode.querySelector("input[type=radio]").checked = toggleOn;
    e.currentTarget.parentNode.querySelectorAll("input[type=text]")[0].disabled = toggleOn;
    e.currentTarget.parentNode.querySelectorAll("input[type=text]")[1].disabled = toggleOn;
}

function updateShortcutSelection () {
    let select = document.getElementById("calendar-shortcut-selection");
    let options = select.getElementsByTagName("option");

    while (options.length > 1) { select.removeChild(options[1]) };
    select.selectedIndex = 0;

    for (let shortcut in library) {
        var option = document.createElement("option");
        option.value = shortcut;
        option.innerHTML = shortcut+" - "+library[shortcut]["subject"];
        select.appendChild(option);
    };
}

function updateLocationList () {
    let list = document.getElementById("shortcut-location-datalist");
    let newList = document.createElement("datalist");

    let locations = new Set();

    for (let shortcut in library) {
        locations.add(library[shortcut]["location"]);
    };

    locations.forEach((value) => {
        let option = document.createElement("option");
        option.value = value;
        newList.appendChild(option);
    });
    list.replaceChildren(...newList.childNodes);
}

function updateShortcutCards() {
    document.getElementById("container-library").hidden = false;

    var cardTemp = document.querySelector("template#template-shortcut-card");

    var container = document.getElementById("container-library-cards");

    var new_container = document.createElement("div");

    for (let shortcut in library) {
        let data = library[shortcut];

        let node = document.importNode(cardTemp.content, true);

        node.querySelector(".card").setAttribute("data-card-shortcut", shortcut);

        node.querySelectorAll("button")[0].addEventListener("click", shortcutEdit);
        node.querySelectorAll("button")[1].addEventListener("click", shortcutDelete);

        node.querySelector(".shortcut-card-shortcut").innerHTML += shortcut;

        node.querySelector(".shortcut-card-subject").innerHTML = data["subject"];
        node.querySelector(".shortcut-card-time").innerHTML = data["time"];
        node.querySelector(".shortcut-card-location").innerHTML = data["location"];
        node.querySelector(".shortcut-card-description").innerHTML = data["description"];

        new_container.insertBefore(node, new_container.firstChild);
    };

    container.replaceChildren(...new_container.childNodes);
}

function activateNode (id) {
    document.getElementById(id).classList.remove("deactivated");
}

function validateFilename (e) {
    if (/^[^\\ \/ : * ? " < > |]+$/.test(e.currentTarget.value)) {
        e.currentTarget.setCustomValidity("");
    } else {
        e.currentTarget.setCustomValidity("invalid filename")
    };
}

function unvalidateFilename (e) {
    e.currentTarget.form.classList.remove("was-validated");
}

function validateShortcut (e) {
    if (data.library.hasOwnProperty(e.currentTarget.value)) {
        e.currentTarget.classList.add("is-used");
        document.getElementById("shortcut-add").hidden = true;
        document.getElementById("shortcut-update").hidden = false;
    } else {
        e.currentTarget.classList.remove("is-used");
        document.getElementById("shortcut-add").hidden = false;
        document.getElementById("shortcut-update").hidden = true;
    };
}

function validateTime (e) {
    if (/^(2[0-3]|[01]?[0-9]):?([0-5][0-9])?( )?(AM|am|PM|pm)?$/.test(e.currentTarget.value)) {
        e.currentTarget.setCustomValidity("");
    } else {
        e.currentTarget.setCustomValidity("invalid time")
    };
}

function changeCalendarDate (e) {
    if (document.getElementById("calendar-change-tooltip").getAttribute("data-promt") === "active") {
        document.getElementById("calendar-change-tooltip").setAttribute("data-promt", "show");
    } else {
        let direction = parseInt(e.currentTarget.getAttribute("data-direction"));

        let dateCopy = new Date(data.date.getTime());
        dateCopy.setMonth(dateCopy.getMonth() + direction);
        data.date = dateCopy;
        document.getElementById("calendar-change-tooltip").setAttribute("data-promt", "none");
    }
}

function editDateInput (e) {
    e.currentTarget.form.classList.add("was-validated");
    e.currentTarget.setCustomValidity("");
    e.currentTarget.value = getStringFromDate();

    updateDateTooltip();

    if (document.getElementById("calendar-change-tooltip").getAttribute("data-promt") === "active") {
        document.getElementById("calendar-change-tooltip").setAttribute("data-promt", "show");
    }
}

function validateDateInput (e) {
    if (/^(1[0-2]|0?[1-9]) ?\/ ?([2-9]\d[1-9]\d|[1-9]\d)$/.test(e.currentTarget.value)) {
        e.currentTarget.setCustomValidity("");
        updateDateTooltip();
    } else {
        e.currentTarget.setCustomValidity("invalid date")
    };
}

function acceptDateInput (e) {
    let inputDate = getDateFromString();
    let savedDate = new Date(data.date.getFullYear(), data.date.getMonth());
    if (e.currentTarget.form.checkValidity() && +inputDate !== +savedDate) {
        data.date = inputDate;
    } else {
        updateDateInput();
        if (document.getElementById("calendar-change-tooltip").getAttribute("data-promt") === "show") {
            document.getElementById("calendar-change-tooltip").setAttribute("data-promt", "active");
        }
    };

    e.currentTarget.form.classList.remove("was-validated");
}

function dayInput (e) {
    let textarea = e.currentTarget.querySelector("textarea");

    if (document.getElementById("toggle-shortcut").checked) {
        let shortcut = e.currentTarget.form.elements["calendar-shortcut-selection"].value;

        if (!shortcut) { return };
        if (textarea.value.split("\n").includes(shortcut)) { return };
        if (textarea.value) { textarea.value += "\n" }
        textarea.value += shortcut;
    } else {
        textarea.value = "";
    };

    document.getElementById("calendar-change-tooltip").setAttribute("data-promt", "active");
}

function shortcutEdit (e) {
    let shortcut = e.currentTarget.parentNode.parentNode.getAttribute("data-card-shortcut");
    let data = library[shortcut];

    let form = document.getElementById("shortcut-form");
    form.classList.remove("was-validated");
    document.getElementById("shortcut-add").hidden = true;
    document.getElementById("shortcut-update").hidden = false;

    form.elements["shortcut-shortcut"].value = shortcut;

    form.elements["shortcut-subject"].value = data["subject"];

    if (data["time"] === "all-day") {
        form.elements["toggle-time"].checked = true;
        form.elements["shortcut-begin"].disabled = true;
        form.elements["shortcut-begin"].value = "";
        form.elements["shortcut-end"].disabled = true;
        form.elements["shortcut-end"].value = "";
    } else {
        form.elements["toggle-time"].checked = false;
        form.elements["shortcut-begin"].disabled = false;
        form.elements["shortcut-begin"].value = data["time"].split("-")[0];
        form.elements["shortcut-end"].disabled = false;
        form.elements["shortcut-end"].value = data["time"].split("-")[1];
    };

    form.elements["shortcut-location"].value = data["location"];

    form.elements["shortcut-description"].value = data["description"];
}

function shortcutDelete (e) {
    let shortcut = e.currentTarget.parentNode.parentNode.getAttribute("data-card-shortcut");

    copyLibrary = { ...library };
    delete copyLibrary[shortcut];
    data.library = copyLibrary;
}

function checkForm (f) {
    f.classList.add("was-validated");
    return f.checkValidity();
}

function resetLibraryForm(f) {
    document.getElementById("shortcut-shortcut").classList.remove("is-used");
    document.getElementById("shortcut-add").hidden = false;
    document.getElementById("shortcut-update").hidden = true;
    document.getElementById("shortcut-begin").disabled = false;
    document.getElementById("shortcut-end").disabled = false;
    f.classList.remove("was-validated");
    f.reset();
}

function correctTime (t) {
    let [h, m] = ["00", "00"];

    if (t.includes(":")) { [h, m] = t.split(":") }
    else if (t.length <= 2) { h = t }
    else { [h, m] = [t.slice(0, -2), t.slice(-2)] };

    let time = new Date(0, 0, 0, h, m, 0);
    return ("00"+time.getHours()).slice(-2)+":"+("00"+time.getMinutes()).slice(-2);
}

function updateDateTooltip () {
    document.getElementById("calendar-date-tooltip").innerHTML = getFormattedStringFromDate(getDateFromString());
}

function getDateFromString () {
    let [month, year]= document.getElementById("calendar-date-input").value.split("/");
    let date = new Date(year, month-1);
    if (date.getFullYear() < 1970) { date.setFullYear(date.getFullYear() + 100) };
    return date;
}

function getStringFromDate () {
    return ("00"+(date.getMonth()+1)).slice(-2)+" / "+date.getFullYear();
}

function getFormattedStringFromDate (date) {
    return date.toLocaleString("en-US", { month: "long", year: "numeric" });
}


function getTimeString (y, m, d, t) {
    y = parseInt(y); m = parseInt(m); d = parseInt(d);

    let [begin, end] = t.split("-");
    let day = y+"/"+(m+1)+"/"+d;

    if (t === "all-day") { return [day, day] };
    return [day+" "+begin, day.substring(0, day.indexOf('/', 5)+1)+(d+(begin < end ? 0 : 1))+" "+end];
}