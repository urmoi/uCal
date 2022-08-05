var libData = {};

function saveCalendar () {
    // https://github.com/nwcell/ics.js
    /*! ics.js Wed Aug 20 2014 17:23:02 */
    var saveAs=saveAs||function(e){"use strict";if(typeof e==="undefined"||typeof navigator!=="undefined"&&/MSIE [1-9]\./.test(navigator.userAgent)){return}var t=e.document,n=function(){return e.URL||e.webkitURL||e},r=t.createElementNS("http://www.w3.org/1999/xhtml","a"),o="download"in r,a=function(e){var t=new MouseEvent("click");e.dispatchEvent(t)},i=/constructor/i.test(e.HTMLElement)||e.safari,f=/CriOS\/[\d]+/.test(navigator.userAgent),u=function(t){(e.setImmediate||e.setTimeout)(function(){throw t},0)},s="application/octet-stream",d=1e3*40,c=function(e){var t=function(){if(typeof e==="string"){n().revokeObjectURL(e)}else{e.remove()}};setTimeout(t,d)},l=function(e,t,n){t=[].concat(t);var r=t.length;while(r--){var o=e["on"+t[r]];if(typeof o==="function"){try{o.call(e,n||e)}catch(a){u(a)}}}},p=function(e){if(/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)){return new Blob([String.fromCharCode(65279),e],{type:e.type})}return e},v=function(t,u,d){if(!d){t=p(t)}var v=this,w=t.type,m=w===s,y,h=function(){l(v,"writestart progress write writeend".split(" "))},S=function(){if((f||m&&i)&&e.FileReader){var r=new FileReader;r.onloadend=function(){var t=f?r.result:r.result.replace(/^data:[^;]*;/,"data:attachment/file;");var n=e.open(t,"_blank");if(!n)e.location.href=t;t=undefined;v.readyState=v.DONE;h()};r.readAsDataURL(t);v.readyState=v.INIT;return}if(!y){y=n().createObjectURL(t)}if(m){e.location.href=y}else{var o=e.open(y,"_blank");if(!o){e.location.href=y}}v.readyState=v.DONE;h();c(y)};v.readyState=v.INIT;if(o){y=n().createObjectURL(t);setTimeout(function(){r.href=y;r.download=u;a(r);h();c(y);v.readyState=v.DONE});return}S()},w=v.prototype,m=function(e,t,n){return new v(e,t||e.name||"download",n)};if(typeof navigator!=="undefined"&&navigator.msSaveOrOpenBlob){return function(e,t,n){t=t||e.name||"download";if(!n){e=p(e)}return navigator.msSaveOrOpenBlob(e,t)}}w.abort=function(){};w.readyState=w.INIT=0;w.WRITING=1;w.DONE=2;w.error=w.onwritestart=w.onprogress=w.onwrite=w.onabort=w.onerror=w.onwriteend=null;return m}(typeof self!=="undefined"&&self||typeof window!=="undefined"&&window||this.content);if(typeof module!=="undefined"&&module.exports){module.exports.saveAs=saveAs}else if(typeof define!=="undefined"&&define!==null&&define.amd!==null){define("FileSaver.js",function(){return saveAs})};
    var ics=function(e,t){"use strict";{if(!(navigator.userAgent.indexOf("MSIE")>-1&&-1==navigator.userAgent.indexOf("MSIE 10"))){void 0===e&&(e="default"),void 0===t&&(t="Calendar");var r=-1!==navigator.appVersion.indexOf("Win")?"\r\n":"\n",n=[],i=["BEGIN:VCALENDAR","PRODID:"+t,"VERSION:2.0"].join(r),o=r+"END:VCALENDAR",a=["SU","MO","TU","WE","TH","FR","SA"];return{events:function(){return n},calendar:function(){return i+r+n.join(r)+o},addEvent:function(t,i,o,l,u,s){if(void 0===t||void 0===i||void 0===o||void 0===l||void 0===u)return!1;if(s&&!s.rrule){if("YEARLY"!==s.freq&&"MONTHLY"!==s.freq&&"WEEKLY"!==s.freq&&"DAILY"!==s.freq)throw"Recurrence rrule frequency must be provided and be one of the following: 'YEARLY', 'MONTHLY', 'WEEKLY', or 'DAILY'";if(s.until&&isNaN(Date.parse(s.until)))throw"Recurrence rrule 'until' must be a valid date string";if(s.interval&&isNaN(parseInt(s.interval)))throw"Recurrence rrule 'interval' must be an integer";if(s.count&&isNaN(parseInt(s.count)))throw"Recurrence rrule 'count' must be an integer";if(void 0!==s.byday){if("[object Array]"!==Object.prototype.toString.call(s.byday))throw"Recurrence rrule 'byday' must be an array";if(s.byday.length>7)throw"Recurrence rrule 'byday' array must not be longer than the 7 days in a week";s.byday=s.byday.filter(function(e,t){return s.byday.indexOf(e)==t});for(var c in s.byday)if(a.indexOf(s.byday[c])<0)throw"Recurrence rrule 'byday' values must include only the following: 'SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'"}}var g=new Date(l),d=new Date(u),f=new Date,S=("0000"+g.getFullYear().toString()).slice(-4),E=("00"+(g.getMonth()+1).toString()).slice(-2),v=("00"+g.getDate().toString()).slice(-2),y=("00"+g.getHours().toString()).slice(-2),A=("00"+g.getMinutes().toString()).slice(-2),T=("00"+g.getSeconds().toString()).slice(-2),b=("0000"+d.getFullYear().toString()).slice(-4),D=("00"+(d.getMonth()+1).toString()).slice(-2),N=("00"+d.getDate().toString()).slice(-2),h=("00"+d.getHours().toString()).slice(-2),I=("00"+d.getMinutes().toString()).slice(-2),R=("00"+d.getMinutes().toString()).slice(-2),M=("0000"+f.getFullYear().toString()).slice(-4),w=("00"+(f.getMonth()+1).toString()).slice(-2),L=("00"+f.getDate().toString()).slice(-2),O=("00"+f.getHours().toString()).slice(-2),p=("00"+f.getMinutes().toString()).slice(-2),Y=("00"+f.getMinutes().toString()).slice(-2),U="",V="";y+A+T+h+I+R!=0&&(U="T"+y+A+T,V="T"+h+I+R);var B,C=S+E+v+U,j=b+D+N+V,m=M+w+L+("T"+O+p+Y);if(s)if(s.rrule)B=s.rrule;else{if(B="rrule:FREQ="+s.freq,s.until){var x=new Date(Date.parse(s.until)).toISOString();B+=";UNTIL="+x.substring(0,x.length-13).replace(/[-]/g,"")+"000000Z"}s.interval&&(B+=";INTERVAL="+s.interval),s.count&&(B+=";COUNT="+s.count),s.byday&&s.byday.length>0&&(B+=";BYDAY="+s.byday.join(","))}(new Date).toISOString();var H=["BEGIN:VEVENT","UID:"+n.length+"@"+e,"CLASS:PUBLIC","DESCRIPTION:"+i,"DTSTAMP;VALUE=DATE-TIME:"+m,"DTSTART;VALUE=DATE-TIME:"+C,"DTEND;VALUE=DATE-TIME:"+j,"LOCATION:"+o,"SUMMARY;LANGUAGE=en-us:"+t,"TRANSP:TRANSPARENT","END:VEVENT"];return B&&H.splice(4,0,B),H=H.join(r),n.push(H),H},download:function(e,t){if(n.length<1)return!1;t=void 0!==t?t:".ics",e=void 0!==e?e:"calendar";var a,l=i+r+n.join(r)+o;if(-1===navigator.userAgent.indexOf("MSIE 10"))a=new Blob([l]);else{var u=new BlobBuilder;u.append(l),a=u.getBlob("text/x-vCalendar;charset="+document.characterSet)}return saveAs(a,e+t),l},build:function(){return!(n.length<1)&&i+r+n.join(r)+o}}}console.log("Unsupported Browser")}};

    let filenameInput = document.getElementById("calendar-filename-input");
    if (!checkForm(filenameInput.form)) { return }
    filenameInput.form.classList.remove("was-validated");
    let filename = filenameInput.value;
    
    let input = document.getElementById("calendar-calendar").querySelectorAll("textarea");

    let [month, year] = getCalendarDate();

    var cal = ics();

    for (let i = 0; i < input.length; i++) {
        let textarea = input[i];

        let shortcuts = textarea.value.split("\n");
        let day = i + 1;

        if (shortcuts[0]) {
            for (let j = 0; j < shortcuts.length; j++) {
                let shortcut = shortcuts[j];

                let subject = libData[shortcut]["subject"];
                let description = libData[shortcut]["description"];
                let location = libData[shortcut]["location"];
                let [begin, end] = getTime(libData[shortcut]["time"], year, month, day);

                console.log(subject, description, location, begin, end);

                cal.addEvent(subject, description, location, begin, end);
            }
        }
    }
    cal.download(filename);
}

