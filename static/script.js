vvar data = {
    MONTH: new Date(),
    LIBRARY: {},
    MERGE: {"events": {}},
    events : {},
    months: {}
};

Object.defineProperty(data, "month", {
    set(newDate) {
        this.MONTH = newDate;
        updateMonthsData();
        updateCalendar();
    },
    get() { return this.MONTH; }
});

Object.defineProperty(data, "library", {
    set(newLibrary) {
        if (Object.keys(this.LIBRARY).length === 0) {
            toggleLibraryInput();
        };
        this.LIBRARY= newLibrary;
        updateShortcutSelection();
        updateShortcutCards();
        updateLocationList();
    },
    get() { return this.LIBRARY; }
});

Object.defineProperty(data, "merge", {
    set(newMerge) {
        this.MERGE = newMerge;
        updateMergeBtn(Object.keys(this.MERGE).length-1);
        updateMergeList();
        updateCalendar();
    },
    get() { return this.MERGE; }
});

/* https://github.com/nwcell/FileSaver.js */
/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
var saveAs=saveAs||function(e){"use strict";if(typeof e==="undefined"||typeof navigator!=="undefined"&&/MSIE [1-9]\./.test(navigator.userAgent)){return}var t=e.document,n=function(){return e.URL||e.webkitURL||e},r=t.createElementNS("http://www.w3.org/1999/xhtml","a"),o="download"in r,a=function(e){var t=new MouseEvent("click");e.dispatchEvent(t)},i=/constructor/i.test(e.HTMLElement)||e.safari,f=/CriOS\/[\d]+/.test(navigator.userAgent),u=function(t){(e.setImmediate||e.setTimeout)(function(){throw t},0)},s="application/octet-stream",d=1e3*40,c=function(e){var t=function(){if(typeof e==="string"){n().revokeObjectURL(e)}else{e.remove()}};setTimeout(t,d)},l=function(e,t,n){t=[].concat(t);var r=t.length;while(r--){var o=e["on"+t[r]];if(typeof o==="function"){try{o.call(e,n||e)}catch(a){u(a)}}}},p=function(e){if(/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)){return new Blob([String.fromCharCode(65279),e],{type:e.type})}return e},v=function(t,u,d){if(!d){t=p(t)}var v=this,w=t.type,m=w===s,y,h=function(){l(v,"writestart progress write writeend".split(" "))},S=function(){if((f||m&&i)&&e.FileReader){var r=new FileReader;r.onloadend=function(){var t=f?r.result:r.result.replace(/^data:[^;]*;/,"data:attachment/file;");var n=e.open(t,"_blank");if(!n)e.location.href=t;t=undefined;v.readyState=v.DONE;h()};r.readAsDataURL(t);v.readyState=v.INIT;return}if(!y){y=n().createObjectURL(t)}if(m){e.location.href=y}else{var o=e.open(y,"_blank");if(!o){e.location.href=y}}v.readyState=v.DONE;h();c(y)};v.readyState=v.INIT;if(o){y=n().createObjectURL(t);setTimeout(function(){r.href=y;r.download=u;a(r);h();c(y);v.readyState=v.DONE});return}S()},w=v.prototype,m=function(e,t,n){return new v(e,t||e.name||"download",n)};if(typeof navigator!=="undefined"&&navigator.msSaveOrOpenBlob){return function(e,t,n){t=t||e.name||"download";if(!n){e=p(e)}return navigator.msSaveOrOpenBlob(e,t)}}w.abort=function(){};w.readyState=w.INIT=0;w.WRITING=1;w.DONE=2;w.error=w.onwritestart=w.onprogress=w.onwrite=w.onabort=w.onerror=w.onwriteend=null;return m}(typeof self!=="undefined"&&self||typeof window!=="undefined"&&window||this.content);if(typeof module!=="undefined"&&module.exports){module.exports.saveAs=saveAs}else if(typeof define!=="undefined"&&define!==null&&define.amd!==null){define("FileSaver.js",function(){return saveAs})};

