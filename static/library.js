var libData = {};

function saveLibrary () {
    let form = document.getElementById("new-lib");
    if (!checkForm(form)) { return };
    if (Object.keys(libData).length === 0) { return };

    const filename = document.getElementById("libTitle").value + ".ucal";

    console.log(libData);

    var element = document.createElement("a");
    element.setAttribute("href","data:text/plain;charset=utf-8," + JSON.stringify(libData));
    element.setAttribute("download", filename);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

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
    console.log("toggle", e.parentNode.querySelector("input[type=radio]").checked);//, e.parentNode.parentNode.querySelector(".btn-toggle:not(#"+e.parentNode.id+")"));
    
    e.parentNode.querySelector("input[type=radio]").checked = !toggle;

    e.classList.remove("btn-toggle-disabled");
    e.parentNode.querySelector(".btn-toggle:not(#"+e.id+")").classList.add("btn-toggle-disabled");
    
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