function checkFilename(input) {
    if (/^[^\\ \/ : * ? " < > |]+$/.test(input.value)) {
        input.setCustomValidity("");
    } else {
        input.setCustomValidity("invalid filename")
    }
}

function checkForm(form) {
    form.classList.add("was-validated");
    return form.checkValidity();
}

function loadLibrary () {
    let libraryFile = new Blob(document.getElementById("library-file").files, {type:"application/json"});

    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        let libText = event.target.result;
        libData = JSON.parse(libText)
        console.log(libData);

        resetCalendar();
    });
    reader.readAsText(libraryFile);
}

function resetCalendar() {
    let form = document.getElementById("calendar-form");
    form.reset();

    updateShortcutSelection();
    toggleShortcut();
    activateCalendar();
}

function updateShortcutSelection() {
    let shortcutSelection = document.getElementById("calendar-shortcut-selection");
    let options = shortcutSelection.getElementsByTagName('option');

    while (options.length > 1) {
        shortcutSelection.removeChild(options[1]);
    }

    shortcutSelection.selectedIndex = 0;

    for (let shortcut in libData) {
        var opt = document.createElement('option');
        opt.value = shortcut;
        opt.innerHTML = shortcut + " - " + libData[short]["subject"];
        shortcutSelection.appendChild(opt);
    }
}