function addMerge () {
    let mergeFile = new Blob(document.getElementById("merge-file-input").files, {type:"text/plain"});
    let mergeFilename = document.getElementById("merge-file-input").value.split("/").pop().split("\\").pop().split(".")[0];

    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        if (!document.getElementById("calendar-filename-input").value) {
            document.getElementById("calendar-filename-input").value = mergeFilename;
        };

        let mergeFilenameCopy = mergeFilename;
        for (let i = 1; mergeFilename in data.merge; i++) {
            mergeFilename = mergeFilenameCopy + "_" + i;
        };

        let merge_list = event.target.result.split("END:VCALENDAR")[0].split(/(?=BEGIN:VEVENT)/g).slice(1).map(item => item.trim());

        for (let i = 0; i < merge_list.length; i++) {
            let date = merge_list[i].split("DTSTART;VALUE=DATE-TIME:")[1].substring(0, 8);
            let month = date.substring(0, 4)+"-"+date.substring(4, 6);
            if (!(month in data.merge["events"])) {
                data.merge["events"][month] = new Array();
            };
            data.merge["events"][month].push(month+"-"+date.substring(6, 8));
        };

        let copyMerge = { ... data.merge };
        copyMerge[mergeFilename] = merge_list;
        data.merge = copyMerge;
    });
    reader.readAsText(mergeFile);
}

function removeMerge (e) {
    let mergeName = e.currentTarget.parentNode.getAttribute("merge-name");
    console.log(mergeName);

    let merge_list = data.merge[mergeName];

    for (let i = 0; i < merge_list.length; i++) {
        let date = merge_list[i].split("DTSTART;VALUE=DATE-TIME:")[1].substring(0, 8);
        let month = date.substring(0, 4)+"-"+date.substring(4, 6);
        let index = data.merge["events"][month].indexOf(month+"-"+date.substring(6, 8));
        if (index > -1) {
            data.merge["events"][month].splice(index, 1);
        };
    };

    delete data.merge[mergeName];
    data.merge = data.merge;
}

