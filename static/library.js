function saveLibrary () {
    let filenameInput = document.getElementById("library-filename-input");
    if (!checkForm(filenameInput.form)) { return }
    if (Object.keys(library).length === 0) { return };

    let filename = filenameInput.value + ".ucal";

    console.log("save library", library);

    /* https://github.com/nwcell/FileSaver.js */
    /*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
    var saveAs=saveAs||function(e){"use strict";if(typeof e==="undefined"||typeof navigator!=="undefined"&&/MSIE [1-9]\./.test(navigator.userAgent)){return}var t=e.document,n=function(){return e.URL||e.webkitURL||e},r=t.createElementNS("http://www.w3.org/1999/xhtml","a"),o="download"in r,a=function(e){var t=new MouseEvent("click");e.dispatchEvent(t)},i=/constructor/i.test(e.HTMLElement)||e.safari,f=/CriOS\/[\d]+/.test(navigator.userAgent),u=function(t){(e.setImmediate||e.setTimeout)(function(){throw t},0)},s="application/octet-stream",d=1e3*40,c=function(e){var t=function(){if(typeof e==="string"){n().revokeObjectURL(e)}else{e.remove()}};setTimeout(t,d)},l=function(e,t,n){t=[].concat(t);var r=t.length;while(r--){var o=e["on"+t[r]];if(typeof o==="function"){try{o.call(e,n||e)}catch(a){u(a)}}}},p=function(e){if(/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)){return new Blob([String.fromCharCode(65279),e],{type:e.type})}return e},v=function(t,u,d){if(!d){t=p(t)}var v=this,w=t.type,m=w===s,y,h=function(){l(v,"writestart progress write writeend".split(" "))},S=function(){if((f||m&&i)&&e.FileReader){var r=new FileReader;r.onloadend=function(){var t=f?r.result:r.result.replace(/^data:[^;]*;/,"data:attachment/file;");var n=e.open(t,"_blank");if(!n)e.location.href=t;t=undefined;v.readyState=v.DONE;h()};r.readAsDataURL(t);v.readyState=v.INIT;return}if(!y){y=n().createObjectURL(t)}if(m){e.location.href=y}else{var o=e.open(y,"_blank");if(!o){e.location.href=y}}v.readyState=v.DONE;h();c(y)};v.readyState=v.INIT;if(o){y=n().createObjectURL(t);setTimeout(function(){r.href=y;r.download=u;a(r);h();c(y);v.readyState=v.DONE});return}S()},w=v.prototype,m=function(e,t,n){return new v(e,t||e.name||"download",n)};if(typeof navigator!=="undefined"&&navigator.msSaveOrOpenBlob){return function(e,t,n){t=t||e.name||"download";if(!n){e=p(e)}return navigator.msSaveOrOpenBlob(e,t)}}w.abort=function(){};w.readyState=w.INIT=0;w.WRITING=1;w.DONE=2;w.error=w.onwritestart=w.onprogress=w.onwrite=w.onabort=w.onerror=w.onwriteend=null;return m}(typeof self!=="undefined"&&self||typeof window!=="undefined"&&window||this.content);if(typeof module!=="undefined"&&module.exports){module.exports.saveAs=saveAs}else if(typeof define!=="undefined"&&define!==null&&define.amd!==null){define("FileSaver.js",function(){return saveAs})};
    
    var blob = new Blob([JSON.stringify(data.library)], {type: "text/plain;charset=utf-8"});
    saveAs(blob, filename);
}

function loadLibrary () {
    let libraryFile = new Blob(document.getElementById("library-file-input").files, {type:"application/json"});
    let libraryFilename = document.getElementById("library-file-input").value.split("/").pop().split("\\").pop().split(".")[0];

    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        data.filename = libraryFilename;
        data.library = JSON.parse(event.target.result);
        console.log(library);
    });
    reader.readAsText(libraryFile);
}

//  --> double with calendar.js

// function checkFilname(input) {
//     if (/^[^\\ \/ : * ? " < > |]+$/.test(input.value)) {
//         input.setCustomValidity("");
//     } else {
//         input.setCustomValidity("invalid filename")
//     }
// }

function addShortcut () {
    let form = document.getElementById("shortcut-form");
    if (!checkForm(form)) { return }

    var formData = {};

    formData["subject"] = form.elements["shortcut-subject"].value;

    if (form.elements["toggle-time"].checked) {
        formData["time"] = "all-day";
    } else {
        formData["time"] = correctTime(form.elements["shortcut-begin"].value)+"-"+correctTime(form.elements["shortcut-end"].value);
    }

    formData["location"] = form.elements["shortcut-location"].value;

    formData["description"] = form.elements["shortcut-description"].value;

    copyLibrary = { ...library };
    copyLibrary[form.elements["shortcut-shortcut"].value] = formData;
    data.library = copyLibrary;

    resetLibraryForm(form);
}

function toggleNav (e) {
    let shownMode = (typeof e) === "string" ? e : e.currentTarget.getAttribute("data-nav");
    let otherMode = shownMode === "library" ? "calendar" : "library";
    console.log("switch to " + shownMode, "other mode " + otherMode);

    let modes = [shownMode, shownMode === "library" ? "calendar" : "library"];

    document.getElementById("library-new").disabled = shownMode === "library" ? true : false;

    for (let i = 0; i < modes.length; i++) {
        let mode = modes[i];
        let bool = i === 0 ? false : true;

        let modeActivated = document.getElementById("nav-toggle-"+mode).hasAttribute("data-activated");

        document.getElementById(mode).hidden = bool;
        document.getElementById(mode+"-filename-input").disabled = bool;
        document.getElementById(mode+"-nav").disabled = !bool;

        document.getElementById(mode+"-save").hidden = modeActivated ? bool : true;
        document.getElementById(mode+"-edit").hidden =  modeActivated ? !bool : true;
    }
}

function toggleNavOnInput () {
    document.getElementById("nav-toggle-calendar").classList.remove("col-md-auto");
    document.getElementById("calendar-nav").classList.remove("rounded", "flex-grow-1");

    document.getElementById("library-nav").classList.remove("btn-add");
    document.getElementById("library-nav").classList.add("btn-nav");
    document.getElementById("library-file-upload").hidden = true;
    document.getElementById("library-new").hidden = true;
    document.getElementById("library-filename-input").value = data.filename;

    let modes = ["calendar", "library"];
    for (let i = 0; i < modes.length; i++) {
        let mode = modes[i];
        document.getElementById("nav-toggle-"+mode).setAttribute("data-activated", "activated");
        document.getElementById(mode+"-filename-input").hidden = false;

        let status = document.getElementById(mode).hidden;
        document.getElementById(mode+"-edit").hidden = !status;
        document.getElementById(mode+"-save").hidden = status
    }
}

//  --> double with calendar.js

// function checkForm(form) {
//     form.classList.add("was-validated");
//     return form.checkValidity();
// } 

function resetLibraryForm(form) {
    form.reset();
    form.classList.remove("was-validated");
    document.getElementById("shortcut-shortcut").classList.remove("is-used");
    document.getElementById("shortcut-begin").disabled = false;
    document.getElementById("shortcut-end").disabled = false;
    
}

function validateShortcut(e) {
    if (data.library.hasOwnProperty(e.currentTarget.value)) {
        e.currentTarget.classList.add("is-used");
    } else {
        e.currentTarget.classList.remove("is-used");
    }
}

function validateTime(e) {
    if (/^(2[0-3]|[01]?[0-9]):?([0-5][0-9])?( )?(AM|am|PM|pm)?$/.test(e.currentTarget.value)) {
        e.currentTarget.setCustomValidity("");
    } else {
        e.currentTarget.setCustomValidity("invalid time")
    }
}

function correctTime(input) {
    let [h, m] = ["0", "0"];

    if (input.includes(":")) { [h, m] = input.split(":") }
    else if (input.length <= 2) { h = input }
    else { [h, m] = [input.slice(0, -2), input.slice(-2)] };

    let time = new Date(0, 0, 0, h, m, 0);
    return ("0" + time.getHours()).slice(-2) + ":" + ("0" + time.getMinutes()).slice(-2);
}

function toggleTime(e) {
    let toggleOn = e.currentTarget.getAttribute("data-toggle") === "allday";
    e.currentTarget.parentNode.querySelector("input[type=radio]").checked = toggleOn;
    e.currentTarget.parentNode.querySelectorAll("input[type=text]")[0].disabled = toggleOn;
    e.currentTarget.parentNode.querySelectorAll("input[type=text]")[1].disabled = toggleOn;
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
    }

    container.replaceChildren(...new_container.childNodes);
}

function shortcutEdit(e) {
    let shortcut = e.currentTarget.parentNode.parentNode.getAttribute("data-card-shortcut");
    let data = library[shortcut];

    let form = document.getElementById("shortcut-form");

    form.elements["shortcut-shortcut"].value = shortcut;

    form.elements["shortcut-subject"].value = data["subject"];

    if (data["time"] === "all-day") {
        form.elements["toggle-time"].checked = true;
    } else {
        form.elements["toggle-time"].checked = false;
        form.elements["shortcut-begin"].value = data["time"].split("-")[0];
        form.elements["shortcut-end"].value = data["time"].split("-")[1];
    }

    form.elements["shortcut-location"].value = data["location"];

    form.elements["shortcut-description"].value = data["description"];
}

function shortcutDelete(e) {
    let shortcut = e.currentTarget.parentNode.parentNode.getAttribute("data-card-shortcut");

    copyLibrary = { ...library };
    delete copyLibrary[shortcut];
    data.library = copyLibrary;
}