function makeCalendar () {
    let [month, year] = getCalendarDate();

    var headerTemp = document.querySelector("template#calendar-header");
    var dayTemp = document.querySelector("template#calendar-day");

    var container = document.getElementById("calendar-calendar");

    var new_container = document.createElement("div");
    let header = document.importNode(headerTemp.content, true);
    new_container.appendChild(header);
    
    var content = document.createElement("div");
    content.id = "calendar-input";
    new_container.appendChild(content);

    let daysInWeek = 7;
    let daysInMonth = new Date(year, month+1, 0).getDate();
    let firstDay = new Date(year, month, 1).getDay() || 7;
    let weeksInMonth = (firstDay + daysInMonth - 1) / daysInWeek;

    for (let i = 0; i < weeksInMonth; i++) {
        let week = document.createElement("div");
        week.classList.add("row", "mx-auto", "flex-nowwrap");
        for (let j = 1; j <= daysInWeek; j++) {
            let numberDay = i * daysInWeek + j;
            let calendarDay = numberDay - firstDay + 1;
            let isDay = calendarDay >= 1 && calendarDay <= daysInMonth;
            let node = document.importNode(dayTemp.content, true);
            if (isDay) {
                node.querySelector("button").addEventListener("click", function() { dayClick(this) });
                node.querySelector("label").innerHTML = (calendarDay) + "." + (month+1) + ".";
            } else {
                node.children[0].disabled = true;
                node.children[0].innerHTML = "";
            }
            week.appendChild(node);
        }
        content.appendChild(week);
    }
    container.replaceChildren(new_container);
}