function saveCalendar () {
    let filenameInput = document.getElementById("calendar-filename-input");
    if (!checkForm(filenameInput.form)) { return filenameInput.focus() };
    filenameInput.form.classList.remove("was-validated");
    let filename = filenameInput.value;

    if (Object.keys(data.events).length === 0 && Object.keys(data.merge).length === 1) { return promtDownloadTooltip(document.getElementById("calendar-download-tooltip")) };

    /* https://github.com/nwcell/ics.js */
    /*! ics.js Wed Aug 20 2014 17:23:02 */
    var ics=function(e,t){"use strict";{if(!(navigator.userAgent.indexOf("MSIE")>-1&&-1==navigator.userAgent.indexOf("MSIE 10"))){void 0===e&&(e="default"),void 0===t&&(t="Calendar");var r=-1!==navigator.appVersion.indexOf("Win")?"\r\n":"\n",n=[],i=["BEGIN:VCALENDAR","PRODID:"+t,"VERSION:2.0"].join(r),o=r+"END:VCALENDAR",a=["SU","MO","TU","WE","TH","FR","SA"];return{events:function(){return n},calendar:function(){return i+r+n.join(r)+o},addEvent:function(t,i,o,l,u,s){if(void 0===t||void 0===i||void 0===o||void 0===l||void 0===u)return!1;if(s&&!s.rrule){if("YEARLY"!==s.freq&&"MONTHLY"!==s.freq&&"WEEKLY"!==s.freq&&"DAILY"!==s.freq)throw"Recurrence rrule frequency must be provided and be one of the following: 'YEARLY', 'MONTHLY', 'WEEKLY', or 'DAILY'";if(s.until&&isNaN(Date.parse(s.until)))throw"Recurrence rrule 'until' must be a valid date string";if(s.interval&&isNaN(parseInt(s.interval)))throw"Recurrence rrule 'interval' must be an integer";if(s.count&&isNaN(parseInt(s.count)))throw"Recurrence rrule 'count' must be an integer";if(void 0!==s.byday){if("[object Array]"!==Object.prototype.toString.call(s.byday))throw"Recurrence rrule 'byday' must be an array";if(s.byday.length>7)throw"Recurrence rrule 'byday' array must not be longer than the 7 days in a week";s.byday=s.byday.filter(function(e,t){return s.byday.indexOf(e)==t});for(var c in s.byday)if(a.indexOf(s.byday[c])<0)throw"Recurrence rrule 'byday' values must include only the following: 'SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'"}}var g=new Date(l),d=new Date(u),f=new Date,S=("0000"+g.getFullYear().toString()).slice(-4),E=("00"+(g.getMonth()+1).toString()).slice(-2),v=("00"+g.getDate().toString()).slice(-2),y=("00"+g.getHours().toString()).slice(-2),A=("00"+g.getMinutes().toString()).slice(-2),T=("00"+g.getSeconds().toString()).slice(-2),b=("0000"+d.getFullYear().toString()).slice(-4),D=("00"+(d.getMonth()+1).toString()).slice(-2),N=("00"+d.getDate().toString()).slice(-2),h=("00"+d.getHours().toString()).slice(-2),I=("00"+d.getMinutes().toString()).slice(-2),R=("00"+d.getMinutes().toString()).slice(-2),M=("0000"+f.getFullYear().toString()).slice(-4),w=("00"+(f.getMonth()+1).toString()).slice(-2),L=("00"+f.getDate().toString()).slice(-2),O=("00"+f.getHours().toString()).slice(-2),p=("00"+f.getMinutes().toString()).slice(-2),Y=("00"+f.getMinutes().toString()).slice(-2),U="",V="";y+A+T+h+I+R!=0&&(U="T"+y+A+T,V="T"+h+I+R);var B,C=S+E+v+U,j=b+D+N+V,m=M+w+L+("T"+O+p+Y);if(s)if(s.rrule)B=s.rrule;else{if(B="rrule:FREQ="+s.freq,s.until){var x=new Date(Date.parse(s.until)).toISOString();B+=";UNTIL="+x.substring(0,x.length-13).replace(/[-]/g,"")+"000000Z"}s.interval&&(B+=";INTERVAL="+s.interval),s.count&&(B+=";COUNT="+s.count),s.byday&&s.byday.length>0&&(B+=";BYDAY="+s.byday.join(","))}(new Date).toISOString();var H=["BEGIN:VEVENT","UID:"+n.length+"@"+e,"CLASS:PUBLIC","DESCRIPTION:"+i,"DTSTAMP;VALUE=DATE-TIME:"+m,"DTSTART;VALUE=DATE-TIME:"+C,"DTEND;VALUE=DATE-TIME:"+j,"LOCATION:"+o,"SUMMARY;LANGUAGE=en-us:"+t,"TRANSP:TRANSPARENT","END:VEVENT"];return B&&H.splice(4,0,B),H=H.join(r),n.push(H),H},download:function(e,t){if(n.length<1)return!1;t=void 0!==t?t:".ics",e=void 0!==e?e:"calendar";var a,l=i+r+n.join(r)+o;if(-1===navigator.userAgent.indexOf("MSIE 10"))a=new Blob([l]);else{var u=new BlobBuilder;u.append(l),a=u.getBlob("text/x-vCalendar;charset="+document.characterSet)}return saveAs(a,e+t),l},build:function(){return!(n.length<1)&&i+r+n.join(r)+o}
    
/**/,merge:function(merge){n = n.concat(merge);}}  /*added function to merge calendars by me [@urmoi]*/

    }}console.log("Unsupported Browser")};

    var cal = ics(new Date().getTime(), "uCal@urmoi");
    
    for (let key in data.events) {
        let shortcuts = data.events[key];
        shortcuts.forEach((shortcut) => {
            let element = data.library[shortcut];
            if (element === undefined) { return promtDownloadTooltip(document.getElementById("calendar-error-tooltip")) };

            let [year, month, day] = key.split("-");

            let subject = element["subject"];
            let description = element["description"];
            let location = element["location"];
            let [begin, end] = getTimeString(year, month, day, element["time"]);

            cal.addEvent(subject, description, location, begin, end);
        });
    };

    for (let mergeName in data.merge) {
        if (mergeName === "events") { continue };
        cal.merge(data.merge[mergeName]);
    }

    savedCal = cal.download(filename)
}

