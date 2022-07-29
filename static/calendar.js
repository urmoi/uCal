var libData = {};

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

    container.replaceChild(new_container, container.childNodes[0]);
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