function activateCalendar () {
    let activate = document.getElementById("calendar-shortcut-selection").value;
    let container = document.getElementById("calendar-calendar");
    container.style.pointerEvents = activate ? "all" : "none";
    container.style.opacity = activate ? 1 : .5;
    container.style.filter = activate ? "initial" : "blur(1px)";

}

function dayClick (btn) {
    let textarea = btn.querySelector("textarea");

    if (document.getElementById("toggle-shortcut").checked) {
        let shortcut = btn.form.elements["calendar-shortcut-selection"].value;

        if (!shortcut) { return }
        if (textarea.value.split("\n").includes(shortcut)) { return }
        if (textarea.value) { textarea.value += "\n" }
        textarea.value += shortcut;
    } else {
        textarea.value = "";
    }
}

function toggleShortcut(toggle=true, e=document.getElementById("toggle-shortcut-add")) {
    e.parentNode.querySelector("input[type=radio]").checked = toggle;
    e.parentNode.querySelector("select").disabled = !toggle;
}

function getCalendarDate() {
    let month = parseInt(document.getElementById("calendar-date-month").value);
    let year = parseInt(document.getElementById("calendar-date-year").value);
    return [month, year];
}

function setCalendarDate () {
    let month = new Date().getMonth();
    let year = new Date().getFullYear();
    updateCalendarDate(month, year);
}

function changeCalendarDate (direction) {
    let [month, year] = getCalendarDate();
    updateCalendarDate(month + direction, year);
}

function updateCalendarDate (month, year, update=true) {
    let date = getDateFromMonthAndYear(month, year);

    document.getElementById("calendar-date-month").value = date.getMonth();
    document.getElementById("calendar-date-year").value = date.getFullYear();
    document.getElementById("calendar-date-input").value = getStringFromDate(date);

    if (update) { makeCalendar() };
}

function editCalenderDate (input) {
    input.form.classList.add("was-validated");
    input.setCustomValidity("");

    let [month, year] = getCalendarDate();
    updateCalendarTooltip (month, year);
    input.value = (month+1) + " / " + year;
}

function checkCalenderDate (input) {
    if (/^(1[0-2]|0?[1-9]) ?\/ ?([2-9]\d[1-9]\d|[1-9]\d)$/.test(input.value)) {
        input.setCustomValidity("");
        let [month, year] = input.value.split("/");
        updateCalendarTooltip (month-1, year);
    } else {
        input.setCustomValidity("invalid date")
    }
}

function acceptCalenderDate (input) {
    input.form.classList.remove("was-validated");

    let [month, year] = input.value.split("/");
    month -= 1;

    let [savedMonth, savedYear] = getCalendarDate();

    if (!input.form.checkValidity()) { [month, year] = [savedMonth, savedYear] }

    updateCalendarDate(month, year, month != savedMonth || year != savedYear);
}

function updateCalendarTooltip (month, year) {
    document.getElementById("calendar-date-tooltip").innerHTML = getStringFromDate(getDateFromMonthAndYear(month, year));
}

function getDateFromMonthAndYear (month, year) {
    let date = new Date(year, month);
    if (date.getFullYear() < 1970) { date.setFullYear(date.getFullYear() + 100) };
    return date;
}

function getStringFromDate (date) {
    return date.toLocaleString("en-US", { month: "long", year: "numeric" });
}

function getTime(time, year, month, day) {
    let date = getDate(year, month, day);

    if (time === "all-day") {
        return [date, date];
    }

    let [start, end] = time.split("-");
    console.log(time, start, end);
    if (start >= end) {
        return [date + " " + start, getDate(year, month, day + 1) + " " + end];
    }

    return [date + " " + start, date + " " + end];
}

function getDate(year, month, day) {
    return year + "/" + (month+1) + "/" + day;
}