function saveLibrary () {
    let filenameInput = document.getElementById("library-filename-input");
    if (!checkForm(filenameInput.form)) { return filenameInput.focus() };
    if (Object.keys(data.library).length === 0) { return promtDownloadTooltip(document.getElementById("library-download-tooltip")); };

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

    var values = {};

    values["subject"] = form.elements["shortcut-subject"].value;

    if (form.elements["toggle-time"].checked) {
        values["time"] = "all-day";
    } else {
        values["time"] = correctTime(form.elements["shortcut-begin"].value)+"-"+correctTime(form.elements["shortcut-end"].value);
    };

    values["location"] = form.elements["shortcut-location"].value;

    values["description"] = form.elements["shortcut-description"].value;

    let copyLibrary = { ... data.library };
    copyLibrary[form.elements["shortcut-shortcut"].value] = values;
    data.library = copyLibrary;

    resetLibraryForm(form);

    if (!document.getElementById("library-hint-tooltip").hasAttribute("data-promt")) {
        return promtDownloadTooltip(document.getElementById("library-hint-tooltip"));
    }
}

function updateCalendar () {
    updateDateInput();
    updateMonthsList();

    let [month, year] = [data.month.getMonth(), data.month.getFullYear()];

    var dayTemp = document.querySelector("template#template-calendar-day");

    var container = document.getElementById("calendar-input");

    var new_container = document.createElement("div");

    let daysInWeek = 7;
    let daysInMonth = new Date(year, month+1, 0).getDate();
    let firstDay = new Date(year, month, 1).getDay() || 7;
    let weeksInMonth = (firstDay + daysInMonth - 1) / daysInWeek;

    let monthId = year+"-"+getDoubleDigit(month+1);

    let checkMerge = new Set();
    if (monthId in data.merge.events) {
        for (let key in data.merge.events[monthId]) {
            checkMerge.add(data.merge.events[monthId][key]);
        }
    }

    for (let i = 0; i < weeksInMonth; i++) {
        let week = document.createElement("div");
        week.classList.add("row", "mx-auto", "row-cols-"+daysInWeek);

        for (let j = 1; j <= daysInWeek; j++) {
            let numberDay = i * daysInWeek + j;
            let calendarDay = numberDay - firstDay + 1;
            let isDay = calendarDay >= 1 && calendarDay <= daysInMonth;
            let node = document.importNode(dayTemp.content, true);
            if (isDay) {
                let label = (calendarDay) + "." + (month+1) + ".";
                let key = monthId+"-"+getDoubleDigit(calendarDay);

                let id = "calendarDay-"+key;

                node.querySelector("button").addEventListener("click", dayInput);

                node.querySelector("label").setAttribute("for", id);
                node.querySelector("label").innerHTML += label;
                if (checkMerge.has(key)) {
                    node.querySelector("label").querySelector("i").hidden = false;
                }

                node.querySelector("textarea").id = id;
                node.querySelector("textarea").value = textareaInput(key);

            } else {
                node.querySelector("button").disabled = true;
                node.querySelector("label").innerHTML = "";
            };
            week.appendChild(node);
        };
        new_container.appendChild(week);
    };
    container.replaceChildren(...new_container.childNodes);
}

function updateDateInput () {
    document.getElementById("calendar-date-input").value = getFormattedStringFromDate(data.month);
}

function toggleLibraryInput () {
    document.getElementById("nav-init").hidden = true;
    document.getElementById("nav-input").hidden = false;
    toggleNav(document.getElementById("calendar").hidden ? "library" : "calendar");
    activateCalendar();
}

