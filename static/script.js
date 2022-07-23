var libData = {};

function saveLibrary () {
    console.log(libData);
    for (let short in libData) {
        console.log(libData[short]);
        // for (let key in libData[short]) { console.log(key, libData[short][key]); }
    }
}

function addItem () {
    
    var itemData = {};

    let form = document.getElementById("new-item");
    if (!checkForm(form)) { return }

    itemData["short"] = document.getElementById("calShort").value;

    itemData["subject"] = document.getElementById("calSub").value;

    if (document.getElementById("calTime").checked) {
        itemData["time"] = document.getElementById("calStarts").value+"-"+document.getElementById("calEnds").value;
    } else {
        itemData["time"] = "allday";
    }

    itemData["location"] = document.getElementById("calLocal").value;

    itemData["notes"] = document.getElementById("calNotes").value;


    libData[document.getElementById("calShort").value] = itemData;

    resetForm(form);
}

function checkForm(form) {
    form.checkValidity();
    form.classList.add('was-validated');
    return form.checkValidity();
}

function resetForm(form) {
    form.classList.remove('was-validated');
    disableTime(false);
    document.getElementById("calShort").classList.remove('is-used');
    form.reset();
}

function checkShort(input) {
    if (libData.hasOwnProperty(input.value)) {
        input.classList.add('is-used');
    } else {
        input.classList.remove('is-used');
    }
}

function checkTime(input) {
    if (/^(2[0-3]|[01]?[0-9]):?([0-5][0-9])?$/.test(input.value)) {
        input.setCustomValidity("");
    } else {
        input.setCustomValidity("invalid time")
    }
}

function disableTime(disable) {
    document.getElementById("calStarts").disabled = disable;
    document.getElementById("calEnds").disabled = disable;
}

function updateTable() {
    document.querySelector("table").classList.remove("visually-hidden");
    const old_tbody = document.querySelector("tbody");
    const new_tbody = document.createElement('tbody');

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