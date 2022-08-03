var libData = {};

function saveLibrary () {
    let form = document.getElementById("new-lib");
    if (!checkForm(form)) { return };
    if (Object.keys(libData).length === 0) { return };

    const filename = document.getElementById("libTitle").value + ".ucal";

    console.log(libData);
    /* https://github.com/nwcell/FileSaver.js */
    /*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
    var saveAs=saveAs||function(e){"use strict";if(typeof e==="undefined"||typeof navigator!=="undefined"&&/MSIE [1-9]\./.test(navigator.userAgent)){return}var t=e.document,n=function(){return e.URL||e.webkitURL||e},r=t.createElementNS("http://www.w3.org/1999/xhtml","a"),o="download"in r,a=function(e){var t=new MouseEvent("click");e.dispatchEvent(t)},i=/constructor/i.test(e.HTMLElement)||e.safari,f=/CriOS\/[\d]+/.test(navigator.userAgent),u=function(t){(e.setImmediate||e.setTimeout)(function(){throw t},0)},s="application/octet-stream",d=1e3*40,c=function(e){var t=function(){if(typeof e==="string"){n().revokeObjectURL(e)}else{e.remove()}};setTimeout(t,d)},l=function(e,t,n){t=[].concat(t);var r=t.length;while(r--){var o=e["on"+t[r]];if(typeof o==="function"){try{o.call(e,n||e)}catch(a){u(a)}}}},p=function(e){if(/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)){return new Blob([String.fromCharCode(65279),e],{type:e.type})}return e},v=function(t,u,d){if(!d){t=p(t)}var v=this,w=t.type,m=w===s,y,h=function(){l(v,"writestart progress write writeend".split(" "))},S=function(){if((f||m&&i)&&e.FileReader){var r=new FileReader;r.onloadend=function(){var t=f?r.result:r.result.replace(/^data:[^;]*;/,"data:attachment/file;");var n=e.open(t,"_blank");if(!n)e.location.href=t;t=undefined;v.readyState=v.DONE;h()};r.readAsDataURL(t);v.readyState=v.INIT;return}if(!y){y=n().createObjectURL(t)}if(m){e.location.href=y}else{var o=e.open(y,"_blank");if(!o){e.location.href=y}}v.readyState=v.DONE;h();c(y)};v.readyState=v.INIT;if(o){y=n().createObjectURL(t);setTimeout(function(){r.href=y;r.download=u;a(r);h();c(y);v.readyState=v.DONE});return}S()},w=v.prototype,m=function(e,t,n){return new v(e,t||e.name||"download",n)};if(typeof navigator!=="undefined"&&navigator.msSaveOrOpenBlob){return function(e,t,n){t=t||e.name||"download";if(!n){e=p(e)}return navigator.msSaveOrOpenBlob(e,t)}}w.abort=function(){};w.readyState=w.INIT=0;w.WRITING=1;w.DONE=2;w.error=w.onwritestart=w.onprogress=w.onwrite=w.onabort=w.onerror=w.onwriteend=null;return m}(typeof self!=="undefined"&&self||typeof window!=="undefined"&&window||this.content);if(typeof module!=="undefined"&&module.exports){module.exports.saveAs=saveAs}else if(typeof define!=="undefined"&&define!==null&&define.amd!==null){define("FileSaver.js",function(){return saveAs})};
    
    var blob = new Blob([JSON.stringify(libData)], {type: "text/plain;charset=utf-8"});
    saveAs(blob, filename);


    form.classList.remove("was-validated");
}

function checkTitle(input) {
    if (/^[^\\ \/ : * ? " < > |]+$/.test(input.value)) {
        input.setCustomValidity("");
    } else {
        input.setCustomValidity("invalid title")
    }
}

function addItem () {
    let form = document.getElementById("new-item");
    if (!checkForm(form)) { return }

    var itemData = {};

    itemData["short"] = document.getElementById("calShort").value;

    itemData["subject"] = document.getElementById("calSub").value;

    if (!document.getElementById("time-toggle").checked) {
        itemData["time"] = correctTime(document.getElementById("calStarts").value) + "-" + correctTime(document.getElementById("calEnds").value);
    } else {
        itemData["time"] = "all-day";
    }

    itemData["location"] = document.getElementById("calLocal").value;

    itemData["notes"] = document.getElementById("calNotes").value;


    libData[itemData["short"]] = itemData;

    resetForm(form);
}

function checkForm(form) {
    form.checkValidity();
    form.classList.add("was-validated");
    return form.checkValidity();
}

function resetForm(form) {
    form.classList.remove("was-validated");
    document.getElementById("calShort").classList.remove("is-used");
    toggleTime();
    form.reset();
}

function checkShort(input) {
    if (libData.hasOwnProperty(input.value)) {
        input.classList.add("is-used");
    } else {
        input.classList.remove("is-used");
    }
}

function checkTime(input) {
    if (/^(2[0-3]|[01]?[0-9]):?([0-5][0-9])?$/.test(input.value)) {
        input.setCustomValidity("");
    } else {
        input.setCustomValidity("invalid time")
    }
}

function correctTime(input) {
    if (input.includes(":")) {
        time = input.split(":");
        if (input.length === 2) {
            return input;
        } else {
            return time[0] + ":00";
        }
    } else {
        if (input.length === 1) {
            return "0" + input + ":00";
        } else if (input.length === 2) {
            return input + ":00";
        } else if (input.length === 3) {
            return "0" + input[0] + ":" + input[1] + input[2];
        } else {
            return input[0] + input[1] + ":" + input[2] + input[3];
        }
    }
}

function toggleTime(toggle=true, e=document.querySelector("#time-toggle-time")) {
    e.parentNode.querySelector("input[type=radio]").checked = !toggle;
    
    e.parentNode.querySelectorAll("input[type=text]")[0].disabled = !toggle;
    e.parentNode.querySelectorAll("input[type=text]")[1].disabled = !toggle;
}

function updateTable() {
    if (Object.keys(libData).length === 0) { return };

    document.getElementById("new-lib-container").classList.remove("visually-hidden");
    document.getElementById("new-lib-hr").classList.remove("visually-hidden");

    const old_tbody = document.querySelector("tbody");
    const new_tbody = document.createElement("tbody");

    for (let short in libData) {
        let data = libData[short];
        let row = new_tbody.insertRow();

        for (key in data) {
            let cell = document.createElement(key === "short" ? "th" : "td");
            let text = document.createTextNode(data[key]);
            cell.appendChild(text);
            row.appendChild(cell);
        }
    }

    old_tbody.parentNode.replaceChild(new_tbody, old_tbody)
}