function toggleNavInit (e) {
    let showMode = (typeof e) === "string" ? e : e.currentTarget.getAttribute("data-nav");

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
    let switchedMode = document.getElementById(showMode).hidden;

    document.getElementById("calendar").hidden = showMode === "calendar" ? false : true;
    document.getElementById("calendar-nav").disabled = showMode === "calendar" ? true : false;
    document.getElementById("calendar-filename-input").disabled = showMode === "calendar" ? false : true;
    document.getElementById("calendar-merge-btn").hidden = showMode === "calendar" ? false : true;
    document.getElementById("calendar-merge").hidden = showMode === "calendar" ? true : false;
    document.getElementById("calendar-save").hidden = showMode === "calendar" ? false : true;
    document.getElementById("calendar-edit").hidden = showMode === "calendar" ? true : false;

    document.getElementById("library").hidden = showMode === "library" ? false : true;
    document.getElementById("library-nav").disabled = showMode === "library" ? true : false;
    document.getElementById("library-filename-input").disabled = showMode === "library" ? false : true;
    document.getElementById("library-save").hidden = showMode === "library" ? false : true;
    document.getElementById("library-edit").hidden = showMode === "library" ? true : false;

    if (showMode === "library" && switchedMode) { document.getElementById("shortcut-shortcut").focus() };
}

function toggleMerge () {
    document.getElementById("calendar-merge-list").hidden = !document.getElementById("calendar-merge-list").hidden;
    if (!document.getElementById("calendar-merge-list").hidden) { window.addEventListener("click", hideMerge, true) }
    else { window.removeEventListener("click", hideMerge, true) };
}

function hideMerge (e) {
    if (document.getElementById("calendar-merge-list").contains(e.target)) { return };
    document.getElementById("calendar-merge-list").hidden = true;
    window.removeEventListener("click", hideMerge, true);
}

function toggleHelp (e) {
    document.getElementById("help").hidden = !document.getElementById("help").hidden
    if (!document.getElementById("help").hidden) { window.addEventListener("click", hideHelp, true) }
    else { window.removeEventListener("click", hideHelp, true) };
}

function hideHelp (e) {
    if (e.target !== document.getElementById("help-close") && document.getElementById("help").contains(e.target)) { return };
    if (document.getElementById("help-show-footer").contains(e.target) || document.getElementById("help-show-nav").contains(e.target)) { return };
    document.getElementById("help").hidden = true;
    window.removeEventListener("click", hideHelp, true);
}

function toggleMonths () {
    document.getElementById("calendar-date-list").hidden = !document.getElementById("calendar-date-list").hidden;
    if (!document.getElementById("calendar-date-list").hidden) { window.addEventListener("click", hideMonths, true) }
    else { window.removeEventListener("click", hideMonths, true) };
}

function hideMonths (e) {
    if (document.getElementById("calendar-date-months").contains(e.target)) { return };
    document.getElementById("calendar-date-list").hidden = true;
    window.removeEventListener("click", hideMonths, true);
}

function toggleShortcut (e) {
    let toggleMode = (typeof e) === "string" ? e : e.currentTarget.getAttribute("data-toggle");
    document.getElementById("toggle-shortcut").checked = toggleMode === "add" ? true : false;
    document.getElementById("calendar-shortcut-selection").disabled = toggleMode === "add" ? false : true;
}

function toggleTime (e) {
    let toggleMode = (typeof e) === "string" ? e : e.currentTarget.getAttribute("data-toggle");
    document.getElementById("toggle-time").checked = toggleMode === "allday" ? true : false;
    document.getElementById("shortcut-begin").disabled = toggleMode === "allday" ? true : false;
    document.getElementById("shortcut-end").disabled = toggleMode === "allday" ? true : false;
}

function updateShortcutSelection () {
    let select = document.getElementById("calendar-shortcut-selection");
    let options = select.getElementsByTagName("option");

    while (options.length > 1) { select.removeChild(options[1]) };
    select.selectedIndex = 0;

    for (let shortcut in data.library) {
        var option = document.createElement("option");
        option.value = shortcut;
        option.innerHTML = shortcut+" - "+data.library[shortcut]["subject"];
        select.appendChild(option);
    };
}

function updateMergeList () {
    var container = document.getElementById("calendar-merge-list");
    let tempNode = container.children[0];
    let addNode = container.children[1];

    var new_container = document.createElement("div");
    new_container.appendChild(tempNode);
    new_container.appendChild(addNode);

    for (let mergeName in data.merge) {
        if (mergeName === "events") { continue }
        let node = tempNode.cloneNode(true);
        node.hidden = false;
        node.setAttribute("merge-name", mergeName);
        node.innerHTML = mergeName + node.innerHTML;
        node.querySelector("button").addEventListener("click", removeMerge);
        new_container.appendChild(node);
    };

    container.replaceChildren(...new_container.childNodes);
}

