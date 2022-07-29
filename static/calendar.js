function makeCalendar () {
    let form = document.getElementById("calendar-selection");
    let calendarMonth = form.elements["calMonth"].value;
    let calendarYear = form.elements["calYear"].value;

    var cellTemp = document.getElementById("cellTemp");
    var emptyTemp = document.getElementById("emptyTemp");

    var old_container = document.getElementById("container-calendar");
    var new_container = document.createElement("div");
    new_container.id = old_container.id;

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
                cell.querySelectorAll("button")[0].addEventListener("click", function() { addShort(this) });
                cell.querySelectorAll("label")[0].innerHTML = (dayCount - startIndex) + "." + calendarMonth + ".";
            }

            // cell.querySelectorAll("input")[0].disabled = true;
            row.appendChild(cell);
        }
        new_container.appendChild(row);
    }

    old_container.parentNode.replaceChild(new_container, old_container)
}

function addShort (btn) {
    console.log("You clicked me!");
    let text = "FA";
    if (btn.querySelectorAll("textarea")[0].value) {
        text = "\n" + text;
    }
    btn.querySelectorAll("textarea")[0].value += text;
    // this.style.backgroundColor = "#ff0";
}

function daysInMonth (month, year) {
    return new Date(year, month, 0).getDate();
}

function weekdayOfMonth (month, year) {
    return new Date(year, month - 1, 1).getDay() - 1;
}

function setMonth () {
    let form = document.getElementById("calendar-selection");
    form.elements["calMonth"].value = new Date().getMonth() + 1;
    form.elements["calYear"].value = new Date().getFullYear();
}