function updateMergeBtn (count) {
    let btn = document.getElementById("calendar-merge-btn");
    let icon = document.getElementById("calendar-merge");

    if (count > 0) {
        btn.classList.add("bg-dark");
        btn.querySelector("i").classList.remove("bi-calendar-plus");
        btn.querySelector("i").classList.add("bi-calendar-check");
        icon.classList.remove("bi-calendar-plus");
        icon.classList.add("bi-calendar-check");
    } else {
        btn.classList.remove("bg-dark");
        btn.querySelector("i").classList.add("bi-calendar-plus");
        btn.querySelector("i").classList.remove("bi-calendar-check");
        icon.classList.add("bi-calendar-plus");
        icon.classList.remove("bi-calendar-check");
    };
}

function updateMonthsData () {
    let inputs = document.getElementById("calendar-input").querySelectorAll("textarea[id]");
    let key = inputs[0].id.split("-")[1]+"-"+inputs[0].id.split("-")[2];

    let shortcutCount = 0;
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value) { shortcutCount++ };
    };

    if (shortcutCount === 0) { delete data.months[key] }
    else { data.months[key] = shortcutCount };
}

function updateMonthsList () {
    var container = document.getElementById("calendar-date-list");
    let tempNode = container.children[0];

    var new_container = document.createElement("div");

    let currentMonth = new Date().getFullYear()+"-"+(new Date().getMonth()+1);
    let shownMonth = data.month.getFullYear()+"-"+(data.month.getMonth()+1);

    for (let month in data.months) {
        if (month === shownMonth) { continue };

        let node = tempNode.cloneNode(true);
        let span = node.querySelector("span").cloneNode();
        node.disabled = false;
        node.setAttribute("data-month", "month-"+month);
        node.innerHTML = getFormattedStringFromDate(new Date(month.split("-")[0], month.split("-")[1]-1))+" ";
        node.appendChild(span);
        node.querySelector("span").hidden = false;
        node.querySelector("span").innerHTML = "("+getDoubleDigit(data.months[month])+")";
        node.addEventListener("click", changeCalendarDate);
        new_container.appendChild(node);
    };

    document.getElementById("calendar-date-listbadge").innerHTML = new_container.children.length;
    document.getElementById("calendar-date-listbadge").hidden = !new_container.children.length;

    if (new_container.children.length === 0) {
        let node = tempNode.cloneNode(true);
        let span = node.querySelector("span").cloneNode();
        node.disabled = true;
        node.innerHTML = "no other months with shortcuts";
        node.appendChild(span);
        node.querySelector("span").hidden = true;
        new_container.appendChild(node);
    };

    container.replaceChildren(...new_container.childNodes);

    if (shownMonth === currentMonth) {
        document.getElementById("calendar-date-current").classList.add("pe-none");
        document.getElementById("calendar-date-current").firstElementChild.classList.add("bi-dot");
    } else {
        document.getElementById("calendar-date-current").classList.remove("pe-none");
        document.getElementById("calendar-date-current").firstElementChild.classList.remove("bi-dot");
    };
}

function updateLocationList () {
    let list = document.getElementById("shortcut-location-datalist");
    let newList = document.createElement("datalist");

    let locations = new Set();

    for (let shortcut in data.library) {
        locations.add(data.library[shortcut]["location"]);
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

    for (let shortcut in data.library) {
        let values = data.library[shortcut];

        let node = document.importNode(cardTemp.content, true);

        node.querySelector(".card").setAttribute("data-card-shortcut", shortcut);

        node.querySelectorAll("button")[0].addEventListener("click", shortcutEdit);
        node.querySelectorAll("button")[1].addEventListener("click", shortcutDelete);

        node.querySelector(".shortcut-card-shortcut").innerHTML += shortcut;

        node.querySelector(".shortcut-card-subject").innerHTML = values["subject"];
        node.querySelector(".shortcut-card-time").innerHTML = values["time"];
        node.querySelector(".shortcut-card-location").innerHTML = values["location"];
        node.querySelector(".shortcut-card-description").innerHTML = values["description"];

        new_container.insertBefore(node, new_container.firstChild);
    };

    container.replaceChildren(...new_container.childNodes);
}

function activateCalendar () {
    if (node = document.querySelector(".deactivated")) { node.classList.remove("deactivated") };
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
    var newValue = e.currentTarget.value.replace(/[^0-9\:]/gi, '');
    if (e.currentTarget.value != newValue) {
        e.currentTarget.value = newValue;
    }

    if (/^(2[0-3]|[01]?[0-9]):?([0-5][0-9])?( )?(AM|am|PM|pm)?$/.test(e.currentTarget.value)) {
        e.currentTarget.setCustomValidity("");
    } else {
        e.currentTarget.setCustomValidity("invalid time")
    };
}

function changeCalendarDate (e) {

    let month = e.currentTarget.getAttribute("data-month");

    if (month === "month-current") { return data.month = new Date() };
    if (!parseInt(month)) { return data.month = new Date(month.split("-")[1], month.split("-")[2]-1)};
    data.month = new Date(data.month.getFullYear(), data.month.getMonth()+parseInt(month));
}

function editDateInput (e) {
    e.currentTarget.form.classList.add("was-validated");
    e.currentTarget.setCustomValidity("");
    e.currentTarget.value = getStringFromDate();

    updateDateTooltip();
}

function validateDateInput (e) {
    if (/^(1[0-2]|0?[1-9]) ?\/ ?([2-9]\d[1-9]\d|[1-9]\d)$/.test(e.currentTarget.value)) {
        e.currentTarget.setCustomValidity("");
        updateDateTooltip();
    } else {
        e.currentTarget.setCustomValidity("invalid date")
    };
}

function acceptDateInput () {
    let inputDate = getDateFromString();
    let savedDate = new Date(data.month.getFullYear(), data.month.getMonth());
    if (document.getElementById("calendar-date-input").form.checkValidity() && +inputDate !== +savedDate) {
        data.month = inputDate;
    } else {
        updateDateInput();
    };

    document.getElementById("calendar-date-input").form.classList.remove("was-validated");
}

function dayInput (e) {
    let textarea = e.currentTarget.querySelector("textarea");
    let key = textarea.id.substring(textarea.id.indexOf("-")+1);

    if (document.getElementById("toggle-shortcut").checked) {
        let shortcut = document.getElementById("calendar-shortcut-selection").value;
        if (!shortcut) { return };

        if (!(key in data.events)) { data.events[key] = new Set() };
        data.events[key].add(shortcut);
    } else {
        if (!(key in data.events)) { return };
        delete data.events[key];
    };
    textarea.value = textareaInput(key);
}

function textareaInput (key) {
    let text = "";

    if (key in data.events) {
        for (value of data.events[key]) {
            text += value + "\n";
        };
    };
    return text;
}

function shortcutEdit (e) {
    let shortcut = e.currentTarget.parentNode.parentNode.getAttribute("data-card-shortcut");
    let shortcut_data = data.library[shortcut];

    let form = document.getElementById("shortcut-form");
    form.classList.remove("was-validated");
    document.getElementById("shortcut-add").hidden = true;
    document.getElementById("shortcut-update").hidden = false;

    form.elements["shortcut-shortcut"].value = shortcut;

    form.elements["shortcut-subject"].value = shortcut_data["subject"];

    form.elements["toggle-time"].checked = shortcut_data["time"] === "all-day" ? true : false;
    form.elements["shortcut-begin"].disabled = shortcut_data["time"] === "all-day" ? true : false;
    form.elements["shortcut-begin"].value = shortcut_data["time"] === "all-day" ? "" : shortcut_data["time"].split("-")[0];
    form.elements["shortcut-end"].disabled = shortcut_data["time"] === "all-day" ? true : false;
    form.elements["shortcut-end"].value = shortcut_data["time"] === "all-day" ? "" : shortcut_data["time"].split("-")[1];

    form.elements["shortcut-location"].value = shortcut_data["location"];

    form.elements["shortcut-description"].value = shortcut_data["description"];
}

function shortcutDelete (e) {
    let shortcut = e.currentTarget.parentNode.parentNode.getAttribute("data-card-shortcut");

    delete data.library[shortcut];
    data.library = data.library;
}

function checkForm (f) {
    f.classList.add("was-validated");
    return f.checkValidity();
}

function resetLibraryForm(f) {
    document.getElementById("shortcut-shortcut").classList.remove("is-used");
    document.getElementById("shortcut-shortcut").focus();
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
    return getDoubleDigit(time.getHours())+":"+getDoubleDigit(time.getMinutes());
}

function promtDownloadTooltip (tooltip) {
    tooltip.setAttribute("data-promt", "show");
    setTimeout(() => {
        tooltip.setAttribute("data-promt", "shown");
    }, 3000);
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
    return getDoubleDigit(data.month.getMonth()+1)+" / "+data.month.getFullYear();
}

function getFormattedStringFromDate (date) {
    return date.toLocaleString("en-US", { month: "long", year: "numeric" });
}


function getTimeString (y, m, d, t) {
    y = parseInt(y); m = parseInt(m); d = parseInt(d);

    let [begin, end] = t.split("-");
    let day = y+"/"+m+"/"+d;

    if (t === "all-day") { return [day, day] };
    return [day+" "+begin, day.substring(0, day.indexOf('/', 5)+1)+(d+(begin < end ? 0 : 1))+" "+end];
}

function getDoubleDigit (d) {
    return ("00"+d).slice(-2);
}

function keyPressed (e) {
    if (e.ctrlKey && e.shiftKey) {
        let calendarShown = !document.getElementById("calendar").hidden;

        if (e.code === "KeyS") {
            if (calendarShown) {
                return saveCalendar();
            } else {
                return saveLibrary();
            }
        }

        if (e.code === "KeyU") {
            if (!document.getElementById("nav-init").hidden) {
                return document.getElementById("library-file-input").click();
            }
        }

        if (e.code === "KeyV") {
            let showMode = calendarShown ? "library" : "calendar";
            if (!document.getElementById("nav-init").hidden) { return toggleNavInit(showMode) };
            return toggleNav(showMode);
        }

        if (e.code === "KeyA") {
            if (document.getElementById("shortcut-form") == document.activeElement.form) {
                e.preventDefault();
                return addShortcut();
            }
        }

        if (e.code === "KeyT") {
            if (document.getElementById("shortcut-form") == document.activeElement.form) {
                let toggleMode = document.getElementById("toggle-time").checked ? "time" : "allday";
                toggleTime(toggleMode);
                if (toggleMode === "allday") { document.getElementById("shortcut-location").focus() }
                else if (toggleMode === "time") { document.getElementById("shortcut-begin").focus() };
                return;
            }
        }

        if (e.code === "KeyB" || e.code === "KeyN" || e.code === "KeyM" || e.code === "KeyK") {
            if (calendarShown) {
                if (e.code === "KeyK") {
                    return document.getElementById("calendar-date-input").focus();
                }
                document.getElementById("calendar-date-input").blur();
                if (e.code === "KeyB") {
                    return document.getElementById("calendar-date-before").click();
                }
                if (e.code === "KeyN") {
                    return document.getElementById("calendar-date-after").click();
                }
                if (e.code === "KeyM") {
                    return document.getElementById("calendar-date-current").click();
                }
            }
        }

        if (e.code === "KeyA") {
            if (calendarShown && !document.getElementById("calendar-shortcut").classList.contains("deactivated")) {
                if (document.getElementById("toggle-shortcut").checked) {
                    let select = document.getElementById("calendar-shortcut-selection");
                    select.selectedIndex = (select.selectedIndex % (select.children.length-1)) + 1;
                }
                activateCalendar();
                return toggleShortcut("add");
            }
        }

        if (e.code === "KeyC") {
            if (calendarShown && !document.getElementById("calendar-shortcut").classList.contains("deactivated")) {
                return toggleShortcut("clear");
            }
        }

        if (e.code === "KeyH") {
            return toggleHelp(e);
        }
    }
}